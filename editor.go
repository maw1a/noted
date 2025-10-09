package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"

	"github.com/wailsapp/wails/v3/pkg/application"
)

const GIT_PATH = "/.git"
const CONFIG_PATH = "/.noted/config.json"

type Config struct {
	Name        string            `json:"name"`
	Description string            `json:"description,omitempty"`
	Repository  string            `json:"repository,omitempty"`
	Homepage    string            `json:"homepage,omitempty"`
	Registry    map[string]string `json:"registry"`
	Author      string            `json:"author,omitempty"`
}

type Editor struct {
	ctx context.Context

	window *application.WebviewWindow

	scanner *Scanner

	mu         sync.RWMutex
	rootPath   string
	rootTree   *Node
	cancelScan context.CancelFunc

	streamMu   sync.Mutex
	streamChan chan StreamEvent
}

func NewEditorService() *Editor {
	return &Editor{
		ctx:     context.Background(),
		scanner: NewScanner(),
	}
}

// Flows
// 1. Create:
// - a. Select directory
// - b. Create Repo
// - c. Open Editor
// 2. Open:
// - a. Select directory
// - b. Open Editor
// 3. Clone:
// - a. Take Git URL
// - b. Select Directory
// - c. Clone Repo
// - d. Open Editor

func (e *Editor) Create() (string, error) {
	// a. Select directory
	dir, err := selectDirectory()

	if err != nil {
		return dir, err
	}

	if dir == "" {
		log.Print("User cancelled directory selection")
		return dir, fmt.Errorf("User cancelled directory selection")
	}

	// b. Create Repo
	success, errs := createNoteRepo(dir)
	err = nil
	if len(errs) > 0 {
		err = errs[0]
	}

	if !success {
		log.Printf("Failed to create notes repo: %v", err)
		return dir, err
	}

	// c. Open Editor
	window := createEditor(dir)
	e.window = window
	e.rootPath = dir

	return dir, err
}

// selectDirectory opens a directory selection dialog and returns the selected path
func selectDirectory() (string, error) {
	home := os.Getenv("HOME")
	if home == "" {
		// Windows fallback
		home = os.Getenv("USERPROFILE")
	}

	dialog := application.OpenFileDialog().CanChooseDirectories(true).CanChooseFiles(false).SetTitle("Select a folder").CanCreateDirectories(true).SetDirectory(home).ResolvesAliases(true).TreatsFilePackagesAsDirectories(true)

	dir, err := dialog.PromptForSingleSelection()
	if err != nil {
		return dir, fmt.Errorf("Failed to open dialog")
	}

	return dir, nil
}

// createNoteRepo handles the flow of creating a new notes repository
func createNoteRepo(dir string) (bool, []error) {
	// Simple cross‑platform home directory
	errors := []error{}

	// Check if .git exists
	gitDir := dir + GIT_PATH
	if _, err := exec.Command("test", "-d", gitDir).Output(); err != nil {
		// .git does not exist, run git init
		if err := runGitInit(dir); err != nil {
			log.Printf("Failed to initialize git repo: %v", err)
			errors = append(errors, fmt.Errorf("Failed to initialize git repo"))
		}
	}

	name := strings.Split(dir, "/")[len(strings.Split(dir, "/"))-1]
	note := Config{
		Name:     name,
		Registry: map[string]string{},
	}

	notePath := dir + CONFIG_PATH
	// Check if Config file exists
	if _, err := os.Stat(notePath); err == nil {
		// Config file exists, do nothing
		log.Print("Config file already exists, skipping creation")
	} else if !os.IsNotExist(err) {
		// Some other error
		log.Printf("Failed to check Config file: %v", err)
		errors = append(errors, fmt.Errorf("Failed to check config file"))
	} else {
		log.Print("Creating Config file")

		file, err := createFile(notePath)

		if err != nil {
			log.Printf("Failed to create Config file: %v", err)
			errors = append(errors, fmt.Errorf("Failed to create config file."))
		} else {
			defer file.Close()
			data, err := json.MarshalIndent(note, "", "  ")
			if err != nil {
				log.Printf("Failed to marshal Config file: %v", err)
				errors = append(errors, fmt.Errorf("Failed to write config file."))
			} else {
				if _, err := file.Write(data); err != nil {
					log.Printf("Failed to write Config file: %v", err)
					errors = append(errors, fmt.Errorf("Failed to write config file."))
				} else {
					log.Print("Config file created successfully")
				}
			}
		}
	}

	return true, errors
}

func createEditor(path string) *application.WebviewWindow {
	app := application.Get()
	// Default window title fallback: use root directory name
	rootDir := ""
	if path != "" {
		rootDir = filepath.Base(path)
	} else {
		rootDir, _ = os.Getwd()
		rootDir = filepath.Base(rootDir)
	}
	windowTitle := rootDir

	// Try to read config file for custom title
	configPath := filepath.Join(path, CONFIG_PATH)
	if data, err := os.ReadFile(configPath); err == nil {
		var config Config
		if err := json.Unmarshal(data, &config); err == nil && config.Name != "" {
			windowTitle = config.Name
		}
	}

	window := EditorWindow(app, windowTitle)

	window.Center()

	if err := window.Show(); err != nil {
		log.Printf("Failed to show editor window: %v", err)
		return nil
	}

	return window
}

func runGitInit(dir string) error {
	// Check git availability
	if _, err := exec.LookPath("git"); err != nil {
		return fmt.Errorf("git is not installed or not in PATH: %w", err)
	}

	// Run `git init` in target dir
	cmd := exec.Command("git", "init")
	cmd.Dir = dir
	// Capture stderr/stdout for diagnostics
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("git init failed: %v; output: %s", err, string(output))
	}
	return nil
}

func createFile(path string) (*os.File, error) {
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return nil, err
	}
	f, err := os.Create(path) // creates or truncates file
	if err != nil {
		return nil, err
	}

	return f, nil
}
