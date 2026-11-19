import { DiscordIcon } from './ui.jsx';
import { useDetectedOS, DL_WIN, DL_ANDROID, GUIDE_ANDROID, GITHUB_APP, DISCORD } from './data.js';
import { navigate, isModifiedClick } from './seo.js';
import { V2Bg, V2Nav, V2Footer } from './V2Shell.jsx';

const go = (href) => (e) => { if (isModifiedClick(e)) return; e.preventDefault(); navigate(href); window.scrollTo(0, 0); };
function Arrow() { return <span aria-hidden="true">↗</span>; }

function Icon({ kind, size = 24 }) {
  const paths = {
    window: <path d="m3 5 8-1v7H3zm10-1 8-1v8h-8zM3 13h8v7l-8-1zm10 0h8v8l-8-1z" fill="currentColor" stroke="none" />,
    cube: <path d="m12 2 9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10" />,
    link: <path d="m10 13 4-4m-6 6-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 2 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(1 1)" />,
    shield: <><path d="m12 2 8 3v6c0 5-8 11-8 11S4 16 4 11V5z" /><path d="m8 11 3 3 5-6" /></>,
    phone: <><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M10 18h4M10 5h4" /></>,
    bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
    heart: <path d="M12 21C5 15 3 11 3 8a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 3-2 7-9 13Z" />,
    diamond: <path d="m3 9 4-6h10l4 6-9 12z M3 9h18M8 3 6 9l6 12 6-12-2-6" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind] || paths.cube}</svg>;
}

const FEATURES = [
  { icon: 'cube', tag: '01 / MANAGE', title: 'Run it from one app.', text: 'Create a Vanilla, Paper or Fabric server, or import the one you have. VoxelPort installs the right Java and gives you a live console, players, CPU, RAM and TPS, backups, and plugins or mods from Modrinth.' },
  { icon: 'link', tag: '02 / CONNECT', title: 'Skip the router rituals.', text: 'The VoxelPort relay is a proxy: your server connects out to it and players connect to it, so no port forwarding is needed. It works behind CGNAT and on networks you do not control.' },
  { icon: 'diamond', tag: '03 / PLAY TOGETHER', title: 'Different devices. Same dirt.', text: 'One switch adds Geyser and Floodgate, so Java and Bedrock friends join the same world with plain Minecraft. Your world and files stay on your own hardware.' },
];
const PROOF = ['Runs on your own device', 'No port forwarding', 'Java + Bedrock', 'Players need no account', 'Open source', 'Free'];
const FLOW = [
  { n: 1, title: 'Install VoxelPort', text: 'Download the app for Windows or Android and sign in with Discord once.', img: null },
  { n: 2, title: 'Create or import a server', text: 'Create a Vanilla, Paper or Fabric server, import a server folder or a modpack, or point VoxelPort at a server you already run.', img: 'app-library-empty' },
  { n: 3, title: 'Start and manage it', text: 'Start the server on your device. See the console, players, CPU, RAM and TPS, and use settings, backups, plugins and files.', img: 'app-server-stopped' },
  { n: 4, title: 'Turn on the relay', text: 'Press Make public. Your server connects out to a VoxelPort relay; Region is Auto (fastest) unless you pick one.', img: 'app-make-public' },
  { n: 5, title: 'Share the address', text: 'Copy the address the app shows. Friends paste it into Multiplayer in plain Minecraft.', img: 'app-share-address' },
];
const ARCH = [
  { who: 'Minecraft player', what: 'Plain Minecraft, Java or Bedrock. No account, no mods, nothing to install.', side: 'Anywhere' },
  { who: 'VoxelPort relay (proxy)', what: 'Passes traffic between players and your device. It provides connectivity only: no CPU, RAM or world storage.', side: 'VoxelPort', relay: true },
  { who: 'Your PC or Android phone', what: 'Runs the VoxelPort app, which connects out to the relay. Nothing to open on your router.', side: 'Your hardware' },
  { who: 'Minecraft server', what: 'Your world and files, running on your own CPU and RAM. It stops when your device is off.', side: 'Your hardware' },
];
const HOW = [
  ['1', 'Install VoxelPort', 'Download the app for Windows or Android and sign in with Discord once.'],
  ['2', 'Create or import a server', 'Pick a type and version, or import a server folder. VoxelPort sets up Java and starts it on your device.'],
  ['3', 'Connect through the relay', 'Press Make public. Your server connects out to a VoxelPort relay and gets an address.'],
  ['4', 'Friends join', 'They paste the address into Multiplayer in plain Minecraft. No account, no install.'],
];
const FAQ = [
  ['Is VoxelPort a Minecraft hosting service?', 'No. It is a server manager and proxy app. Your server runs on your own PC or Android phone with your own CPU, RAM and internet. VoxelPort manages it and connects it to a relay so friends can join without port forwarding.'],
  ['What does the relay do?', 'It provides connectivity, not computing. Your server connects out to the relay, players connect to it, and it passes the traffic between them. It does not run your server or store your world.'],
  ['Is VoxelPort really free?', 'Yes. The app and relay are free and open source under the MIT license. Optional supporter perks help keep the project running. You can use it and play without paying.'],
  ['Do my friends need to install anything?', 'Only Minecraft. Players connect to your public address through Multiplayer. VoxelPort runs on the device that runs the server.'],
  ['Can Java and Bedrock friends play together?', 'Yes. Turn on Geyser and Floodgate in VoxelPort to let Bedrock players (phone, console, Windows 10) join your Java server.'],
  ['Does my computer need to stay on?', 'Yes. Your world runs on your own PC or Android phone, so that device must stay on while friends play. Performance depends on your hardware and connection.'],
];

