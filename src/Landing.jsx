import { useState } from 'react';
import { Nav, Footer, Pixels } from './ui.jsx';
import {
  SPRITES, useRelayStatus, useLatestReleases,
  DL_WIN, DL_WIN_PORTABLE, DL_LINUX, GITHUB_APP, EXAMPLE_ADDR,
} from './data.js';

// ─── Content ──────────────────────────────────────────────────────────────────

const TICKER = ['No port forwarding', 'Vanilla clients', 'Desktop app', 'Java set up for you', 'No signup', 'Open source', 'Free forever'];

const PATHS = [
  {
    tag: 'New server', color: 'green', sprite: 'grass', title: 'START FROM SCRATCH',
    desc: 'Pick Vanilla, Paper or Fabric and a version. VoxelPort downloads the server, installs the right Java and starts it for you.',
    points: ['Right Java version installed automatically', 'Official, checksum-verified downloads', 'Live console, players & ping'],
    cta: ['DOWNLOAD FOR WINDOWS', DL_WIN],
  },
  {
    tag: 'Your server', color: 'gold', sprite: 'diamond', title: 'BRING YOUR OWN',
    desc: 'Already have a world, a modpack or a server running somewhere else? Import the folder or point VoxelPort at its port and go public.',
    points: ['Import any server folder', 'Tunnel a server that’s already running', 'Modpacks & any server jar'],
    cta: ['GET THE APP', '#download'],
  },
];

const FEATURES = [
  { sprite: 'bolt', title: 'INSTANT RELAY', desc: 'Your server dials out to the relay and gets a public address in seconds. No DNS, no static IP, no router.' },
  { sprite: 'grass', title: 'VANILLA CLIENTS', desc: 'Friends join with plain Minecraft. No client mods, no launchers, no patches — ever.' },
  { sprite: 'lock', title: 'ROUTER STAYS SHUT', desc: 'Nothing to open on your side. Players connect to the relay, never to your home IP.' },
  { sprite: 'card', title: 'NO SIGNUP', desc: 'No account, no Discord, no token to copy. A private device key is created on first run.' },
  { sprite: 'signal', title: 'DIRECT ROUTING', desc: 'Hosts connect straight to the relay for ~10–20 ms pings, and fall back to Cloudflare automatically if a network blocks it.' },
  { sprite: 'heart', title: 'FREE & OPEN', desc: 'MIT-licensed app and relay. Read the code, fork it, or run your own relay.' },
];

const STEPS = [
  { n: '1', title: 'INSTALL', desc: 'Grab the desktop app for Windows or Linux. No account needed.', sprite: 'grass' },
  { n: '2', title: 'HIT START', desc: 'Create or import a server and press Start. Java is handled for you.', sprite: 'bolt' },
  { n: '3', title: 'COPY ADDRESS', desc: `VoxelPort hands you an address like ${EXAMPLE_ADDR}.`, sprite: 'card' },
  { n: '4', title: 'FRIENDS JOIN', desc: 'They paste it into Multiplayer → Add Server. That’s it.', sprite: 'heart' },
];

const RIVALS = [
  { name: 'VoxelPort', tag: 'Made for MC', note: 'Built for Minecraft only. Vanilla clients, no signup, one simple app, fully open source.', verdict: '✓ The right tool', us: true },
  { name: 'playit.gg', tag: 'General tunnel', note: 'Works for lots of games, but it’s a generic agent with freemium limits and no Minecraft tuning.', verdict: '~ Freemium' },
  { name: 'ngrok', tag: 'Dev tunnel', note: 'Great for webhooks and HTTP. Clunky for game servers, and TCP sits behind paid tiers.', verdict: '~ Not for games' },
  { name: 'Port forwarding', tag: 'The old way', note: 'Needs router access, exposes your real IP and invites scans. Many ISPs block it anyway (CGNAT).', verdict: '✕ Risky' },
];

const Y = { k: 'yes', t: 'YES' };
const N = { k: 'no', t: 'NO' };
const P = (t) => ({ k: 'part', t });
const TABLE = [
  ['No port forwarding', Y, Y, Y, N],
  ['Vanilla clients', Y, Y, P('TCP only'), Y],
  ['No signup', Y, P('Freemium'), P('Account'), Y],
  ['Open source', Y, N, N, P('—')],
  ['Hides your home IP', Y, Y, Y, N],
  ['Sets up Java & server', Y, N, N, N],
  ['Minecraft-specific', Y, N, N, P('Manual')],
];

// ─── Pieces ───────────────────────────────────────────────────────────────────

