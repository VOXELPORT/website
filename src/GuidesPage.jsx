import { Fragment, useEffect, useMemo, useState } from 'react';
import { Nav, Footer, Pixels, DiscordButton } from './ui.jsx';
import { SITE_NAV } from './content.js';
import { SPRITES, DL_STORE } from './data.js';
import { navigate, isModifiedClick } from './seo.js';
import { GUIDES_META, GUIDE_CATEGORIES, guidePath } from './guides-meta.js';
import { findGuide, guideToc } from './guides.js';

const SPRITE_FOR = ['grass', 'diamond', 'heart', 'bolt', 'tower', 'grass'];

/** Same-site links inside the article HTML navigate without a page load. */
function onArticleClick(e) {
  if (isModifiedClick(e)) return;
  const a = e.target.closest('a');
  const href = a?.getAttribute('href');
  // /dl/ is a real file download served by the web server, not an app route.
  if (!href || !href.startsWith('/') || href.startsWith('/dl/') || a.hasAttribute('download')) return;
  e.preventDefault();
  navigate(href);
  window.scrollTo(0, 0);
}

function GuideCard({ g, i }) {
  return (
    <a className="panel guide-card" href={guidePath(g)} onClick={onArticleClick}
      style={{ transform: `rotate(${[-.6, .5, -.3, .6][i % 4]}deg)` }}>
      <div className="guide-card-top">
        <span className="pixel" style={{ fontSize: 11 }}>{g.kicker.toUpperCase()}</span>
        <Pixels rows={SPRITES[SPRITE_FOR[i % SPRITE_FOR.length]]} size={2.4} />
      </div>
      {/* Keep hyphenated words like "Wi-Fi" on one line. */}
      <h2 className="h-display">{g.short.split(' ').map((w, j) => <Fragment key={j}>{j ? ' ' : ''}<span style={{ whiteSpace: 'nowrap' }}>{w}</span></Fragment>)}</h2>
      <p>{g.blurb}</p>
      <span className="guide-card-more">READ THE GUIDE →</span>
    </a>
  );
}

export function GuideGrid({ guides = GUIDES_META }) {
  return <div className="grid-3">{guides.map((g, idx) => <GuideCard key={g.slug} g={g} i={idx} />)}</div>;
}

function GuidesIndex({ missingSlug }) {
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return GUIDES_META.filter((g) => {
      if (cat !== 'all' && g.category !== cat) return false;
      if (!needle) return true;
      return `${g.title} ${g.short} ${g.blurb} ${g.kicker} ${g.description}`.toLowerCase().includes(needle);
    });
  }, [cat, q]);

  return (
    <>
      {missingSlug && (
        <div className="panel gold" style={{ padding: '18px 22px', marginBottom: 32 }}>
          <span className="kicker" style={{ color: 'var(--ink-2)' }}>404 · Guide not found</span>
          <p style={{ marginTop: 6, fontWeight: 600 }}>
            We couldn’t find a guide at <code className="typewriter">/guides/{missingSlug}</code>. Browse or search all {GUIDES_META.length} guides below.
          </p>
        </div>
      )}
      <span className="kicker">Field manual · free guides</span>
      <h1 className="guide-hero">
        <span className="c-title" data-text="SERVER">SERVER</span><br />
        <span className="c-title green" data-text="GUIDES">GUIDES</span>
      </h1>
      <p className="lede" style={{ marginTop: 18 }}>
        Plain-English guides to hosting a Minecraft server from your own PC or Android phone: no port forwarding, Java and Bedrock together, and what to do when it crashes.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 32, alignItems: 'center' }}>
        {GUIDE_CATEGORIES.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`btn sm ${cat === id ? '' : 'cream'}`}
            onClick={() => setCat(id)}
            aria-pressed={cat === id}
          >
            {label.toUpperCase()}
          </button>
        ))}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search guides…"
          aria-label="Search guides"
          style={{ flex: '1 1 200px', minWidth: 0, border: '3px solid var(--ink)', padding: '10px 12px', font: 'inherit', background: 'var(--card)', boxShadow: '3px 3px 0 var(--ink)' }}
        />
      </div>

      <div style={{ marginTop: 36 }}>
        {shown.length > 0 ? (
          <GuideGrid guides={shown} />
        ) : (
          <div className="panel" style={{ padding: '26px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h2 className="h-display" style={{ fontSize: 32 }}>NO GUIDES MATCH THAT SEARCH</h2>
              <p style={{ marginTop: 4, color: 'var(--ink-2)' }}>Try another keyword or show all {GUIDES_META.length} guides.</p>
            </div>
            <button type="button" className="btn sm cream" onClick={() => { setCat('all'); setQ(''); }}>SHOW ALL GUIDES</button>
          </div>
        )}
      </div>
    </>
  );
}

