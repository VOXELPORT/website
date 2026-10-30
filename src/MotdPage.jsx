import { useEffect, useRef, useState } from 'react';
import { Nav, Footer, Pixels } from './ui.jsx';
import { SITE_NAV } from './content.js';
import { SPRITES } from './data.js';
import { COLORS, COLOR_NAMES, centerMotdText, gradient, hexCode, motdSpans, propertiesLine, stripCodes } from './motd.js';
import './motd.css';

const PRESETS = {
  Welcome: '\u00a7a\u00a7lWelcome to our server!\u00a7r\n\u00a77Survival, friends & new adventures',
  Adventure: '\u00a76\u00a7lADVENTURE AWAITS\u00a7r\n\u00a7bExplore. Build. Make it yours.',
  Minimal: '\u00a7fYour Minecraft server\n\u00a78A quiet place to build',
  'SMP Season': '\u00a7e\u00a7l★ SURVIVAL SMP · SEASON 2 ★\u00a7r\n\u00a7aJava + Bedrock \u00a78· \u00a7fHosted with VoxelPort',
  Hardcore: '\u00a7c\u00a7l☠ HARDCORE WORLD ☠\u00a7r\n\u00a77One life. Don\u2019t dig straight down.',
};

const SCRAMBLE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789#$%&*@!?';

