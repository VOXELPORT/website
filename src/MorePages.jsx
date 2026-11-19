import { useEffect, useMemo, useState } from 'react';
import { Nav, Footer, Pixels, DiscordButton } from './ui.jsx';
import {
  SPRITES, useAndroidFeed, useDetectedOS,
  DL_WIN, GITHUB_APP, GITHUB_ORG, EXAMPLE_ADDR, UPI_ID, UPI_LINK,
} from './data.js';
import { navigate, isModifiedClick, FAQ } from './seo.js';
import { SITE_NAV, PATHS, FEATURES, RIVALS, TABLE, EXPLORE } from './content.js';
import { DISCORD_PERKS } from './community.js';
import { SUPPORTER } from './support.js';
import { RELEASES, fmtDate, fmtMB, WIN_SMARTSCREEN, WIN_SMART_APP_CONTROL, WIN_VERIFY_COMMAND } from './release.js';
import { COMPARE } from './content.js';
import { DEV, ABOUT, ABOUT_NOTE, TEAM_INTRO, TEAM_ROLES, TEAM_HOW, TEAM_NOTE } from './about.js';

// The pages that used to be sections of one very long home page. Each is short and has its own address
// (/features, /compare, /faq, /download, /support, /community), so people can link straight to it.

/** Same-site link that navigates without a page load. */
const go = (href) => (e) => {
  if (isModifiedClick(e)) return;
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
    <div className="zine hb">
      <Nav links={SITE_NAV} onLogo={back} />
      <main id="main-content" tabIndex={-1} className="wrap" style={{ paddingTop: 50, paddingBottom: 100 }}>{children}</main>
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
        lede="Everything the person running the server needs, and nothing the player has to install. One app that manages any Minecraft Java server on your PC or your Android phone, and connects it through a relay." />

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
                    ? <a className="btn" href={DL_WIN}>DOWNLOAD FOR WINDOWS</a>
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
              <span className="kicker">What running a server looks like</span>
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
        lede="VoxelPort manages a Minecraft server and connects it. playit.gg and ngrok only do the connecting. Here is what each one states about itself, with sources." />

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

      <section className="page-section" id="sources">
        <SectionHead kicker={`Last verified ${fmtDate(COMPARE.verifiedOn)}`}>HOW WE COMPARED.</SectionHead>
        <div className="note-list">
          <div className="panel">
            <h3>WHAT THE ROWS MEAN</h3>
            <dl style={{ margin: 0 }}>
              {COMPARE.definitions.map(([t, d]) => <div key={t} style={{ marginBottom: 8 }}><dt style={{ fontWeight: 700 }}>{t}</dt><dd style={{ margin: 0 }}>{d}</dd></div>)}
            </dl>
          </div>
          <div className="panel">
            <h3>SOURCES</h3>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
              {COMPARE.sources.map(([n, u, d]) => <li key={u}><a href={u} target="_blank" rel="noreferrer">{n}</a>: {d}</li>)}
            </ul>
          </div>
          <div className="panel">
            <h3>LIMITS</h3>
            <p>“Not checked” means we did not confirm it, so we claim nothing. Prices and plans change: the sources above are the authority, not this page. We are the maker of VoxelPort, so read our column with that in mind, and tell us in the Discord if something here is out of date.</p>
          </div>
        </div>
      </section>

      <div className="bubble tail-b" style={{ marginTop: 56, maxWidth: 760 }}>
        <span className="kicker">Fair warning</span>
        <p style={{ marginTop: 8, lineHeight: 1.65 }}>
          VoxelPort only does Minecraft: Java servers, with Bedrock players welcome through Geyser. If you need to put a website
          or a different game online, a general tunnel is the better tool. playit.gg also supports Minecraft and many other games. If you already run your own Minecraft server and only need an address for it, a tunnel can be enough; VoxelPort also installs and manages the server for you.
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
  const [openQuestions, setOpenQuestions] = useState(() => new Set(FAQ.slice(0, 2).map((f) => f.q)));
  const [q, setQ] = useState('');

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return FAQ;
    return FAQ.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(needle));
  }, [q]);

  const allOpen = shown.length > 0 && shown.every((f) => openQuestions.has(f.q));

  const toggleAll = () => {
    if (allOpen) {
      setOpenQuestions(new Set());
    } else {
      setOpenQuestions(new Set(FAQ.map((f) => f.q)));
    }
  };

  const toggleOne = (question, isOpen) => {
    setOpenQuestions((prev) => {
      const next = new Set(prev);
      if (isOpen) next.add(question);
      else next.delete(question);
      return next;
    });
  };

  return (
    <SubPage onBack={onBack}>
      <PageHero kicker="Letters page" a="YOUR" b="QUESTIONS"
        lede="The things people ask before they install, answered in plain words." />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 34, alignItems: 'center' }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search questions…"
          aria-label="Search questions"
          style={{ flex: '1 1 240px', minWidth: 0, border: '3px solid var(--ink)', padding: '10px 12px', font: 'inherit', background: 'var(--card)', boxShadow: '3px 3px 0 var(--ink)' }}
        />
        <button type="button" className="btn sm cream" onClick={toggleAll}>
          {allOpen ? 'COLLAPSE ALL' : 'EXPAND ALL'}
        </button>
      </div>

      <div className="faq-grid" style={{ marginTop: 28 }}>
        {shown.map((f, i) => {
          const isOpen = q.trim().length > 0 || openQuestions.has(f.q);
          return (
            <details
              key={f.q}
              className="panel faq-item"
              style={{ transform: `rotate(${[-.5, .4, -.3, .5][i % 4]}deg)` }}
              open={isOpen}
              onToggle={(e) => toggleOne(f.q, e.currentTarget.open)}
            >
              <summary><h2>{f.q}</h2></summary>
              <p>{f.a}</p>
            </details>
          );
        })}
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

