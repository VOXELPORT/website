import { useMemo, useState } from 'react';
import { HOME_COPY, HOME_EXPLORE } from './content.js';
import { DL_ANDROID, DL_WIN, DISCORD, GITHUB_APP, INSTAGRAM, EXAMPLE_ADDR, RELAYS, SPRITES, useDetectedOS, useRelayStatus } from './data.js';
import { ES_NAV, useLanguage } from './language.js';
import { RELEASES } from './release.js';
import { navigate, isModifiedClick } from './seo.js';
import { V2Nav, V2Footer } from './V2Shell.jsx';
import { Pixels, DiscordIcon } from './ui.jsx';
import HeroWorld from './home/HeroWorld.jsx';
import { useUptime, fmtPct } from './uptime.js';
import './home/home.css';

function PageLink({ href, children, ...props }) {
  return <a {...props} href={href} onClick={(event) => {
    if (isModifiedClick(event)) return;
    event.preventDefault();
    navigate(href);
    window.scrollTo(0, 0);
  }}>{children}</a>;
}

function startShowcase(video) {
  if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  video.muted = true;
  video.play().catch(() => {
    // Playback controls remain available when the browser blocks autoplay.
  });
}

const STEPS = [
  ['grass', ['Install', 'Instala'], ['Grab the app for Windows or Android. It’s free, and you join our Discord once.', 'Descarga la aplicación para Windows o Android. Es gratis y te unes a nuestro Discord una vez.']],
  ['bolt', ['Hit Start', 'Pulsa Iniciar'], ['Create or import a server and press Start. Java is handled for you.', 'Crea o importa un servidor y pulsa Iniciar. VoxelPort se encarga de Java.']],
  ['card', ['Copy the address', 'Copia la dirección'], ['VoxelPort hands you an address like this one. Tap it to copy.', 'VoxelPort te da una dirección como esta. Tócala para copiarla.']],
  ['heart', ['Friends join', 'Tus amigos entran'], ['They paste it into Multiplayer → Add Server. That’s it.', 'La pegan en Multijugador → Añadir servidor. Y listo.']],
];

const FEATURES = [
  ['bolt', ['Instant relay', 'Relé instantáneo'], ['Your server dials out to the relay and gets a public address, usually within seconds of pressing Make public. No DNS, no static IP, no router changes.', 'Tu servidor se conecta al relé y obtiene una dirección pública, normalmente segundos después de pulsar Hacer público. Sin DNS, sin IP fija, sin tocar el router.']],
  ['grass', ['Vanilla clients', 'Minecraft normal'], ['Friends join with plain Minecraft. No client mods, no launchers, no patches.', 'Tus amigos entran con Minecraft normal. Sin mods, sin launchers, sin parches.']],
  ['diamond', ['Bedrock too', 'También Bedrock'], ['One switch installs Geyser + Floodgate, so phone, console and PC players share one world.', 'Un interruptor instala Geyser + Floodgate, para que jugadores de móvil, consola y PC compartan un mundo.']],
  ['house', ['Your address', 'Tu dirección'], ['Every server gets a free address like play.voxelport.in:26137. Supporters can claim yourname.voxelport.in, with no port number.', 'Cada servidor recibe una dirección gratis como play.voxelport.in:26137. Quienes apoyan el proyecto pueden reservar tunombre.voxelport.in, sin número de puerto.']],
  ['head1', ['Crash help', 'Ayuda con fallos'], ['If your server stops, VoxelPort says why in plain words and offers the fix. Plus live CPU, RAM and TPS.', 'Si tu servidor se detiene, VoxelPort explica por qué con palabras claras y ofrece la solución. Además, CPU, RAM y TPS en vivo.']],
  ['heart', ['Free & open', 'Libre y gratis'], ['MIT-licensed app and relay. Read the code, fork it, or run your own relay.', 'Aplicación y relé con licencia MIT. Lee el código, haz un fork o ejecuta tu propio relé.']],
];

