import { useRef, useState } from 'react';
import { Nav, Footer } from './ui.jsx';
import { SITE_NAV } from './content.js';
import { COLORS, gradient, hexCode, motdSpans, propertiesLine } from './motd.js';
import './motd.css';

const PRESETS = {
  Welcome: '\u00a7a\u00a7lWelcome to our server!\u00a7r\n\u00a77Survival, friends & new adventures',
  Adventure: '\u00a76\u00a7lADVENTURE AWAITS\n\u00a7bExplore. Build. Make it yours.',
  Minimal: '\u00a7fYour Minecraft server\n\u00a78A quiet place to build',
};

export default function MotdPage({ onBack }) {
  const [text, setText] = useState(PRESETS.Welcome);
  const [name, setName] = useState('Your Minecraft Server');
  const [from, setFrom] = useState('#55ff55');
  const [to, setTo] = useState('#55ffff');
  const [message, setMessage] = useState('');
  const editor = useRef(null);
  const output = propertiesLine(text);
  function insert(code, transform) {
    const input = editor.current;
    const start = input.selectionStart, end = input.selectionEnd;
    if (transform && start === end) { setMessage('Select text in the editor to apply a gradient.'); return; }
    const replacement = transform ? gradient(text.slice(start, end), from, to) : code;
    setText(text.slice(0, start) + replacement + text.slice(transform ? end : start));
    requestAnimationFrame(() => { input.focus(); input.setSelectionRange(start + replacement.length, start + replacement.length); });
    setMessage('');
  }
  async function copy() {
    try { await navigator.clipboard.writeText(output); setMessage('Copied! Replace the existing motd= line in server.properties, then restart your server.'); }
    catch { setMessage('Copy is unavailable. Select the output below and copy it manually.'); }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([output + '\n'], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'motd-snippet.properties'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('Downloaded a snippet. Replace only the motd= line in your existing server.properties.');
  }
  return <div className="zine">
    <Nav links={SITE_NAV} onLogo={onBack} />
    <main className="wrap motd-page">
      <span className="kicker">FREE MINECRAFT TOOL</span>
      <h1>MOTD EDITOR</h1>
      <p>Make your server list greeting your own. Edit two lines, add colors and formatting, then copy the result to your Java server. Your text stays in this browser.</p>
      <div className="motd-layout">
        <section className="motd-card" aria-label="MOTD controls">
          <label>Start with a preset <select defaultValue="" onChange={e => { if (e.target.value) setText(PRESETS[e.target.value]); }}><option value="" disabled>Choose a style</option>{Object.keys(PRESETS).map(p => <option key={p}>{p}</option>)}</select></label>
          <label htmlFor="motd-text">Your MOTD (two lines; § codes supported)</label>
          <textarea ref={editor} id="motd-text" rows={5} maxLength={8000} value={text} onChange={e => setText(e.target.value.replace(/\r\n?/g, '\n').split('\n').slice(0, 2).join('\n'))} spellCheck={false} />
          <div className="motd-swatches" aria-label="Minecraft colors">{COLORS.map((c, i) => <button key={c} type="button" style={{ background: c }} title={`Color §${i.toString(16)} (${c})`} aria-label={`Insert color ${c}`} onClick={() => insert('§' + i.toString(16))} />)}</div>
          <div className="motd-actions">{[['Bold', 'l'], ['Italic', 'o'], ['Underline', 'n'], ['Strike', 'm'], ['Obfuscated', 'k'], ['Reset', 'r']].map(([label, code]) => <button type="button" key={code} onClick={() => insert('§' + code)}>{label}</button>)}</div>
          <div className="motd-actions"><label>Color / gradient start <input type="color" value={from} onChange={e => setFrom(e.target.value)} /></label><label>Gradient end <input type="color" value={to} onChange={e => setTo(e.target.value)} /></label></div>
          <div className="motd-actions"><button type="button" onClick={() => insert(hexCode(from))}>Insert custom color</button><button type="button" onClick={() => insert('', true)}>Gradient on selection</button></div>
          <p>Formatting buttons insert a code at your cursor. Use Reset to end a style. Hex colors and gradients require compatible server software and clients (Java 1.16+); use the standard palette for older versions.</p>
        </section>
        <section className="motd-card" aria-label="MOTD preview and export">
          <h2>LIVE PREVIEW</h2>
          <label>Preview server name <input value={name} maxLength={60} onChange={e => setName(e.target.value)} /></label>
          <div className="motd-preview"><div className="motd-server-name">{name}<span>0/20 ▂▄▆</span></div><div className="motd-lines">{motdSpans(text).map(({ text: part, style }, i) => {
            const { obfuscated, ...css } = style;
            return <span key={i} style={css}>{obfuscated ? part.replace(/[^\s]/g, '▒') : part}</span>;
          })}</div></div>
          <p>Approximate preview. Obfuscated text is shown as blocks; fonts and line wrapping vary by client. The server name above is for preview only.</p>
          <label htmlFor="motd-output">Ready for server.properties</label>
          <textarea id="motd-output" rows={6} readOnly value={output} onFocus={e => e.target.select()} />
          <div className="motd-actions"><button type="button" onClick={copy}>Copy MOTD</button><button type="button" onClick={download}>Download snippet</button></div>
          <p>Stop your server, replace its existing <code>motd=</code> line with this output, save, and restart. Keep the rest of server.properties. Proxies and MOTD plugins may override it.</p>
          <p role="status">{message}</p>
        </section>
      </div>
    </main><Footer />
  </div>;
}