// ─── /new-app ─────────────────────────────────────────────────────────────────

const NEWAPP_STEPS = [{"title":"1 · UPDATE YOUR CURRENT APP","body":"Open VoxelPort. If it offers an update, press Restart & Update. You need version 1.18.0 or newer, which is the one with the move button."},{"title":"2 · PRESS THE BIG BUTTON","body":"You will see “VoxelPort has moved to a new app”. Press Update to the new VoxelPort. It downloads and checks the new app, installs it, brings over your servers, backups, VoxelPort ID, address and settings, then removes the old app. It takes about a minute."},{"title":"3 · SIGN IN AND PLAY","body":"Sign in with Discord once in the new app. Then Start and Make public, as always. Your server folders and worlds were never touched."}];
const NEWAPP_OTHER = [{"title":"NO BUTTON? INSTALL IT DIRECTLY","body":"Download the new app below and run it. The first time it opens, it finds your old VoxelPort and offers to bring your data over."},{"title":"MICROSOFT STORE VERSION","body":"The Store cannot install another app for you. Download the new one below, open it, use its banner to bring your data over, then remove the Store version in Windows Settings › Apps."},{"title":"WINDOWS SAYS “PROTECTED YOUR PC”","body":"The installer is not code-signed yet, so Windows may warn about an unknown publisher. Check the download first: get it only from the official release page and compare its SHA-256 checksum (steps on the download page). Smart App Control blocks unsigned installers with no override, and we do not recommend turning it off: keep using your current VoxelPort, which keeps working."},{"title":"ANDROID","body":"Nothing to do. The Android app updates itself from inside the app."}];
const NEWAPP_WHY = [{"title":"MUCH SMALLER","body":"About 3 MB to download instead of over 100 MB."},{"title":"WHERE NEW THINGS GO","body":"New features come only to the new app. The old one keeps working, but it stops getting them."},{"title":"SAFE UPDATES","body":"Updates are checked against a key built into the app before they are installed."},{"title":"NOTHING LOST","body":"Your servers, worlds, backups, VoxelPort ID and custom address come with you, and if anything goes wrong your old app and data stay exactly as they are."}];

