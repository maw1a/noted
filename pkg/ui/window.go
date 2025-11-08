package ui

import (
	"github.com/leaanthony/u"
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
			WebviewPreferences: application.MacWebviewPreferences{
				TabFocusesLinks:                     u.False,
				AllowsBackForwardNavigationGestures: u.False,
				FullscreenEnabled:                   u.True,
				TextInteractionEnabled:              u.False,
			},
		},
		URL: "/",
	})
}

func EditorWindow(app *application.App, path string, title string) *application.WebviewWindow {
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
			InvisibleTitleBarHeight: 20,
			TitleBar:                application.MacTitleBarHiddenInset,
			Backdrop:                application.MacBackdropTranslucent,
			Appearance:              application.NSAppearanceNameDarkAqua,
			WebviewPreferences: application.MacWebviewPreferences{
				TextInteractionEnabled: u.False,
				TabFocusesLinks: u.False,
				AllowsBackForwardNavigationGestures: u.False,
			},
		},
		URL: "/editor?root=" + path,
	})
}
