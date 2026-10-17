import { Nav, Footer, Pixels, DiscordButton } from './ui.jsx';
import {
  SPRITES, useRelayStatus, useLatestReleases,
  DL_STORE, DL_WIN, DL_LINUX, DL_ANDROID, GITHUB_APP,
} from './data.js';
import { navigate } from './seo.js';
import { SITE_NAV, TICKER, FEATURES, STEPS, EXPLORE } from './content.js';

// The home page is the short version: what it is, how it works, the six things that matter, where to
// get it, and the Discord. Everything else lives on its own page (see EXPLORE) so nobody has to scroll
// through it all to find the download button.

const HOME_FEATURES = FEATURES.filter((f) => f.home);

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

/** A link tile to another page of the site. */
function ExploreCard({ e, i }) {
  return (
    <a className="panel guide-card explore-card" href={e.href} onClick={(ev) => { ev.preventDefault(); navigate(e.href); window.scrollTo(0, 0); }}
      style={{ transform: `rotate(${[-.6, .5, -.3, .6][i % 4]}deg)` }}>
      <div className="guide-card-top">
        <span className="pixel" style={{ fontSize: 11 }}>{e.tag.toUpperCase()}</span>
        <Pixels rows={SPRITES[e.sprite]} size={2.4} />
      </div>
      <h3 className="h-display">{e.title}</h3>
      <p>{e.blurb}</p>
      <span className="guide-card-more">OPEN →</span>
    </a>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Landing() {
  const relay = useRelayStatus();
  const rel = useLatestReleases();
  const scrollTo = (hash) => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="zine" id="top">
      <Nav links={SITE_NAV} relay={relay} onLogo={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

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

        <h1 className="hero-title">
          <span className="sr-only">VoxelPort — free Minecraft server hosting from your PC or Android phone, no port forwarding</span>
          <span aria-hidden="true"><Title>VOXEL</Title><Title className="green">PORT</Title></span>
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
              <DiscordButton className="tilt-r1">JOIN THE DISCORD</DiscordButton>
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
              <span className="chip tilt-l1">PC + ANDROID</span>
              <span className="chip tilt-r1">AUTO JAVA</span>
              <span className="chip tilt-r1">OPEN SOURCE</span>
              <span className="chip tilt-l1">FREE</span>
            </div>
            <a href="/status" onClick={(e) => { e.preventDefault(); navigate('/status'); }} className="panel" style={{ display: 'block', marginTop: 22, padding: '12px 16px', textDecoration: 'none', boxShadow: 'var(--shadow-sm)' }}>
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

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="section" id="how">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">The plan</span>
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
        </div>
      </section>

      {/* ═══ THE SIX THAT MATTER ═══ */}
      <section className="section band" id="why">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">The powers</span>
            <h2 className="h-display h-section">EVERYTHING THE HOST NEEDS.<br /><span style={{ color: 'var(--red)' }}>NOTHING THE PLAYER INSTALLS.</span></h2>
          </div>
          <div className="grid-3">
            {HOME_FEATURES.map((f, i) => (
              <article key={f.title} className="panel feat" style={{ position: 'relative', transform: `rotate(${[-1.2, .8, -.6, 1, -.9, .7][i % 6]}deg)` }}>
                <span className="sticker red feat-num" style={{ transform: 'rotate(4deg)' }}>#{String(i + 1).padStart(2, '0')}</span>
                <div style={{ height: 56, display: 'flex', alignItems: 'center' }}><Pixels rows={SPRITES[f.sprite]} size={4.4} /></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>
          <div className="page-cta" style={{ justifyContent: 'center', marginTop: 44 }}>
            <a className="btn cream" href="/features" onClick={(e) => { e.preventDefault(); navigate('/features'); window.scrollTo(0, 0); }}>SEE ALL {FEATURES.length} FEATURES →</a>
          </div>
        </div>
      </section>

      {/* ═══ DOWNLOAD ═══ */}
      <section className="section" id="download" style={{ textAlign: 'center' }}>
        <div className="wrap">
          <span className="kicker">Get it</span>
          <h2 style={{ marginTop: 12, fontSize: 'clamp(70px, 13vw, 170px)' }}>
            <Title>GET IT!</Title>
          </h2>
          <p className="lede" style={{ margin: '22px auto 0' }}>
            One app — on your PC or your Android phone — hosts any Minecraft Java server. Players always join with vanilla Minecraft.
          </p>
          <div className="panel tilt-l1" style={{ padding: '24px 24px 26px', marginTop: 50, textAlign: 'left', maxWidth: 640, marginInline: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <span className="kicker" style={{ color: 'var(--grass-dk)' }}>PC &amp; Android app</span>
              <span className="sticker gold" style={{ transform: 'rotate(-2deg)' }}>NOW ON MICROSOFT STORE</span>
              <span className="sticker" style={{ transform: 'rotate(3deg)' }}>{rel.app ? `Latest ${rel.app}` : 'Latest release'}</span>
            </div>
            <h3 className="h-display" style={{ fontSize: 42, marginTop: 10 }}>HOST ANY SERVER</h3>
            <p style={{ marginTop: 6, color: 'var(--ink-2)' }}>Creates, imports or tunnels your server — and installs the Java it needs.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 20 }}>
              <a className="btn green sm" href={DL_STORE} target="_blank" rel="noreferrer">MICROSOFT STORE</a>
              <a className="btn cream sm" href={DL_WIN}>WINDOWS · DIRECT .EXE</a>
              <a className="btn cream sm" href={DL_LINUX}>LINUX</a>
              <a className="btn gold sm" href={DL_ANDROID}>ANDROID · BETA APK</a>
              <a className="btn cream sm" href={GITHUB_APP} target="_blank" rel="noreferrer">SOURCE</a>
              <span className="btn sm" aria-disabled="true">MACOS · SOON</span>
            </div>
            <p style={{ marginTop: 14, fontSize: 13, lineHeight: 1.5, color: 'var(--muted)' }}>
              Windows may say “Windows protected your PC” on the direct .exe — click <b>More info → Run anyway</b>.
              <br /><b>Store updates take about a day:</b> Microsoft reviews each one first. The direct .exe is always the newest.
              <br /><b>The Android app is a beta:</b> it still has bugs. For a server that stays up, use the PC app.
              {' '}<a href="/download" onClick={(e) => { e.preventDefault(); navigate('/download'); window.scrollTo(0, 0); }} style={{ color: 'inherit' }}>All install notes →</a>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 44 }}>
            {['No signup', 'Open source · MIT', 'Vanilla clients join'].map((b, i) => (
              <span key={b} className="sticker" style={{ transform: `rotate(${[-2, 1.5, -1][i]}deg)` }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EXPLORE — one tile per page ═══ */}
      <section className="section band" id="explore">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">More to read</span>
            <h2 className="h-display h-section">THE REST OF THE ZINE.</h2>
            <p className="lede" style={{ marginTop: 10 }}>Pick what you came for. Each one is its own short page.</p>
          </div>
          <div className="grid-4">
            {EXPLORE.map((e, i) => <ExploreCard key={e.href} e={e} i={i} />)}
          </div>
        </div>
      </section>

      <Footer onHome={(hash) => scrollTo(hash)} />
    </div>
  );
}
