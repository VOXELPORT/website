import { useState, useEffect, useRef } from 'react';

// ─── Brand links ──────────────────────────────────────────────────────────────
const GITHUB = 'https://github.com/VOXELPORT/VoxelPort';
const CURSEFORGE_MOD = 'https://www.curseforge.com/minecraft/mc-mods/voxelport';

const DL_WIN   = 'https://github.com/VOXELPORT/VoxelPort-App/releases/latest/download/VoxelPort-Setup.exe';
const DL_LINUX = 'https://github.com/VOXELPORT/VoxelPort-App/releases/latest/download/VoxelPort-Linux.tar.gz';
const DL_MOD   = 'https://github.com/VOXELPORT/VoxelPort/releases/latest/download/VoxelPort-Fabric.jar';

const MONO = "'JetBrains Mono', ui-monospace, monospace";

// ─── Palette — used as subtle per-section accents, not loud blocks ───────────
const GREEN   = '#00FFB2';
const MAGENTA = '#FF4FA3';
const YELLOW  = '#FFD84A';
const VIOLET  = '#B084F5';
const ORANGE  = '#FF9159';
const CYAN    = '#4FD8FF';
const VOID    = '#0A0A0A';

const ADDR_FULL = 'play.voxelport.in:25312';

// ─── Content (unchanged) ───────────────────────────────────────────────────────
const TAGS = ['No Port Forwarding', 'Vanilla Clients', 'Desktop App', 'Fabric Mod', 'No Signup', 'Open Source'];

const FEATURES = [
  { num: '01', icon: '⟁', title: 'Instant Relay',   desc: 'Your server connects out to the VoxelPort relay in seconds. No DNS, no static IP, no setup wizard.', c: GREEN },
  { num: '02', icon: '◳', title: 'Vanilla Clients', desc: 'Friends join with unmodified Minecraft. No client mods, no launchers, no patches — ever.', c: MAGENTA },
  { num: '03', icon: '⊘', title: 'No Open Ports',   desc: 'Your router stays closed. Nothing exposed to the internet, nothing to configure.', c: YELLOW },
  { num: '04', icon: '◈', title: 'No Signup',       desc: 'No account, no Discord, no token to copy. A private device key is created automatically on first run.', c: VIOLET },
  { num: '05', icon: '⊟', title: 'Encrypted Relay', desc: 'All traffic is bridged through the relay over an encrypted channel. Your home IP is never shared.', c: CYAN },
  { num: '06', icon: '◴', title: 'Live Status',     desc: 'Real-time relay health, latency, and player count — in the app, in-game, and on the status page.', c: ORANGE },
];

const PATHS = [
  {
    tag: 'DESKTOP APP', title: 'Host with the app',
    desc: 'Tunnel any local Minecraft server — vanilla, Fabric, Paper, modpacks — without installing a mod. Pick a port, click Start, share the address.',
    points: ['No mod required', 'Works with any server jar', 'Windows · Linux · macOS soon'],
    cta: ['↓ Download for Windows', DL_WIN], c: GREEN, accent: true,
  },
  {
    tag: 'FABRIC MOD', title: 'Host from your game',
    desc: 'Prefer to host straight from Minecraft? Drop the Fabric mod in, open your world to LAN, and press Open to VoxelPort from the pause menu.',
    points: ['Singleplayer or dedicated', 'One-click from the pause menu', 'Fabric · MC 26.x'],
    cta: ['↓ Download the mod', DL_MOD], c: MAGENTA, accent: false,
  },
];

const STEPS = [
  { num: '1', title: 'Install',            desc: 'Download the desktop app, or drop the VoxelPort mod into your Fabric mods folder.', c: GREEN },
  { num: '2', title: 'Start Hosting',      desc: 'Open the app and hit Start — or press Open to VoxelPort from the in-game pause menu.', c: MAGENTA },
  { num: '3', title: 'Share Your Address', desc: 'VoxelPort hands you a public address like play.voxelport.in:25312 — copy it.', c: YELLOW },
  { num: '4', title: 'Friends Join',       desc: 'They paste it into vanilla Minecraft. No mod, no signup on their end. That\'s it.', c: VIOLET },
];

const STRENGTHS = [
  { primary: true, tag: 'The right tool', name: 'VoxelPort',       note: 'Built for Minecraft. Vanilla clients, no signup, an app or a mod, fully open source.', verdict: '✓ Made for MC' },
  {                tag: 'General tunnel', name: 'PlayIt.gg',       note: 'Works for many games, but it\'s a generic agent with freemium limits and no MC tuning.', verdict: '~ Freemium' },
  {                tag: 'Dev tunnel',     name: 'ngrok',           note: 'Excellent for HTTP and webhooks. Clunky for game servers and gated behind paid tiers.', verdict: '~ Not for games' },
  {                tag: 'The old way',    name: 'Port Forwarding', note: 'Exposes your real IP, needs router access, and opens you up to attacks and scans.', verdict: '✕ Risky' },
];

