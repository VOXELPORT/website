import { useEffect, useState, useRef, useCallback } from 'react';
import './index.css';

const RELAY_WS = 'wss://relay.voxelport.in/ws';
const MONO = "'JetBrains Mono', ui-monospace, monospace";
const GREEN = '#00FFB2';
const MAGENTA = '#FF4FA3';
const YELLOW = '#FFD84A';
const VIOLET = '#B084F5';
const VOID = '#0A0A0A';

// ── Ping helpers (unchanged logic) ─────────────────────────────────────────────
function pingRelay() {
  return new Promise((resolve) => {
    const start = Date.now();
    let ws;
    try { ws = new WebSocket(RELAY_WS); } catch { resolve({ online: false, latency: null }); return; }
    const timer = setTimeout(() => { try { ws.close(); } catch {} resolve({ online: false, latency: null }); }, 8000);
    ws.onopen = () => {
      clearTimeout(timer);
      const latency = Date.now() - start;
      try { ws.close(); } catch {}
      resolve({ online: true, latency });
    };
    ws.onerror = () => { clearTimeout(timer); resolve({ online: false, latency: null }); };
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = {
    operational: { color: GREEN,   label: 'OPERATIONAL' },
    degraded:    { color: YELLOW,  label: 'DEGRADED' },
    down:        { color: MAGENTA, label: 'DOWN' },
    checking:    { color: '#8a8a8a', label: 'CHECKING…' },
  }[status] || { color: '#8a8a8a', label: 'UNKNOWN' };

  return (
    <span style={{
      fontFamily: MONO, fontSize: '0.62rem', letterSpacing: '0.12em',
      color: cfg.color, background: `${cfg.color}14`, padding: '0.25rem 0.7rem', textTransform: 'uppercase',
      border: `1px solid ${cfg.color}55`, borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, flexShrink: 0, animation: status === 'operational' ? 'vp-pulse 2s ease-in-out infinite' : 'none' }} />
      {cfg.label}
    </span>
  );
}

function relayStatus(ms) {
  if (ms === null || ms === undefined) return 'down';
  if (ms < 150) return 'operational';
  if (ms < 350) return 'degraded';
  return 'down';
}

function LatencyBar({ ms }) {
  if (ms === null) return <span style={{ fontFamily: MONO, fontSize: '0.72rem', color: '#6a6a6a' }}>—</span>;
  const color = ms < 120 ? GREEN : ms < 280 ? YELLOW : MAGENTA;
  return (
    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 650, fontSize: '2rem', color, lineHeight: 1 }}>
      {ms}<span style={{ fontSize: '0.8rem', fontFamily: MONO, color: '#9a9a9a', marginLeft: 3 }}>ms</span>
    </span>
  );
}

function ServiceCard({ icon, name, desc, status, latency, extra, loading, accent }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,.012)', padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1.4rem',
      border: '1px solid var(--border)', borderRadius: 16, borderLeft: `2px solid ${accent}`,
      transition: 'transform 0.15s ease, border-color 0.15s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem' }}>
        <div style={{ width: 38, height: 38, background: `${accent}12`, border: `1px solid ${accent}44`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: MONO, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 2 }}>{name}</div>
          <div style={{ fontFamily: MONO, fontSize: '0.62rem', color: '#6a6a6a', fontWeight: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{desc}</div>
        </div>
      </div>
      <div><StatusBadge status={loading ? 'checking' : status} /></div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: '0.55rem', color: '#6a6a6a', letterSpacing: '0.1em', marginBottom: 6 }}>LATENCY</div>
          <LatencyBar ms={latency} />
        </div>
        {extra && <div style={{ textAlign: 'right', flexShrink: 0 }}>{extra}</div>}
      </div>
    </div>
  );
}