function GuideArticle({ g }) {
  const toc = guideToc(g);
  const related = GUIDES_META.filter((x) => x.slug !== g.slug && (x.category === g.category || true)).slice(0, 3);
  return (
    <>
      <nav className="crumbs typewriter" aria-label="Breadcrumb">
        <a href="/" onClick={onArticleClick}>Home</a> / <a href="/guides" onClick={onArticleClick}>Guides</a> / <span>{g.short}</span>
      </nav>
      <span className="kicker" style={{ display: 'block', marginTop: 18 }}>{g.kicker}</span>
      <h1 className="guide-title">{g.title}</h1>
      <p className="lede" style={{ marginTop: 14 }}>{g.description}</p>

      <div className="guide-layout">
        <aside className="panel guide-toc">
          <span className="pixel" style={{ fontSize: 11 }}>ON THIS PAGE</span>
          <ol>
            {toc.map((t) => (
              <li key={t.id}><a href={`#${t.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth' }); }}>{t.text}</a></li>
            ))}
            {g.faq?.length > 0 && <li><a href="#faq" onClick={(e) => { e.preventDefault(); document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }); }}>Questions</a></li>}
          </ol>
          <a className="btn green sm" href={DL_STORE} target="_blank" rel="noreferrer" style={{ textAlign: 'center' }}>GET VOXELPORT</a>
        </aside>

        <div className="guide-main">
          <article className="guide-body" onClick={onArticleClick} dangerouslySetInnerHTML={{ __html: g.html }} />
          {g.faq?.length > 0 && (
            <section className="guide-body" id="faq">
              <h2>Questions</h2>
              {g.faq.map((f) => (<div key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>))}
            </section>
          )}
          <div className="panel" style={{ marginTop: 36, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', background: 'var(--card)' }}>
            <p style={{ flex: '1 1 260px', fontSize: 16, lineHeight: 1.55, color: 'var(--ink-2)' }}><b>Still stuck?</b> Ask in <b>#help</b> on the VoxelPort Discord and tell us what you see.</p>
            <DiscordButton small>ASK ON DISCORD</DiscordButton>
          </div>
        </div>
      </div>

      <div className="section-head" style={{ marginTop: 70, marginBottom: 30 }}>
        <span className="kicker">Keep reading</span>
        <h2 className="h-display h-section">MORE GUIDES</h2>
      </div>
      <GuideGrid guides={related} />
    </>
  );
}

export default function GuidesPage({ slug, onBack }) {
  const g = slug ? findGuide(slug) : null;
  const back = (e) => { e?.preventDefault(); onBack(e); };

  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (h && /^[\w-]+$/.test(h)) setTimeout(() => document.getElementById(h)?.scrollIntoView(), 50);
    else window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="zine hb">
      <Nav links={SITE_NAV} onLogo={back} />
      <main id="main-content" tabIndex={-1} className="wrap" style={{ paddingTop: 50, paddingBottom: 100 }}>
        {g ? <GuideArticle g={g} /> : <GuidesIndex missingSlug={slug} />}
      </main>
      <Footer />
    </div>
  );
}
