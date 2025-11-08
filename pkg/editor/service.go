package editor

import "github.com/wailsapp/wails/v3/pkg/application"

func Service() application.Service {
	return application.NewService(newEditor())
}
