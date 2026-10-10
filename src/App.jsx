import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import LegalPage from './LegalPage.jsx';
import StatusPage from './StatusPage.jsx';
import ServersPage from './ServersPage.jsx';
import GuidesPage from './GuidesPage.jsx';
import Landing from './Landing.jsx';
import { applyPageMeta, navigate } from './seo.js';
import './index.css';

// Smooth scrolling, matching the previous site feel.
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);
}

// Old links used hash routes (#/servers, #/legal#privacy-notice) — the app
// still links to some. Rewrite them to real paths before the first render.
if (typeof window !== 'undefined' && window.location.hash.startsWith('#/')) {
  const [, route, anchor] = window.location.hash.split('#');
  window.history.replaceState(null, '', route + (anchor ? '#' + anchor : ''));
}

function routeFromPath() {
  if (typeof window === 'undefined') return 'home';
  const p = window.location.pathname.replace(/\/+$/, '');
  if (p === '/legal') return 'legal';
  if (p === '/status') return 'status';
  if (p === '/servers') return 'servers';
  if (p === '/guides') return 'guides';
  const m = p.match(/^\/guides\/([\w-]+)$/);
  if (m) return 'guide:' + m[1];
  return 'home';
}

export default function App() {
  const [page, setPage] = useState(routeFromPath);
  useLenis();

  useEffect(() => {
    const onNav = () => setPage(routeFromPath());
    window.addEventListener('popstate', onNav);
    return () => window.removeEventListener('popstate', onNav);
  }, []);

  useEffect(() => { applyPageMeta(page); }, [page]);

  // Arriving on the landing page with a section anchor (e.g. #features from
  // another page's footer): scroll there once it has rendered.
  useEffect(() => {
    if (page !== 'home') return;
    const h = window.location.hash;
    if (h.length > 1 && /^#[\w-]+$/.test(h)) {
      setTimeout(() => document.querySelector(h)?.scrollIntoView(), 30);
    }
  }, [page]);

  const goHome = (e) => {
    if (e) e.preventDefault();
    navigate('/');
    window.scrollTo(0, 0);
  };

  if (page === 'legal')  return <LegalPage onBack={goHome} />;
  if (page === 'status') return <StatusPage onBack={goHome} />;
  if (page === 'servers') return <ServersPage onBack={goHome} />;
  if (page === 'guides' || page.startsWith('guide:')) return <GuidesPage slug={page.startsWith('guide:') ? page.slice(6) : null} onBack={goHome} />;
  return <Landing />;
}
