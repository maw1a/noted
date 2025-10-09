package main

import (
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

func EditorWindow(app *application.App, title string) *application.WebviewWindow {
	return app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title:            title,
		Name:             "Editor",
		MinHeight:        480,
		MinWidth:         720,
		Height:           600,
		Width:            900,
		DisableResize:    false,
		BackgroundColour: application.NewRGBA(27, 38, 54, 0),
		Mac: application.MacWindow{
			InvisibleTitleBarHeight: 50,
			TitleBar:                application.MacTitleBarHiddenInset,
			Backdrop:                application.MacBackdropTranslucent,
			Appearance:              application.NSAppearanceNameDarkAqua,
		},
		URL: "/editor",
	})
}