const ALT = {
  'app-library-empty': 'VoxelPort app on a new install: "Create your first server", with buttons to import an existing server or a modpack, and a link to tunnel a server you already run.',
  'app-server-stopped': 'VoxelPort server page for a Paper server named Survival SMP, stopped, with a Start server button and Settings, Backups, Plugins, Files and Open folder buttons.',
  'app-make-public': 'VoxelPort server page for the running Survival SMP server, with a Make public button and a Region menu set to Auto (fastest).',
  'app-share-address': 'VoxelPort server page for the running server showing CPU, RAM and TPS, and a shareable address with a Copy button.',
};

function Showcase({ src, poster, className }) {
  return <video className={className} src={src} poster={poster} autoPlay loop muted playsInline preload="metadata" aria-label="VoxelPort app walkthrough" />;
}

export default function Landing() {
  const os = useDetectedOS();
  const cta = 'Download VoxelPort';
  const download = os === 'android' ? DL_ANDROID : DL_WIN;
  return <div className="v2d" id="top">
    <V2Bg />
    <V2Nav />

    <main id="main-content" tabIndex={-1}>
      {/* HERO */}
      <section className="v2d-wrap v2d-hero">
        <div>
          <p className="v2d-eyebrow"><i />Minecraft server manager &amp; proxy</p>
          <h1>Your Minecraft Server.<br /><span className="g">Your Control.</span></h1>
          <p className="v2d-lede">Manage Minecraft servers on your own device and let friends connect without complicated port forwarding.</p>
          <p className="v2d-note">The server runs on your own PC or Android phone. VoxelPort manages it and connects it through a relay; it is not a hosting service.</p>
          <div className="v2d-cta">
            <a className="v2d-btn v2d-btn-solid" href={download} ><Icon kind={os === 'android' ? 'phone' : 'window'} size={18} />{cta}</a>
            <a className="v2d-btn v2d-btn-ghost" href="/features" onClick={go('/features')}>Explore Features <Arrow /></a>
          </div>
          <p className="v2d-free"><b>✓</b> Free &amp; open source <i /> {os === 'android' ? 'For Android' : 'For Windows'} <i /> Sign in with Discord once</p>
        </div>
        <div className="v2d-show">
          <div className="v2d-show-frame">
            <div className="v2d-show-bar"><span /><span /><span /><b>VoxelPort</b></div>
            <Showcase src="/showcase/desktop.mp4" poster="/showcase/app-library-empty.webp" />
          </div>
          <span className="v2d-show-tag">REAL APP · NOT A MOCKUP</span>
        </div>
      </section>

      {/* PROOF */}
      <div className="v2d-proof"><div className="v2d-wrap v2d-proof-in">{PROOF.map((t) => <span key={t}><i>✳</i>{t}</span>)}</div></div>

      {/* WHY */}
      <section className="v2d-wrap v2d-sec" id="why">
        <div className="v2d-head">
          <p className="v2d-eyebrow"><i />Less friction. More Minecraft.</p>
          <h2>A server manager with a built-in connection.</h2>
          <p>VoxelPort looks after the server on your device and gets your friends to it. It is not a hosting service.</p>
        </div>
        <div className="v2d-cards">
          {FEATURES.map((f) => <article className="v2d-card" key={f.tag}>
            <span className="v2d-card-ico"><Icon kind={f.icon} /></span>
            <p className="v2d-card-tag">{f.tag}</p>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </article>)}
        </div>
        <p style={{ marginTop: 28 }}><a className="v2d-underlink" href="/features" onClick={go('/features')}>A closer look at the features <Arrow /></a></p>
      </section>

      {/* WORKFLOW */}
      <section className="v2d-wrap v2d-sec" id="workflow" style={{ paddingTop: 0 }}>
        <div className="v2d-head">
          <p className="v2d-eyebrow"><i />The real workflow.</p>
          <h2>From download to friends joining, in five steps.</h2>
          <p>Screenshots of the VoxelPort app itself, so you know what you are installing.</p>
        </div>
        <ol className="v2d-flow">
          {FLOW.map((s) => <li className="v2d-flow-step" key={s.n}>
            <span className="v2d-flow-n" aria-hidden="true">{s.n}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            {s.img
              ? <img src={`/showcase/${s.img}.webp`} width="720" height="900" loading="lazy" decoding="async" alt={ALT[s.img]} />
              : <a className="v2d-underlink" href="/download" onClick={go('/download')}>Go to the download page <Arrow /></a>}
          </li>)}
        </ol>
        <p className="v2d-fine">Screenshots recorded in a 2.0 pre-release build of the Windows app with a sample server (no real players). The Android app has the same steps.</p>
      </section>

      {/* ARCHITECTURE */}
      <section className="v2d-wrap v2d-sec" id="architecture" style={{ paddingTop: 0 }}>
        <div className="v2d-head">
          <p className="v2d-eyebrow"><i />How the connection works.</p>
          <h2>Management and connectivity. Not cloud computing.</h2>
          <p>VoxelPort looks after the server on your device and relays the connection. The CPU, RAM and storage that run the game are always yours.</p>
        </div>
        <figure className="v2d-arch-wrap">
          <ol className="v2d-arch" aria-label="Connection path from a Minecraft player to your Minecraft server">
            {ARCH.map((a, i) => <li key={a.who} className={`v2d-arch-node${a.relay ? ' is-relay' : ''}`}>
              <span className="v2d-arch-side">{a.side}</span>
              <h3>{a.who}</h3>
              <p>{a.what}</p>
              {i < ARCH.length - 1 && <span className="v2d-arch-arrow" aria-hidden="true">↓</span>}
            </li>)}
          </ol>
          <figcaption>Your device connects out to the relay, so the connection works behind CGNAT and without port forwarding. If your device is off, the server is off.</figcaption>
        </figure>
      </section>

      {/* HOW IT WORKS */}
      <section className="v2d-wrap v2d-sec" id="how" style={{ paddingTop: 0 }}>
        <div className="v2d-head">
          <p className="v2d-eyebrow"><i />How VoxelPort works.</p>
          <h2>Your device runs the server. The relay connects it.</h2>
          <p>The relay is a proxy that provides connectivity, not compute. It does not run your server, store your world, or provide CPU or RAM. Your PC or phone has to stay on while people play.</p>
        </div>
        <div className="v2d-cards">
          {HOW.map(([n, t, d]) => <article className="v2d-card" key={n}>
            <p className="v2d-card-tag">STEP {n}</p>
            <h3>{t}</h3>
            <p>{d}</p>
          </article>)}
        </div>
      </section>

      {/* DUAL SHOWCASE */}
      <section className="v2d-wrap v2d-sec" id="showcase" style={{ paddingTop: 0 }}>
        <div className="v2d-head">
          <p className="v2d-eyebrow"><i />See it work.</p>
          <h2>The real app, on Windows and Android.</h2>
          <p>Recordings of VoxelPort itself: set up a server, make it public, share the address.</p>
        </div>
        <div className="v2d-dual">
          <div className="v2d-dual-card">
            <span className="v2d-badge"><Icon kind="window" size={14} /> Desktop</span>
            <h3>Windows app</h3>
            <p>Create a server, press start, make it public. Live stats and a copy-ready address.</p>
            <div className="v2d-dual-media"><Showcase src="/showcase/desktop.mp4" poster="/showcase/app-library-empty.webp" /></div>
          </div>
          <div className="v2d-dual-card">
            <span className="v2d-badge"><Icon kind="phone" size={14} /> Android</span>
            <h3>Android app</h3>
            <p>Run a server on your phone: one Play button installs, starts and shares it. Players, whitelist and plugins, all on your phone.</p>
            <div className="v2d-dual-media is-phone"><Showcase className="v2d-phone" src="/showcase/android.mp4" poster="/showcase/android-poster.webp" /></div>
          </div>
        </div>
      </section>

      {/* DOWNLOAD */}
      <section className="v2d-wrap v2d-sec" id="download" style={{ paddingTop: 0 }}>
        <div className="v2d-head">
          <p className="v2d-eyebrow"><i />Supported platforms.</p>
          <h2>Download VoxelPort.</h2>
          <p>Windows 10 and 11, and Android. Only the person running the server needs the app; everyone else just needs Minecraft.</p>
        </div>
        <div className="v2d-plats">
          <a href={DL_WIN} className={`v2d-plat ${os === 'windows' ? 'rec' : ''}`}>
            <div className="v2d-plat-ico"><Icon kind="window" size={30} /></div>
            <h3>Windows</h3><p>The desktop app: a small download, and where every new feature goes.</p>
            <span className="go">Download .exe ↓</span>
          </a>
          <a href={DL_ANDROID} className={`v2d-plat ${os === 'android' ? 'rec' : ''}`}>
            <div className="v2d-plat-ico"><Icon kind="phone" size={30} /></div>
            <h3>Android</h3><p>Run and manage a server from your phone. Sideloaded APK.</p>
            <span className="go">Download APK ↓</span>
          </a>
        </div>
        <p className="v2d-dlnote">Version, size, checksums and requirements are on the <a href="/download" onClick={go('/download')}>download page</a>. New to installing an APK? Read the <a href={GUIDE_ANDROID} onClick={go(GUIDE_ANDROID)}>Android install guide</a>.</p>
      </section>

      {/* COMMUNITY */}
      <section className="v2d-wrap v2d-sec" style={{ paddingTop: 0 }}>
        <div className="v2d-comm">
          <div>
            <p className="v2d-eyebrow"><i />Built in the open.</p>
            <h2>A small project. An open invitation.</h2>
            <p>Made for people who just want to play together. Find your people, share your builds, or help make VoxelPort better.</p>
            <div className="v2d-cta">
              <a className="v2d-btn v2d-btn-solid" href={DISCORD} target="_blank" rel="noopener noreferrer"><DiscordIcon size={18} />Meet us on Discord <Arrow /></a>
              <a className="v2d-underlink" href={GITHUB_APP} target="_blank" rel="noreferrer">Explore the source <Arrow /></a>
            </div>
          </div>
          <div className="v2d-comm-art" aria-hidden="true">
            <span className="heart">♥</span>
            <span className="stamp">FREE · OPEN SOURCE · YOURS</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="v2d-wrap v2d-sec" style={{ paddingTop: 0 }}>
        <div className="v2d-faq">
          <div>
            <p className="v2d-eyebrow"><i />Before you dig in.</p>
            <h2 style={{ fontSize: '32px', letterSpacing: '-.02em', margin: '0 0 14px' }}>A few good questions.</h2>
            <a className="v2d-underlink" href="/faq" onClick={go('/faq')}>The full FAQ <Arrow /></a>
          </div>
          <div>
            {FAQ.map(([q, a]) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}
          </div>
        </div>
      </section>

      {/* FINAL */}
      <div className="v2d-wrap v2d-final">
        <p>Run the server on your own hardware. Let the relay do the connecting.</p>
        <a className="v2d-btn v2d-btn-solid" href="/download" onClick={go('/download')}>Download VoxelPort <Arrow /></a>
      </div>
    </main>

    <V2Footer />
  </div>;
}
