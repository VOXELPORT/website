import { useCallback, useEffect, useRef, useState } from 'react';
import { Nav, Footer, Pixels } from './ui.jsx';
import { SITE_NAV } from './content.js';
import { SPRITES, useRelayStatus, DISCORD } from './data.js';

// The India relay has two public routes: hosts on app ≥1.3.1 try direct first
// and fall back to the Cloudflare route. The Europe and Los Angeles relays serve wss themselves.
const ENDPOINTS = [
  { key: 'direct', name: 'DIRECT ROUTE', host: 'wss://direct.voxelport.in:26499', url: 'https://direct.voxelport.in:26499/api/status', sprite: 'bolt', note: 'Used first by the app (1.3.1+)' },
  { key: 'cdn', name: 'CLOUDFLARE ROUTE', host: 'wss://relay.voxelport.in', url: 'https://relay.voxelport.in/api/status', sprite: 'signal', note: 'Fallback route · older versions' },
  { key: 'eu', name: 'EUROPE RELAY', host: 'wss://eu.voxelport.in', url: 'https://eu.voxelport.in/api/status', sprite: 'tower', note: 'Chosen automatically when it’s closest to you' },
  { key: 'la', name: 'LOS ANGELES RELAY', host: 'wss://la.voxelport.in', url: 'https://la.voxelport.in/api/status', sprite: 'tower', note: 'Chosen automatically when it’s closest to you' },
];

/** Warm round-trip time: one request to open the connection, then the best of three. */
async function measure(url) {
  const once = async () => {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 8000);
    const start = performance.now();
    try {
      const r = await fetch(url, { cache: 'no-store', signal: ctl.signal });
      await r.json();
      return performance.now() - start;
    } finally { clearTimeout(t); }
  };
  try {
    await once();
    const samples = [];
    for (let i = 0; i < 3; i++) samples.push(await once());
    return Math.round(Math.min(...samples));
  } catch {
    return null;
  }
}

function grade(ms) {
  if (ms === null || ms === undefined) return { label: 'NO ANSWER', color: 'var(--bad, #ff6b6b)' };
  if (ms < 60) return { label: 'EXCELLENT', color: 'var(--grass)' };
  if (ms < 120) return { label: 'GOOD', color: 'var(--grass)' };
  if (ms < 220) return { label: 'FAIR', color: 'var(--gold)' };
  return { label: 'HIGH', color: 'var(--bad, #ff6b6b)' };
}

