import { useEffect, useState } from 'react';
import { DiscordIcon } from './ui.jsx';
import { DISCORD, GITHUB_APP, useRelayStatus } from './data.js';
import { navigate, isModifiedClick } from './seo.js';
import { SITE_NAV } from './content.js';

const go = (href, after) => (e) => {
  if (isModifiedClick(e)) return;
  if (href.startsWith('/dl/')) return;
  e.preventDefault();
  if (after) after();
  navigate(href);
  window.scrollTo(0, 0);
};

export function V2Bg() {
  return <><div className="v2d-bgfx" aria-hidden="true" /><div className="v2d-grid" aria-hidden="true" /></>;
}

export function V2Nav({ onLogo }) {
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
    <a className="v2d-skip" href="#main-content">Skip to content</a>
    <a className="v2d-strip" href="/new-app" onClick={go('/new-app')}><b>VoxelPort has a new app.</b> Already using it? Move in one minute and keep your servers →</a>
    <header className="v2d-top">
      <div className="v2d-wrap v2d-top-in">
        <a className="v2d-brand" href="/" onClick={(e) => { if (onLogo && !isModifiedClick(e)) onLogo(e); else go('/')(e); }}><img className="v2d-logo" src="/favicon.svg" width="30" height="30" alt="" /><span>Voxel<b>Port</b></span></a>
        <nav id="v2d-nav" className={`v2d-nav${open ? ' open' : ''}`} aria-label="Main">
          {SITE_NAV.map(([label, href]) => {
            const active = path === href || (href === '/guides' && path.startsWith('/guides/'));
            return <a key={href} href={href} className={active ? 'active' : undefined} aria-current={active ? 'page' : undefined} onClick={go(href, close)}>{label}</a>;
          })}
          <a className="v2d-status" href="/status" onClick={go('/status', close)}><i className={relay.state} aria-hidden="true" />{relay.state === 'online' ? 'Relays online' : relay.state === 'loading' ? 'Checking' : 'Status'}</a>
          <a className="v2d-discord" href={DISCORD} target="_blank" rel="noopener noreferrer"><DiscordIcon size={18} />Discord</a>
        </nav>
        <button className="v2d-burger" aria-expanded={open} aria-controls="v2d-nav" onClick={() => setOpen((v) => !v)}>{open ? 'Close' : 'Menu'}</button>
      </div>
    </header>
  </>;
}

export function V2Footer() {
  return <footer className="v2d-foot">
    <div className="v2d-wrap v2d-foot-in">
      <a className="v2d-brand" href="/" onClick={go('/')} style={{ fontSize: 17 }}><img className="v2d-logo" src="/favicon.svg" width="24" height="24" alt="" /><span>Voxel<b>Port</b></span></a>
      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 24px' }} aria-label="Footer">
        {SITE_NAV.map(([label, href]) => <a key={href} href={href} onClick={go(href)}>{label}</a>)}
        <a href="/compare" onClick={go('/compare')}>Compare</a>
        <a href="/about" onClick={go('/about')}>About</a>
        <a href="/legal" onClick={go('/legal')}>Legal</a>
        <a href={GITHUB_APP} target="_blank" rel="noreferrer">GitHub</a>
        <a href={DISCORD} target="_blank" rel="noopener noreferrer">Discord</a>
      </nav>
      <small>© {new Date().getFullYear()} VoxelPort · built by trazhub · MIT licensed · Not affiliated with Mojang or Microsoft</small>
    </div>
  </footer>;
}
