package main

import (
	"embed"
	_ "embed"
	"log"

	"noted/pkg/notedapp"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := notedapp.New(
		"Noted — by maw1a",
		"Simple notes app based on Git. Write in markdown and web components. Save, share, collaborate across notes repositories. Because Notion sucks.",
		assets,
	)

	err := app.Run()

	if err != nil {
		log.Fatal(err)
	}
}
