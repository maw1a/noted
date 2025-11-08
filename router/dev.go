//go:build !production
// +build !production

package router

import (
	"io/fs"

	"github.com/wailsapp/wails/v3/pkg/application"
)

func AssetOptions(assets fs.FS) application.AssetOptions {
	return application.AssetOptions{
    Handler:    application.AssetFileServerFS(assets),
  }
}
