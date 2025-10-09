package main

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"slices"
	"sort"
	"strings"
	"sync"
	"time"
)

// Node represents a directory tree node.
// Children are only populated for directories.
type Node struct {
	Name      string    `json:"name"`
	Path      string    `json:"path"`
	Type      string    `json:"type"` // "file" | "dir" | "symlink"
	Size      int64     `json:"size"`
	Modified  time.Time `json:"modified"`
	Children  []Node    `json:"children,omitempty"`
	IsHidden  bool      `json:"isHidden"`
	Extension string    `json:"extension,omitempty"`
	// Internal: not exported to JSON
	isSymlinkTargetDir bool `json:"-"`
}

// StreamEvent is sent incrementally during scanning to update the UI.
type StreamEvent struct {
	Kind string `json:"kind"` // "node" | "done" | "error"`
	Node *Node  `json:"node,omitempty"`
	Err  string `json:"err,omitempty"`
}

// IgnoreConfig holds rules similar to how Zed avoids heavy dirs.
type IgnoreConfig struct {
	SkipDirs     []string
	SkipFileExts []string
	SkipDotDirs  bool
	SkipDotFiles bool
}

// ScanConfig controls traversal behaviour.
type ScanConfig struct {
	MaxDepth         int  // -1 for unlimited
	MaxEntriesPerDir int  // 0 for unlimited
	FollowSymlinks   bool // if true, symlinked dirs are traversed (with cycle protection)
	BurstConcurrency int  // number of concurrent stat/readDir workers
}

// Scanner performs Zed-like streaming directory scans.
type Scanner struct {
	ignore IgnoreConfig
	cfg    ScanConfig
}

// NewScanner with sensible defaults
func NewScanner() *Scanner {
	return &Scanner{
		ignore: IgnoreConfig{
			SkipDirs: []string{
				".git", ".hg", ".svn",
				"node_modules",
				".cache", "dist", "build", "out", "coverage",
				".next", ".nuxt", ".svelte-kit",
				"venv", ".venv", "__pycache__",
				"target",
				".idea", ".vscode",
			},
			SkipFileExts: []string{
				".o", ".obj", ".class", ".pyc", ".so", ".dll", ".exe",
			},
			SkipDotDirs:  true,
			SkipDotFiles: false,
		},
		cfg: ScanConfig{
			MaxDepth:         6,
			MaxEntriesPerDir: 5000,
			FollowSymlinks:   true,
			BurstConcurrency: 16,
		},
	}
}

func (e *Editor) StartScan(root string) error {
	if root == "" {
		return errors.New("root path is empty")
	}
	abs, err := filepath.Abs(root)
	if err != nil {
		return fmt.Errorf("abs failed: %w", err)
	}
	info, err := os.Lstat(abs)
	if err != nil {
		return fmt.Errorf("stat failed: %w", err)
	}
	if !info.IsDir() {
		return fmt.Errorf("path is not a directory: %s", abs)
	}

	if e.cancelScan != nil {
		e.cancelScan()
	}

	ctx, cancel := context.WithCancel(e.ctx)
	e.cancelScan = cancel

	e.mu.Lock()
	e.rootPath = abs
	e.rootTree = &Node{
		Name:     info.Name(),
		Path:     abs,
		Type:     "dir",
		Size:     info.Size(),
		Modified: info.ModTime().UTC(),
		IsHidden: isHidden(info.Name()),
	}
	e.mu.Unlock()

	e.streamMu.Lock()
	e.streamChan = make(chan StreamEvent, 1024)
	e.streamMu.Unlock()

	go func() {
		// When scan finishes, signal done and close stream
		defer func() {
			e.streamMu.Lock()
			ch := e.streamChan
			e.streamChan = nil
			e.streamMu.Unlock()
			if ch != nil {
				// send done before closing
				select {
				case ch <- StreamEvent{Kind: "done"}:
				default:
				}
				close(ch)
			}
		}()

		e.scanner.Scan(ctx, abs, func(ev StreamEvent) {
			if ev.Kind == "node" && ev.Node != nil {
				e.applyNode(ev.Node)
			}
			e.streamMu.Lock()
			ch := e.streamChan
			e.streamMu.Unlock()
			if ch != nil {
				select {
				case ch <- ev:
				default:
					if ev.Kind == "node" {
						select {
						case ch <- ev:
						case <-time.After(10 * time.Millisecond):
						}
					}
				}
			}
		})
	}()

	return nil
}

func (e *Editor) PollStream(max int) ([]StreamEvent, error) {
	e.streamMu.Lock()
	ch := e.streamChan
	e.streamMu.Unlock()
	if ch == nil {
		return nil, nil
	}
	if max <= 0 || max > 1000 {
		max = 1000
	}
	events := make([]StreamEvent, 0, max)
	for i := 0; i < max; i++ {
		select {
		case ev, ok := <-ch:
			if !ok {
				return events, nil
			}
			events = append(events, ev)
			if ev.Kind == "done" {
				return events, nil
			}
		default:
			return events, nil
		}
	}
	return events, nil
}