const COLS = ['VoxelPort', 'PlayIt.gg', 'ngrok', 'Port Fwd'];
const Y = { yes: true };
const N = { no: true };
const P = (t) => ({ partial: true, text: t });
const row = (feature, a, b, c, d) => ({ feature, cells: [a, b, c, d] });

const TABLE_BASE = [
  row('No port forwarding', Y, Y, Y, N),
  row('Vanilla clients',    Y, Y, P('TCP'), Y),
  row('No signup',          Y, P('Freemium'), P('Account'), Y),
];
const TABLE_EXTRA = [
  row('Open source',           Y, N, N, P('—')),
  row('Encrypted relay',       Y, Y, Y, N),
  row('App or mod',            Y, P('App'), P('CLI'), N),
  row('Minecraft-optimized',   Y, N, N, P('Manual')),
  row('Hides your home IP',    Y, Y, Y, N),
];

const FOOTER_COLS = [
  { title: 'Product', links: [['Features', '#features'], ['How It Works', '#how'], ['Compare', '#comparison'], ['Download', '#download']] },
  { title: 'Get It',  links: [['Windows App', DL_WIN], ['Linux App', DL_LINUX], ['Fabric Mod', DL_MOD], ['CurseForge', CURSEFORGE_MOD]] },
  { title: 'Links',   links: [['GitHub', GITHUB], ['System Status', '#/status'], ['Download', '#download']] },
  { title: 'Legal',   links: [['MIT License', '#/legal#mit-license'], ['Privacy', '#/legal#privacy-notice'], ['Terms', '#/legal#terms-of-use']] },
];

const FAKE_PLAYERS = ['xXCreeperSlayerXx', 'BuilderBob42', 'NightOwl_MC', 'SteveNotSteve', 'DiamondDigger', 'RedstoneWiz', 'CraftingTable99', 'EnderDragonKing'];

const TERM_LINES = [
  { color: '#6a6a6a', text: '$ voxelport start --port 25565' },
  { color: '#7a8f88', text: '  → connecting to relay...' },
  { color: GREEN,      text: `  ✓ tunnel ready · WSS · TLS 1.3` },
  { color: '#8a8a8a',  text: `  → address: ${ADDR_FULL}` },
];

// ─── Page-scoped CSS ────────────────────────────────────────────────────────
const KEYFRAMES = `
  .vp-cta-primary{transition:all .2s ease!important;}
  .vp-cta-primary:hover{box-shadow:0 0 32px rgba(0,255,178,.4)!important; transform:translateY(-2px);}
  .vp-cta-ghost:hover{border-color:${GREEN}!important; color:#fff!important;}
  .vp-feat:hover{border-color:var(--border-bright)!important; transform:translateY(-3px);}
  .vp-path:hover{transform:translateY(-3px);}
  .vp-foot-link:hover{color:${GREEN}!important;}
  @keyframes vp-dash{to{stroke-dashoffset:-40}}
  .vp-root .vp-flow{animation:vp-dash 1.4s linear infinite;}
`;

// ─── Particle canvas hook ─────────────────────────────────────────────────────
function useParticles(ref) {
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.resetTransform(); ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', resize);
    resize();

    const N = 70;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));

    const onMouse = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    window.addEventListener('mousemove', onMouse);
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener('mouseleave', onLeave);

    const draw = () => {
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < 180 && d > 0) { p.vx += (dx / d) * 0.08; p.vy += (dy / d) * 0.08; }
        p.vx *= 0.975; p.vy *= 0.975;
        p.x = (p.x + p.vx + W) % W; p.y = (p.y + p.vy + H) % H;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,255,178,0.5)';
        ctx.fill();
      }
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 115) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(0,255,178,${0.13 * (1 - d / 115)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);
}

// ─── Relay diagram ─────────────────────────────────────────────────────────────
const L_HOME = 'M180,76 L180,182';
const L_P1   = 'M180,240 L62,344';
const L_P2   = 'M180,240 L180,344';
const L_P3   = 'M180,240 L298,344';

function Node({ x, y, w, h, title, sub, color, accent }) {
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="11"
        fill={accent ? `${color}1a` : 'rgba(255,255,255,.03)'}
        stroke={accent ? color : 'rgba(255,255,255,.18)'}
        strokeWidth={accent ? 1.6 : 1.2} />
      <text x={cx} y={y + (sub ? h / 2 - 2 : h / 2 + 5)} textAnchor="middle"
        fontFamily={MONO} fontSize={accent ? 16 : 14} fontWeight="700"
        fill={accent ? color : '#e8e8e8'} letterSpacing=".5">{title}</text>
      {sub && (
        <text x={cx} y={y + h / 2 + 15} textAnchor="middle"
          fontFamily={MONO} fontSize="9.5" fill="#8a8a8a" letterSpacing=".3">{sub}</text>
      )}
    </g>
  );
}

