import { useEffect, useState } from 'react';
import { DiscordIcon } from './ui.jsx';
import { DISCORD, GITHUB_APP, useRelayStatus } from './data.js';
import { navigate, isModifiedClick } from './seo.js';
import { SITE_NAV } from './content.js';
import { ES_NAV, setLanguage, useLanguage } from './language.js';

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
  useEffect(() => {
    if (!open) return;
    const k = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open]);
  const close = () => setOpen(false);
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
          <a className="v2d-status" href="/status" onClick={go('/status', close)}><i className={relay.state} aria-hidden="true" />{relay.state === 'online' ? text('Relays online', 'Relés en línea') : relay.state === 'loading' ? text('Checking', 'Comprobando') : text('Status', 'Estado')}</a>
          <a className="v2d-discord" href={DISCORD} target="_blank" rel="noopener noreferrer"><DiscordIcon size={18} />Discord</a>
        </nav>
        <select className="vp-language" aria-label={text('Language', 'Idioma')} value={locale} onChange={(event) => setLanguage(event.target.value)}>
          <option value="en" lang="en">English</option>
          <option value="es" lang="es">Español</option>
        </select>
        <button className="v2d-burger" aria-expanded={open} aria-controls="v2d-nav" onClick={() => setOpen((v) => !v)}>{open ? text('Close', 'Cerrar') : text('Menu', 'Menú')}</button>
      </div>
    </header>
  </>;
}

export function V2Footer() {
  const { text } = useLanguage();
  return <footer className="v2d-foot">
    <div className="v2d-wrap v2d-foot-in">
      <a className="v2d-brand" href="/" onClick={go('/')} style={{ fontSize: 17 }}><img className="v2d-logo" src="/favicon.svg" width="24" height="24" alt="" /><span>Voxel<b>Port</b></span></a>
      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 24px' }} aria-label={text('Footer', 'Pie de página')}>
        {SITE_NAV.map(([label, href]) => <a key={href} href={href} onClick={go(href)}>{text(label, ES_NAV[href])}</a>)}
        <a href="/compare" onClick={go('/compare')}>{text('Compare', 'Comparar')}</a>
        <a href="/about" onClick={go('/about')}>{text('About', 'Acerca de')}</a>
        <a href="/legal" onClick={go('/legal')}>{text('Legal', 'Aviso legal')}</a>
        <a href={GITHUB_APP} target="_blank" rel="noreferrer">GitHub</a>
        <a href={DISCORD} target="_blank" rel="noopener noreferrer">Discord</a>
      </nav>
      <small>© {new Date().getFullYear()} VoxelPort · built by trazhub · MIT licensed · Not affiliated with Mojang or Microsoft</small>
    </div>
  </footer>;
}

const DIRECTORY = [
  ['Product', 'Producto', [['Download', '/download'], ['Features', '/features'], ['Compare', '/compare'], ["What's new", '/new-app']]],
  ['Resources', 'Recursos', [['Guides', '/guides'], ['Server list', '/servers'], ['FAQ', '/faq']]],
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
