import { useEffect, useState } from 'react';
import { Nav, Footer, Pixels, DiscordButton } from './ui.jsx';
import {
  SPRITES, useLatestReleases,
  DL_STORE, DL_WIN, DL_LINUX, DL_ANDROID, GITHUB_APP, EXAMPLE_ADDR, UPI_ID, UPI_LINK,
} from './data.js';
import { navigate, FAQ } from './seo.js';
import { SITE_NAV, PATHS, FEATURES, RIVALS, TABLE } from './content.js';
import { DISCORD_PERKS } from './community.js';
import { SUPPORTER } from './support.js';

// The pages that used to be sections of one very long home page. Each is short and has its own address
// (/features, /compare, /faq, /download, /support, /community), so people can link straight to it.

/** Same-site link that navigates without a page load. */
const go = (href) => (e) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  navigate(href);
};

/** The frame every page here shares: nav (with the Discord button), content, footer (with the Discord banner). */
function SubPage({ onBack, children, band = true }) {
  const back = (e) => { e?.preventDefault(); onBack(e); };
  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (h && /^[\w-]+$/.test(h)) setTimeout(() => document.getElementById(h)?.scrollIntoView(), 50);
    else window.scrollTo(0, 0);
  }, []);
  return (
    <div className="zine">
      <Nav links={SITE_NAV} relay={null} onLogo={back} />
      <main className="wrap" style={{ paddingTop: 50, paddingBottom: 100 }}>{children}</main>
      <Footer band={band} />
    </div>
  );
}

function PageHero({ kicker, a, b, lede, children }) {
  return (
    <header className="page-hero">
      <span className="kicker">{kicker}</span>
      <h1>
        <span className="c-title" data-text={a}>{a}</span><br />
        <span className="c-title green" data-text={b}>{b}</span>
      </h1>
      {lede && <p className="lede">{lede}</p>}
      {children}
    </header>
  );
}

function SectionHead({ kicker, children }) {
  return (
    <div className="section-head" style={{ marginBottom: 36 }}>
      <span className="kicker">{kicker}</span>
      <h2 className="h-display h-section">{children}</h2>
    </div>
  );
}

// ─── /features ────────────────────────────────────────────────────────────────

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

