import { useState } from 'react';
import { PAL, DL_WIN, DL_WIN_PORTABLE, DL_LINUX, GITHUB_APP, GITHUB_ORG } from './data.js';

// ─── Pixel art ────────────────────────────────────────────────────────────────

/** Renders a pixel sprite from rows of palette chars ('.' = transparent). */
export function Pixels({ rows, size = 4, title, style, className }) {
  const w = rows[0].length;
  const h = rows.length;
  const rects = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const c = row[x];
      if (c !== '.' && PAL[c]) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={PAL[c]} />);
    }
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w * size} height={h * size} shapeRendering="crispEdges"
      role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}
      style={style} className={className}>
      {rects}
    </svg>
  );
}

export function Logo({ onClick }) {
  return (
    <a className="logo" href="#top" onClick={onClick} aria-label="VoxelPort home">
      <img src="/favicon.svg" width="38" height="38" alt="" style={{ imageRendering: 'pixelated', display: 'block' }} />
      <span className="logo-word">VOXEL<span>PORT</span></span>
    </a>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

export function Nav({ links, relay, onLogo }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <Logo onClick={onLogo} />
        <ul className={`nav-links${open ? ' open' : ''}`} onClick={() => setOpen(false)}>
          {links.map(([label, href, onClick]) => (
            <li key={label}><a href={href} onClick={onClick}>{label}</a></li>
          ))}
          {relay && (
            <li>
              <a href="#/status" onClick={(e) => { e.preventDefault(); window.location.hash = '#/status'; }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span className={`live-dot ${relay.state === 'online' ? '' : relay.state === 'loading' ? 'wait' : 'off'}`} />
                {relay.state === 'online' ? 'Relay online' : relay.state === 'loading' ? 'Relay…' : 'Relay offline'}
              </a>
            </li>
          )}
        </ul>
        <button className="nav-toggle" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>{open ? '×' : '≡'}</button>
      </div>
    </nav>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

const FOOTER_COLS = [
  { title: 'Product', links: [['Features', '#features'], ['How it works', '#how'], ['Direct routing', '#direct'], ['Compare', '#compare']] },
  { title: 'Get it', links: [['Windows app', DL_WIN], ['Portable .exe', DL_WIN_PORTABLE], ['Linux app', DL_LINUX]] },
  { title: 'Project', links: [['App source', GITHUB_APP], ['All repos', GITHUB_ORG], ['Relay status', '#/status']] },
  { title: 'Legal', links: [['MIT License', '#/legal#mit-license'], ['Privacy', '#/legal#privacy-notice'], ['Terms', '#/legal#terms-of-use'], ['Trademarks', '#/legal#trademarks']] },
];

export function Footer({ onHome }) {
  const go = (href) => (e) => {
    if (href.startsWith('#/')) { e.preventDefault(); window.location.hash = href; return; }
    if (href.startsWith('#') && onHome) { onHome(href); }
  };
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/favicon.svg" width="38" height="38" alt="" style={{ imageRendering: 'pixelated', display: 'block' }} />
              <span className="logo-word" style={{ color: 'var(--paper)' }}>VOXEL<span style={{ color: 'var(--grass)' }}>PORT</span></span>
            </div>
            <p style={{ marginTop: 16, maxWidth: 300, fontSize: 15, lineHeight: 1.6, color: 'rgba(243,235,220,.78)' }}>
              Free, open-source relay for Minecraft: Java Edition. No port forwarding, no signup — your friends join with vanilla Minecraft.
            </p>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map(([label, href]) => {
                  const external = !href.startsWith('#');
                  return (
                    <li key={label}>
                      <a href={href} onClick={external ? undefined : go(href)} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>{label}</a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-base">
          <span>© 2026 VoxelPort · built by trazhub</span>
          <span>Not affiliated with Mojang or Microsoft · MIT License</span>
        </div>
      </div>
    </footer>
  );
}
