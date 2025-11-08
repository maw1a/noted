//go:build production
// +build production

package router

import (
	"io/fs"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/wailsapp/wails/v3/pkg/application"
)

func ginMiddleware(ginEngine *gin.Engine) application.Middleware {
  return func(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
      if strings.HasPrefix(r.URL.Path, "/wails") {
        next.ServeHTTP(w, r)
        return
      }
      ginEngine.ServeHTTP(w, r)
    })
  }
}

func AssetOptions(assets fs.FS) application.AssetOptions {
	ginEngine := gin.New()

	ginEngine.Use(gin.Recovery())

	distFS, err := fs.Sub(assets, "frontend/dist")
	if err != nil {
		panic(err)
	}

	assetsFS, err := fs.Sub(distFS, "assets")
	if err != nil {
		panic(err)
	}

	ginEngine.StaticFS("/assets", http.FS(assetsFS))

	ginEngine.GET("/", func(c *gin.Context) {
		f, err := distFS.Open("index.html")
		if err != nil {
			c.String(http.StatusInternalServerError, "index.html not found")
			return
		}
		info, _ := f.Stat()
		c.DataFromReader(http.StatusOK, info.Size(), "text/html; charset=utf-8", f, nil)
	})

	ginEngine.NoRoute(func(c *gin.Context) {
		f, err := distFS.Open("index.html")
		if err != nil {
			c.String(http.StatusInternalServerError, "index.html not found")
			return
		}
		info, _ := f.Stat()
		c.DataFromReader(http.StatusOK, info.Size(), "text/html; charset=utf-8", f, nil)
	})

	return application.AssetOptions{
    Handler:    ginEngine,
    Middleware: ginMiddleware(ginEngine),
  }
}
