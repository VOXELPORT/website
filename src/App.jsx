import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import LegalPage from './LegalPage.jsx';
import StatusPage from './StatusPage.jsx';
import ServersPage from './ServersPage.jsx';
import GuidesPage from './GuidesPage.jsx';
import Landing from './Landing.jsx';
import { FeaturesPage, ComparePage, FaqPage, DownloadPage, SupportPage, CommunityPage } from './MorePages.jsx';
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

// The home page used to hold all of these as sections. Apps and posts out there still link to
// voxelport.in/#support, /#supporters and so on, so those old anchors go to the page they moved to.
const MOVED_SECTIONS = {
  '#features': '/features', '#paths': '/features#paths', '#direct': '/features#direct',
  '#compare': '/compare', '#faq': '/faq', '#guides': '/guides',
  '#support': '/support', '#supporters': '/support#supporters',
};
if (typeof window !== 'undefined' && window.location.pathname.replace(/\/+$/, '') === '' && MOVED_SECTIONS[window.location.hash]) {
  window.history.replaceState(null, '', MOVED_SECTIONS[window.location.hash]);
}

const SIMPLE_ROUTES = {
  '/legal': 'legal', '/status': 'status', '/servers': 'servers', '/guides': 'guides',
  '/features': 'features', '/compare': 'compare', '/faq': 'faq', '/download': 'download',
  '/support': 'support', '/community': 'community',
};

function routeFromPath() {
  if (typeof window === 'undefined') return 'home';
  const p = window.location.pathname.replace(/\/+$/, '');
  if (SIMPLE_ROUTES[p]) return SIMPLE_ROUTES[p];
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

  if (page === 'features') return <FeaturesPage onBack={goHome} />;
  if (page === 'compare') return <ComparePage onBack={goHome} />;
  if (page === 'faq') return <FaqPage onBack={goHome} />;
  if (page === 'download') return <DownloadPage onBack={goHome} />;
  if (page === 'support') return <SupportPage onBack={goHome} />;
  if (page === 'community') return <CommunityPage onBack={goHome} />;
  if (page === 'legal')  return <LegalPage onBack={goHome} />;
  if (page === 'status') return <StatusPage onBack={goHome} />;
  if (page === 'servers') return <ServersPage onBack={goHome} />;
  if (page === 'guides' || page.startsWith('guide:')) return <GuidesPage slug={page.startsWith('guide:') ? page.slice(6) : null} onBack={goHome} />;
  return <Landing />;
}