function Title({ children, className = '', style }) {
  return <span className={`c-title ${className}`} data-text={children} style={style}>{children}</span>;
}

/** The comic panel in the hero: host → relay → players, with packets moving. */
function RelayPanel() {
  const lines = ['M 92 150 L 236 150', 'M 290 150 L 390 64', 'M 290 150 L 404 150', 'M 290 150 L 390 236'];
  const colors = ['#5FAE3B', '#C8262B', '#F6CB2F', '#43C8D8'];
  return (
    <svg viewBox="0 0 480 300" width="100%" style={{ display: 'block' }} aria-label="Your server connects out to the VoxelPort relay; players connect to the relay">
      <rect width="480" height="300" fill="#FFFBF2" />
      <g opacity=".5">{Array.from({ length: 16 }, (_, i) => <line key={i} x1={i * 32} y1="0" x2={i * 32} y2="300" stroke="#E8DCC5" strokeWidth="1" />)}</g>
      <rect x="0" y="246" width="480" height="54" fill="#E8DCC5" />
      {lines.map((d) => (
        <path key={d} d={d} stroke="#15120F" strokeWidth="3" strokeDasharray="8 7" fill="none">
          <animate attributeName="stroke-dashoffset" from="30" to="0" dur="1s" repeatCount="indefinite" />
        </path>
      ))}
      {lines.map((d, i) => (
        <rect key={`p${i}`} x="-7" y="-7" width="14" height="14" fill={colors[i]} stroke="#15120F" strokeWidth="3">
          <animateMotion path={d} dur={i === 0 ? '1.4s' : '1.8s'} begin={`${i * 0.35}s`} repeatCount="indefinite" />
        </rect>
      ))}
      <foreignObject x="18" y="96" width="80" height="120">
        <div style={{ textAlign: 'center' }}>
          <Pixels rows={SPRITES.house} size={5} />
          <div className="pixel" style={{ fontSize: 11, marginTop: 4 }}>YOUR PC</div>
        </div>
      </foreignObject>
      <foreignObject x="218" y="70" width="100" height="150">
        <div style={{ textAlign: 'center' }} className="bob">
          <Pixels rows={SPRITES.tower} size={7} />
          <div className="pixel" style={{ fontSize: 11, marginTop: 4 }}>RELAY</div>
        </div>
      </foreignObject>
      {[[SPRITES.head1, 42], [SPRITES.head2, 128], [SPRITES.head3, 214]].map(([rows, y], i) => (
        <foreignObject key={i} x="396" y={y - 24} width="70" height="60">
          <div style={{ textAlign: 'center' }}>
            <Pixels rows={rows} size={5} />
            <div className="pixel" style={{ fontSize: 10, marginTop: 1 }}>P{i + 1}</div>
          </div>
        </foreignObject>
      ))}
    </svg>
  );
}