function Packet({ path, dur, begin, color }) {
  return (
    <circle r="3.2" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
      <animateMotion path={path} dur={dur} begin={begin} repeatCount="indefinite" />
    </circle>
  );
}

function RelayDiagram() {
  return (
    <svg className="vp-diagram" viewBox="0 0 360 420" width="100%" height="420"
      style={{ position: 'relative', maxWidth: 430 }} fill="none">
      {[L_HOME, L_P1, L_P2, L_P3].map((d, i) => (
        <path key={i} className="vp-flow" d={d} stroke="rgba(255,255,255,.16)" strokeWidth="1.4" strokeDasharray="4 6" strokeLinecap="round" />
      ))}
      <Packet path={L_HOME} dur="1.6s" begin="0s" color={GREEN} />
      <Packet path={L_P1} dur="1.9s" begin="0.2s" color={MAGENTA} />
      <Packet path={L_P2} dur="1.9s" begin="0.75s" color={YELLOW} />
      <Packet path={L_P3} dur="1.9s" begin="1.3s" color={CYAN} />
      <Node x={118} y={28} w={124} h={48} title="HOST" sub="app · mod · server" color={VIOLET} />
      <Node x={120} y={182} w={120} h={58} title="RELAY" sub="play.voxelport.in" color={GREEN} accent />
      <Node x={29}  y={344} w={66} h={46} title="P1" color={MAGENTA} />
      <Node x={147} y={344} w={66} h={46} title="P2" color={YELLOW} />
      <Node x={265} y={344} w={66} h={46} title="P3" color={CYAN} />
      <text x={180} y={410} textAnchor="middle" fontFamily={MONO} fontSize="11" fill="#8a8a8a" letterSpacing=".4">
        vanilla minecraft · no mods
      </text>
    </svg>
  );
}

// ─── Cell / table row renderer ─────────────────────────────────────────────────
function Cell({ cell }) {
  return (
    <div style={{ padding: '15px 14px', textAlign: 'center', borderBottom: '1px solid var(--border)', fontFamily: MONO, fontSize: 13 }}>
      {cell.yes && <span style={{ color: GREEN }}>✓</span>}
      {cell.no && <span style={{ color: '#888' }}>✕</span>}
      {cell.partial && <span style={{ color: '#888' }}>{cell.text}</span>}
    </div>
  );
}
function TableRow({ r }) {
  return (
    <div style={{ display: 'contents' }}>
      <div style={{ padding: '15px 22px', fontSize: 14.5, color: '#cfcfcf', borderBottom: '1px solid var(--border)' }}>{r.feature}</div>
      {r.cells.map((c, i) => <Cell key={i} cell={c} />)}
    </div>
  );
}

// ─── Join notification ─────────────────────────────────────────────────────────
function JoinNotif({ player, leaving }) {
  return (
    <div className="vp-notif" style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: 'rgba(10,10,10,.92)', border: '1px solid rgba(0,255,178,.3)', borderRadius: 12,
      padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 0 30px rgba(0,255,178,.12), 0 8px 32px rgba(0,0,0,.5)',
      backdropFilter: 'blur(12px)',
      animation: `${leaving ? 'vp-notif-out' : 'vp-notif-in'} .38s ease forwards`,
      pointerEvents: 'none', minWidth: 260,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN, boxShadow: `0 0 8px ${GREEN}`, flexShrink: 0 }} />
      <div>
        <div style={{ fontFamily: MONO, fontSize: 11, color: GREEN, letterSpacing: '.06em' }}>PLAYER JOINED</div>
        <div style={{ fontSize: 13, color: '#cfcfcf', marginTop: 3 }}>
          <span style={{ color: '#fff', fontWeight: 600 }}>{player}</span>
          <span style={{ color: '#6a6a6a' }}> → {ADDR_FULL}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Landing ──────────────────────────────────────────────────────────────────