export function NewAppPage({ onBack }) {
  return (
    <SubPage onBack={onBack}>
      <PageHero kicker="VoxelPort has moved" a="THE NEW" b="VOXELPORT"
        lede="A smaller app that does everything the old one does, and the only one that gets new features. Moving takes about a minute and keeps your servers.">
        <div className="page-cta" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 24 }}>
          <a className="btn green" href={DL_WIN}>DOWNLOAD THE NEW APP</a>
          <DiscordButton>ASK ON DISCORD</DiscordButton>
        </div>
      </PageHero>

      <section className="page-section" id="steps">
        <SectionHead kicker="Already using VoxelPort?">MOVE IN ONE MINUTE.</SectionHead>
        <div className="note-list">
          {NEWAPP_STEPS.map((n) => (
            <div key={n.title} className="panel gold">
              <h3>{n.title}</h3>
              <p>{n.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section" id="other">
        <SectionHead kicker="If something is different">OTHER WAYS AND QUESTIONS.</SectionHead>
        <div className="note-list">
          {NEWAPP_OTHER.map((n) => (
            <div key={n.title} className="panel">
              <h3>{n.title}</h3>
              <p>{n.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section" id="why">
        <SectionHead kicker="Why move">WHAT YOU GET.</SectionHead>
        <div className="note-list">
          {NEWAPP_WHY.map((n) => (
            <div key={n.title} className="panel">
              <h3>{n.title}</h3>
              <p>{n.body}</p>
            </div>
          ))}
        </div>
        <div className="page-cta" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 28 }}>
          <a className="btn green" href={DL_WIN}>DOWNLOAD THE NEW APP</a>
          <a className="btn cream" href="/download" onClick={go('/download')}>ALL DOWNLOADS</a>
        </div>
      </section>
    </SubPage>
  );
}

/** A slim notice for the pages most people land on. */
export function MoveStrip() {
  return (
    <a className="move-strip" href="/new-app" onClick={go('/new-app')}>
      <b>VoxelPort has a new app.</b> Using VoxelPort already? Move in one minute and keep your servers <span aria-hidden="true">→</span>
    </a>
  );
}

// ─── /download ────────────────────────────────────────────────────────────────

const INSTALL_NOTES = [
  { title: 'THE NEW APP · 2.0', body: 'VoxelPort has moved to a new app, rebuilt on newer technology: about 3 MB instead of over 100 MB, and where every new feature goes. Already using VoxelPort? Update your current app to 1.18.0 and press “Update to the new VoxelPort”: it downloads and checks the new app, installs it, brings your servers, backups, VoxelPort ID, address and settings across, then removes the old app. Your server folders and worlds are never touched, and if anything goes wrong your old app and data stay as they are. You sign in with Discord once in the new app. The previous (Electron) app is not updated any more: it keeps the India and Europe relays, and custom addresses only on India. Los Angeles, custom addresses on every relay and Supporter+ voice chat on every relay are in the new app. Microsoft Store copy: the Store can’t install another app, so download the new one here, open it and use its banner to bring your data over, then remove the Store version in Windows Settings › Apps.' },
  { title: 'WINDOWS WARNINGS', body: WIN_SMARTSCREEN },
  { title: 'WINDOWS 11 · SMART APP CONTROL', body: WIN_SMART_APP_CONTROL },
  { title: 'ANDROID', body: 'Run a server from your phone. A phone has limits: Android can close apps in the background, and mobile data or a phone with little RAM is the hardest case. Use Wi‑Fi, and use the PC app for a server that has to stay up. The APK is installed from outside Google Play: open it, allow installs from your browser, and tap through the Play Protect prompt.', link: ['Read the Android guide →', '/guides/host-minecraft-server-android-phone'] },
  { title: 'WHAT YOU NEED', body: 'Windows 10 or 11 (64-bit), or Android 8.0 or newer. To run a Minecraft server comfortably, 8 GB of RAM or more is a good guide (16 GB is comfortable); the server uses your own memory. A free Discord account to join our server, and no router settings.' },
  { title: 'MACOS AND LINUX', body: 'VoxelPort is not available for macOS or Linux. It is Windows and Android only.' },
];

export function DownloadPage({ onBack }) {
  const os = useDetectedOS();
  const android = useAndroidFeed();
  const win = RELEASES.windows;
  return (
    <SubPage onBack={onBack}>
      <MoveStrip />
      <PageHero kicker="Free · join our Discord" a="GET" b="VOXELPORT"
        lede="One app, on your PC or your Android phone, manages any Minecraft Java server and connects it through a relay. The server runs on your device. Players always join with vanilla Minecraft." />

      <div className="panel tilt-l1" style={{ padding: '24px 24px 26px', marginTop: 50, maxWidth: 720 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <span className="kicker" style={{ color: 'var(--grass-dk)' }}>PC &amp; Android app</span>
          <span className="sticker gold" style={{ transform: 'rotate(-2deg)' }}>
            {os === 'android' ? 'DETECTED: ANDROID' : 'FREE DOWNLOAD'}
          </span>
          <span className="sticker" style={{ transform: 'rotate(3deg)' }}>{`Stable ${win.version}`}</span>
        </div>
        <h2 className="h-display" style={{ fontSize: 42, marginTop: 10 }}>MANAGE ANY SERVER</h2>
        <p style={{ marginTop: 6, color: 'var(--ink-2)' }}>Creates, imports or tunnels your server — and installs the Java it needs.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 20 }}>
          <a className={`btn ${os === 'android' ? 'cream' : 'green'} sm`} href={win.downloadUrl}>DOWNLOAD VOXELPORT FOR WINDOWS</a>
          <a className={`btn ${os === 'android' ? 'green' : 'gold'} sm`} href={RELEASES.android.downloadUrl}>DOWNLOAD FOR ANDROID (APK)</a>
          <a className="btn cream sm" href={GITHUB_APP} target="_blank" rel="noreferrer">SOURCE</a>
        </div>
      </div>

      <section className="page-section" id="releases">
        <SectionHead kicker={`Checked ${fmtDate(RELEASES.verifiedOn)}`}>RELEASE INFORMATION.</SectionHead>
        <div className="table-scroll panel" style={{ padding: 0 }}>
          <table className="table">
            <thead><tr><th scope="col">&nbsp;</th><th scope="col">WINDOWS</th><th scope="col">ANDROID</th></tr></thead>
            <tbody>
              <tr><th scope="row">Release</th><td>{win.channel} {win.version}</td><td>{android.channel} {android.version}</td></tr>
              <tr><th scope="row">Beta</th><td colSpan="2">None right now: both are stable releases.</td></tr>
              <tr><th scope="row">Released</th><td>{fmtDate(win.releasedOn)}</td><td>See the update feed</td></tr>
              <tr><th scope="row">File</th><td>{win.installer} ({fmtMB(win.sizeBytes)})</td><td>voxelport-android.apk ({fmtMB(android.sizeBytes)})</td></tr>
              <tr><th scope="row">Needs</th><td>{win.requirements[0]}</td><td>{RELEASES.android.requirements[0]}</td></tr>
              <tr><th scope="row">SHA-256</th><td><code className="hash">{win.sha256}</code></td><td><code className="hash">{android.sha256}</code></td></tr>
              <tr><th scope="row">Links</th><td><a href={win.releaseUrl} target="_blank" rel="noreferrer">Release notes</a> · <a href={win.checksumsUrl} target="_blank" rel="noreferrer">SHA256SUMS.txt</a> · <a href={win.changelogUrl} target="_blank" rel="noreferrer">All releases</a></td><td><a href={RELEASES.android.feedUrl}>Update feed (JSON)</a> · <a href={RELEASES.android.guideUrl} onClick={go(RELEASES.android.guideUrl)}>Install guide</a></td></tr>
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: 12, fontSize: 14, color: 'var(--ink-2)' }}>
          The Windows values describe v{win.version} and the Android values come from the live update feed. A newer release has its own checksum on its release page.
        </p>
      </section>

      <section className="page-section" id="verify">
        <SectionHead kicker="Before you run it">CHECK THE DOWNLOAD.</SectionHead>
        <div className="panel" style={{ padding: '20px 22px' }}>
          <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Get the installer only from this page or the official <a href={win.releaseUrl} target="_blank" rel="noreferrer">GitHub release</a>.</li>
            <li>Open PowerShell in the download folder and run <code>{WIN_VERIFY_COMMAND}</code>.</li>
            <li>The hash it prints must match the <code>VoxelPort-Setup.exe</code> line in <a href={win.checksumsUrl} target="_blank" rel="noreferrer">SHA256SUMS.txt</a> (v{win.version}: <code className="hash">{win.sha256.slice(0, 16)}…</code>).</li>
            <li>If they match and you trust the source, continue. If not, delete the file and ask in <b>#help</b> on the Discord.</li>
          </ol>
          <p style={{ marginTop: 12 }}>The installer is not code-signed yet, so Windows shows an unknown publisher. That is expected, and it is why this check matters.</p>
        </div>
      </section>


      <div className="panel gold tilt-l1" style={{ padding: '18px 22px', marginTop: 24, maxWidth: 720 }}>
        <span className="kicker" style={{ color: 'var(--ink-2)' }}>Good to know · Android</span>
        <p style={{ marginTop: 8, fontWeight: 600, lineHeight: 1.6 }}>
          Running a server on a phone has limits. Android can close apps in the background, and mobile data or a phone with little memory is the hardest case.
          Use Wi‑Fi, keep the app open, and use the <b>PC app</b> for a server that has to stay up.
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
              VoxelPort has no ads. The app, the relay, the free address and the server list are free for everyone, and you join our Discord server to use the app. A custom name is a supporter perk.
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

// ─── /about ───────────────────────────────────────────────────────────────────────

export function AboutPage({ onBack }) {
  return (
    <SubPage onBack={onBack} band={false}>
      <PageHero kicker="The story" a="WHO MADE" b="VOXELPORT"
        lede="A one-person, open-source project from India: who built it, how it started, how it is made, and the people who made it possible.">
        <div className="page-cta">
          <a className="btn" href={DEV.github} target="_blank" rel="noopener noreferrer">THE DEVELOPER ON GITHUB</a>
          <a className="btn cream" href={DEV.linkedin} target="_blank" rel="noopener noreferrer">LINKEDIN</a>
          <a className="btn cream" href="/team" onClick={go('/team')}>JOIN THE TEAM</a>
        </div>
      </PageHero>

      {ABOUT.map((s) => (
        <section className="page-section" id={s.id} key={s.id}>
          <SectionHead kicker={s.kicker}>{s.title}</SectionHead>
          <div className="note-list">
            {s.paras.map((p) => (
              <div key={p.slice(0, 40)} className="panel"><p style={{ lineHeight: 1.65 }}>{p}</p></div>
            ))}
            {s.stack && (
              <div className="panel" style={{ gridColumn: "1 / -1" }}>
                <h3>The stack</h3>
                <ul style={{ lineHeight: 1.7, paddingLeft: 20 }}>
                  {s.stack.map(([k, v]) => <li key={k}><b>{k}:</b> {v}</li>)}
                </ul>
              </div>
            )}
            {s.credits && (
              <div className="panel" style={{ gridColumn: "1 / -1" }}>
                <ul style={{ lineHeight: 1.7, paddingLeft: 20 }}>
                  {s.credits.map(([k, v]) => <li key={k}><b>{k}:</b> {v}</li>)}
                </ul>
              </div>
            )}
          </div>
          {s.links && (
            <div className="page-cta">
              {s.links.map(([label, href, primary]) => (
                <a key={href} className={primary ? 'btn' : 'btn cream'} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
              ))}
            </div>
          )}
        </section>
      ))}

      <section className="page-section" id="contact">
        <SectionHead kicker="Say hi">GET IN TOUCH.</SectionHead>
        <div className="bubble tail-b" style={{ maxWidth: 760 }}>
          <p style={{ lineHeight: 1.65 }}>
            Found a bug, want to help, or just want to tell me how your server is going? Join the Discord, or email{' '}
            <a href={'mailto:' + DEV.email}>{DEV.email}</a>. The code is at{' '}
            <a href={GITHUB_ORG} target="_blank" rel="noopener noreferrer">github.com/VOXELPORT</a>.
          </p>
          <p style={{ marginTop: 10, opacity: 0.75, fontSize: 14 }}>{ABOUT_NOTE}</p>
        </div>
        <div className="page-cta">
          <DiscordButton>JOIN THE DISCORD</DiscordButton>
          <a className="btn cream" href="/team" onClick={go('/team')}>JOIN THE TEAM</a>
        </div>
      </section>
    </SubPage>
  );
}

// ─── /team ────────────────────────────────────────────────────────────────────────

export function TeamPage({ onBack }) {
  return (
    <SubPage onBack={onBack} band={false}>
      <PageHero kicker="Help wanted" a="JOIN THE" b="TEAM" lede={TEAM_INTRO}>
        <div className="page-cta">
          <DiscordButton>JOIN THE DISCORD</DiscordButton>
          <a className="btn cream" href={'mailto:' + DEV.email}>EMAIL ME</a>
        </div>
      </PageHero>

      <section className="page-section" id="roles">
        <SectionHead kicker="Who we need">SIX WAYS TO HELP.</SectionHead>
        <div className="grid-3">
          {TEAM_ROLES.map((r, i) => (
            <article key={r.title} className="panel feat" style={{ position: 'relative', transform: `rotate(${[-1.2, .8, -.6, 1, -.9, .7][i % 6]}deg)` }}>
              <div style={{ height: 56, display: 'flex', alignItems: 'center' }}><Pixels rows={SPRITES[r.sprite]} size={4.4} /></div>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
              <p style={{ marginTop: 10, opacity: 0.8, fontSize: 14 }}><b>You need:</b> {r.asks}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section" id="how">
        <SectionHead kicker="Takes a minute">HOW TO APPLY.</SectionHead>
        <div className="note-list">
          {TEAM_HOW.map((s) => (
            <div key={s.title} className="panel">
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
        <div className="bubble tail-b" style={{ marginTop: 56, maxWidth: 760 }}>
          <span className="kicker">Staying safe</span>
          <p style={{ marginTop: 8, lineHeight: 1.65 }}>{TEAM_NOTE}</p>
        </div>
        <div className="page-cta">
          <DiscordButton>JOIN THE DISCORD</DiscordButton>
          <a className="btn cream" href={GITHUB_ORG} target="_blank" rel="noopener noreferrer">SEE THE CODE</a>
          <a className="btn cream" href="/about" onClick={go('/about')}>THE STORY</a>
        </div>
      </section>
    </SubPage>
  );
}

// ─── 404 Not Found ────────────────────────────────────────────────────────────────

export function NotFoundPage({ onBack }) {
  return (
    <SubPage onBack={onBack}>
      <PageHero kicker="Error 404 · wrong portal" a="PAGE NOT" b="FOUND"
        lede="That address doesn’t lead anywhere on this site. Head back to the home page or jump straight to what you came for:">
        <div className="page-cta">
          <a className="btn green" href="/" onClick={go('/')}>BACK TO HOME</a>
          <a className="btn cream" href="/download" onClick={go('/download')}>DOWNLOAD THE APP</a>
          <a className="btn cream" href="/guides" onClick={go('/guides')}>SERVER GUIDES</a>
        </div>
      </PageHero>

      <section className="page-section">
        <SectionHead kicker="Where to go">EXPLORE THE ZINE.</SectionHead>
        <div className="grid-4">
          {EXPLORE.map((e, i) => (
            <a key={e.href} className="panel guide-card explore-card" href={e.href} onClick={go(e.href)}
              style={{ transform: `rotate(${[-.6, .5, -.3, .6][i % 4]}deg)` }}>
              <div className="guide-card-top">
                <span className="pixel" style={{ fontSize: 11 }}>{e.tag.toUpperCase()}</span>
                <Pixels rows={SPRITES[e.sprite]} size={2.4} />
              </div>
              <h3 className="h-display">{e.title}</h3>
              <p>{e.blurb}</p>
              <span className="guide-card-more">OPEN →</span>
            </a>
          ))}
        </div>
      </section>
    </SubPage>
  );
}
