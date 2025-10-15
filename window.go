package main

import (
	"encoding/json"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v3/pkg/application"
)

func OpenDirectoryWindow(app *application.App) *application.WebviewWindow {
	return app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title:               "Noted",
		Name:                "Open Notes",
		Width:               744,
		Height:              464,
		DisableResize:       true,
		MaximiseButtonState: 2,
		MinimiseButtonState: 2,
		InitialPosition:     application.WindowCentered,
		BackgroundColour:    application.NewRGBA(27, 38, 54, 0),
		Mac: application.MacWindow{
			InvisibleTitleBarHeight: 50,
			TitleBar:                application.MacTitleBarHiddenInset,
			Backdrop:                application.MacBackdropTranslucent,
			Appearance:              application.NSAppearanceNameDarkAqua,
		},
		URL: "/",
	})
}

func EditorWindow(app *application.App, path string) *application.WebviewWindow {
	// Default window title fallback: use root directory name
	rootDir := ""
	if path != "" {
		rootDir = filepath.Base(path)
	} else {
		rootDir, _ = os.Getwd()
		rootDir = filepath.Base(rootDir)
	}
	title := rootDir

	// Try to read config file for custom title
	configPath := filepath.Join(path, CONFIG_PATH)
	if data, err := os.ReadFile(configPath); err == nil {
		var config Config
		if err := json.Unmarshal(data, &config); err == nil && config.Name != "" {
			title = config.Name
		}
	}

	return app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title:            title,
		Name:             "Editor",
		MinHeight:        480,
		MinWidth:         720,
		Height:           960,
		Width:            1280,
		DisableResize:    false,
		BackgroundColour: application.NewRGBA(27, 38, 54, 0),
		Mac: application.MacWindow{
			InvisibleTitleBarHeight: 40,
			TitleBar:                application.MacTitleBarHiddenInset,
			Backdrop:                application.MacBackdropTranslucent,
			Appearance:              application.NSAppearanceNameDarkAqua,
		},
		URL: "/editor?root=" + path,
	})
}
