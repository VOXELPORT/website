import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import LegalPage from './LegalPage.jsx';
import StatusPage from './StatusPage.jsx';
import Landing from './Landing.jsx';
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

function routeFromHash() {
  if (typeof window === 'undefined') return 'home';
  const h = window.location.hash;
  if (h.startsWith('#/legal'))  return 'legal';
  if (h.startsWith('#/status')) return 'status';
  return 'home';
}

export default function App() {
  const [page, setPage] = useState(routeFromHash);
  useLenis();

  useEffect(() => {
    const onHash = () => setPage(routeFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Arriving on the landing page with a section anchor (e.g. #features from
  // another page's footer): scroll there once it has rendered.
  useEffect(() => {
    if (page !== 'home') return;
    const h = window.location.hash;
    if (h.length > 1 && !h.startsWith('#/')) {
      setTimeout(() => document.querySelector(h)?.scrollIntoView(), 30);
    }
  }, [page]);

  const goHome = (e) => {
    if (e) e.preventDefault();
    window.location.hash = '';
    setPage('home');
    window.scrollTo(0, 0);
  };

  if (page === 'legal')  return <LegalPage onBack={goHome} />;
  if (page === 'status') return <StatusPage onBack={goHome} />;
  return <Landing />;
}
