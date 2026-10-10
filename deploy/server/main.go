// Minimal static file server for the VoxelPort website.
//
// Serves the Vite build output (dist/) on a loopback address; public traffic
// arrives through the Cloudflare Tunnel, which terminates TLS. Each route has
// its own prerendered page (dist/servers/index.html, …), served at /servers
// without a redirect. Unknown paths get the app shell with a 404 status, so
// search engines don't index them as copies of the home page.
//
// With -stats-listen it also counts page loads (see stats.go) and serves the
// counts to the operator dashboard on a separate loopback listener.
package main

import (
	"bytes"
	"flag"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
	"time"
)

func main() {
	listen := flag.String("listen", "127.0.0.1:2527", "listen address")
	root := flag.String("root", "/opt/voxelport-web/www", "directory containing the built site")
	statsListen := flag.String("stats-listen", "", "loopback address serving page-load counts to the dashboard (token from $VOXELPORT_ADMIN_TOKEN); empty disables counting")
	statsFile := flag.String("stats-file", "", "where daily counts are saved (e.g. /var/lib/voxelport-web/stats.json)")
	flag.Parse()

	var stats *siteStats
	token := os.Getenv("VOXELPORT_ADMIN_TOKEN")
	if *statsListen != "" && (len(token) < 24 || !strings.HasPrefix(*statsListen, "127.0.0.1:")) {
		// Never take the website down over stats: just run without them.
		log.Printf("stats disabled: -stats-listen must be a 127.0.0.1 address and needs $VOXELPORT_ADMIN_TOKEN (24+ characters)")
	} else if *statsListen != "" {
		stats = newSiteStats(*statsFile, "voxelport.in")
		go stats.saveLoop()
		go func() {
			ss := &http.Server{Addr: *statsListen, Handler: stats.handler(token), ReadHeaderTimeout: 5 * time.Second}
			log.Printf("stats on %s", *statsListen)
			log.Printf("stats listener stopped: %v", ss.ListenAndServe())
		}()
		sig := make(chan os.Signal, 1)
		signal.Notify(sig, syscall.SIGTERM, os.Interrupt)
		go func() { <-sig; stats.save(); os.Exit(0) }()
	}

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
		st, err := os.Stat(clean)
		if err == nil && st.IsDir() && r.URL.Path != "/" {
			// A route like /servers: serve its own page directly (no /servers/ redirect).
			if b, err := os.ReadFile(filepath.Join(clean, "index.html")); err == nil {
				h.Set("Cache-Control", "no-cache")
				h.Set("Content-Type", "text/html; charset=utf-8")
				stats.pageLoad(r, strings.TrimSuffix(r.URL.Path, "/"))
				http.ServeContent(w, r, "index.html", st.ModTime(), bytes.NewReader(b))
				return
			}
		}
		if err != nil || st.IsDir() && r.URL.Path != "/" {
			// Unknown path: the app shell (it shows the home page), but a real 404.
			h.Set("Cache-Control", "no-cache")
			h.Set("Content-Type", "text/html; charset=utf-8")
			w.WriteHeader(http.StatusNotFound)
			if r.Method == http.MethodGet {
				if b, err := os.ReadFile(index); err == nil {
					w.Write(b)
				}
			}
			return
		}
		if r.URL.Path == "/" {
			stats.pageLoad(r, "/")
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
