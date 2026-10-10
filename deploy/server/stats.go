package main

// Privacy-friendly page-load counting for the operator dashboard. No cookies,
// and no IP address is ever stored: a visitor is a hash of (daily random salt,
// IP, user agent) held in memory for one day only, used just to count unique
// visitors and who's active right now. What's saved to disk is plain counts per
// day, kept forever: page loads, unique visitors, pages, referring sites,
// countries and search-engine crawler hits.

import (
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/binary"
	"encoding/json"
	"log"
	"net"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"sort"
	"strings"
	"sync"
	"time"
)

const (
	liveWindow = 5 * time.Minute
	maxKeys    = 200 // per map per day, so junk referrers can't grow the file forever
)

type dayStats struct {
	Views     int            `json:"views"`
	Visitors  int            `json:"visitors"`
	Paths     map[string]int `json:"paths"`
	Referrers map[string]int `json:"referrers"`
	Countries map[string]int `json:"countries"`
	Crawlers  map[string]int `json:"crawlers"`
}

type siteStats struct {
	path string

	mu      sync.Mutex
	days    map[string]*dayStats // "2006-01-02" (UTC) -> counts
	day     string
	salt    [16]byte
	seen    map[uint64]bool      // today's visitor hashes (memory only)
	live    map[uint64]time.Time // visitor hash -> last page load (memory only)
	ownHost string
}

var crawlerRE = regexp.MustCompile(`(?i)(googlebot|bingbot|duckduckbot|yandex|baiduspider|applebot|gptbot|claudebot|perplexity|ahrefs|semrush|facebookexternalhit|twitterbot|linkedinbot|discordbot|whatsapp|telegrambot|slackbot|redditbot)`)
var botRE = regexp.MustCompile(`(?i)(bot|crawl|spider|slurp|preview|curl|wget|python|go-http|httpclient|headless|monitor|uptime)`)

func newSiteStats(path, ownHost string) *siteStats {
	s := &siteStats{path: path, days: map[string]*dayStats{}, ownHost: ownHost}
	if path != "" {
		if raw, err := os.ReadFile(path); err == nil {
			if err := json.Unmarshal(raw, &s.days); err != nil {
				log.Printf("stats: ignoring unreadable %s: %v", path, err)
				s.days = map[string]*dayStats{}
			}
		}
	}
	s.rollLocked(time.Now().UTC().Format("2006-01-02"))
	return s
}

func (s *siteStats) rollLocked(day string) {
	if s.day == day {
		return
	}
	s.day = day
	rand.Read(s.salt[:])
	s.seen = map[uint64]bool{}
	s.live = map[uint64]time.Time{}
	if s.days[day] == nil {
		s.days[day] = newDay()
	}
}

func newDay() *dayStats {
	return &dayStats{Paths: map[string]int{}, Referrers: map[string]int{}, Countries: map[string]int{}, Crawlers: map[string]int{}}
}

func bump(m map[string]int, k string) {
	if k == "" {
		return
	}
	if _, ok := m[k]; ok || len(m) < maxKeys {
		m[k]++
	}
}

// pageLoad records one successful HTML page load.
func (s *siteStats) pageLoad(r *http.Request, path string) {
	if s == nil || r.Method != http.MethodGet {
		return
	}
	ua := r.UserAgent()
	now := time.Now()
	s.mu.Lock()
	defer s.mu.Unlock()
	s.rollLocked(now.UTC().Format("2006-01-02"))
	d := s.days[s.day]
	if m := crawlerRE.FindString(ua); m != "" {
		bump(d.Crawlers, strings.ToLower(m))
		return
	}
	if ua == "" || botRE.MatchString(ua) {
		return
	}

	ip := r.Header.Get("CF-Connecting-IP")
	if ip == "" {
		ip, _, _ = net.SplitHostPort(r.RemoteAddr)
	}
	h := sha256.New()
	h.Write(s.salt[:])
	h.Write([]byte(ip))
	h.Write([]byte{0})
	h.Write([]byte(ua))
	visitor := binary.BigEndian.Uint64(h.Sum(nil))

	d.Views++
	if !s.seen[visitor] {
		s.seen[visitor] = true
		d.Visitors++
	}
	s.live[visitor] = now
	bump(d.Paths, path)
	bump(d.Countries, strings.ToUpper(r.Header.Get("CF-IPCountry")))
	if ref, err := url.Parse(r.Referer()); err == nil && ref.Host != "" {
		host := strings.TrimPrefix(strings.ToLower(ref.Hostname()), "www.")
		if host != s.ownHost {
			bump(d.Referrers, host)
		}
	}
}

func (s *siteStats) liveCountLocked() int {
	cutoff := time.Now().Add(-liveWindow)
	n := 0
	for k, t := range s.live {
		if t.Before(cutoff) {
			delete(s.live, k)
		} else {
			n++
		}
	}
	return n
}

func (s *siteStats) save() {
	if s == nil || s.path == "" {
		return
	}
	s.mu.Lock()
	data, err := json.Marshal(s.days)
	s.mu.Unlock()
	if err != nil {
		return
	}
	tmp := s.path + ".tmp"
	if err := os.WriteFile(tmp, data, 0o600); err != nil {
		log.Printf("stats: save: %v", err)
		return
	}
	os.Rename(tmp, s.path)
}

func (s *siteStats) saveLoop() {
	for range time.Tick(5 * time.Minute) {
		s.save()
	}
}

// handler serves GET /stats to the dashboard (bearer token, loopback listener).
func (s *siteStats) handler(token string) http.Handler {
	want := []byte("Bearer " + token)
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if subtle.ConstantTimeCompare([]byte(r.Header.Get("Authorization")), want) != 1 {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		s.mu.Lock()
		s.rollLocked(time.Now().UTC().Format("2006-01-02"))
		days := make([]string, 0, len(s.days))
		for d := range s.days {
			days = append(days, d)
		}
		sort.Strings(days)
		out := map[string]any{"live": s.liveCountLocked(), "today": s.day, "days": map[string]*dayStats{}}
		for _, d := range days {
			out["days"].(map[string]*dayStats)[d] = s.days[d]
		}
		data, err := json.Marshal(out)
		s.mu.Unlock()
		if err != nil {
			http.Error(w, "error", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Cache-Control", "no-store")
		w.Write(data)
	})
}