/** App window mock, matching the real desktop app's look. */
function AppMock() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(EXAMPLE_ADDR).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="panel tilt-r1" style={{ background: 'var(--paper)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: '3px solid var(--ink)', background: 'var(--ink)', color: 'var(--paper)' }}>
        {['var(--red)', 'var(--gold)', 'var(--grass)'].map((c) => <span key={c} style={{ width: 12, height: 12, background: c, border: '2px solid var(--paper)' }} />)}
        <span className="pixel" style={{ marginLeft: 8, fontSize: 12 }}>VOXELPORT APP</span>
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="h-display" style={{ fontSize: 30 }}>SURVIVAL SMP</div>
          <span className="sticker green" style={{ transform: 'rotate(3deg)' }}>● PUBLIC</span>
        </div>
        <div className="kicker" style={{ color: 'var(--ink-2)' }}>Share this address</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="addr" style={{ flex: 1 }}>{EXAMPLE_ADDR}</div>
          <button className="btn sm cream" onClick={copy} style={{ boxShadow: '3px 3px 0 var(--ink)' }}>{copied ? 'COPIED!' : 'COPY'}</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[['3', 'PLAYERS'], ['13 ms', 'RELAY PING']].map(([n, l]) => (
            <div key={l} className="panel" style={{ padding: '10px 14px', boxShadow: '3px 3px 0 var(--ink)' }}>
              <div className="h-display" style={{ fontSize: 34 }}>{n}</div>
              <div className="pixel" style={{ fontSize: 11, color: 'var(--muted)' }}>{l}</div>
            </div>
          ))}
        </div>
        <div className="typewriter" style={{ background: 'var(--ink)', color: '#B9F18B', fontSize: 13, padding: '10px 12px', lineHeight: 1.7 }}>
          <div>&gt; Connecting to wss://direct.voxelport.in…</div>
          <div>&gt; Tunnel is live on public port 26137.</div>
          <div style={{ color: 'var(--gold)' }}>&gt; Player connected → 127.0.0.1:25565</div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Landing() {
  const relay = useRelayStatus();
  const rel = useLatestReleases();
  const scrollTo = (hash) => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });

  const navLinks = [
    ['Features', '#features'], ['How it works', '#how'], ['Direct routing', '#direct'],
    ['Compare', '#compare'], ['Download', '#download'],
  ];

  return (
    <div className="zine" id="top">
      <Nav links={navLinks} relay={relay} onLogo={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

      {/* ═══ HERO — comic cover ═══ */}
      <header className="hero wrap">
        <div className="hero-top">
          <span className="sticker tilt-l" style={{ lineHeight: 1.5 }}>
            Issue #{rel.app ? rel.app.replace(/^v/, '') : '1.3'}<br />Oct 2026<br /><span style={{ color: 'var(--red)' }}>Free · No signup</span>
          </span>
          <span className="sticker gold tilt-r hero-flag" style={{ fontFamily: 'var(--display)', fontSize: 22, letterSpacing: '.04em', padding: '10px 16px 8px' }}>
            NO PORT FORWARDING!
          </span>
        </div>

        <h1 className="hero-title" aria-label="VoxelPort">
          <Title>VOXEL</Title><Title className="green">PORT</Title>
        </h1>

        <div className="hero-grid">
          <div className="hero-left">
            <div className="bubble tail-r">
              <div className="kicker" style={{ textAlign: 'right' }}>Hey, host!</div>
              <p className="h-display" style={{ fontSize: 'clamp(30px, 3.6vw, 44px)', textAlign: 'right', marginTop: 8 }}>
                HOST ANY SERVER.<br /><span style={{ color: 'var(--red)' }}>ROUTER STAYS SHUT.</span>
              </p>
            </div>
            <div className="hero-ctas">
              <a className="btn tilt-l1" href="#download" onClick={(e) => { e.preventDefault(); scrollTo('#download'); }}>DOWNLOAD THE APP</a>
              <a className="btn cream tilt-r1" href="#how" onClick={(e) => { e.preventDefault(); scrollTo('#how'); }}>HOW IT WORKS</a>
            </div>
          </div>

          <div className="hero-panel-wrap">
            <div className="burst" style={{ inset: '-14% -10%', zIndex: 0 }} />
            <figure className="panel hero-panel">
              <RelayPanel />
              <figcaption className="pixel" style={{ position: 'absolute', left: 14, bottom: 14, background: 'var(--ink)', color: 'var(--paper)', fontSize: 12, padding: '6px 10px' }}>
                THE RELAY — PLAY.VOXELPORT.IN
              </figcaption>
            </figure>
          </div>

          <div className="hero-right">
            <div className="panel gold" style={{ padding: '18px 20px' }}>
              <div className="kicker" style={{ color: 'var(--ink-2)' }}>Meanwhile, in your world…</div>
              <p style={{ marginTop: 8, fontWeight: 600, fontSize: 16.5, lineHeight: 1.5 }}>
                Your friends paste one address into vanilla Minecraft and they’re in. No mods on their side, no account, no router settings.
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 22 }}>
              <span className="chip tilt-l1">DESKTOP APP</span>
              <span className="chip tilt-r1">AUTO JAVA</span>
              <span className="chip tilt-r1">OPEN SOURCE</span>
              <span className="chip tilt-l1">FREE</span>
            </div>
            <a href="#/status" className="panel" style={{ display: 'block', marginTop: 22, padding: '12px 16px', textDecoration: 'none', boxShadow: 'var(--shadow-sm)' }}>
              <div className="typewriter" style={{ fontSize: 14, lineHeight: 1.6 }}>
                <span style={{ color: 'var(--red)', fontWeight: 700 }}>RELAY LOG: </span>
                {relay.state === 'loading' && 'checking the relay…'}
                {relay.state === 'offline' && 'relay unreachable right now.'}
                {relay.state === 'online' && <>online · {relay.tunnels} {relay.tunnels === 1 ? 'server' : 'servers'} hosting · {relay.players} {relay.players === 1 ? 'player' : 'players'} connected.</>}
              </div>
            </a>
          </div>
        </div>

        <div className="hero-turn typewriter">TURN THE PAGE ↓</div>
      </header>

      {/* ═══ TICKER ═══ */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map((k) => (
            <div key={k} className="ticker-item">
              {TICKER.map((t) => <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 28 }}>{t.toUpperCase()} <i>■</i></span>)}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ TWO WAYS ═══ */}
      <section className="section" id="paths">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">Chapter 1 · One app, any server</span>
            <h2 className="h-display h-section">NEW SERVER OR YOUR OWN.</h2>
          </div>
          <div className="grid-2">
            {PATHS.map((p, i) => (
              <article key={p.title} className={`panel ${i ? 'tilt-r1' : 'tilt-l1'}`} style={{ padding: 0, position: 'relative' }}>
                <div className={`panel ${p.color}`} style={{ margin: -3, marginBottom: 0, boxShadow: 'none', padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="kicker" style={{ color: 'var(--ink)' }}>{p.tag}</span>
                  <Pixels rows={SPRITES[p.sprite]} size={3} />
                </div>
                <div style={{ padding: '22px 24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 className="h-display" style={{ fontSize: 44 }}>{p.title}</h3>
                  <p style={{ fontSize: 16.5, lineHeight: 1.6, color: 'var(--ink-2)' }}>{p.desc}</p>
                  <ul className="ticks">{p.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
                  <div><a className={`btn ${i ? 'gold' : ''}`} href={p.cta[1]} onClick={p.cta[1].startsWith('#') ? (e) => { e.preventDefault(); scrollTo(p.cta[1]); } : undefined}>{p.cta[0]}</a></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="section band" id="features">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">Chapter 2 · The powers</span>
            <h2 className="h-display h-section">EVERYTHING THE HOST NEEDS.<br /><span style={{ color: 'var(--red)' }}>NOTHING THE PLAYER INSTALLS.</span></h2>
          </div>
          <div className="grid-3">
            {FEATURES.map((f, i) => (
              <article key={f.title} className="panel feat" style={{ position: 'relative', transform: `rotate(${[-1.2, .8, -.6, 1, -.9, .7][i]}deg)` }}>
                <span className="sticker red feat-num" style={{ transform: 'rotate(4deg)' }}>#{String(i + 1).padStart(2, '0')}</span>
                <div style={{ height: 56, display: 'flex', alignItems: 'center' }}><Pixels rows={SPRITES[f.sprite]} size={4.4} /></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="section" id="how">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">Chapter 3 · The plan</span>
            <h2 className="h-display h-section">ZERO TO ONLINE IN FOUR PANELS.</h2>
          </div>
          <div className="grid-4">
            {STEPS.map((s, i) => (
              <div key={s.n} className="panel" style={{ padding: '20px 18px 22px', position: 'relative', transform: `rotate(${i % 2 ? .8 : -.8}deg)` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="c-title" data-text={s.n} style={{ fontSize: 64, '--title-off': '5px', '--title-stroke': '3px' }}>{s.n}</span>
                  <Pixels rows={SPRITES[s.sprite]} size={3.4} />
                </div>
                <h3 className="h-display" style={{ fontSize: 30, marginTop: 10 }}>{s.title}</h3>
                <p style={{ marginTop: 8, fontSize: 15, lineHeight: 1.55, color: 'var(--ink-2)', overflowWrap: 'anywhere' }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="how-demo">
            <div>
              <div className="bubble tail-b" style={{ maxWidth: 440 }}>
                <span className="kicker">What hosting looks like</span>
                <p style={{ marginTop: 8, fontSize: 17, lineHeight: 1.6 }}>
                  One address to share, a live player count, and the relay ping — right in the app.
                </p>
              </div>
              <div style={{ marginTop: 50, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <a className="btn green" href={DL_WIN}>GET THE APP</a>
                <a className="btn cream" href={GITHUB_APP} target="_blank" rel="noreferrer">READ THE CODE</a>
              </div>
            </div>
            <AppMock />
          </div>
        </div>
      </section>

      {/* ═══ DIRECT ROUTING ═══ */}
      <section className="section band" id="direct">
        <div className="wrap direct-grid">
          <div>
            <span className="kicker">Chapter 4 · New in app 1.3.1</span>
            <h2 className="h-display h-section">DIRECT ROUTING.<br /><span style={{ color: 'var(--grass-dk)' }}>WAY LESS LAG.</span></h2>
            <p className="lede" style={{ marginTop: 18 }}>
              Some ISPs send traffic for big CDNs on a detour through another country. Now hosts connect straight to the relay
              at <span className="typewriter" style={{ fontWeight: 700 }}>direct.voxelport.in</span> — and if your network blocks that, VoxelPort quietly falls back to the
              Cloudflare route within a few seconds. Nothing to configure.
            </p>
          </div>
          <div className="panel" style={{ padding: '24px 24px 26px', transform: 'rotate(1deg)' }}>
            <div className="kicker" style={{ color: 'var(--ink-2)' }}>Relay ping, measured from Delhi</div>
            {[['VIA CDN DETOUR', 151, 'var(--red)'], ['DIRECT', 13, 'var(--grass)']].map(([label, ms, color]) => (
              <div key={label} style={{ marginTop: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="pixel" style={{ fontSize: 13 }}>{label}</span>
                  <span className="h-display" style={{ fontSize: 38 }}>{ms} MS</span>
                </div>
                <div style={{ height: 22, border: '3px solid var(--ink)', background: 'var(--paper-2)', marginTop: 6 }}>
                  <div style={{ width: `${Math.max(6, (ms / 160) * 100)}%`, height: '100%', background: color, borderRight: '3px solid var(--ink)' }} />
                </div>
              </div>
            ))}
            <p className="typewriter" style={{ marginTop: 16, fontSize: 13, color: 'var(--muted)' }}>
              One host on one ISP — your numbers depend on where you are.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ COMPARE ═══ */}
      <section className="section" id="compare">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">Chapter 5 · Rivals</span>
            <h2 className="h-display h-section">WHY NOT THE OTHERS?</h2>
            <p className="lede" style={{ marginTop: 10 }}>Generic tunnels work — until they don’t. VoxelPort does one job: Minecraft servers.</p>
          </div>
          <div className="grid-4">
            {RIVALS.map((r, i) => (
              <div key={r.name} className={`panel ${r.us ? 'green' : ''}`} style={{ padding: '20px 18px 22px', display: 'flex', flexDirection: 'column', gap: 10, transform: `rotate(${[-1, .7, -.5, .9][i]}deg)` }}>
                <span className="kicker" style={{ color: r.us ? 'var(--ink)' : 'var(--muted)' }}>{r.tag}</span>
                <h3 className="h-display" style={{ fontSize: 34 }}>{r.name.toUpperCase()}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.55, flex: 1 }}>{r.note}</p>
                <span className="pixel" style={{ fontSize: 13 }}>{r.verdict}</span>
              </div>
            ))}
          </div>
          <div className="table-scroll panel" style={{ marginTop: 40, padding: 0 }}>
            <table className="table">
              <thead>
                <tr><th>FEATURE</th><th className="us">VOXELPORT</th><th>PLAYIT.GG</th><th>NGROK</th><th>PORT FWD</th></tr>
              </thead>
              <tbody>
                {TABLE.map(([feat, ...cells]) => (
                  <tr key={feat}>
                    <td>{feat}</td>
                    {cells.map((c, i) => <td key={i} className={i === 0 ? 'us' : undefined}><span className={c.k}>{c.t}</span></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══ DOWNLOAD ═══ */}
      <section className="section band" id="download" style={{ textAlign: 'center' }}>
        <div className="wrap">
          <span className="kicker">Final chapter · Get it</span>
          <h2 style={{ marginTop: 12, fontSize: 'clamp(70px, 13vw, 170px)' }}>
            <Title>GET IT!</Title>
          </h2>
          <p className="lede" style={{ margin: '22px auto 0' }}>
            One desktop app hosts any Minecraft Java server. Players always join with vanilla Minecraft.
          </p>
          <div className="panel tilt-l1" style={{ padding: '24px 24px 26px', marginTop: 50, textAlign: 'left', maxWidth: 640, marginInline: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="kicker" style={{ color: 'var(--grass-dk)' }}>Desktop app</span>
              <span className="sticker" style={{ transform: 'rotate(3deg)' }}>{rel.app ? `Latest ${rel.app}` : 'Latest release'}</span>
            </div>
            <h3 className="h-display" style={{ fontSize: 42, marginTop: 10 }}>HOST ANY SERVER</h3>
            <p style={{ marginTop: 6, color: 'var(--ink-2)' }}>Creates, imports or tunnels your server — and installs the Java it needs.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 20 }}>
              <a className="btn green sm" href={DL_WIN}>WINDOWS</a>
              <a className="btn cream sm" href={DL_WIN_PORTABLE}>PORTABLE .EXE</a>
              <a className="btn cream sm" href={DL_LINUX}>LINUX</a>
              <a className="btn cream sm" href={GITHUB_APP} target="_blank" rel="noreferrer">SOURCE</a>
              <span className="btn sm" aria-disabled="true">MACOS · SOON</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 44 }}>
            {['No signup', 'Open source · MIT', 'Vanilla clients join'].map((b, i) => (
              <span key={b} className="sticker" style={{ transform: `rotate(${[-2, 1.5, -1][i]}deg)` }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      <Footer onHome={(hash) => scrollTo(hash)} />
    </div>
  );
}
