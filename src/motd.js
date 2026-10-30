export const COLORS = ['#000000', '#0000aa', '#00aa00', '#00aaaa', '#aa0000', '#aa00aa', '#ffaa00', '#aaaaaa', '#555555', '#5555ff', '#55ff55', '#55ffff', '#ff5555', '#ff55ff', '#ffff55', '#ffffff'];

export const COLOR_NAMES = [
  'Black', 'Dark Blue', 'Dark Green', 'Dark Aqua',
  'Dark Red', 'Dark Purple', 'Gold', 'Gray',
  'Dark Gray', 'Blue', 'Green', 'Aqua',
  'Red', 'Light Purple', 'Yellow', 'White',
];

export function stripCodes(text) {
  return text.replace(/\u00a7x(?:\u00a7[0-9a-f]){6}|\u00a7[0-9a-fk-or]/gi, '');
}

export function centerMotdText(text, width = 45) {
  return text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .slice(0, 2)
    .map((line) => {
      const trimmed = line.replace(/^ +/, '');
      const visibleLen = Array.from(stripCodes(trimmed)).length;
      const pad = Math.max(0, Math.floor((width - visibleLen) / 2));
      return ' '.repeat(pad) + trimmed;
    })
    .join('\n');
}

export function hexCode(hex) {
  return '\u00a7x' + hex.slice(1).split('').map(c => '\u00a7' + c).join('');
}

export function gradient(text, from, to) {
  const chars = Array.from(text.replace(/\u00a7[0-9a-fk-orx]/gi, ''));
  const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const a = rgb(from), b = rgb(to);
  return chars.map((c, i) => {
    const t = chars.length < 2 ? 0 : i / (chars.length - 1);
    return hexCode('#' + a.map((v, j) => Math.round(v + (b[j] - v) * t).toString(16).padStart(2, '0')).join('')) + c;
  }).join('');
}

export function motdSpans(text) {
  let style = { color: '#aaaaaa' };
  const spans = [];
  const tokens = text.split(/(\u00a7x(?:\u00a7[0-9a-f]){6}|\u00a7[0-9a-fk-or])/gi);
  for (const token of tokens) {
    if (!token) continue;
    if (token[0] !== '\u00a7') { spans.push({ text: token, style: { ...style } }); continue; }
    const code = token[1].toLowerCase();
    if (code === 'x') style = { color: '#' + token.slice(2).replaceAll('\u00a7', '') };
    else if (/[0-9a-f]/.test(code)) style = { color: COLORS[parseInt(code, 16)] };
    else if (code === 'r') style = { color: '#aaaaaa' };
    else if (code === 'l') style.fontWeight = 'bold';
    else if (code === 'o') style.fontStyle = 'italic';
    else if (code === 'n' || code === 'm') style.textDecoration = [style.textDecoration, code === 'n' ? 'underline' : 'line-through'].filter(Boolean).join(' ');
    else if (code === 'k') style.obfuscated = true;
  }
  return spans;
}

// Java properties are escaped so a second line cannot become another setting.
export function propertiesLine(text) {
  const value = text.replace(/\r\n?/g, '\n').split('\n').slice(0, 2).join('\n');
  return 'motd=' + Array.from(value).map(char => {
    if (char === '\\') return '\\\\';
    if (char === '\n') return '\\n';
    if ('=:#! '.includes(char)) return '\\' + char;
    const n = char.charCodeAt(0);
    if (n < 32 || n > 126) return char.split('').map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('');
    return char;
  }).join('');
}
