import { Fragment, useEffect } from 'react';
import { Nav, Footer, Pixels } from './ui.jsx';
import { SPRITES, DL_STORE } from './data.js';
import { navigate } from './seo.js';
import { GUIDES, findGuide, guidePath, guideToc } from './guides.js';

const SPRITE_FOR = ['grass', 'diamond', 'heart', 'bolt', 'tower', 'grass'];

/** Same-site links inside the article HTML navigate without a page load. */
function onArticleClick(e) {
  const a = e.target.closest('a');
  const href = a?.getAttribute('href');
  if (!href || !href.startsWith('/') || e.metaKey || e.ctrlKey || e.shiftKey) return;
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

export function GuideGrid({ guides = GUIDES }) {
  return <div className="grid-3">{guides.map((g) => <GuideCard key={g.slug} g={g} i={GUIDES.indexOf(g)} />)}</div>;
}

function GuidesIndex() {
  return (
    <>
      <span className="kicker">Field manual · free guides</span>
      <h1 className="guide-hero">
        <span className="c-title" data-text="SERVER">SERVER</span><br />
        <span className="c-title green" data-text="GUIDES">GUIDES</span>
      </h1>
      <p className="lede" style={{ marginTop: 18 }}>
        Plain-English guides to hosting a Minecraft server from your own PC: no port forwarding, Java and Bedrock together, and what to do when it crashes.
      </p>
      <div style={{ marginTop: 40 }}><GuideGrid /></div>
    </>
  );
}

function GuideArticle({ g }) {
  const toc = guideToc(g);
  const related = GUIDES.filter((x) => x !== g).slice(0, 3);
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
    <div className="zine">
      <Nav links={[['All guides', '/guides'], ['← Back to site', '#', back]]} relay={null} onLogo={back} />
      <main className="wrap" style={{ paddingTop: 50, paddingBottom: 100 }}>
        {g ? <GuideArticle g={g} /> : <GuidesIndex />}
      </main>
      <Footer />
    </div>
  );
}
