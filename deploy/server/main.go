// Minimal static file server for the VoxelPort website.
//
// Serves the Vite build output (dist/) on a loopback address; public traffic
// arrives through the Cloudflare Tunnel, which terminates TLS. The site uses
// hash routing, so no SPA rewrite is needed — unknown paths get index.html
// anyway as a safety net for old links.
package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func main() {
	listen := flag.String("listen", "127.0.0.1:2527", "listen address")
	root := flag.String("root", "/opt/voxelport-web/www", "directory containing the built site")
	flag.Parse()

	index := filepath.Join(*root, "index.html")
	if _, err := os.Stat(index); err != nil {
		log.Fatalf("no index.html in %s: %v", *root, err)
	}
	files := http.FileServer(http.Dir(*root))

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet && r.Method != http.MethodHead {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		h := w.Header()
		h.Set("X-Content-Type-Options", "nosniff")
		h.Set("Referrer-Policy", "strict-origin-when-cross-origin")
		h.Set("X-Frame-Options", "DENY")

		// Vite emits content-hashed filenames under /assets/, safe to cache forever.
		if strings.HasPrefix(r.URL.Path, "/assets/") {
			h.Set("Cache-Control", "public, max-age=31536000, immutable")
			files.ServeHTTP(w, r)
			return
		}

		clean := filepath.Join(*root, filepath.FromSlash(filepath.Clean("/"+r.URL.Path)))
		if st, err := os.Stat(clean); err != nil || st.IsDir() && r.URL.Path != "/" {
			// Fall back to the app shell rather than a 404 or a directory listing.
			h.Set("Cache-Control", "no-cache")
			http.ServeFile(w, r, index)
			return
		}
		if r.URL.Path == "/" || strings.HasSuffix(r.URL.Path, ".html") {
			h.Set("Cache-Control", "no-cache")
		} else {
			h.Set("Cache-Control", "public, max-age=3600")
		}
		files.ServeHTTP(w, r)
	})

	srv := &http.Server{
		Addr:              *listen,
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
		MaxHeaderBytes:    16 << 10,
	}
	log.Printf("VoxelPort website serving %s on %s", *root, *listen)
	log.Fatal(srv.ListenAndServe())
}