export default function Landing({ onNavigate }) {
  const [expanded, setExpanded] = useState(false);
  const canvasRef = useRef(null);
  useParticles(canvasRef);

  const [typedAddr, setTypedAddr] = useState('');
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTypedAddr(ADDR_FULL.slice(0, i));
      if (i >= ADDR_FULL.length) clearInterval(t);
    }, 55);
    return () => clearInterval(t);
  }, []);

  const [termCount, setTermCount] = useState(0);
  useEffect(() => {
    let count = 0;
    const t = setInterval(() => {
      count++;
      setTermCount(count);
      if (count >= TERM_LINES.length) clearInterval(t);
    }, 680);
    return () => clearInterval(t);
  }, []);

  const [livePing, setLivePing] = useState(24);
  useEffect(() => {
    const t = setInterval(() => {
      setLivePing(p => Math.max(18, Math.min(52, p + Math.round((Math.random() - 0.42) * 6))));
    }, 2200);
    return () => clearInterval(t);
  }, []);

  const [liveSessions, setLiveSessions] = useState(3);
  useEffect(() => {
    const t = setInterval(() => {
      setLiveSessions(s => Math.max(1, Math.min(8, s + (Math.random() > 0.65 ? 1 : Math.random() > 0.5 ? -1 : 0))));
    }, 3800);
    return () => clearInterval(t);
  }, []);

  const [copied, setCopied] = useState(false);
  const copyAddr = () => {
    navigator.clipboard.writeText(ADDR_FULL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [notif, setNotif] = useState(null);
  const [notifLeaving, setNotifLeaving] = useState(false);
  useEffect(() => {
    let idx = 0;
    const show = () => {
      const player = FAKE_PLAYERS[idx % FAKE_PLAYERS.length];
      idx++;
      setNotifLeaving(false);
      setNotif(player);
      setTimeout(() => setNotifLeaving(true), 3800);
      setTimeout(() => setNotif(null), 4400);
    };
    const first = setTimeout(show, 6000);
    const interval = setInterval(show, 14000);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, []);

  const goStatus = (e) => { e.preventDefault(); window.location.hash = '#/status'; onNavigate?.('status'); };
  const goLegal = (target) => (e) => { e.preventDefault(); window.location.hash = target; onNavigate?.('legal'); };

  return (
    <div className="vp-root" style={{ background: VOID, color: '#E8E8E8', fontFamily: "'Space Grotesk', system-ui, sans-serif", position: 'relative', overflow: 'hidden', minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>
      <style>{KEYFRAMES}</style>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)', backgroundSize: '52px 52px', maskImage: 'radial-gradient(ellipse 100% 70% at 50% 0%, #000 35%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 100% 70% at 50% 0%, #000 35%, transparent 100%)' }} />

      {notif && <JoinNotif player={notif} leaving={notifLeaving} />}

      {/* NAV */}
      <nav className="vp-nav" style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '1px solid var(--border)', background: 'rgba(10,10,10,.72)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
          <span style={{ display: 'inline-block', width: 22, height: 22, border: `1.5px solid ${GREEN}`, borderRadius: 5, boxShadow: '0 0 14px rgba(0,255,178,.4)' }} />
          <span style={{ fontWeight: 600, fontSize: 18, letterSpacing: '-.01em', color: '#fff' }}>Voxel<span style={{ color: GREEN }}>Port</span></span>
        </a>
        <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {[['Features', '#features'], ['How It Works', '#how'], ['Compare', '#comparison'], ['Status', '#/status']].map(([label, href]) => (
            <a key={label} className="vp-link" href={href} onClick={href === '#/status' ? goStatus : undefined} style={{ fontFamily: MONO, fontSize: 12.5, letterSpacing: '.04em', color: '#8a8a8a', textDecoration: 'none' }}>{label}</a>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: MONO, fontSize: 11, color: '#9a9a9a', border: '1px solid var(--border-bright)', borderRadius: 100, padding: '5px 12px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN, boxShadow: `0 0 6px ${GREEN}`, animation: 'vp-pulse 2s ease-in-out infinite', display: 'inline-block' }} />
            <span style={{ color: GREEN }}>{liveSessions}</span>&nbsp;online
          </div>
          <a className="vp-btn" href="#download" style={{ fontFamily: MONO, fontSize: 12.5, fontWeight: 500, letterSpacing: '.02em', color: VOID, background: GREEN, padding: '9px 16px', borderRadius: 8, textDecoration: 'none', boxShadow: '0 0 18px rgba(0,255,178,.25)' }}>Download</a>
        </div>
      </nav>

      {/* HERO */}
      <header id="top" className="vp-hero" style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: '90px 40px 70px', display: 'grid', gridTemplateColumns: '1.12fr .88fr', gap: 40, alignItems: 'center', zIndex: 1 }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.45 }} />

        <div style={{ position: 'absolute', left: -120, top: -80, width: 520, height: 520, borderRadius: '50%', background: `radial-gradient(circle, ${GREEN}22, transparent 65%)`, filter: 'blur(20px)', pointerEvents: 'none', animation: 'vp-glow 7s ease-in-out infinite' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: MONO, fontSize: 11.5, letterSpacing: '.14em', color: GREEN, border: '1px solid rgba(0,255,178,.28)', borderRadius: 100, padding: '7px 14px', background: 'rgba(0,255,178,.04)' }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: GREEN, boxShadow: `0 0 8px ${GREEN}` }} />
            NO PORT FORWARDING · NO SIGNUP
          </div>
          <h1 style={{ margin: '26px 0 0', fontSize: 'clamp(52px,8vw,108px)', lineHeight: .92, fontWeight: 700, letterSpacing: '-.04em', color: '#fff' }}>VOXEL<br /><span style={{ color: GREEN, textShadow: '0 0 44px rgba(0,255,178,.4)' }}>PORT</span></h1>
          <p style={{ margin: '28px 0 0', maxWidth: 480, fontSize: 17, lineHeight: 1.6, color: '#9a9a9a' }}>Host your Minecraft server over the internet without touching your router. Use the desktop app for any server, or the Fabric mod to host straight from your game. Players join with vanilla Minecraft.</p>
          <div style={{ display: 'flex', gap: 14, marginTop: 34, flexWrap: 'wrap' }}>
            <a className="vp-cta-primary" href="#download" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontWeight: 600, fontSize: 15, color: VOID, background: GREEN, padding: '14px 24px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 0 26px rgba(0,255,178,.3)' }}>↓ Download the app</a>
            <a className="vp-cta-ghost" href={DL_MOD} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontWeight: 500, fontSize: 15, color: '#E8E8E8', background: 'transparent', padding: '14px 24px', border: '1px solid var(--border-bright)', borderRadius: 10, textDecoration: 'none' }}>Get the Fabric mod</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 30, fontFamily: MONO, fontSize: 13, color: '#7a7a7a' }}>
            <span style={{ color: '#5a5a5a' }}>$</span>
            <span style={{ color: '#cfcfcf' }}>
              {typedAddr.includes(':') ? (
                <>{typedAddr.split(':')[0]}<span style={{ color: GREEN }}>:{typedAddr.split(':')[1]}</span></>
              ) : typedAddr}
              {typedAddr.length < ADDR_FULL.length && (
                <span style={{ display: 'inline-block', width: 7, height: 14, background: GREEN, marginLeft: 2, verticalAlign: -2, animation: 'vp-blink 0.8s step-end infinite' }} />
              )}
            </span>
          </div>
        </div>

        <div className="vp-hero-art" style={{ position: 'relative', height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', background: `radial-gradient(circle, ${VIOLET}1f, transparent 62%)`, filter: 'blur(16px)', animation: 'vp-glow 6s ease-in-out infinite' }} />
          <RelayDiagram />
        </div>
      </header>

      {/* MARQUEE */}
      <div style={{ position: 'relative', zIndex: 1, overflow: 'hidden', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '18px 0', background: 'rgba(255,255,255,.012)' }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'vp-marquee 26s linear infinite' }}>
          {[0, 1].map(dup => (
            <div key={dup} aria-hidden={dup === 1} style={{ display: 'flex', alignItems: 'center', gap: 34, paddingRight: 34 }}>
              {TAGS.map((tag, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 34 }}>
                  <span style={{ fontFamily: MONO, fontSize: 15, letterSpacing: '.06em', textTransform: 'uppercase', color: '#cdcdcd' }}>{tag}</span>
                  <span style={{ color: GREEN, fontSize: 13 }}>◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* TWO WAYS TO HOST */}
      <section id="paths" style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', padding: '100px 40px 20px' }}>
        <div className="section-label">// TWO WAYS TO HOST</div>
        <h2 style={{ margin: '14px 0 0', fontSize: 'clamp(32px,4.4vw,50px)', fontWeight: 700, letterSpacing: '-.03em', color: '#fff', maxWidth: 640, lineHeight: 1.04 }}>An app, a mod — same relay.</h2>
        <div className="vp-grid2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18, marginTop: 44 }}>
          {PATHS.map((p) => (
            <div key={p.title} className="vp-path" style={{ position: 'relative', border: `1px solid ${p.accent ? 'rgba(0,255,178,.35)' : 'var(--border)'}`, borderRadius: 18, padding: '30px 28px 32px', background: p.accent ? 'rgba(0,255,178,.03)' : 'rgba(255,255,255,.012)', transition: 'all .25s ease' }}>
              <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.1em', color: p.c, textTransform: 'uppercase' }}>{p.tag}</div>
              <h3 style={{ margin: '12px 0 0', fontSize: 24, fontWeight: 650, color: '#fff', letterSpacing: '-.02em' }}>{p.title}</h3>
              <p style={{ margin: '12px 0 0', fontSize: 15, lineHeight: 1.6, color: '#9a9a9a' }}>{p.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, margin: '20px 0 0' }}>
                {p.points.map((pt) => (
                  <div key={pt} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#cfcfcf' }}>
                    <span style={{ color: p.c }}>✓</span>{pt}
                  </div>
                ))}
              </div>
              <a className={p.accent ? 'vp-cta-primary' : 'vp-cta-ghost'} href={p.cta[1]} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, marginTop: 26, fontWeight: 600, fontSize: 14.5, textDecoration: 'none', padding: '12px 22px', borderRadius: 10, ...(p.accent ? { color: VOID, background: GREEN, boxShadow: '0 0 24px rgba(0,255,178,.28)' } : { color: '#E8E8E8', border: '1px solid var(--border-bright)' }) }}>{p.cta[0]}</a>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', padding: '90px 40px 90px' }}>
        <div className="section-label">// FEATURES</div>
        <h2 style={{ margin: '14px 0 0', fontSize: 'clamp(34px,4.4vw,52px)', fontWeight: 700, letterSpacing: '-.03em', color: '#fff', maxWidth: 640, lineHeight: 1.04 }}>Everything the host needs. Nothing the player has to install.</h2>
        <div className="vp-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginTop: 54 }}>
          {FEATURES.map((f) => (
            <div key={f.num} className="vp-feat" style={{ position: 'relative', border: '1px solid var(--border)', borderRadius: 16, padding: '30px 26px 32px', background: 'rgba(255,255,255,.012)' }}>
              <div style={{ position: 'absolute', top: 24, right: 26, fontFamily: MONO, fontSize: 13, color: '#3f3f3f' }}>{f.num}</div>
              <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${f.c}55`, borderRadius: 11, background: `${f.c}14`, color: f.c, fontSize: 20 }}>{f.icon}</div>
              <h3 style={{ margin: '22px 0 0', fontSize: 19, fontWeight: 600, color: '#fff', letterSpacing: '-.01em' }}>{f.title}</h3>
              <p style={{ margin: '11px 0 0', fontSize: 14.5, lineHeight: 1.55, color: '#8c8c8c' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="vp-how" style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', padding: '40px 40px 100px', display: 'grid', gridTemplateColumns: '.92fr 1.08fr', gap: 60, alignItems: 'start' }}>
        <div>
          <div className="section-label">// HOW IT WORKS</div>
          <h2 style={{ margin: '14px 0 44px', fontSize: 'clamp(32px,4vw,48px)', fontWeight: 700, letterSpacing: '-.03em', color: '#fff', lineHeight: 1.04 }}>From zero to online in four steps.</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {STEPS.map((s) => (
              <div key={s.num} style={{ display: 'flex', gap: 20, padding: '18px 0', borderTop: '1px solid var(--border)' }}>
                <div style={{ flex: 'none', width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 600, fontSize: 15, color: s.c, border: `1px solid ${s.c}55`, borderRadius: 10, background: `${s.c}14` }}>{s.num}</div>
                <div>
                  <h3 style={{ margin: '6px 0 0', fontSize: 18, fontWeight: 600, color: '#fff' }}>{s.title}</h3>
                  <p style={{ margin: '7px 0 0', fontSize: 14.5, lineHeight: 1.55, color: '#8c8c8c' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: -10, background: 'radial-gradient(ellipse at 50% 40%, rgba(0,255,178,.1), transparent 70%)', filter: 'blur(14px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', border: '1px solid var(--border-bright)', borderRadius: 14, overflow: 'hidden', background: '#0c0d0d', boxShadow: '0 24px 60px rgba(0,0,0,.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,.02)' }}>
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: MAGENTA }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: YELLOW }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: GREEN }} />
              <span style={{ marginLeft: 10, fontFamily: MONO, fontSize: 12, color: '#6a6a6a' }}>VoxelPort</span>
            </div>

            <div style={{ padding: '26px 24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: MONO, fontSize: 11, letterSpacing: '.06em', color: GREEN, textTransform: 'uppercase' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN, boxShadow: `0 0 8px ${GREEN}`, animation: 'vp-pulse 2s ease-in-out infinite', display: 'inline-block' }} /> Hosting
                </div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: '#4a4a4a', letterSpacing: '.04em' }}>UPTIME 99.97%</div>
              </div>

              <div style={{ fontFamily: MONO, fontSize: 11, color: '#6a6a6a', textTransform: 'uppercase', letterSpacing: '.06em' }}>Share this address</div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, fontFamily: MONO, fontSize: 15, color: GREEN, background: '#0a120f', border: '1px solid rgba(0,255,178,.25)', borderRadius: 9, padding: '12px 14px', letterSpacing: '.02em' }}>{ADDR_FULL}</div>
                <button className="vp-copy-btn" onClick={copyAddr} style={{ display: 'flex', alignItems: 'center', padding: '0 16px', border: '1px solid var(--border-bright)', borderRadius: 9, fontFamily: MONO, fontSize: 12, color: copied ? GREEN : '#cfcfcf', background: copied ? 'rgba(0,255,178,.08)' : 'transparent', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
                {[[liveSessions.toString(), 'players'], [`${livePing}ms`, 'relay ping']].map(([n, l]) => (
                  <div key={l} style={{ flex: 1, background: '#0a120f', border: '1px solid var(--border)', borderRadius: 9, padding: '10px 12px' }}>
                    <div style={{ fontSize: 20, fontWeight: 650, color: '#fff', fontFamily: MONO, animation: 'vp-pop .3s ease' }} key={n}>{n}</div>
                    <div style={{ fontFamily: MONO, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.06em', color: '#7a8f88', marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16, background: '#060708', borderRadius: 8, border: '1px solid var(--border)', padding: '12px 14px', minHeight: 96 }}>
                {TERM_LINES.slice(0, termCount).map((line, i) => (
                  <div key={i} style={{ fontFamily: MONO, fontSize: 11.5, color: line.color, lineHeight: 1.7, animation: 'vp-line-in .25s ease forwards' }}>{line.text}</div>
                ))}
                {termCount < TERM_LINES.length && (
                  <span style={{ display: 'inline-block', width: 7, height: 13, background: '#4a4a4a', verticalAlign: -2, animation: 'vp-blink 1s step-end infinite' }} />
                )}
                {termCount >= TERM_LINES.length && (
                  <div style={{ fontFamily: MONO, fontSize: 11.5, color: '#3a3a3a', lineHeight: 1.7 }}>
                    {'> '}<span style={{ display: 'inline-block', width: 7, height: 13, background: GREEN, verticalAlign: -2, animation: 'vp-blink 1.1s step-end infinite' }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section id="comparison" style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', padding: '40px 40px 100px' }}>
        <div className="section-label">// COMPARISON</div>
        <h2 style={{ margin: '14px 0 8px', fontSize: 'clamp(32px,4vw,48px)', fontWeight: 700, letterSpacing: '-.03em', color: '#fff', lineHeight: 1.04 }}>Why not the others?</h2>
        <p style={{ margin: '0 0 44px', fontSize: 16, color: '#8c8c8c', maxWidth: 520 }}>Generic tunnels work, until they don't. VoxelPort is built for one job: Minecraft servers.</p>

        <div className="vp-grid2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {STRENGTHS.map((c) => (
            <div key={c.name} style={{ position: 'relative', border: '1px solid var(--border)', borderRadius: 16, padding: '26px 22px 28px', minHeight: 200, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,.012)' }}>
              {c.primary && <div style={{ position: 'absolute', inset: -1, border: '1px solid rgba(0,255,178,.5)', borderRadius: 16, background: 'rgba(0,255,178,.03)', boxShadow: '0 0 40px rgba(0,255,178,.15)', pointerEvents: 'none' }} />}
              <div style={{ position: 'relative', fontFamily: MONO, fontSize: 11, letterSpacing: '.08em', color: '#7a7a7a', textTransform: 'uppercase' }}>{c.tag}</div>
              <h3 style={{ position: 'relative', margin: '10px 0 0', fontSize: 20, fontWeight: 600, color: '#fff' }}>{c.name}</h3>
              <p style={{ position: 'relative', margin: '12px 0 0', fontSize: 14, lineHeight: 1.55, color: '#9a9a9a', flex: 1 }}>{c.note}</p>
              <div style={{ position: 'relative', marginTop: 18, fontFamily: MONO, fontSize: 12, color: '#7a7a7a' }}>{c.verdict}</div>
            </div>
          ))}
        </div>

        <div className="vp-table-wrap" style={{ marginTop: 24, border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,.01)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px,1.5fr) repeat(4,1fr)', minWidth: 560 }}>
            <div style={{ padding: '16px 22px', fontFamily: MONO, fontSize: 11, letterSpacing: '.1em', color: '#6a6a6a', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>Feature</div>
            {COLS.map((col) => (
              <div key={col} style={{ padding: '16px 14px', textAlign: 'center', fontFamily: MONO, fontSize: 12, letterSpacing: '.04em', color: '#cfcfcf', borderBottom: '1px solid var(--border)' }}>{col}</div>
            ))}
            {TABLE_BASE.map((r) => <TableRow key={r.feature} r={r} />)}
            {expanded && TABLE_EXTRA.map((r) => <TableRow key={r.feature} r={r} />)}
          </div>
          <button className="vp-expand" onClick={() => setExpanded(v => !v)} style={{ width: '100%', padding: 16, background: 'rgba(255,255,255,.015)', border: 'none', borderTop: '1px solid var(--border)', color: GREEN, fontFamily: MONO, fontSize: 12.5, letterSpacing: '.04em', cursor: 'pointer' }}>
            {expanded ? '— Hide full comparison' : '+ Show full comparison'}
          </button>
        </div>
      </section>

      {/* DOWNLOAD */}
      <section id="download" style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '110px 40px 120px', borderTop: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,178,.12), transparent 65%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div className="section-label">// GET VOXELPORT</div>
          <h2 style={{ margin: '16px 0 0', fontSize: 'clamp(52px,9vw,128px)', fontWeight: 700, letterSpacing: '-.05em', color: '#fff', lineHeight: .9 }}>DOWN<span style={{ color: GREEN, textShadow: '0 0 50px rgba(0,255,178,.35)' }}>LOAD</span></h2>
          <p style={{ margin: '24px auto 0', maxWidth: 480, fontSize: 16, color: '#9a9a9a' }}>Grab the desktop app to host any server, or the Fabric mod to host from your game. Players always join with vanilla Minecraft.</p>

          <div className="vp-grid2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18, maxWidth: 820, margin: '48px auto 0', textAlign: 'left' }}>
            <div style={{ border: '1px solid rgba(0,255,178,.35)', borderRadius: 18, padding: '28px 26px', background: 'rgba(0,255,178,.03)' }}>
              <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.1em', color: GREEN, textTransform: 'uppercase' }}>Desktop App</div>
              <p style={{ margin: '12px 0 20px', fontSize: 14.5, lineHeight: 1.55, color: '#9a9a9a' }}>Host any local server — no mod required.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <a className="vp-cta-primary" href={DL_WIN} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14, color: VOID, background: GREEN, padding: '11px 18px', borderRadius: 9, textDecoration: 'none', boxShadow: '0 0 20px rgba(0,255,178,.28)' }}>↓ Windows</a>
                <a className="vp-cta-primary" href={DL_LINUX} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14, color: VOID, background: GREEN, padding: '11px 18px', borderRadius: 9, textDecoration: 'none', boxShadow: '0 0 20px rgba(0,255,178,.28)' }}>↓ Linux</a>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#6f8177', padding: '11px 18px', border: '1px dashed var(--border-bright)', borderRadius: 9 }}>macOS · soon</span>
              </div>
            </div>
            <div style={{ border: '1px solid var(--border)', borderRadius: 18, padding: '28px 26px', background: 'rgba(255,255,255,.012)' }}>
              <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.1em', color: '#8a8a8a', textTransform: 'uppercase' }}>Fabric Mod</div>
              <p style={{ margin: '12px 0 20px', fontSize: 14.5, lineHeight: 1.55, color: '#9a9a9a' }}>Host straight from Minecraft, singleplayer or dedicated.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <a className="vp-cta-primary" href={DL_MOD} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14, color: VOID, background: GREEN, padding: '11px 18px', borderRadius: 9, textDecoration: 'none', boxShadow: '0 0 20px rgba(0,255,178,.28)' }}>↓ Download .jar</a>
                {[['CurseForge', CURSEFORGE_MOD], ['Source', GITHUB]].map(([label, href]) => (
                  <a key={label} className="vp-cta-ghost" href={href} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 500, fontSize: 14, color: '#E8E8E8', padding: '11px 18px', border: '1px solid var(--border-bright)', borderRadius: 9, textDecoration: 'none' }}>{label}</a>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
            {['No signup', 'Open source · MIT', 'No mod needed to join'].map((b) => (
              <span key={b} style={{ fontFamily: MONO, fontSize: 11.5, color: '#8a8a8a', border: '1px solid var(--border-bright)', borderRadius: 100, padding: '7px 14px' }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid var(--border)', padding: '60px 40px 40px', background: 'rgba(255,255,255,.008)' }}>
        <div className="vp-foot-grid" style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.6fr repeat(4,1fr)', gap: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <span style={{ display: 'inline-block', width: 22, height: 22, border: `1.5px solid ${GREEN}`, borderRadius: 5, boxShadow: '0 0 14px rgba(0,255,178,.4)' }} />
              <span style={{ fontWeight: 600, fontSize: 18, color: '#fff' }}>Voxel<span style={{ color: GREEN }}>Port</span></span>
            </div>
            <p style={{ margin: '18px 0 0', maxWidth: 280, fontSize: 14, lineHeight: 1.6, color: '#7a7a7a' }}>Free, open-source relay for Minecraft servers. No port forwarding, no signup, ever.</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, marginTop: 22, fontFamily: MONO, fontSize: 11.5, letterSpacing: '.08em', color: GREEN, border: '1px solid rgba(0,255,178,.28)', borderRadius: 100, padding: '8px 14px', background: 'rgba(0,255,178,.04)' }}>
              RELAY <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: GREEN, animation: 'vp-pulse 2s ease-in-out infinite' }} /> ONLINE
            </div>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.1em', color: '#5a5a5a', textTransform: 'uppercase' }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 18 }}>
                {col.links.map(([label, href]) => {
                  const internal = href.startsWith('#/');
                  const anchor = href.startsWith('#') && !internal;
                  return (
                    <a
                      key={label}
                      className="vp-foot-link"
                      href={href}
                      {...(!internal && !anchor ? { target: '_blank', rel: 'noreferrer' } : {})}
                      {...(internal ? { onClick: href.startsWith('#/status') ? goStatus : goLegal(href) } : {})}
                      style={{ fontSize: 14, color: '#9a9a9a', textDecoration: 'none' }}
                    >{label}</a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1240, margin: '50px auto 0', paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: MONO, fontSize: 12, color: '#5a5a5a' }}>© 2026 VoxelPort</span>
          <span style={{ fontFamily: MONO, fontSize: 12, color: '#5a5a5a' }}>Open source under the MIT License</span>
        </div>
      </footer>
    </div>
  );
}
