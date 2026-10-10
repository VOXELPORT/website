import { useCallback, useEffect, useMemo, useState } from 'react';
import { Nav, Footer, Pixels } from './ui.jsx';
import { SPRITES, SERVERS_URL, DL_STORE } from './data.js';

const MODES = [
  ['all', 'All'], ['survival', 'Survival'], ['creative', 'Creative'], ['hardcore', 'Hardcore'], ['modded', 'Modded'], ['bedrock', 'Bedrock'],
];
const MODE_COLOR = { survival: 'green', creative: 'gold', hardcore: 'red', modded: 'gold', adventure: 'green', minigames: 'gold', skyblock: 'green' };
const SPRITE_FOR = { survival: 'grass', creative: 'diamond', hardcore: 'heart', modded: 'bolt' };

function useServers() {
  const [state, setState] = useState({ loading: true, error: false, servers: [], at: null });
  const load = useCallback(async () => {
    try {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), 8000);
      const r = await fetch(SERVERS_URL, { cache: 'no-store', signal: ctl.signal });
      clearTimeout(t);
      const j = await r.json();
      setState({ loading: false, error: false, servers: Array.isArray(j.servers) ? j.servers : [], at: new Date() });
    } catch {
      setState((s) => ({ ...s, loading: false, error: true, at: new Date() }));
    }
  }, []);
  useEffect(() => {
    const first = setTimeout(load, 0);
    const id = setInterval(load, 30000);
    return () => { clearTimeout(first); clearInterval(id); };
  }, [load]);
  return [state, load];
}

function CopyButton({ text, label = 'COPY' }) {
  const [done, setDone] = useState(false);
  return (
    <button className="btn sm cream" style={{ boxShadow: '3px 3px 0 var(--ink)', flex: 'none' }}
      onClick={() => { navigator.clipboard?.writeText(text).catch(() => {}); setDone(true); setTimeout(() => setDone(false), 1500); }}>
      {done ? 'COPIED!' : label}
    </button>
  );
}