func (e *Editor) PollTree() (*Node, error) {
	e.mu.RLock()
	defer e.mu.RUnlock()
	if e.rootTree == nil {
		return nil, errors.New("no scan started")
	}
	copy := deepCopyNode(e.rootTree)
	return &copy, nil
}

func (e *Editor) Rescan() error {
	e.mu.RLock()
	root := e.rootPath
	e.mu.RUnlock()
	if root == "" {
		return errors.New("no root set")
	}
	return e.StartScan(root)
}

func (e *Editor) StopScan() {
	if e.cancelScan != nil {
		e.cancelScan()
	}
}

func (e *Editor) applyNode(n *Node) {
	e.mu.Lock()
	defer e.mu.Unlock()
	if e.rootTree == nil {
		return
	}
	rel, err := filepath.Rel(e.rootTree.Path, n.Path)
	if err != nil || strings.HasPrefix(rel, "..") {
		return
	}
	if rel == "." {
		e.rootTree.Size = n.Size
		e.rootTree.Modified = n.Modified
		return
	}

	parts := splitPath(rel)
	cur := e.rootTree
	for i, p := range parts {
		isLast := i == len(parts)-1
		idx := -1
		for j := range cur.Children {
			if cur.Children[j].Name == p {
				idx = j
				break
			}
		}
		if idx == -1 {
			newNode := Node{
				Name:     p,
				Path:     filepath.Join(cur.Path, p),
				Type:     ternary(isLast, n.Type, "dir"),
				Size:     ternary(isLast, n.Size, int64(0)),
				Modified: n.Modified,
				IsHidden: isHidden(p),
			}
			cur.Children = append(cur.Children, newNode)
			sortNodes(cur.Children)
			idx = findIndexByName(cur.Children, p)
		}

		if isLast {
			existing := cur.Children[idx]
			existing.Type = n.Type
			existing.Size = n.Size
			existing.Modified = n.Modified
			existing.IsHidden = n.IsHidden
			existing.Extension = n.Extension
			existing.isSymlinkTargetDir = n.isSymlinkTargetDir
			if n.Type == "dir" {
				if existing.Children == nil {
					existing.Children = []Node{}
				}
			}
			cur.Children[idx] = existing
			sortNodes(cur.Children)
		} else {
			cur = &cur.Children[idx]
			if cur.Type != "dir" {
				cur.Type = "dir"
			}
		}
	}
}

func splitPath(rel string) []string {
	parts := []string{}
	for _, p := range strings.Split(rel, string(os.PathSeparator)) {
		if p != "" {
			parts = append(parts, p)
		}
	}
	return parts
}

func sortNodes(nodes []Node) {
	sort.Slice(nodes, func(i, j int) bool {
		di := nodes[i].Type == "dir"
		dj := nodes[j].Type == "dir"
		if di != dj {
			return di && !dj
		}
		return strings.ToLower(nodes[i].Name) < strings.ToLower(nodes[j].Name)
	})
}

func findIndexByName(nodes []Node, name string) int {
	for i := range nodes {
		if nodes[i].Name == name {
			return i
		}
	}
	return -1
}

func deepCopyNode(n *Node) Node {
	cp := *n
	if n.Children != nil {
		cp.Children = make([]Node, len(n.Children))
		for i := range n.Children {
			child := n.Children[i]
			cp.Children[i] = deepCopyNode(&child)
		}
	}
	return cp
}

func isHidden(name string) bool { return strings.HasPrefix(name, ".") }

// Scanner implementation

type job struct {
	path  string
	depth int
}

func (s *Scanner) Scan(ctx context.Context, root string, emit func(StreamEvent)) {
	seen := newPathSet()
	jobs := make(chan job, 1024)

	// Seed
	select {
	case jobs <- job{path: root, depth: 0}:
	case <-ctx.Done():
		emit(StreamEvent{Kind: "done"})
		return
	}

	wg := &sync.WaitGroup{}
	workerCount := s.cfg.BurstConcurrency
	if workerCount <= 0 {
		workerCount = 8
	}

	for w := 0; w < workerCount; w++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for {
				select {
				case <-ctx.Done():
					return
				case j, ok := <-jobs:
					if !ok {
						return
					}
					s.processDir(ctx, j, jobs, seen, emit)
				}
			}
		}()
	}

	// Wait for workers to drain the queue
	done := make(chan struct{})
	go func() {
		wg.Wait()
		close(done)
	}()

	// Close jobs when context canceled OR when queue naturally drains
	go func() {
		select {
		case <-ctx.Done():
			// allow workers to return
		case <-done:
			// normal completion
		}
		close(jobs)
	}()

	// Block until done or canceled, then emit done
	select {
	case <-ctx.Done():
	case <-done:
	}
	emit(StreamEvent{Kind: "done"})
}

