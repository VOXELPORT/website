import { useState } from 'react';
import { PAL, DL_STORE, DL_WIN, DL_LINUX, DL_ANDROID, GITHUB_APP, GITHUB_ORG, INSTAGRAM, DISCORD } from './data.js';
import { DISCORD_LINE } from './community.js';
import { navigate } from './seo.js';
import { GUIDES, guidePath } from './guides.js';

/** Click handler for same-site links: client-side navigation for paths ("/servers"). */
function internal(href) {
  // /dl/ paths are real file downloads (served by the web server), not routes.
  return href.startsWith('/') && !href.startsWith('/dl/') ? (e) => { e.preventDefault(); navigate(href); } : undefined;
}

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

// ─── Discord ──────────────────────────────────────────────────────────────────

/** The Discord logo mark (single colour, takes the text colour). */
export function DiscordIcon({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" focusable="false" style={{ flex: 'none' }}>
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  );
}

/** A button to the Discord invite. `tone`: 'blurple' (default) or 'cream' (on the blurple banner). */
export function DiscordButton({ children = 'JOIN THE DISCORD', tone = 'blurple', small = false, style, className = '' }) {
  return (
    <a className={`btn ${tone === 'cream' ? 'cream' : 'discord'} ${small ? 'sm' : ''} ${className}`} href={DISCORD} target="_blank" rel="noopener noreferrer" style={style}>
      <DiscordIcon size={small ? 20 : 26} />{children}
    </a>
  );
}

/** The Discord invitation shown above the footer on every page. */
export function DiscordBand() {
  return (
    <section className="discord-band" aria-labelledby="discord-band-title">
      <div className="wrap discord-inner">
        <div className="discord-copy">
          <span className="kicker">Our home base</span>
          <h2 id="discord-band-title" className="h-display">
            JOIN THE <span className="c-title" data-text="DISCORD" style={{ '--title-off': '5px', '--title-stroke': '3px' }}>DISCORD</span>
          </h2>
          <p>{DISCORD_LINE} It’s free, and you don’t need it to use VoxelPort.</p>
        </div>
        <div className="discord-actions">
          <DiscordButton tone="cream">JOIN THE DISCORD</DiscordButton>
          <a className="discord-more" href="/community" onClick={internal('/community')}>What’s inside →</a>
        </div>
      </div>
    </section>
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
            <li key={label}><a href={href} onClick={onClick || internal(href)}>{label}</a></li>
          ))}
          <li className="nav-cta">
            <a className="nav-discord" href={DISCORD} target="_blank" rel="noopener noreferrer"><DiscordIcon size={18} />Discord</a>
          </li>
          {relay && (
            <li>
              <a href="/status" onClick={internal('/status')}
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
  { title: 'Explore', links: [['Features', '/features'], ['How it works', '#how'], ['Compare', '/compare'], ['FAQ', '/faq'], ['Server list', '/servers'], ['Relay status', '/status']] },
  { title: 'Guides', links: GUIDES.slice(0, 5).map((g) => [g.short, guidePath(g)]).concat([['All guides', '/guides']]) },
  { title: 'Get it', links: [['Download page', '/download'], ['Microsoft Store', DL_STORE], ['Windows (direct .exe)', DL_WIN], ['Android (APK)', DL_ANDROID], ['Linux app', DL_LINUX]] },
  { title: 'Community', links: [['Discord', DISCORD], ['About the Discord', '/community'], ['Instagram', INSTAGRAM], ['App source', GITHUB_APP], ['All repos', GITHUB_ORG], ['Support (UPI)', '/support']] },
  { title: 'Legal', links: [['MIT License', '/legal#mit-license'], ['Privacy', '/legal#privacy-notice'], ['Terms', '/legal#terms-of-use'], ['Trademarks', '/legal#trademarks']] },
];

export function Footer({ onHome, band = true }) {
  const go = (href) => (e) => {
    if (href.startsWith('/dl/')) return; // real file download, let the browser handle it
    if (href.startsWith('/')) { e.preventDefault(); navigate(href); return; }
    // A section of the landing page: scroll there, or go home first.
    if (href.startsWith('#')) {
      if (onHome) onHome(href);
      else { e.preventDefault(); navigate('/' + href); }
    }
  };
  return (
    <>
    {band && <DiscordBand />}
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/favicon.svg" width="38" height="38" alt="" style={{ imageRendering: 'pixelated', display: 'block' }} />
              <span className="logo-word" style={{ color: 'var(--paper)' }}>VOXEL<span style={{ color: 'var(--grass)' }}>PORT</span></span>
            </div>
            <p style={{ marginTop: 16, maxWidth: 300, fontSize: 15, lineHeight: 1.6, color: 'rgba(243,235,220,.78)' }}>
              Free, open-source Minecraft server hosting from your own PC. No port forwarding, no signup — Java and Bedrock friends join in seconds.
            </p>
            <DiscordButton small style={{ marginTop: 18 }}>JOIN THE DISCORD</DiscordButton>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h2 className="footer-title">{col.title}</h2>
              <ul>
                {col.links.map(([label, href]) => {
                  const external = !href.startsWith('#') && !href.startsWith('/');
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
    </>
  );
}
