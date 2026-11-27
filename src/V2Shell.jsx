import { useEffect, useRef, useState } from 'react';
import { DiscordIcon } from './ui.jsx';
import { DISCORD, GITHUB_APP, useRelayStatus } from './data.js';
import { navigate, isModifiedClick } from './seo.js';
import { SITE_NAV } from './content.js';
import { ES_NAV, LANGUAGES, setLanguage, useLanguage } from './language.js';
import { useUptime, fmtPct } from './uptime.js';

/** Live uptime, always in the header: green when every service answered its last check. */
function UptimePill({ onNavigate }) {
  const { text } = useLanguage();
  const u = useUptime();
  const label = u.status === 'ok' ? text('All systems up', 'Todo funcionando')
    : u.status === 'down' ? text('{n} down', '{n} con fallos', { n: u.down.length })
    : u.status === 'stale' ? text('Monitor paused', 'Monitor en pausa')
    : text('Uptime', 'Disponibilidad');
  const title = u.status === 'ok' ? text('{up} of {total} services answered their last check', '{up} de {total} servicios respondieron', { up: u.up, total: u.total })
    : u.status === 'down' ? u.down.map((t) => t.label).join(', ')
    : text('Uptime report', 'Informe de disponibilidad');
  return <a className={`v2d-uptime ${u.status}`} href="/uptime" onClick={go('/uptime', onNavigate)} title={title}>
    <i aria-hidden="true" />
    <span className="v2d-uptime-label">{label}</span>
    {u.relayPct != null && <b>{fmtPct(u.relayPct)}</b>}
  </a>;
}

const go = (href, after) => (e) => {
  if (isModifiedClick(e)) return;
  if (href.startsWith('/dl/')) return;
  e.preventDefault();
  if (after) after();
  navigate(href);
  window.scrollTo(0, 0);
};

export function V2Nav({ onLogo }) {
  const { locale, text } = useLanguage();
  const [open, setOpen] = useState(false);
  const relay = useRelayStatus();
  const path = typeof window !== 'undefined' ? (window.location.pathname.replace(/\/+$/, '') || '/') : '/';
  const moreRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const k = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open]);
  useEffect(() => {
    const onDocClick = (e) => { if (moreRef.current && !moreRef.current.contains(e.target)) moreRef.current.open = false; };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);
  const close = () => setOpen(false);
  const closeMore = () => { if (moreRef.current) moreRef.current.open = false; close(); };
  return <>
    <a className="v2d-skip" href="#main-content">{text('Skip to content', 'Ir al contenido')}</a>
    <a className="v2d-strip" href="/new-app" onClick={go('/new-app')}><b>{text('VoxelPort has a new app.', 'VoxelPort tiene una nueva aplicación.')}</b>{' '}{text('Keep your servers when you upgrade.', 'Conserva tus servidores al actualizar.')}</a>
    <header className="v2d-top">
      <div className="v2d-wrap v2d-top-in">
        <a className="v2d-brand" href="/" onClick={(e) => { if (onLogo && !isModifiedClick(e)) onLogo(e); else go('/')(e); }}><img className="v2d-logo" src="/favicon.svg" width="30" height="30" alt="" /><span>Voxel<b>Port</b></span></a>
        <nav id="v2d-nav" className={`v2d-nav${open ? ' open' : ''}`} aria-label={text('Main', 'Principal')}>
          {SITE_NAV.map(([label, href]) => {
            const active = path === href || (href === '/guides' && path.startsWith('/guides/'));
            return <a key={href} href={href} className={active ? 'active' : undefined} aria-current={active ? 'page' : undefined} onClick={go(href, close)}>{text(label, ES_NAV[href])}</a>;
          })}
          <details className="v2d-more" ref={moreRef}>
            <summary><i className={relay.state} aria-hidden="true" />{text('More', 'Más')}</summary>
            <div className="v2d-more-menu" role="menu">
              <a href="/status" onClick={go('/status', closeMore)} role="menuitem"><i className={relay.state} aria-hidden="true" />{relay.state === 'online' ? text('Relays online', 'Relés en línea') : relay.state === 'loading' ? text('Checking relays', 'Comprobando relés') : text('Relay status', 'Estado del relé')}</a>
              <a href="/uptime" onClick={(e) => go('/uptime', closeMore)(e)} role="menuitem"><i aria-hidden="true" />{text('Uptime report', 'Informe de disponibilidad')}</a>
              <a href={DISCORD} target="_blank" rel="noopener noreferrer" role="menuitem" onClick={closeMore}><DiscordIcon size={18} />Discord</a>
            </div>
          </details>
        </nav>
        <UptimePill onNavigate={close} />
        <select className="vp-language" aria-label={text('Language', 'Idioma')} value={locale} onChange={(event) => setLanguage(event.target.value)}>
          {LANGUAGES.map((l) => <option key={l.code} value={l.code} lang={l.intl}>{l.label}</option>)}
        </select>
        <button className="v2d-burger" aria-expanded={open} aria-controls="v2d-nav" onClick={() => setOpen((v) => !v)}>{open ? text('Close', 'Cerrar') : text('Menu', 'Menú')}</button>
      </div>
    </header>
  </>;
}

