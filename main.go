package main

import (
	"embed"
	_ "embed"
	"log"

	"github.com/wailsapp/wails/v3/pkg/application"

	"noted/router"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := application.New(application.Options{
		Name:        "Noted — by maw1a",
		Description: "Simple notes app based on Git. Write in markdown and web components. Save, share, collaborate across notes repositories. Because Notion sucks.",
		Services: []application.Service{
			application.NewService(NewEditorService()),
			application.NewService(NewScanner()),
		},
		Assets: router.AssetOptions(assets),
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
	})

	OpenDirectoryWindow(app)

	err := app.Run()

	if err != nil {
		log.Fatal(err)
	}
}
