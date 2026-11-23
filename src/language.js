import { useSyncExternalStore } from 'react';

const key = 'voxelport-language';
const event = 'voxelport-language-change';

function getLanguage() {
  try { return localStorage.getItem(key) === 'es' ? 'es' : 'en'; }
  catch { return 'en'; }
}

let language = getLanguage();
document.documentElement.lang = language;

function subscribe(callback) {
  window.addEventListener(event, callback);
  return () => window.removeEventListener(event, callback);
}

export function setLanguage(value) {
  language = value === 'es' ? 'es' : 'en';
  try { localStorage.setItem(key, language); } catch { /* Preference lasts for this visit. */ }
  document.documentElement.lang = language;
  window.dispatchEvent(new Event(event));
}

export function useLanguage() {
  const locale = useSyncExternalStore(subscribe, () => language);
  return { locale, text: (english, spanish) => locale === 'es' ? spanish : english };
}

export const ES_NAV = {
  '/features': 'Funciones', '/guides': 'Guías', '/blog': 'Blog',
  '/servers': 'Servidores', '/download': 'Descargas', '/support': 'Apoyo',
  '/compare': 'Comparar', '/about': 'Acerca de', '/legal': 'Aviso legal',
  '/community': 'Comunidad', '/new-app': 'Nueva aplicación', '/faq': 'Preguntas frecuentes',
  '/status': 'Estado', '/uptime': 'Disponibilidad', '/team': 'Equipo',
};