const MARQUEE = [
  ['No port forwarding', 'Sin abrir puertos'], ['A free .voxelport.in address', 'Una dirección .voxelport.in gratis'], ['Bedrock players too', 'También jugadores de Bedrock'],
  ['Java set up for you', 'Java configurado por ti'], ['Players need no account', 'Los jugadores no necesitan cuenta'], ['Open source, MIT', 'Código abierto, MIT'],
  ['Windows + Android', 'Windows + Android'], ['Works behind CGNAT', 'Funciona detrás de CGNAT'],
];

/** The last 30 days of the uptime monitor, all services together, right on the home page. */
function UptimeStrip() {
  const { intl, text } = useLanguage();
  const u = useUptime();
  if (u.status === 'loading' || u.status === 'error') return null;
  const date = new Date(u.since).toLocaleDateString(intl, { month: 'short', day: 'numeric' });
  const covered = u.windowDays >= 29.5 ? text('last 30 days', 'últimos 30 días') : text('since {date}', 'desde el {date}', { date });
  const headline = u.status === 'ok' ? text('All systems operational', 'Todos los sistemas funcionan')
    : u.status === 'down' ? text('{n} of {total} services down', '{n} de {total} servicios con fallos', { n: u.down.length, total: u.total })
    : text('Monitor not reporting right now', 'El monitor no informa ahora mismo');
  return <PageLink href="/uptime" className={`h4-uptime ${u.status}`}>
    <div className="h4-uptime-top">
      <span className="h4-uptime-state"><i aria-hidden="true" />{headline}</span>
      <span className="h4-uptime-pct">
        <b>{fmtPct(u.relayPct)}</b><span>{text('relay uptime', 'disponibilidad del relé')} · {covered}</span>
      </span>
    </div>
    <div className="h4-uptime-bars" aria-label={text('Daily uptime, last 30 days', 'Disponibilidad diaria, últimos 30 días')}>
      {u.days.map((d) => {
        const p = d.t ? (d.u / d.t) * 100 : null;
        const tone = p === null ? 'none' : p >= 99.9 ? 'good' : p >= 98 ? 'warn' : 'bad';
        return <span key={d.key} className={tone} title={p === null ? `${d.key}: ${text('no data yet', 'sin datos')}` : `${d.key}: ${fmtPct(Math.round(p * 100) / 100)}`} />;
      })}
    </div>
    <div className="h4-uptime-foot">
      <span>{text('{up}/{total} services up now · checked every minute', '{up}/{total} servicios activos · se comprueba cada minuto', { up: u.up, total: u.total })}</span>
      <span className="h4-arrow-link">{text('Full uptime report', 'Informe completo')} <span aria-hidden="true">→</span></span>
    </div>
  </PageLink>;
}

function CopyAddress() {
  const { text } = useLanguage();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EXAMPLE_ADDR);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard blocked: the address is still visible */ }
  };
  return <button type="button" className={`h4-addr${copied ? ' is-copied' : ''}`} onClick={copy}>
    <code>{EXAMPLE_ADDR}</code>
    <span>{copied ? text('Copied!', '¡Copiada!') : text('Copy', 'Copiar')}</span>
  </button>;
}