export function FeaturesPage({ onBack }) {
  return (
    <SubPage onBack={onBack}>
      <PageHero kicker="The powers" a="ALL THE" b="FEATURES"
        lede="Everything the host needs, and nothing the player has to install. One app, any Minecraft Java server, on your PC or your Android phone." />

      <section className="page-section" id="paths">
        <SectionHead kicker="One app, any server">NEW SERVER OR YOUR OWN.</SectionHead>
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
                <div>
                  {i === 0
                    ? <a className="btn" href={DL_STORE} target="_blank" rel="noreferrer">GET IT ON MICROSOFT STORE</a>
                    : <a className="btn gold" href="/download" onClick={go('/download')}>GET THE APP</a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section" id="all">
        <SectionHead kicker="The powers">EVERYTHING THE HOST NEEDS.</SectionHead>
        <div className="grid-3">
          {FEATURES.map((f, i) => (
            <article key={f.title} className="panel feat" style={{ position: 'relative', transform: `rotate(${[-1.2, .8, -.6, 1, -.9, .7, -.5, .9, -.8][i]}deg)` }}>
              <span className="sticker red feat-num" style={{ transform: 'rotate(4deg)' }}>#{String(i + 1).padStart(2, '0')}</span>
              <div style={{ height: 56, display: 'flex', alignItems: 'center' }}><Pixels rows={SPRITES[f.sprite]} size={4.4} /></div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section" id="direct">
        <div className="direct-grid">
          <div>
            <span className="kicker">New in app 1.3.1</span>
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

      <section className="page-section">
        <div className="how-demo" style={{ marginTop: 0 }}>
          <div>
            <div className="bubble tail-b" style={{ maxWidth: 440 }}>
              <span className="kicker">What hosting looks like</span>
              <p style={{ marginTop: 8, fontSize: 17, lineHeight: 1.6 }}>
                One address to share, a live player count, and the relay ping — right in the app.
              </p>
            </div>
            <div style={{ marginTop: 50, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a className="btn green" href="/download" onClick={go('/download')}>GET THE APP</a>
              <a className="btn cream" href={GITHUB_APP} target="_blank" rel="noreferrer">READ THE CODE</a>
            </div>
          </div>
          <AppMock />
        </div>
      </section>
    </SubPage>
  );
}

// ─── /compare ─────────────────────────────────────────────────────────────────

export function ComparePage({ onBack }) {
  return (
    <SubPage onBack={onBack}>
      <PageHero kicker="Rivals" a="THE" b="RIVALS"
        lede="Generic tunnels work — until they don’t. VoxelPort does one job: Minecraft servers." />

      <div className="grid-4" style={{ marginTop: 56 }}>
        {RIVALS.map((r, i) => (
          <div key={r.name} className={`panel ${r.us ? 'green' : ''}`} style={{ padding: '20px 18px 22px', display: 'flex', flexDirection: 'column', gap: 10, transform: `rotate(${[-1, .7, -.5, .9][i]}deg)` }}>
            <span className="kicker" style={{ color: r.us ? 'var(--ink)' : 'var(--muted)' }}>{r.tag}</span>
            <h2 className="h-display" style={{ fontSize: 34 }}>{r.name.toUpperCase()}</h2>
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

      <div className="bubble tail-b" style={{ marginTop: 56, maxWidth: 760 }}>
        <span className="kicker">Fair warning</span>
        <p style={{ marginTop: 8, lineHeight: 1.65 }}>
          VoxelPort only does Minecraft: Java servers, with Bedrock players welcome through Geyser. If you need to put a website
          or a different game online, a general tunnel is the better tool. For a Minecraft server it’s the one that sets everything up for you.
        </p>
      </div>
      <div className="page-cta">
        <a className="btn green" href="/download" onClick={go('/download')}>GET VOXELPORT</a>
        <a className="btn cream" href="/features" onClick={go('/features')}>SEE THE FEATURES</a>
      </div>
    </SubPage>
  );
}

// ─── /faq ─────────────────────────────────────────────────────────────────────

export function FaqPage({ onBack }) {
  return (
    <SubPage onBack={onBack}>
      <PageHero kicker="Letters page" a="YOUR" b="QUESTIONS"
        lede="The things people ask before they install, answered in plain words." />
      <div className="faq-grid" style={{ marginTop: 52 }}>
        {FAQ.map((f, i) => (
          <details key={f.q} className="panel faq-item" style={{ transform: `rotate(${[-.5, .4, -.3, .5][i % 4]}deg)` }} open>
            <summary><h2>{f.q}</h2></summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
      <div className="bubble tail-b" style={{ marginTop: 60, maxWidth: 720 }}>
        <span className="kicker">Not here?</span>
        <p style={{ marginTop: 8, lineHeight: 1.65 }}>
          Try the <a href="/guides" onClick={go('/guides')}>step-by-step guides</a>, or just ask in the Discord.
        </p>
      </div>
      <div className="page-cta"><DiscordButton>ASK IN THE DISCORD</DiscordButton></div>
    </SubPage>
  );
}

// ─── /download ────────────────────────────────────────────────────────────────

const INSTALL_NOTES = [
  { title: 'WINDOWS · STORE', body: 'The easiest way: one click from the Microsoft Store, and it updates itself. Microsoft reviews every Store update before it goes out, so a new version reaches the Store about a day after it is released here. Want a release the moment it is out? Use the direct installer.' },
  { title: 'WINDOWS · DIRECT', body: 'The newest version, straight from GitHub. It isn’t code-signed yet, so Windows may say “Windows protected your PC”: click More info, then Run anyway. It updates itself after that.' },
  { title: 'ANDROID', body: 'Host a server from your phone. The APK is sideloaded: open it, allow installs from your browser, and tap through the Play Protect prompt.', link: ['Read the Android guide →', '/guides/host-minecraft-server-android-phone'] },
  { title: 'LINUX', body: 'Download the Linux build from the GitHub release. It is the same app, built for Linux.' },
  { title: 'WHAT YOU NEED', body: 'A Windows 10/11 or Linux PC with at least 8 GB of RAM (16 GB is comfortable), or a recent Android phone. No account, and no router settings.' },
  { title: 'MACOS', body: 'Not yet. Follow the Discord or GitHub to hear when it lands.' },
];

export function DownloadPage({ onBack }) {
  const rel = useLatestReleases();
  return (
    <SubPage onBack={onBack}>
      <PageHero kicker="Free · no signup" a="GET" b="VOXELPORT"
        lede="One app, on your PC or your Android phone, hosts any Minecraft Java server. Players always join with vanilla Minecraft." />

      <div className="panel tilt-l1" style={{ padding: '24px 24px 26px', marginTop: 50, maxWidth: 720 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <span className="kicker" style={{ color: 'var(--grass-dk)' }}>PC &amp; Android app</span>
          <span className="sticker gold" style={{ transform: 'rotate(-2deg)' }}>NOW ON MICROSOFT STORE</span>
          <span className="sticker" style={{ transform: 'rotate(3deg)' }}>{rel.app ? `Latest ${rel.app}` : 'Latest release'}</span>
        </div>
        <h2 className="h-display" style={{ fontSize: 42, marginTop: 10 }}>HOST ANY SERVER</h2>
        <p style={{ marginTop: 6, color: 'var(--ink-2)' }}>Creates, imports or tunnels your server — and installs the Java it needs.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 20 }}>
          <a className="btn green sm" href={DL_STORE} target="_blank" rel="noreferrer">MICROSOFT STORE</a>
          <a className="btn cream sm" href={DL_WIN}>WINDOWS · DIRECT .EXE</a>
          <a className="btn cream sm" href={DL_LINUX}>LINUX</a>
          <a className="btn gold sm" href={DL_ANDROID} onClick={go(DL_ANDROID)}>ANDROID · APK</a>
          <a className="btn cream sm" href={GITHUB_APP} target="_blank" rel="noreferrer">SOURCE</a>
          <span className="btn sm" aria-disabled="true">MACOS · SOON</span>
        </div>
      </div>

      <div className="panel gold tilt-r1" style={{ padding: '18px 22px', marginTop: 36, maxWidth: 720 }}>
        <span className="kicker" style={{ color: 'var(--ink-2)' }}>Heads up · Microsoft Store</span>
        <p style={{ marginTop: 8, fontWeight: 600, lineHeight: 1.6 }}>
          Microsoft reviews every Store update before it goes out, so a new version reaches the Store about a day after it is released here. If you got VoxelPort from the Store and the new version isn’t there yet, it is on its way.
          The <b>direct .exe</b> is always the newest and updates itself.
        </p>
      </div>

      <section className="page-section">
        <SectionHead kicker="Before you click">INSTALL NOTES.</SectionHead>
        <div className="note-list">
          {INSTALL_NOTES.map((n) => (
            <div key={n.title} className="panel">
              <h3>{n.title}</h3>
              <p>{n.body}</p>
              {n.link && <p><a href={n.link[1]} onClick={go(n.link[1])}>{n.link[0]}</a></p>}
            </div>
          ))}
        </div>
      </section>

      <div className="bubble tail-b" style={{ marginTop: 60, maxWidth: 720 }}>
        <span className="kicker">Stuck on the install?</span>
        <p style={{ marginTop: 8, lineHeight: 1.65 }}>Ask in <b>#help</b> on the Discord. Tell us your Windows or Android version and what you see on screen.</p>
      </div>
      <div className="page-cta"><DiscordButton>ASK IN THE DISCORD</DiscordButton></div>
    </SubPage>
  );
}

// ─── /support ─────────────────────────────────────────────────────────────────

export function SupportPage({ onBack }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(UPI_ID).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <SubPage onBack={onBack}>
      <PageHero kicker="Tip jar · keep it free" a="SUPPORT" b="VOXELPORT" />

      <section className="page-section" id="support" style={{ marginTop: 40 }}>
        <div className="support">
          <div className="support-copy">
            <p className="lede">
              VoxelPort has no ads, no accounts and no paid plan: hosting, custom addresses and the server list are free for everyone.
              The relay runs on a server I pay for myself. If it saved you a fight with your router, a small tip helps keep it online,
              and <a href="#supporters">supporters get a badge and a few extras</a> as a thank-you.
            </p>
            <ul className="support-points">
              <li>Any amount helps, even ₹20</li>
              <li>Goes to the relay's power, internet and hardware</li>
              <li>UPI works from any Indian bank app: GPay, PhonePe, Paytm, BHIM</li>
            </ul>
          </div>
          <div className="panel support-card tilt-r1">
            <img src="/upi-qr.svg" width="220" height="220" alt={`UPI QR code for ${UPI_ID}`} className="support-qr" />
            <span className="pixel" style={{ fontSize: 11, color: 'var(--muted)' }}>SCAN WITH ANY UPI APP</span>
            <div className="support-id">
              <span className="addr">{UPI_ID}</span>
              <button className="btn sm cream" onClick={copy}>{copied ? 'COPIED!' : 'COPY'}</button>
            </div>
            <a className="btn green sm support-pay" href={UPI_LINK}>PAY WITH UPI</a>
            <span className="support-note">“Pay with UPI” opens your UPI app on a phone.</span>
          </div>
        </div>
      </section>

      <section className="page-section" id="supporters">
        <span className="kicker">Optional · a thank-you</span>
        <h2 className="h-display" style={{ fontSize: 'clamp(30px, 4vw, 44px)', marginTop: 6 }}>SUPPORTER PERKS</h2>
        <p className="lede" style={{ marginTop: 10, maxWidth: 720 }}>{SUPPORTER.intro}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginTop: 22 }}>
          {SUPPORTER.tiers.map((t) => (
            <div key={t.name} className="panel" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--card)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
                <span className="h-display" style={{ fontSize: 28 }}>{t.name.toUpperCase()}</span>
                <span className="pixel" style={{ fontSize: 13 }}>₹{t.inr}+</span>
              </div>
              <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--ink-2)' }}>
                {t.perks.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 18, maxWidth: 760, lineHeight: 1.6 }}><b>How:</b> {SUPPORTER.how}</p>
        <p style={{ marginTop: 8, maxWidth: 760, fontSize: 14, color: 'var(--muted)' }}>{SUPPORTER.fine}</p>
      </section>

      <section className="page-section">
        <div className="bubble tail-b" style={{ maxWidth: 720 }}>
          <span className="kicker">No money? That helps too</span>
          <ul className="ticks" style={{ marginTop: 12 }}>
            <li>Tell a friend who hosts Minecraft</li>
            <li>Star the project on <a href={GITHUB_APP} target="_blank" rel="noreferrer">GitHub</a></li>
            <li>Report bugs and ideas in the Discord</li>
          </ul>
        </div>
        <div className="page-cta"><DiscordButton>JOIN THE DISCORD</DiscordButton></div>
      </section>
    </SubPage>
  );
}

// ─── /community ───────────────────────────────────────────────────────────────

const JOIN_STEPS = [
  { title: '1 · CLICK JOIN', body: 'The button opens Discord. You need a Discord account for this part only: VoxelPort itself never asks for one.' },
  { title: '2 · READ THE WELCOME', body: 'The welcome channel says what the server is for and the few rules. Press its button if you want a ping for new releases.' },
  { title: '3 · PICK YOUR ROLES', body: 'Choose what fits in #roles: Java or Bedrock, phone or PC host, modder. Then say hi in #general.' },
];

export function CommunityPage({ onBack }) {
  return (
    <SubPage onBack={onBack} band={false}>
      <PageHero kicker="Our home base" a="OUR" b="DISCORD"
        lede="This is where VoxelPort lives: where people ask for help, show their servers and hear about every release first.">
        <div className="page-cta"><DiscordButton>JOIN THE DISCORD</DiscordButton></div>
      </PageHero>

      <section className="page-section" id="inside">
        <SectionHead kicker="What’s inside">SIX GOOD REASONS.</SectionHead>
        <div className="grid-3">
          {DISCORD_PERKS.map((f, i) => (
            <article key={f.title} className="panel feat" style={{ position: 'relative', transform: `rotate(${[-1.2, .8, -.6, 1, -.9, .7][i % 6]}deg)` }}>
              <div style={{ height: 56, display: 'flex', alignItems: 'center' }}><Pixels rows={SPRITES[f.sprite]} size={4.4} /></div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section" id="join">
        <SectionHead kicker="Takes a minute">HOW TO JOIN.</SectionHead>
        <div className="note-list">
          {JOIN_STEPS.map((s) => (
            <div key={s.title} className="panel">
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
        <div className="bubble tail-b" style={{ marginTop: 56, maxWidth: 760 }}>
          <span className="kicker">Staying safe</span>
          <p style={{ marginTop: 8, lineHeight: 1.65 }}>
            To keep scam links out, links are only allowed in a few channels. And you never need to give anyone your Minecraft or Microsoft
            password to host a server: if someone asks, it’s a scam. Tell a moderator.
          </p>
        </div>
        <div className="page-cta">
          <DiscordButton>JOIN THE DISCORD</DiscordButton>
          <a className="btn cream" href="/guides" onClick={go('/guides')}>READ THE GUIDES FIRST</a>
        </div>
      </section>
    </SubPage>
  );
}