function ServerCard({ s, i }) {
  const full = s.players >= s.max_players;
  const mode = s.mode || '';
  return (
    <article className="panel" style={{ padding: 0, display: 'flex', flexDirection: 'column', transform: `rotate(${[-.7, .5, -.4, .8][i % 4]}deg)` }}>
      <div className={`panel ${MODE_COLOR[mode] || ''}`} style={{ margin: -3, marginBottom: 0, boxShadow: 'none', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span className="pixel" style={{ fontSize: 11 }}>{(mode || 'minecraft').toUpperCase()}{s.version ? ` · ${s.version}` : ''}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {s.bedrock && <span className="sticker" style={{ background: 'var(--diamond)', fontSize: 10, padding: '3px 7px 2px', transform: 'rotate(3deg)' }}>+ BEDROCK</span>}
          <Pixels rows={SPRITES[SPRITE_FOR[mode] || 'grass']} size={2.4} />
        </span>
      </div>
      <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <h3 className="h-display" style={{ fontSize: 32, lineHeight: 1, overflowWrap: 'anywhere' }}>{s.title}</h3>
        {s.description && <p style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--ink-2)', overflowWrap: 'anywhere' }}>{s.description}</p>}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span className="pixel" style={{ fontSize: 11, color: 'var(--muted)' }}>PLAYERS</span>
            <span className="h-display" style={{ fontSize: 24, color: full ? 'var(--red)' : 'var(--ink)' }}>{s.players}/{s.max_players}</span>
          </div>
          <div style={{ height: 12, border: '2.5px solid var(--ink)', background: 'var(--paper-2)', marginTop: 4 }}>
            <div style={{ height: '100%', width: `${Math.min(100, (s.players / Math.max(1, s.max_players)) * 100)}%`, background: full ? 'var(--red)' : 'var(--grass)' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="addr" style={{ flex: 1, fontSize: 14, padding: '9px 10px', overflowX: 'auto', whiteSpace: 'nowrap' }}>{s.address}</div>
          <CopyButton text={s.address} />
        </div>
        {s.bedrock && (
          <div className="typewriter" style={{ fontSize: 13, color: 'var(--ink-2)' }}>
            Bedrock: <b>{s.bedrock_host}</b> · port <b>{s.bedrock_port}</b>
          </div>
        )}
      </div>
    </article>
  );
}

export default function ServersPage({ onBack }) {
  const [{ loading, error, servers, at }, reload] = useServers();
  const [mode, setMode] = useState('all');
  const [q, setQ] = useState('');
  const back = (e) => { e?.preventDefault(); onBack(e); };

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return servers.filter((s) => {
      if (mode === 'bedrock' ? !s.bedrock : mode !== 'all' && s.mode !== mode) return false;
      return !needle || `${s.title} ${s.description || ''} ${s.version || ''}`.toLowerCase().includes(needle);
    });
  }, [servers, mode, q]);
  const players = servers.reduce((n, s) => n + s.players, 0);

  return (
    <div className="zine">
      <Nav links={[['← Back to site', '#', back]]} relay={null} onLogo={back} />

      <main className="wrap" style={{ paddingTop: 60, paddingBottom: 100 }}>
        <span className="kicker">Powered by VoxelPort · live directory</span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', marginTop: 10 }}>
          <h1 style={{ fontSize: 'clamp(64px, 11vw, 132px)', fontWeight: 400, lineHeight: .95 }}>
            <span className="c-title" data-text="SERVER">SERVER</span><br />
            <span className="c-title green" data-text="LIST">LIST</span>
          </h1>
          <div className="bubble tail-b" style={{ maxWidth: 360 }}>
            <p className="h-display" style={{ fontSize: 30, lineHeight: 1 }}>
              {loading ? 'CHECKING…' : `${servers.length} ${servers.length === 1 ? 'SERVER' : 'SERVERS'} ONLINE`}
            </p>
            <p className="typewriter" style={{ fontSize: 13, marginTop: 6, color: 'var(--muted)' }}>
              {players} {players === 1 ? 'player' : 'players'} right now{at ? ` · updated ${at.toLocaleTimeString()}` : ''}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 34, alignItems: 'center' }}>
          {MODES.map(([id, label]) => (
            <button key={id} className={`btn sm ${mode === id ? '' : 'cream'}`} onClick={() => setMode(id)} aria-pressed={mode === id}>{label.toUpperCase()}</button>
          ))}
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search servers…" aria-label="Search servers"
            style={{ flex: '1 1 200px', minWidth: 0, border: '3px solid var(--ink)', padding: '10px 12px', font: 'inherit', background: 'var(--card)', boxShadow: '3px 3px 0 var(--ink)' }} />
          <button className="btn sm cream" onClick={reload}>↻</button>
        </div>

        {error && !servers.length ? (
          <div className="panel" style={{ marginTop: 34, padding: 24, background: 'var(--gold)' }}>
            <span className="h-display" style={{ fontSize: 30 }}>CAN’T REACH THE RELAY</span>
            <p style={{ marginTop: 6 }}>The list will come back on its own — check the <a href="#/status">relay status</a>.</p>
          </div>
        ) : !loading && !shown.length ? (
          <div className="panel" style={{ marginTop: 34, padding: '30px 26px', display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
            <Pixels rows={SPRITES.tower} size={5} />
            <div style={{ flex: '1 1 300px' }}>
              <span className="h-display" style={{ fontSize: 34 }}>{servers.length ? 'NOTHING MATCHES' : 'NO PUBLIC SERVERS RIGHT NOW'}</span>
              <p style={{ marginTop: 8, lineHeight: 1.6 }}>
                Host one and list it here: in the VoxelPort app open your server’s <b>Settings</b>, tick <b>Show on voxelport.in/servers</b>, then make it public.
              </p>
            </div>
            <a className="btn" href={DL_STORE} target="_blank" rel="noreferrer">GET THE APP</a>
          </div>
        ) : (
          <div className="grid-3" style={{ marginTop: 34 }}>
            {shown.map((s, i) => <ServerCard key={s.address} s={s} i={i} />)}
          </div>
        )}

        <div className="bubble tail-b" style={{ marginTop: 50, maxWidth: 760 }}>
          <span className="kicker">How this list works</span>
          <p style={{ marginTop: 8, lineHeight: 1.65 }}>
            Only servers whose owners switched on <b>Show on voxelport.in/servers</b> appear here, and only while they’re online — nothing is
            stored. Player counts come from the server itself. Something inappropriate? Email <span className="typewriter">garv@trazz.art</span> and we’ll take it down.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
