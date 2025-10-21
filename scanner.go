package main

import (
	"errors"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"
)

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

type Scanner struct {
	// If true, attempt to resolve symlink target to determine target type (dir/file)
	// and, if FollowSymlinkDirs is true, traverse into symlinked directories safely.
	ResolveSymlinks   bool
	FollowSymlinkDirs bool
	PruneDirNames     []string // names to skip at directory boundaries, e.g., {"node_modules", ".git"}
	IncludeHidden     bool     // if false, skip hidden files/dirs (dot-prefixed on Unix; system attributes on Windows best-effort)
	AbsolutePaths     bool     // if true, Path will be absolute; otherwise Paths are relative to root
	MaxDepth          int      // 0 means unlimited; 1 means only root; 2 includes root children, etc.
}

func NewScanner() *Scanner {
	return &Scanner{
		ResolveSymlinks:   true,
		FollowSymlinkDirs: false, // set true to traverse into symlinked directories with cycle protection
		PruneDirNames:     []string{"node_modules", ".git"},
		IncludeHidden:     true,
		AbsolutePaths:     true,
		MaxDepth:          6,
	}
}

func (s *Scanner) GetFileTree(root string) (Node, error) {
	// Normalize root path
	var base string
	var err error
	if s.AbsolutePaths {
		base, err = filepath.Abs(root)
		if err != nil {
			return Node{}, err
		}
	} else {
		base = filepath.Clean(root)
	}

	visited := make(map[string]struct{}) // for cycle detection when following symlinks
	return s.buildNode(base, base, 0, visited)
}

// buildNode constructs a Node for the given path; rootBase is the anchor for relative paths.
func (s *Scanner) buildNode(path string, rootBase string, depth int, visited map[string]struct{}) (Node, error) {
	entryLstat, err := os.Lstat(path)
	if err != nil {
		// If path cannot be lstat'd, return a minimal node with error context in name
		return Node{
			Name:     filepath.Base(path),
			Path:     formatPath(path, rootBase, s.AbsolutePaths),
			Type:     "file",
			Size:     0,
			Modified: time.Time{},
			IsHidden: isHiddenName(filepath.Base(path)),
		}, err
	}

	isSymlink := entryLstat.Mode()&os.ModeSymlink != 0
	node := Node{
		Name:     filepath.Base(path),
		Path:     formatPath(path, rootBase, s.AbsolutePaths),
		Size:     safeSize(entryLstat),
		Modified: entryLstat.ModTime(),
		IsHidden: isHiddenName(filepath.Base(path)),
		Extension: func(name string, isDir bool) string {
			if isDir {
				return ""
			}
			ext := strings.ToLower(filepath.Ext(name))
			if ext == "" {
				return ""
			}
			return ext
		}(filepath.Base(path), entryLstat.IsDir()),
	}

	// Hidden filtering
	if !s.IncludeHidden && node.IsHidden {
		// Return a node indicating skip—caller can choose to omit it; here we return an empty dir with no children
		return node, nil
	}

	if isSymlink {
		node.Type = "symlink"
		// Optionally resolve target to determine target type and optionally traverse
		if s.ResolveSymlinks {
			targetInfo, statErr := os.Stat(path)
			if statErr == nil {
				node.isSymlinkTargetDir = targetInfo.IsDir()
				// If target is a file, expose its size; for dirs keep symlink size
				if !targetInfo.IsDir() {
					node.Size = safeSize(targetInfo)
					node.Extension = strings.ToLower(filepath.Ext(node.Name))
				}
			} else {
				// Broken or unreadable symlink
				node.isSymlinkTargetDir = false
			}

			// If following symlink directories, ensure we avoid cycles
			if s.FollowSymlinkDirs && node.isSymlinkTargetDir {
				targetPath, err := filepath.EvalSymlinks(path)
				if err == nil {
					// Detect cycles using the realpath of target
					real, rerr := filepath.Abs(targetPath)
					if rerr == nil {
						if _, seen := visited[real]; seen {
							// already visited; avoid cycle
							return node, nil
						}
						visited[real] = struct{}{}
						if !exceedsDepth(depth+1, s.MaxDepth) {
							children, cerr := s.listDirChildren(targetPath, rootBase, depth+1, visited)
							if cerr == nil {
								node.Children = children
							}
						}
					}
				}
			}
		}
		return node, nil
	}

	if entryLstat.IsDir() {
		node.Type = "dir"

		// Depth limiting
		if exceedsDepth(depth, s.MaxDepth) {
			return node, nil
		}

		// Prune by name
		if shouldPrune(node.Name, s.PruneDirNames) {
			return node, nil
		}

		children, err := s.listDirChildren(path, rootBase, depth+1, visited)
		if err != nil {
			// Permission error or similar; keep node as dir with no children
			return node, nil
		}
		node.Children = children
		return node, nil
	}

	// Regular file
	node.Type = "file"
	return node, nil
}

func (s *Scanner) listDirChildren(dir string, rootBase string, depth int, visited map[string]struct{}) ([]Node, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		// Likely permission denied or similar; caller will keep directory empty
		return nil, err
	}

	children := make([]Node, 0, len(entries))
	for _, e := range entries {
		childPath := filepath.Join(dir, e.Name())

		// Hidden filter on child names
		if !s.IncludeHidden && isHiddenName(e.Name()) {
			continue
		}

		// If directory and prune by name
		if e.IsDir() && shouldPrune(e.Name(), s.PruneDirNames) {
			continue
		}

		childNode, cerr := s.buildNode(childPath, rootBase, depth, visited)
		if cerr != nil {
			// Skip unreadable entries but continue walking
			var pErr *os.PathError
			if errors.As(cerr, &pErr) {
				log.Printf("skip path error: %v", cerr)
				continue
			}
			log.Printf("skip unknown error: %v", cerr)
			continue
		}

		// If MaxDepth is set and exceeded, buildNode already limited children
		children = append(children, childNode)
	}
	return children, nil
}

func formatPath(path string, rootBase string, absolute bool) string {
	if absolute {
		abs, err := filepath.Abs(path)
		if err == nil {
			return abs
		}
		return path
	}
	rel, err := filepath.Rel(rootBase, path)
	if err == nil {
		return rel
	}
	return path
}

func safeSize(fi os.FileInfo) int64 {
	// For directories, FileInfo.Size is system-dependent; generally it is not meaningful.
	// We keep 0 for directories, and actual size for files.
	if fi.IsDir() {
		return 0
	}
	return fi.Size()
}

func exceedsDepth(currentDepth int, maxDepth int) bool {
	if maxDepth <= 0 {
		return false
	}
	return currentDepth >= maxDepth
}

func isHiddenName(name string) bool {
	// Basic cross-platform hidden check:
	// - Unix: dot prefix
	// - Windows: we would need syscall to check FILE_ATTRIBUTE_HIDDEN; here best-effort with dot prefix
	return strings.HasPrefix(name, ".")
}

func shouldPrune(name string, pruneList []string) bool {
	for _, p := range pruneList {
		if name == p {
			return true
		}
	}
	return false
}