export default function Landing() {
  const { intl, text } = useLanguage();
  const os = useDetectedOS();
  const relay = useRelayStatus();
  const download = os === 'android' ? DL_ANDROID : DL_WIN;
  // labels inside the 3D world: a new object only when the words change
  const pcLabel = text('Your PC', 'Tu PC');
  const relayLabel = text('VoxelPort relay', 'Relé de VoxelPort');
  const friendsLabel = text('Your friends', 'Tus amigos');
  const labels = useMemo(() => ({ pc: pcLabel, relay: relayLabel, friends: friendsLabel }), [pcLabel, relayLabel, friendsLabel]);

  const live = relay.state === 'online';
  const fmt = (n) => (n == null ? '—' : n.toLocaleString(intl));

  return <div className="v2d vp-home h4" id="top">
    <V2Nav />

    <main id="main-content" tabIndex={-1}>
      {/* ───────────── hero: the world ───────────── */}
      <section className="h4-hero" aria-labelledby="vp-title">
        <div className="h4-backdrop" aria-hidden="true" />
        <HeroWorld labels={labels} />
        <div className="h4-scrim" aria-hidden="true" />
        <div className="h4-wrap h4-hero-in">
          <div className="h4-intro">
            <PageLink href="/status" className={`h4-live ${relay.state}`}>
              <i aria-hidden="true" />
              {live
                ? <>{text('Relays online', 'Relés en línea')}<b>{fmt(relay.tunnels)}</b>{text('servers live', 'servidores activos')}</>
                : text(...HOME_COPY.category)}
            </PageLink>
            <h1 id="vp-title">Voxel<span>Port</span><em>.</em></h1>
            <p className="h4-tagline">{text(...HOME_COPY.tagline)}</p>
            <p className="h4-lede">{text(...HOME_COPY.intro)}</p>
            <div className="h4-actions">
              <PageLink href="/download" className="h4-btn h4-btn-primary">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0-5-5m5 5 5-5M4 19h16" /></svg>
                {text(...HOME_COPY.download)}
              </PageLink>
              <a href="#showcase" className="h4-btn">{text(...HOME_COPY.seeApp)}</a>
            </div>
            <ul className="h4-facts">
              <li>{text(...HOME_COPY.crossplay)}</li>
              <li>{text(...HOME_COPY.openSource)}</li>
              <li>{text(...HOME_COPY.playerAccounts)}</li>
            </ul>
          </div>
          <aside className="h4-release">
            <p className="h4-kicker">{text(...HOME_COPY.releaseLabel)}</p>
            <PageLink className="h4-release-title" href="/new-app">VoxelPort {RELEASES.windows.version}</PageLink>
            <p>{text(...HOME_COPY.releaseIntro)}</p>
            <PageLink className="h4-arrow-link" href="/new-app">{text(...HOME_COPY.releaseLink)} <span aria-hidden="true">→</span></PageLink>
          </aside>
        </div>
        <p className="h4-hint" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M9 11V5a2 2 0 1 1 4 0v5m0-1a2 2 0 1 1 4 0v2m0-1a2 2 0 1 1 4 0v4a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-3.4L4.3 14a2 2 0 0 1 3.4-2L9 14" /></svg>
          {text('Drag to look around · click the beacon or a friend', 'Arrastra para mirar · toca la baliza o a un amigo')}
        </p>
      </section>

      {/* ───────────── marquee ───────────── */}
      <div className="h4-marquee" aria-label={text('Highlights', 'Lo más destacado')}>
        <div className="h4-marquee-track">
          {[0, 1].map((copy) => <ul key={copy} aria-hidden={copy === 1 || undefined}>
            {MARQUEE.map(([en, es]) => <li key={en}><i aria-hidden="true" />{text(en, es)}</li>)}
          </ul>)}
        </div>
      </div>

      {/* ───────────── how it works ───────────── */}
      <section className="h4-sec" id="how" aria-labelledby="h4-how-title">
        <div className="h4-wrap">
          <header className="h4-head rv">
            <p className="h4-kicker">{text('How it works', 'Cómo funciona')}</p>
            <h2 id="h4-how-title">{text('From your PC to your friends in four steps.', 'De tu PC a tus amigos en cuatro pasos.')}</h2>
          </header>
          <ol className="h4-steps">
            {STEPS.map(([sprite, title, desc], i) => <li key={sprite} className="h4-step rv" style={{ '--d': `${i * 90}ms` }} data-tilt>
              <span className="h4-step-n">{String(i + 1).padStart(2, '0')}</span>
              <div className="h4-step-art"><Pixels rows={SPRITES[sprite]} size={4} /></div>
              <h3>{text(...title)}</h3>
              <p>{text(...desc)}</p>
              {i === 2 && <CopyAddress />}
            </li>)}
          </ol>
        </div>
      </section>

      {/* ───────────── the app ───────────── */}
      <section className="h4-sec h4-show-sec" id="showcase" aria-labelledby="vp-feature-title">
        <div className="h4-wrap h4-show">
          <div className="h4-show-copy rv">
            <p className="h4-kicker">{text(...HOME_COPY.walkthroughLabel)}</p>
            <h2 id="vp-feature-title">{text(...HOME_COPY.walkthroughTitle)}</h2>
            <p className="h4-sub">{text(...HOME_COPY.walkthroughIntro)}</p>
            <div className="h4-show-card" id="workflow">
              <p className="h4-kicker">{text(...HOME_COPY.platforms)}</p>
              <h3>{text(...HOME_COPY.managementTitle)}</h3>
              <p>{text(...HOME_COPY.managementIntro)}</p>
              <div className="h4-actions" id="download">
                <a href={download} className="h4-btn h4-btn-primary">{text(...HOME_COPY.downloadFor, { os: os === 'android' ? 'Android' : 'Windows' })}</a>
                <PageLink href="/download" className="h4-btn">{text(...HOME_COPY.allDownloads)}</PageLink>
              </div>
              <p className="h4-note">{text(...HOME_COPY.discordRequirement)}</p>
            </div>
          </div>
          <div className="h4-device-wrap rv" style={{ '--d': '120ms' }}>
            <div className="h4-device" data-tilt data-tilt-max="10">
              <div className="h4-device-bar"><span /><span /><span /><b>VoxelPort</b></div>
              <video ref={startShowcase} controls muted playsInline loop preload="none" poster="/showcase/app-share-address.webp" aria-label={text(...HOME_COPY.videoLabel)}>
                <source src="/showcase/desktop.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="h4-device-glow" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ───────────── features ───────────── */}
      <section className="h4-sec" id="why" aria-labelledby="h4-feat-title">
        <div className="h4-wrap">
          <header className="h4-head h4-head-row rv">
            <div>
              <p className="h4-kicker">{text('Why VoxelPort', 'Por qué VoxelPort')}</p>
              <h2 id="h4-feat-title">{text('Everything the host needs. Nothing the player has to install.', 'Todo lo que necesita quien aloja. Nada que instalar para quien juega.')}</h2>
            </div>
            <PageLink href="/features" className="h4-arrow-link">{text('All features', 'Todas las funciones')} <span aria-hidden="true">→</span></PageLink>
          </header>
          <ul className="h4-features">
            {FEATURES.map(([sprite, title, desc], i) => <li key={sprite} className="h4-feature rv" style={{ '--d': `${(i % 3) * 80}ms` }} data-tilt data-spot>
              <div className="h4-feature-art"><Pixels rows={SPRITES[sprite]} size={4} /></div>
              <h3>{text(...title)}</h3>
              <p>{text(...desc)}</p>
            </li>)}
          </ul>
        </div>
      </section>

      {/* ───────────── the connection, live ───────────── */}
      <section className="h4-sec" id="architecture" aria-labelledby="h4-net-title">
        <div className="h4-wrap">
          <div className="h4-net rv">
            <div className="h4-net-copy">
              <p className="h4-kicker">{text('Under the hood', 'Por dentro')}</p>
              <h2 id="h4-net-title">{text('Your router stays shut.', 'Tu router sigue cerrado.')}</h2>
              <p>{text(...HOME_COPY.connection)}</p>
              <dl className="h4-stats">
                <div><dt>{text('servers online now', 'servidores en línea ahora')}</dt><dd>{live ? fmt(relay.tunnels) : '—'}</dd></div>
                <div><dt>{text('players connected', 'jugadores conectados')}</dt><dd>{live ? fmt(relay.players) : '—'}</dd></div>
                <div><dt>{text('relay regions', 'regiones de relé')}</dt><dd>{RELAYS.length}</dd></div>
              </dl>
              <PageLink href="/status" className="h4-arrow-link">{text('Live relay status', 'Estado del relé en vivo')} <span aria-hidden="true">→</span></PageLink>
            </div>
            <div className="h4-net-art" aria-hidden="true">
              <svg viewBox="0 0 420 300">
                <defs>
                  <linearGradient id="h4g" x1="0" x2="1"><stop offset="0" stopColor="#a4e78b" /><stop offset="1" stopColor="#4fd4e4" /></linearGradient>
                </defs>
                <path className="h4-wire" d="M70 220 C 130 220, 150 80, 210 80" />
                <path className="h4-wire" d="M210 80 C 270 80, 290 60, 350 60" />
                <path className="h4-wire" d="M210 80 C 270 80, 290 150, 350 150" />
                <path className="h4-wire" d="M210 80 C 270 80, 290 240, 350 240" />
                <path className="h4-pulse" d="M70 220 C 130 220, 150 80, 210 80" />
                <path className="h4-pulse b" d="M210 80 C 270 80, 290 60, 350 60" />
                <path className="h4-pulse c" d="M210 80 C 270 80, 290 150, 350 150" />
                <path className="h4-pulse d" d="M210 80 C 270 80, 290 240, 350 240" />
              </svg>
              <span className="h4-node pc"><Pixels rows={SPRITES.house} size={3} />{text('Your device', 'Tu dispositivo')}</span>
              <span className="h4-node relay"><Pixels rows={SPRITES.diamond} size={3} />{text('Relay', 'Relé')}</span>
              <span className="h4-node f f1"><Pixels rows={SPRITES.head1} size={2.4} /></span>
              <span className="h4-node f f2"><Pixels rows={SPRITES.head1} size={2.4} /></span>
              <span className="h4-node f f3"><Pixels rows={SPRITES.head1} size={2.4} /></span>
              <span className="h4-lock"><Pixels rows={SPRITES.lock} size={2.6} />{text('no open ports', 'sin puertos abiertos')}</span>
            </div>
            <UptimeStrip />
          </div>
        </div>
      </section>

      {/* ───────────── explore ───────────── */}
      <section className="h4-sec h4-explore" aria-labelledby="vp-explore-title">
        <div className="h4-wrap">
          <header className="h4-head rv">
            <p className="h4-kicker">{text('Keep going', 'Sigue explorando')}</p>
            <h2 id="vp-explore-title">{text(...HOME_COPY.exploreTitle)}</h2>
          </header>
          <ul className="h4-directory">
            {HOME_EXPLORE.map(([title, description, spanish, href], i) => <li key={href} className="rv" style={{ '--d': `${i * 60}ms` }}>
              <PageLink href={href} data-spot>
                <strong>{text(title, ES_NAV[href])}</strong>
                <span>{text(description, spanish)}</span>
                <i aria-hidden="true">→</i>
              </PageLink>
            </li>)}
          </ul>
        </div>
      </section>

      {/* ───────────── final call ───────────── */}
      <section className="h4-final" aria-labelledby="h4-final-title">
        <div className="h4-final-blocks" aria-hidden="true">
          {['grass', 'diamond', 'bolt', 'heart', 'house', 'card'].map((s, i) => <span key={s} className={`b${i}`}><Pixels rows={SPRITES[s]} size={4} /></span>)}
        </div>
        <div className="h4-wrap h4-final-in rv">
          <h2 id="h4-final-title">{text(...HOME_COPY.tagline)}</h2>
          <p>{text('Free, open source, and ready in a few clicks.', 'Gratis, de código abierto y listo en unos clics.')}</p>
          <div className="h4-actions">
            <a href={download} className="h4-btn h4-btn-primary h4-btn-lg">{text(...HOME_COPY.downloadFor, { os: os === 'android' ? 'Android' : 'Windows' })}</a>
            <a href={DISCORD} className="h4-btn h4-btn-lg h4-btn-discord" target="_blank" rel="noopener noreferrer"><DiscordIcon size={20} />Discord</a>
          </div>
          <div className="h4-social">
            <span>{text(...HOME_COPY.socialTitle)}</span>
            <a href={DISCORD}>Discord</a>
            <a href={GITHUB_APP}>GitHub</a>
            <a href={INSTAGRAM}>Instagram</a>
          </div>
        </div>
      </section>
    </main>

    <V2Footer />
  </div>;
}