function EndpointCard({ ep, ms, loading, i }) {
  const g = grade(ms);
  return (
    <div className="panel" style={{ padding: '22px 22px 24px', transform: `rotate(${i ? .8 : -.8}deg)`, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Pixels rows={SPRITES[ep.sprite]} size={4} />
        <div style={{ minWidth: 0 }}>
          <div className="h-display" style={{ fontSize: 30 }}>{ep.name}</div>
          <div className="typewriter" style={{ fontSize: 13, color: 'var(--muted)', overflowWrap: 'anywhere' }}>{ep.host}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div className="pixel" style={{ fontSize: 11, color: 'var(--muted)' }}>PING FROM YOU</div>
          <div className="h-display" style={{ fontSize: 58, lineHeight: 1 }}>{loading ? '…' : ms === null ? '—' : `${ms} MS`}</div>
        </div>
        <span className="sticker" style={{ background: loading ? 'var(--paper-2)' : g.color, color: loading ? 'var(--ink)' : '#07090c', transform: 'rotate(3deg)' }}>
          {loading ? 'CHECKING…' : g.label}
        </span>
      </div>
      <div className="typewriter" style={{ fontSize: 13, color: 'var(--ink-2)' }}>{ep.note}</div>
    </div>
  );
}

export default function StatusPage({ onBack }) {
  const relay = useRelayStatus(15000);
  const [ms, setMs] = useState(() => Object.fromEntries(ENDPOINTS.map((e) => [e.key, null])));
  const [loading, setLoading] = useState(true);
  const [checkedAt, setCheckedAt] = useState(null);
  const [history, setHistory] = useState([]);
  const timer = useRef(null);

  // `loading` starts true, so the automatic checks don't need to set it;
  // only the manual "Check now" button flips it back on first.
  const check = useCallback(async () => {
    const results = await Promise.all(ENDPOINTS.map((e) => measure(e.url)));
    const next = Object.fromEntries(ENDPOINTS.map((e, i) => [e.key, results[i]]));
    setMs(next);
    setCheckedAt(new Date());
    setHistory((h) => [...h.slice(-23), { t: new Date().toLocaleTimeString(), ...next }]);
    setLoading(false);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const first = setTimeout(check, 0);
    timer.current = setInterval(check, 30000);
    return () => { clearTimeout(first); clearInterval(timer.current); };
  }, [check]);

  const anyUp = Object.values(ms).some((v) => v !== null);
  const overall = loading && !checkedAt ? 'checking' : !anyUp ? 'down' : Object.values(ms).some((v) => v === null) ? 'partial' : 'ok';
  const banner = {
    checking: ['RUNNING CHECKS…', 'Pinging the relay from your browser.', 'var(--paper-2)'],
    ok: ['ALL ROUTES ANSWERED', 'Every relay and route answered from your browser just now.', 'var(--grass)'],
    partial: ['SOME ROUTES DID NOT ANSWER', 'From your browser, at least one route did not answer. The cards below show which. It can be your network as well as the relay.', 'var(--gold)'],
    down: ['NO RELAY ANSWERED', 'None of the relays answered from your browser. This can be your connection or the relays. Check the uptime report or the Discord.', 'var(--bad, #ff6b6b)'],
  }[overall];
  const maxMs = Math.max(200, ...history.flatMap((h) => ENDPOINTS.map((e) => h[e.key] || 0)));

  const back = (e) => { e?.preventDefault(); onBack(e); };

  return (
    <div className="zine hb">
      <Nav links={SITE_NAV} relay={null} onLogo={back} />

      <main lang="en" id="main-content" tabIndex={-1} className="wrap" style={{ paddingTop: 60, paddingBottom: 100, maxWidth: 1000 }}>
        <span className="kicker">Live monitoring · special edition</span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', marginTop: 10 }}>
          <h1 style={{ fontSize: 'clamp(64px, 11vw, 132px)', fontWeight: 400, lineHeight: .95 }}>
            <span className="c-title" data-text="RELAY">RELAY</span><br />
            <span className="c-title green" data-text="STATUS">STATUS</span>
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
            <span className="typewriter" style={{ fontSize: 13, color: 'var(--muted)' }}>{checkedAt ? `Checked ${checkedAt.toLocaleTimeString()}` : 'Checking…'}</span>
            <button className="btn sm cream" onClick={() => { setLoading(true); check(); }} disabled={loading}>{loading ? 'CHECKING…' : '↻ CHECK NOW'}</button>
          </div>
        </div>

        <div role="status" aria-live="polite" className="panel" style={{ marginTop: 34, padding: '18px 22px', background: banner[2], color: overall === 'checking' ? 'var(--ink)' : '#07090c', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', transform: 'rotate(-.5deg)' }}>
          <span className="h-display" style={{ fontSize: 36, color: 'inherit' }}>{banner[0]}</span>
          <span style={{ fontWeight: 600 }}>{banner[1]}</span>
        </div>

        <div className="grid-3" style={{ marginTop: 36 }}>
          {[
            ['HOSTS ONLINE', relay.tunnels, 'grass'],
            ['PLAYERS CONNECTED', relay.players, 'head1'],
            ['RELAY LOCATIONS', 'IN + EU + LA', 'house'],
          ].map(([label, value, sprite], i) => (
            <div key={label} className="panel" style={{ padding: '18px 20px', transform: `rotate(${[-1, .6, -.4][i]}deg)` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="pixel" style={{ fontSize: 12, color: 'var(--muted)' }}>{label}</span>
                <Pixels rows={SPRITES[sprite]} size={3} />
              </div>
              <div className="h-display" style={{ fontSize: 56, marginTop: 6 }}>{label !== 'RELAY LOCATIONS' && relay.state === 'offline' ? '—' : (value ?? (relay.state === 'loading' ? '…' : '—'))}</div>
            </div>
          ))}
        </div>

        <div className="grid-3" style={{ marginTop: 36 }}>
          {ENDPOINTS.map((ep, i) => <EndpointCard key={ep.key} ep={ep} ms={ms[ep.key]} loading={loading && !checkedAt} i={i} />)}
        </div>

        {history.length > 1 && (
          <div className="panel" style={{ marginTop: 40, padding: '22px 22px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <span className="kicker">Ping history · this visit</span>
              <span className="typewriter" style={{ fontSize: 13 }}>
                <span style={{ display: 'inline-block', width: 12, height: 12, background: 'var(--grass)', border: '2px solid var(--ink)', verticalAlign: -1 }} /> direct&nbsp;&nbsp;
                <span style={{ display: 'inline-block', width: 12, height: 12, background: 'var(--diamond)', border: '2px solid var(--ink)', verticalAlign: -1 }} /> cloudflare&nbsp;&nbsp;
                <span style={{ display: 'inline-block', width: 12, height: 12, background: 'var(--gold)', border: '2px solid var(--ink)', verticalAlign: -1 }} /> europe&nbsp;&nbsp;
                <span style={{ display: 'inline-block', width: 12, height: 12, background: '#a78bfa', border: '2px solid var(--ink)', verticalAlign: -1 }} /> los angeles
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, marginTop: 18, borderBottom: '3px solid var(--ink)' }}>
              {history.map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 2, height: '100%' }} title={`${h.t} · direct ${h.direct ?? '—'} ms · cloudflare ${h.cdn ?? '—'} ms · europe ${h.eu ?? '—'} ms · los angeles ${h.la ?? '—'} ms`}>
                  {[[h.direct, 'var(--grass)'], [h.cdn, 'var(--diamond)'], [h.eu, 'var(--gold)'], [h.la, '#a78bfa']].map(([v, c], j) => (
                    <div key={j} style={{ flex: 1, height: v === null ? '100%' : `${Math.max(4, (v / maxMs) * 100)}%`, background: v === null ? 'var(--bad, #ff6b6b)' : c, border: '2px solid var(--ink)', borderBottom: 'none' }} />
                  ))}
                </div>
              ))}
            </div>
            <div className="typewriter" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
              <span>{history[0].t}</span><span>refreshes every 30s</span><span>{history[history.length - 1].t}</span>
            </div>
          </div>
        )}

        <div className="bubble tail-b" style={{ marginTop: 50, maxWidth: 720 }}>
          <span className="kicker">About these numbers</span>
          <p style={{ marginTop: 8, lineHeight: 1.65 }}>
            Pings are measured from <b>your browser</b> to each relay (the best of three requests after a warm-up): one server in India, one in Europe and one in Los Angeles. The app picks whichever answers fastest for
            the person running the server. Latency depends on where you are, which relay you reach, how your ISP routes traffic, the quality of your connection and, for a Minecraft server, the hardware it runs on, so your numbers will differ from anyone else’s. When you are far from every relay, expect more.
            If a card says no answer, the relay may be down or your network may be blocking the request. Nothing here is a guarantee; for history, see the <a href="/uptime">uptime report</a>. The India direct route skips the Cloudflare hop, which some ISPs send through another country. Players connect to{' '}
            <span className="typewriter" style={{ fontWeight: 700 }}>play.voxelport.in</span> (India) or <span className="typewriter" style={{ fontWeight: 700 }}>play-eu.voxelport.in</span> (Europe) or <span className="typewriter" style={{ fontWeight: 700 }}>play-la.voxelport.in</span> (Los Angeles) directly either way. Want the history? See the <a href="/uptime">uptime report</a>. See something wrong? Tell us in <b>#help</b> on the <a href={DISCORD} target="_blank" rel="noopener noreferrer">Discord</a>, where <b>/status</b> also shows whether VoxelPort is working.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
