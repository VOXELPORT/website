import { useEffect, useState } from 'react';
import { V2Nav, V2Footer, V2Directory } from './V2Shell.jsx';
import { PAL, DL_WIN, DL_ANDROID, GITHUB_APP, GITHUB_ORG, INSTAGRAM, DISCORD, useRelayStatus } from './data.js';
import { DISCORD_LINE } from './community.js';
import { navigate, isModifiedClick } from './seo.js';
import { GUIDES_META, guidePath } from './guides-meta.js';

/** Click handler for same-site links: client-side navigation for paths ("/servers"). */
function internal(href) {
  // /dl/ paths are real file downloads (served by the web server), not routes.
  return href.startsWith('/') && !href.startsWith('/dl/')
    ? (e) => {
        if (isModifiedClick(e)) return;
        e.preventDefault();
        navigate(href);
      }
    : undefined;
}

// ─── Pixel art ────────────────────────────────────────────────────────────────

function buildPixelRects(rows) {
  const rects = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const c = row[x];
      if (c !== '.' && PAL[c]) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={PAL[c]} />);
    }
  });
  return rects;
}

/** Renders a pixel sprite from rows of palette chars ('.' = transparent). */
export function Pixels({ rows, size = 4, title, style, className }) {
  const w = rows[0].length;
  const h = rows.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w * size} height={h * size} shapeRendering="crispEdges"
      role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}
      style={style} className={className}>
      {buildPixelRects(rows)}
    </svg>
  );
}

/** Renders a pixel sprite as a native <g> inside an existing <svg> (no <foreignObject> needed). */
export function SvgPixels({ rows, x = 0, y = 0, size = 4, className }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`} shapeRendering="crispEdges" className={className}>
      {buildPixelRects(rows)}
    </g>
  );
}

export function Logo({ onClick }) {
  const handleClick = (e) => {
    if (isModifiedClick(e)) return;
    if (onClick) onClick(e);
  };
  return (
    <a className="logo" href="/" onClick={handleClick} aria-label="VoxelPort home">
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
    <section className="hb-section hb-section-tint hb-discord" aria-labelledby="discord-band-title">
      <div className="hb-wrap hb-discord-inner">
        <div>
          <h2 id="discord-band-title" className="hb-h3">Join the Discord</h2>
          <p>{DISCORD_LINE} It’s free, and you don’t need it to use VoxelPort.</p>
        </div>
        <div className="hb-discord-actions">
          <a className="hb-btn hb-btn-line hb-btn-lg" href={DISCORD} target="_blank" rel="noopener noreferrer"><DiscordIcon size={20} />Join the Discord</a>
          <a className="hb-textlink" href="/community" onClick={internal('/community')}>What’s inside</a>
        </div>
      </div>
    </section>
  );
}

// ─── Nav ───────────────────────────────────────────────────────────────────

export function Nav({ onLogo }) {
  return <><V2Nav onLogo={onLogo} /><V2Directory /></>;
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export function Footer() { return <V2Footer />; }