func (s *Scanner) processDir(ctx context.Context, j job, jobs chan<- job, seen *pathSet, emit func(StreamEvent)) {
	// Depth check
	if s.cfg.MaxDepth >= 0 && j.depth > s.cfg.MaxDepth {
		return
	}

	info, err := os.Lstat(j.path)
	if err != nil {
		emit(StreamEvent{Kind: "error", Err: fmt.Sprintf("stat failed: %s: %v", j.path, err)})
		return
	}

	nType := "file"
	if info.IsDir() {
		nType = "dir"
	} else if (info.Mode() & os.ModeSymlink) != 0 {
		nType = "symlink"
	}

	node := &Node{
		Name:     info.Name(),
		Path:     j.path,
		Type:     nType,
		Size:     info.Size(),
		Modified: info.ModTime().UTC(),
		IsHidden: isHidden(info.Name()),
	}
	if nType == "symlink" && s.cfg.FollowSymlinks {
		if target, err := filepath.EvalSymlinks(j.path); err == nil {
			if fi, err := os.Stat(target); err == nil && fi.IsDir() {
				node.isSymlinkTargetDir = true
			}
		}
	}
	emit(StreamEvent{Kind: "node", Node: node})

	if !info.IsDir() {
		return
	}

	base := filepath.Base(j.path)
	if s.shouldSkipDir(base) {
		return
	}
	if s.ignore.SkipDotDirs && strings.HasPrefix(base, ".") {
		return
	}

	real := j.path
	if s.cfg.FollowSymlinks {
		if rp, err := filepath.EvalSymlinks(j.path); err == nil {
			real = rp
		}
	}
	if !seen.Add(real) {
		return
	}

	entries, err := os.ReadDir(j.path)
	if err != nil {
		emit(StreamEvent{Kind: "error", Err: fmt.Sprintf("readDir failed: %s: %v", j.path, err)})
		return
	}

	if s.cfg.MaxEntriesPerDir > 0 && len(entries) > s.cfg.MaxEntriesPerDir {
		entries = entries[:s.cfg.MaxEntriesPerDir]
	}

	sort.Slice(entries, func(i, j int) bool {
		di := entries[i].IsDir()
		dj := entries[j].IsDir()
		if di != dj {
			return di && !dj
		}
		return strings.ToLower(entries[i].Name()) < strings.ToLower(entries[j].Name())
	})

	for _, e := range entries {
		name := e.Name()
		childPath := filepath.Join(j.path, name)

		if s.ignore.SkipDotFiles && strings.HasPrefix(name, ".") {
			continue
		}

		if !e.IsDir() {
			ext := strings.ToLower(filepath.Ext(name))
			if slices.Contains(s.ignore.SkipFileExts, ext) {
				continue
			}
		}

		fi, err := os.Lstat(childPath)
		if err != nil {
			emit(StreamEvent{Kind: "error", Err: fmt.Sprintf("stat failed: %s: %v", childPath, err)})
			continue
		}
		cType := "file"
		if e.IsDir() {
			cType = "dir"
		} else if (fi.Mode() & os.ModeSymlink) != 0 {
			cType = "symlink"
		}
		child := &Node{
			Name:      name,
			Path:      childPath,
			Type:      cType,
			Size:      fi.Size(),
			Modified:  fi.ModTime().UTC(),
			IsHidden:  isHidden(name),
			Extension: strings.ToLower(filepath.Ext(name)),
		}

		emit(StreamEvent{Kind: "node", Node: child})

		if cType == "dir" {
			if s.ignore.SkipDotDirs && strings.HasPrefix(name, ".") {
				continue
			}
			if s.shouldSkipDir(name) {
				continue
			}
			select {
			case jobs <- struct {
				path  string
				depth int
			}{path: childPath, depth: j.depth + 1}:
			case <-ctx.Done():
				return
			}
		} else if cType == "symlink" && s.cfg.FollowSymlinks {
			if target, err := filepath.EvalSymlinks(childPath); err == nil {
				if tinfo, err := os.Stat(target); err == nil && tinfo.IsDir() {
					child.isSymlinkTargetDir = true
					select {
					case jobs <- struct {
						path  string
						depth int
					}{path: target, depth: j.depth + 1}:
					case <-ctx.Done():
						return
					}
				}
			}
		}

	}
}

func (s *Scanner) shouldSkipDir(name string) bool {
	low := strings.ToLower(name)
	for _, skip := range s.ignore.SkipDirs {
		if low == strings.ToLower(skip) {
			return true
		}
	}
	return false
}

type pathSet struct {
	mu  sync.Mutex
	set map[string]struct{}
}

func newPathSet() *pathSet { return &pathSet{set: make(map[string]struct{})} }
func (ps *pathSet) Add(p string) bool {
	ps.mu.Lock()
	defer ps.mu.Unlock()
	if _, ok := ps.set[p]; ok {
		return false
	}
	ps.set[p] = struct{}{}
	return true
}

func ternary[T any](cond bool, a, b T) T {
	if cond {
		return a
	}
	return b
}