export default function MotdPage({ onBack }) {
  const [text, setText] = useState(PRESETS.Welcome);
  const [name, setName] = useState('Your Minecraft Server');
  const [from, setFrom] = useState('#55ff55');
  const [to, setTo] = useState('#55ffff');
  const [message, setMessage] = useState('');
  const [tick, setTick] = useState(0);
  const editor = useRef(null);
  const output = propertiesLine(text);

  const hasObfuscated = /\u00a7k/i.test(text);
  useEffect(() => {
    if (!hasObfuscated) return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setTick((t) => (t + 1) % 1000), 90);
    return () => clearInterval(id);
  }, [hasObfuscated]);

  const rawLines = text.replace(/\r\n?/g, '\n').split('\n').slice(0, 2);
  const line1Len = Array.from(stripCodes(rawLines[0] || '')).length;
  const line2Len = Array.from(stripCodes(rawLines[1] || '')).length;

  function insert(code, transform) {
    const input = editor.current;
    const start = input.selectionStart, end = input.selectionEnd;
    if (transform && start === end) {
      setMessage('Select text in the editor first to apply a gradient.');
      return;
    }
    const replacement = transform ? gradient(text.slice(start, end), from, to) : code;
    setText(text.slice(0, start) + replacement + text.slice(transform ? end : start));
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + replacement.length, start + replacement.length);
    });
    setMessage('');
  }

  function centerLines() {
    setText((prev) => centerMotdText(prev));
    setMessage('Centered both lines for the standard Minecraft server list width.');
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setMessage('Copied! Replace the existing motd= line in server.properties, then restart your server.');
    } catch {
      setMessage('Copy is unavailable. Select the output below and copy it manually.');
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([output + '\n'], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'motd-snippet.properties';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('Downloaded motd-snippet.properties. Replace only the motd= line in your server.properties.');
  }

  const back = (e) => { e?.preventDefault(); onBack(e); };

  return (
    <div className="zine hb">
      <Nav links={SITE_NAV} onLogo={back} />
      <main id="main-content" tabIndex={-1} className="wrap motd-page">
        <header className="page-hero">
          <span className="kicker">Free Minecraft tool · live preview</span>
          <h1>
            <span className="c-title" data-text="MOTD">MOTD</span><br />
            <span className="c-title green" data-text="EDITOR">EDITOR</span>
          </h1>
          <p className="lede">
            Make your server list greeting your own. Edit two lines, add colors, hex gradients and formatting, then copy the result to your Java server. Everything stays in your browser.
          </p>
        </header>

        <div className="motd-presets" aria-label="MOTD presets">
          <span className="pixel" style={{ fontSize: 11, color: 'var(--muted)', marginRight: 4 }}>PRESETS:</span>
          {Object.entries(PRESETS).map(([label, val]) => (
            <button
              key={label}
              type="button"
              className={`btn sm ${text === val ? 'gold' : 'cream'}`}
              onClick={() => { setText(val); setMessage(''); }}
            >
              {label.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="motd-layout">
          <section className="panel motd-card tilt-l1" style={{ transform: 'rotate(-.4deg)' }} aria-label="MOTD controls">
            <div className="motd-card-head">
              <h2 className="h-display" style={{ fontSize: 32 }}>1 · WRITE &amp; STYLE</h2>
              <span className="sticker gold" style={{ transform: 'rotate(2deg)' }}>2 LINES MAX</span>
            </div>

            <div>
              <label className="motd-field-label" htmlFor="motd-text">
                <span>Your MOTD (§ codes supported)</span>
                <span style={{ color: line1Len > 45 || line2Len > 45 ? 'var(--red)' : 'var(--muted)' }}>
                  L1: {line1Len}/45 · L2: {line2Len}/45
                </span>
              </label>
              <textarea
                ref={editor}
                id="motd-text"
                rows={4}
                maxLength={8000}
                value={text}
                onChange={(e) => setText(e.target.value.replace(/\r\n?/g, '\n').split('\n').slice(0, 2).join('\n'))}
                spellCheck={false}
              />
            </div>

            <div>
              <span className="motd-field-label" style={{ marginBottom: 8 }}>Classic Minecraft palette (§0 – §f)</span>
              <div className="motd-swatches" aria-label="Minecraft colors">
                {COLORS.map((c, i) => {
                  const hexChar = i.toString(16);
                  const dark = i < 6 || i === 8;
                  return (
                    <button
                      key={c}
                      type="button"
                      className="motd-swatch"
                      style={{ background: c, color: dark ? '#fff' : '#15120F' }}
                      title={`${COLOR_NAMES[i]} (§${hexChar})`}
                      aria-label={`Insert ${COLOR_NAMES[i]} color (§${hexChar})`}
                      onClick={() => insert('§' + hexChar)}
                    >
                      §{hexChar}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="motd-field-label" style={{ marginBottom: 8 }}>Text formatting &amp; layout</span>
              <div className="motd-actions">
                {[
                  ['Bold', 'l', { fontWeight: 800 }],
                  ['Italic', 'o', { fontStyle: 'italic' }],
                  ['Underline', 'n', { textDecoration: 'underline' }],
                  ['Strike', 'm', { textDecoration: 'line-through' }],
                  ['Obfuscated', 'k', {}],
                  ['Reset', 'r', {}],
                ].map(([label, code, s]) => (
                  <button type="button" key={code} className="motd-fmt-btn" style={s} onClick={() => insert('§' + code)}>
                    {label} (§{code})
                  </button>
                ))}
                <button type="button" className="motd-fmt-btn" onClick={centerLines} title="Pad both lines with spaces to center them">
                  ↔ Center lines
                </button>
              </div>
            </div>

            <div>
              <span className="motd-field-label" style={{ marginBottom: 8 }}>Hex color &amp; gradient (Java 1.16+)</span>
              <div className="motd-color-pickers">
                <label>
                  <span>Start / Hex</span>
                  <input type="color" value={from} onChange={(e) => setFrom(e.target.value)} />
                </label>
                <label>
                  <span>Gradient end</span>
                  <input type="color" value={to} onChange={(e) => setTo(e.target.value)} />
                </label>
              </div>
              <div className="motd-actions" style={{ marginTop: 10 }}>
                <button type="button" className="btn sm cream" onClick={() => insert(hexCode(from))}>
                  INSERT HEX COLOR
                </button>
                <button type="button" className="btn sm gold" onClick={() => insert('', true)}>
                  GRADIENT ON SELECTION
                </button>
              </div>
            </div>

            <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--muted)' }}>
              Formatting buttons insert a code at your cursor. Select text in the editor first to apply a smooth hex gradient across it.
            </p>
          </section>

          <section className="panel motd-card tilt-r1" style={{ transform: 'rotate(.4deg)' }} aria-label="MOTD preview and export">
            <div className="motd-card-head">
              <h2 className="h-display" style={{ fontSize: 32 }}>2 · LIVE PREVIEW</h2>
              <span className="sticker green" style={{ transform: 'rotate(-2deg)' }}>IN-GAME LOOK</span>
            </div>

            <div>
              <label className="motd-field-label" htmlFor="motd-server-name-input">
                <span>Preview server name</span>
                <span style={{ color: 'var(--muted)' }}>Preview only</span>
              </label>
              <input
                id="motd-server-name-input"
                value={name}
                maxLength={60}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="motd-preview" aria-label="Simulated Minecraft server list row">
              <div className="motd-server-icon" aria-hidden="true">
                <Pixels rows={SPRITES.grass} size={3} />
              </div>
              <div className="motd-slot-body">
                <div className="motd-server-name">
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name || 'Minecraft Server'}</span>
                  <span className="motd-server-meta">
                    <span>12/20</span>
                    <Pixels rows={SPRITES.signal} size={1.4} />
                  </span>
                </div>
                <div className="motd-lines">
                  {motdSpans(text).map(({ text: part, style }, i) => {
                    const { obfuscated, ...css } = style;
                    const rendered = obfuscated
                      ? Array.from(part).map((ch, idx) => (/\s/.test(ch) ? ch : SCRAMBLE_CHARS[(idx + tick + i * 7) % SCRAMBLE_CHARS.length])).join('')
                      : part;
                    return <span key={i} style={css}>{rendered}</span>;
                  })}
                </div>
              </div>
            </div>

            {(line1Len > 45 || line2Len > 45) && (
              <div className="sticker gold" style={{ textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--body)', fontSize: 13.5 }}>
                Heads up: lines over ~45 visible characters may wrap or clip in the vanilla Minecraft server list.
              </div>
            )}

            <div>
              <label className="motd-field-label" htmlFor="motd-output">
                <span>Ready for server.properties</span>
                <span style={{ color: 'var(--grass-dk)' }}>Auto-escaped</span>
              </label>
              <textarea id="motd-output" rows={4} readOnly value={output} onFocus={(e) => e.target.select()} />
            </div>

            <div className="motd-actions">
              <button type="button" className="btn sm green" onClick={copy}>COPY MOTD</button>
              <button type="button" className="btn sm cream" onClick={download}>DOWNLOAD SNIPPET</button>
            </div>

            {message && <p role="status" className="motd-status-toast">{message}</p>}

            <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--muted)' }}>
              Stop your server, replace its existing <code>motd=</code> line in <code>server.properties</code> with this output, save, and restart.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