export function V2Footer() {
  const { text } = useLanguage();
  return <footer className="v2d-foot">
    <div className="v2d-wrap v2d-foot-grid">
      <div className="v2d-foot-brand">
        <a className="v2d-brand" href="/" onClick={go('/')}><img className="v2d-logo" src="/favicon.svg" width="30" height="30" alt="" /><span>Voxel<b>Port</b></span></a>
        <p>{text('Your world. Your hardware.', 'Tu mundo. Tu equipo.')}</p>
        <div className="v2d-foot-social">
          <a href={DISCORD} target="_blank" rel="noopener noreferrer"><DiscordIcon size={16} />Discord</a>
          <a href={GITHUB_APP} target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>
      <nav className="v2d-foot-cols" aria-label={text('Footer', 'Pie de página')}>
        {DIRECTORY.map(([name, spanish, links]) => <div key={name}>
          <h2>{text(name, spanish)}</h2>
          <ul>{links.map(([label, href]) => <li key={href}><a href={href} onClick={go(href)}>{text(label, ES_NAV[href])}</a></li>)}</ul>
        </div>)}
      </nav>
    </div>
    <div className="v2d-wrap v2d-foot-base">
      <small>© {new Date().getFullYear()} VoxelPort · built by trazhub · MIT licensed · Not affiliated with Mojang or Microsoft</small>
    </div>
  </footer>;
}

const DIRECTORY = [
  ['Product', 'Producto', [['Download', '/download'], ['Features', '/features'], ['Compare', '/compare'], ["What's new", '/new-app']]],
  ['Resources', 'Recursos', [['Guides', '/guides'], ['Blog', '/blog'], ['Server list', '/servers'], ['FAQ', '/faq']]],
  ['Project', 'Proyecto', [['Community', '/community'], ['About', '/about'], ['Team', '/team'], ['Support', '/support'], ['Relay status', '/status'], ['Uptime', '/uptime'], ['Legal', '/legal']]],
];

export function V2Directory() {
  const { text } = useLanguage();
  const path = window.location.pathname.replace(/\/+$/, '');
  return <aside className="vp-directory-rail">
    <nav aria-label={text('Site directory', 'Directorio del sitio')}>
      {DIRECTORY.map(([name, spanish, links]) => <div key={name}>
        <h2>{text(name, spanish)}</h2>
        <ul>{links.map(([label, href]) => <li key={href}>
          <a href={href} aria-current={path === href ? 'page' : undefined} onClick={go(href)}>{text(label, ES_NAV[href])}</a>
        </li>)}</ul>
      </div>)}
    </nav>
  </aside>;
}