// ── Main Status Page ──────────────────────────────────────────────────────────
export default function StatusPage({ onBack }) {
  const [relay, setRelay] = useState({ status: 'checking', latency: null });
  const [lastChecked, setLastChecked] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);

  const check = useCallback(async () => {
    setLoading(true);
    const relayResult = await pingRelay();
    const rs = relayResult.online ? relayStatus(relayResult.latency) : 'down';
    setRelay({ status: rs, latency: relayResult.latency });
    setLastChecked(new Date());
    setHistory(prev => [...prev.slice(-19), { time: new Date().toLocaleTimeString(), relayMs: relayResult.latency }]);
    setLoading(false);
  }, []);

  useEffect(() => {
    check();
    intervalRef.current = setInterval(check, 30000);
    return () => clearInterval(intervalRef.current);
  }, [check]);

  const overallStatus = () => {
    if (loading) return 'checking';
    if (relay.status === 'down') return 'down';
    if (relay.status === 'degraded') return 'degraded';
    return 'operational';
  };
  const overall = overallStatus();
  const overallColor = overall === 'operational' ? GREEN : overall === 'down' ? MAGENTA : YELLOW;

  return (
    <div className="vp-status" style={{ background: VOID, minHeight: '100vh', color: '#E8E8E8', fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <nav className="nav">
        <a href="#" className="nav-logo" onClick={onBack}>
          <span style={{ display: 'inline-block', width: 22, height: 22, border: `1.5px solid ${GREEN}`, borderRadius: 5, boxShadow: '0 0 14px rgba(0,255,178,.4)' }} />
          VOXEL<span>PORT</span>
        </a>
        <ul className="nav-links">
          <li>
            <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: MONO, fontSize: '0.72rem', color: '#9a9a9a', letterSpacing: '0.06em' }}>
              ← BACK TO SITE
            </button>
          </li>
        </ul>
      </nav>

      <div className="vp-legal-body" style={{ maxWidth: 960, margin: '0 auto', padding: '8rem 2.5rem 6rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '4rem' }}>
          <div className="section-label" style={{ marginBottom: '1rem' }}>LIVE MONITORING</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 0.9, letterSpacing: '-0.02em', color: '#fff' }}>
              SYSTEM<br /><span style={{ color: GREEN, textShadow: '0 0 44px rgba(0,255,178,.35)' }}>STATUS</span>
            </h1>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem' }}>
              <StatusBadge status={loading ? 'checking' : overall} />
              <span style={{ fontFamily: MONO, fontSize: '0.6rem', color: '#6a6a6a', letterSpacing: '0.08em' }}>
                {lastChecked ? `CHECKED ${lastChecked.toLocaleTimeString()}` : 'CHECKING…'}
              </span>
              <button
                onClick={check}
                disabled={loading}
                style={{
                  fontFamily: MONO, fontSize: '0.65rem', background: 'none',
                  border: '1px solid var(--border-bright)', color: loading ? '#6a6a6a' : GREEN,
                  padding: '0.4rem 1rem', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}
              >
                {loading ? 'CHECKING…' : '↺ CHECK NOW'}
              </button>
            </div>
          </div>

          {/* Overall banner */}
          <div style={{
            marginTop: '2rem', padding: '1.2rem 1.6rem', background: `${overallColor}0d`,
            border: `1px solid ${overallColor}55`, borderRadius: 12, display: 'flex', alignItems: 'center', gap: '1rem',
          }}>
            <span style={{ fontSize: '1.4rem', color: overallColor }}>{overall === 'operational' ? '✓' : overall === 'down' ? '✕' : '~'}</span>
            <div>
              <div style={{ fontFamily: MONO, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', color: overallColor }}>
                {overall === 'operational' ? 'ALL SYSTEMS OPERATIONAL' : overall === 'down' ? 'SERVICE DISRUPTION DETECTED' : overall === 'checking' ? 'RUNNING CHECKS…' : 'DEGRADED PERFORMANCE'}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#9a9a9a', fontWeight: 300, marginTop: 2 }}>
                {overall === 'operational' ? 'Relay is reachable. You can host and join sessions.'
                  : overall === 'down' ? 'The relay is unreachable. Hosting and joining may not work.'
                  : overall === 'checking' ? 'Pinging services from your browser location…'
                  : 'Some services are slower than normal. Sessions may be laggy.'}
              </div>
            </div>
          </div>
        </div>

        {/* Service cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          <ServiceCard
            icon="📡" name="Relay Server" desc="wss://relay.voxelport.in"
            status={relay.status} latency={relay.latency} loading={loading} accent={GREEN}
            extra={
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: MONO, fontSize: '0.58rem', color: '#6a6a6a', letterSpacing: '0.1em', marginBottom: 4 }}>LOCATION</div>
                <div style={{ fontFamily: MONO, fontSize: '0.72rem', color: '#9a9a9a' }}>India 🇮🇳</div>
              </div>
            }
          />
          <ServiceCard
            icon="🌐" name="Website" desc="www.voxelport.in"
            status="operational" latency={null} loading={false} accent={MAGENTA}
            extra={
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: MONO, fontSize: '0.58rem', color: '#6a6a6a', letterSpacing: '0.1em', marginBottom: 4 }}>NOTE</div>
                <div style={{ fontFamily: MONO, fontSize: '0.68rem', color: '#9a9a9a' }}>You're on it</div>
              </div>
            }
          />
        </div>

        {/* Ping from your location */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 16, background: 'rgba(255,255,255,.012)', padding: '2rem', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: '0.68rem', color: GREEN, letterSpacing: '0.12em', marginBottom: 4 }}>YOUR LOCATION → RELAY</div>
              <div style={{ fontSize: '0.88rem', color: '#9a9a9a', fontWeight: 300 }}>
                Real WebSocket ping measured from your browser to the India relay. This is the overhead VoxelPort adds to your Minecraft connection.
              </div>
            </div>
            {relay.latency !== null && (
              <div style={{ textAlign: 'center' }}>
                <LatencyBar ms={relay.latency} />
                <div style={{ fontFamily: MONO, fontSize: '0.58rem', color: '#8a8a8a', letterSpacing: '0.08em', marginTop: 4 }}>
                  {relay.latency < 80 ? '🟢 EXCELLENT' : relay.latency < 150 ? '🟢 GOOD' : relay.latency < 250 ? '🟡 FAIR' : relay.latency < 400 ? '🟠 HIGH' : '🔴 VERY HIGH'}
                </div>
              </div>
            )}
          </div>

          {/* Latency guide */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
            {[
              { range: '< 80ms', label: 'EXCELLENT', color: GREEN, note: 'South Asia, Southeast Asia' },
              { range: '80–150ms', label: 'GOOD', color: '#7FFF00', note: 'Middle East, East Asia' },
              { range: '150–250ms', label: 'FAIR', color: YELLOW, note: 'Europe, Central Asia' },
              { range: '250–400ms', label: 'HIGH', color: '#FF8C00', note: 'North America' },
              { range: '> 400ms', label: 'VERY HIGH', color: MAGENTA, note: 'South America, Australia' },
            ].map((t, i) => (
              <div key={i} style={{ background: VOID, padding: '1rem 0.8rem', borderTop: `2px solid ${t.color}` }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 650, fontSize: '1rem', color: t.color }}>{t.range}</div>
                <div style={{ fontFamily: MONO, fontSize: '0.6rem', color: t.color, letterSpacing: '0.08em', margin: '0.2rem 0' }}>{t.label}</div>
                <div style={{ fontSize: '0.72rem', color: '#6a6a6a', fontWeight: 300, lineHeight: 1.4 }}>{t.note}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#6a6a6a', fontWeight: 300 }}>
            ℹ The relay currently runs on a single server in India. High latency for your region is expected — we plan to add nodes in Europe and North America if the project grows.
            {' '}<a href="https://github.com/sponsors/trazhub" target="_blank" rel="noreferrer" style={{ color: GREEN }}>Support the project →</a>
          </div>
        </div>

        {/* Ping history chart */}
        {history.length > 1 && (
          <div style={{ border: '1px solid var(--border)', borderRadius: 16, background: 'rgba(255,255,255,.012)', padding: '2rem', marginBottom: '3rem' }}>
            <div style={{ fontFamily: MONO, fontSize: '0.68rem', color: GREEN, letterSpacing: '0.12em', marginBottom: '1.5rem' }}>
              RELAY PING HISTORY (THIS SESSION)
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: 80 }}>
              {history.map((h, i) => {
                const ms = h.relayMs;
                const maxMs = Math.max(...history.map(x => x.relayMs || 0), 400);
                const pct = ms ? Math.min((ms / maxMs) * 100, 100) : 100;
                const color = !ms ? MAGENTA : ms < 120 ? GREEN : ms < 280 ? YELLOW : MAGENTA;
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: '100%', height: `${pct}%`, background: color, borderRadius: '2px 2px 0 0', opacity: i === history.length - 1 ? 1 : 0.4, minHeight: 2, transition: 'height 0.4s' }} title={ms ? `${ms}ms at ${h.time}` : `offline at ${h.time}`} />
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: MONO, fontSize: '0.55rem', color: '#6a6a6a' }}>
              <span>{history[0]?.time}</span>
              <span>AUTO-REFRESHES EVERY 30S</span>
              <span>{history[history.length - 1]?.time}</span>
            </div>
          </div>
        )}

        {/* Auto-refresh note */}
        <div style={{ fontFamily: MONO, fontSize: '0.62rem', color: '#6a6a6a', letterSpacing: '0.08em', textAlign: 'center' }}>
          PINGS MEASURED FROM YOUR BROWSER · AUTO-REFRESH EVERY 30 SECONDS · RELAY LOCATION: INDIA 🇮🇳
        </div>
      </div>

      {/* Footer strip */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ fontFamily: MONO, fontSize: '0.62rem', color: '#6a6a6a', letterSpacing: '0.06em' }}>© 2026 VOXELPORT · BUILT BY TRAZHUB</span>
        <button onClick={onBack} style={{ fontFamily: MONO, fontSize: '0.68rem', background: 'none', border: '1px solid var(--border-bright)', color: '#9a9a9a', padding: '0.4rem 1rem', borderRadius: 8, cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          ← BACK TO SITE
        </button>
      </div>
    </div>
  );
}
