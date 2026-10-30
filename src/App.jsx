import { lazy, Suspense, useEffect, useState } from 'react';
import Lenis from 'lenis';
import Landing from './Landing.jsx';
import { Nav, Footer } from './ui.jsx';
import { SITE_NAV } from './content.js';
import { applyPageMeta, navigate } from './seo.js';
import './index.css';
import './v3.css';
import './theme.css';

const LegalPage = lazy(() => import('./LegalPage.jsx'));
const StatusPage = lazy(() => import('./StatusPage.jsx'));
const ServersPage = lazy(() => import('./ServersPage.jsx'));
const GuidesPage = lazy(() => import('./GuidesPage.jsx'));
const MotdPage = lazy(() => import('./MotdPage.jsx'));

const FeaturesPage = lazy(() => import('./MorePages.jsx').then((m) => ({ default: m.FeaturesPage })));
const ComparePage = lazy(() => import('./MorePages.jsx').then((m) => ({ default: m.ComparePage })));
const FaqPage = lazy(() => import('./MorePages.jsx').then((m) => ({ default: m.FaqPage })));
const DownloadPage = lazy(() => import('./MorePages.jsx').then((m) => ({ default: m.DownloadPage })));
const SupportPage = lazy(() => import('./MorePages.jsx').then((m) => ({ default: m.SupportPage })));
const CommunityPage = lazy(() => import('./MorePages.jsx').then((m) => ({ default: m.CommunityPage })));
const AboutPage = lazy(() => import('./MorePages.jsx').then((m) => ({ default: m.AboutPage })));
const TeamPage = lazy(() => import('./MorePages.jsx').then((m) => ({ default: m.TeamPage })));
const NotFoundPage = lazy(() => import('./MorePages.jsx').then((m) => ({ default: m.NotFoundPage })));

// Smooth scrolling, matching the site feel while respecting reduced-motion preferences.
function useLenis() {
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mq?.matches) return;

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
  '/motd': 'motd',
  '/legal': 'legal', '/status': 'status', '/servers': 'servers', '/guides': 'guides',
  '/features': 'features', '/compare': 'compare', '/faq': 'faq', '/download': 'download',
  '/support': 'support', '/community': 'community', '/about': 'about', '/team': 'team',
};

function routeFromPath() {
  if (typeof window === 'undefined') return 'home';
  const p = window.location.pathname.replace(/\/+$/, '');
  if (p === '') return 'home';
  if (SIMPLE_ROUTES[p]) return SIMPLE_ROUTES[p];
  const m = p.match(/^\/guides\/([\w-]+)$/);
  if (m) return 'guide:' + m[1];
  return 'notfound';
}

function PageFallback({ onBack }) {
  return (
    <div className="zine hb">
      <Nav links={SITE_NAV} onLogo={onBack} />
      <main id="main-content" tabIndex={-1} className="wrap" style={{ paddingTop: 60, paddingBottom: 120, minHeight: '60vh' }} />
      <Footer />
    </div>
  );
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

  if (page === 'home') return <Landing />;

  return (
    <Suspense fallback={<PageFallback onBack={goHome} />}>
      {page === 'motd' && <MotdPage onBack={goHome} />}
      {page === 'features' && <FeaturesPage onBack={goHome} />}
      {page === 'compare' && <ComparePage onBack={goHome} />}
      {page === 'faq' && <FaqPage onBack={goHome} />}
      {page === 'download' && <DownloadPage onBack={goHome} />}
      {page === 'support' && <SupportPage onBack={goHome} />}
      {page === 'community' && <CommunityPage onBack={goHome} />}
      {page === 'about' && <AboutPage onBack={goHome} />}
      {page === 'team' && <TeamPage onBack={goHome} />}
      {page === 'legal' && <LegalPage onBack={goHome} />}
      {page === 'status' && <StatusPage onBack={goHome} />}
      {page === 'servers' && <ServersPage onBack={goHome} />}
      {(page === 'guides' || page.startsWith('guide:')) && (
        <GuidesPage slug={page.startsWith('guide:') ? page.slice(6) : null} onBack={goHome} />
      )}
      {page === 'notfound' && <NotFoundPage onBack={goHome} />}
    </Suspense>
  );
}
