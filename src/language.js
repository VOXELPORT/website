import { useSyncExternalStore } from 'react';

/*
 * Site language. English and Spanish are written side by side at each call site: text('Download', 'Descargar').
 * Every other language is a dictionary keyed by the English text (src/i18n/<code>.js), fetched only when chosen,
 * so adding a language never touches the call sites. Anything a dictionary is missing falls back to English.
 * Placeholders like {n} are filled from an optional third argument: text('{n} down', '{n} con fallos', { n: 2 }).
 */

export const LANGUAGES = [
  { code: 'en', label: 'English', intl: 'en' },
  { code: 'es', label: 'Español', intl: 'es' },
  { code: 'hi', label: 'हिन्दी', intl: 'hi-IN' },
  { code: 'pt', label: 'Português', intl: 'pt-BR' },
  { code: 'de', label: 'Deutsch', intl: 'de' },
  { code: 'fr', label: 'Français', intl: 'fr' },
];
const CODES = new Set(LANGUAGES.map((l) => l.code));
const LOADERS = {
  hi: () => import('./i18n/hi.js'),
  pt: () => import('./i18n/pt.js'),
  de: () => import('./i18n/de.js'),
  fr: () => import('./i18n/fr.js'),
};

const key = 'voxelport-language';
const event = 'voxelport-language-change';

function getLanguage() {
  try {
    const saved = localStorage.getItem(key);
    return CODES.has(saved) ? saved : 'en';
  } catch { return 'en'; }
}

let language = getLanguage();
const dictionaries = {};
// The snapshot changes when the language changes or its dictionary arrives, so components re-render either way.
let snapshot = `${language}:0`;

function htmlLang(code) {
  return LANGUAGES.find((l) => l.code === code)?.intl || 'en';
}

function notify() {
  snapshot = `${language}:${dictionaries[language] ? 1 : 0}`;
  window.dispatchEvent(new Event(event));
}

function ensureDictionary(code) {
  if (!LOADERS[code] || dictionaries[code]) return;
  LOADERS[code]().then((m) => {
    dictionaries[code] = m.default;
    if (code === language) notify();
  }).catch(() => { /* stays on the English fallback */ });
}

function applyHtmlLang() {
  const root = document.documentElement;
  root.dataset.siteLang = htmlLang(language);
  // guides in another language set their own; keep it while one is open
  if (!root.lang || LANGUAGES.some((l) => l.intl === root.lang)) root.lang = htmlLang(language);
}

applyHtmlLang();
ensureDictionary(language);

function subscribe(callback) {
  window.addEventListener(event, callback);
  return () => window.removeEventListener(event, callback);
}

export function setLanguage(value) {
  language = CODES.has(value) ? value : 'en';
  try { localStorage.setItem(key, language); } catch { /* Preference lasts for this visit. */ }
  applyHtmlLang();
  ensureDictionary(language);
  notify();
}

const fill = (s, vars) => (vars ? String(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)) : s);

export function useLanguage() {
  useSyncExternalStore(subscribe, () => snapshot);
  const locale = language;
  const dict = dictionaries[locale];
  const text = (english, spanish, vars) => {
    const chosen = locale === 'es' ? spanish : locale === 'en' ? english : dict?.[english] ?? english;
    return fill(chosen, vars);
  };
  return { locale, intl: htmlLang(locale), text };
}

export const ES_NAV = {
  '/features': 'Funciones', '/guides': 'Guías', '/blog': 'Blog',
  '/servers': 'Servidores', '/download': 'Descargas', '/support': 'Apoyo',
  '/compare': 'Comparar', '/about': 'Acerca de', '/legal': 'Aviso legal',
  '/community': 'Comunidad', '/new-app': 'Nueva aplicación', '/faq': 'Preguntas frecuentes',
  '/status': 'Estado', '/uptime': 'Disponibilidad', '/team': 'Equipo',
};
