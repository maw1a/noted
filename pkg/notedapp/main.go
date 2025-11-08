package notedapp

import (
	"io/fs"
	"noted/pkg/editor"
	"noted/pkg/file"
	"noted/pkg/router"
	"noted/pkg/ui"

	"github.com/wailsapp/wails/v3/pkg/application"
)

type App struct {
	*application.App
}

func New(name string, description string, assets fs.FS) App {
	app := application.New(application.Options{
		Name:        name,
		Description: description,
		Services: []application.Service{editor.Service(), file.Service()},
		Assets: router.AssetOptions(assets),
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
	})
	return App {
		app,
	}
}

func (app *App)Run() error {
	ui.OpenDirectoryWindow(app.App)

	err := app.App.Run()

	return err
}
