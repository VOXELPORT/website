import { DiscordIcon } from './ui.jsx';
import { useDetectedOS, DL_WIN, DL_ANDROID, GITHUB_APP, DISCORD } from './data.js';
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
  { icon: 'link', tag: '01 / CONNECT', title: 'Skip the router rituals.', text: 'Your server gets a public address with no port forwarding. Works behind CGNAT and on networks you do not control.' },
  { icon: 'diamond', tag: '02 / PLAY TOGETHER', title: 'Different devices. Same dirt.', text: 'One switch adds Geyser and Floodgate. Java, Bedrock, phone and console friends all join the same world, with plain Minecraft.' },
  { icon: 'shield', tag: '03 / KEEP CONTROL', title: 'Your server means yours.', text: 'Vanilla, Paper, Fabric or your own jar. Your files stay on your hardware. Live console, CPU, RAM and TPS.' },
];
const PROOF = ['No port forwarding', 'Java + Bedrock', 'Players need no account', 'Open source', 'Free forever'];
const FAQ = [
  ['Is VoxelPort really free?', 'Yes. The app and relay are free and open source under the MIT license. Optional supporter perks help keep the project running. You can host and play without paying.'],
  ['Do my friends need to install anything?', 'Only Minecraft. Players connect to your public address through Multiplayer. VoxelPort runs on the host device.'],
  ['Can Java and Bedrock friends play together?', 'Yes. Turn on Geyser and Floodgate in VoxelPort to let Bedrock players (phone, console, Windows 10) join your Java server.'],
  ['Does my computer need to stay on?', 'Yes. Your world runs on your own PC or Android phone, so that device must stay on while friends play. Performance depends on your hardware and connection.'],
];

function Showcase({ src, poster, className }) {
  return <video className={className} src={src} poster={poster} autoPlay loop muted playsInline aria-label="VoxelPort app walkthrough" />;
}

export default function Landing() {
  const os = useDetectedOS();
  const cta = os === 'android' ? 'Get it for Android' : 'Download for Windows';
  const download = os === 'android' ? DL_ANDROID : DL_WIN;
  return <div className="v2d" id="top">
    <V2Bg />
    <V2Nav />

    <main id="main-content" tabIndex={-1}>
      {/* HERO */}
      <section className="v2d-wrap v2d-hero">
        <div>
          <p className="v2d-eyebrow"><i />Small app. Big adventures.</p>
          <h1>Host Minecraft.<br />Invite everyone.<br /><span className="g">No port forwarding.</span></h1>
          <p className="v2d-lede">Turn your PC or Android phone into a Minecraft server in a couple of clicks. Your friends join with plain Minecraft, on Java or Bedrock. You keep control of your world.</p>
          <div className="v2d-cta">
            <a className="v2d-btn v2d-btn-solid" href={download} onClick={os === 'android' ? go(download) : undefined}><Icon kind={os === 'android' ? 'phone' : 'window'} size={18} />{cta}</a>
            <a className="v2d-btn v2d-btn-ghost" href="/download" onClick={go('/download')}>All platforms <Arrow /></a>
          </div>
          <p className="v2d-free"><b>✓</b> Free &amp; open source <i /> Join our Discord to host <i /> No card</p>
        </div>
        <div className="v2d-show">
          <div className="v2d-show-frame">
            <div className="v2d-show-bar"><span /><span /><span /><b>VoxelPort</b></div>
            <Showcase src="/showcase/desktop.mp4" poster="/showcase/desktop.gif" />
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
          <h2>Good worlds deserve good company.</h2>
          <p>From the first dirt hut to your next big build, VoxelPort gets everyone into the same world.</p>
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

      {/* DUAL SHOWCASE */}
      <section className="v2d-wrap v2d-sec" id="showcase" style={{ paddingTop: 0 }}>
        <div className="v2d-head">
          <p className="v2d-eyebrow"><i />See it work.</p>
          <h2>One app. Every platform.</h2>
          <p>The same simple flow on your desktop and in your pocket: set up a server, make it public, share the address.</p>
        </div>
        <div className="v2d-dual">
          <div className="v2d-dual-card">
            <span className="v2d-badge"><Icon kind="window" size={14} /> Desktop</span>
            <h3>Windows app</h3>
            <p>Create a server, press start, make it public. Live stats and a copy-ready address.</p>
            <div className="v2d-dual-media"><Showcase src="/showcase/desktop.mp4" poster="/showcase/desktop.gif" /></div>
          </div>
          <div className="v2d-dual-card">
            <span className="v2d-badge"><Icon kind="phone" size={14} /> Android</span>
            <h3>Host from your phone</h3>
            <p>One Play button installs, starts and shares. Players, whitelist and plugins, all on your phone.</p>
            <div className="v2d-dual-media is-phone"><Showcase className="v2d-phone" src="/showcase/android.mp4" poster="/showcase/android.gif" /></div>
          </div>
        </div>
      </section>

      {/* DOWNLOAD */}
      <section className="v2d-wrap v2d-sec" id="download" style={{ paddingTop: 0 }}>
        <div className="v2d-head">
          <p className="v2d-eyebrow"><i />Pick your platform.</p>
          <h2>Your next session starts here.</h2>
          <p>One download for the host. Just Minecraft for everyone else.</p>
        </div>
        <div className="v2d-plats">
          <a href={DL_WIN} className={`v2d-plat ${os === 'windows' ? 'rec' : ''}`}>
            <div className="v2d-plat-ico"><Icon kind="window" size={30} /></div>
            <h3>Windows</h3><p>The new app: small, fast, and where every new feature goes.</p>
            <span className="go">Download .exe ↓</span>
          </a>
          <a href={DL_ANDROID} onClick={go(DL_ANDROID)} className={`v2d-plat ${os === 'android' ? 'rec' : ''}`}>
            <div className="v2d-plat-ico"><Icon kind="phone" size={30} /></div>
            <h3>Android</h3><p>A whole Minecraft server in your pocket.</p>
            <span className="go">Get the install guide ↗</span>
          </a>
        </div>
        <p className="v2d-dlnote">Installation help, requirements and release notes on the <a href="/download" onClick={go('/download')}>download page</a>.</p>
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
        <p>The best part of Minecraft is who you share it with.</p>
        <a className="v2d-btn v2d-btn-solid" href="/download" onClick={go('/download')}>Let us get you connected <Arrow /></a>
      </div>
    </main>

    <V2Footer />
  </div>;
}
