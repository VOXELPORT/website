import { Fragment, useEffect, useMemo, useState } from 'react';
import { Nav, Footer, Pixels, DiscordButton } from './ui.jsx';
import { SITE_NAV } from './content.js';
import { SPRITES } from './data.js';
import { navigate, isModifiedClick } from './seo.js';
import { BLOG_META, BLOG_CATEGORIES, blogPath } from './blog-meta.js';
import { findBlogPost, blogToc } from './blog.js';
import { AdSlot } from './ads.jsx';

const SPRITE_FOR = ['bolt', 'heart', 'tower', 'grass', 'diamond'];

/** Same-site links inside the article HTML navigate without a page load. */
function onArticleClick(e) {
  if (isModifiedClick(e)) return;
  const a = e.target.closest('a');
  const href = a?.getAttribute('href');
  if (!href || !href.startsWith('/') || href.startsWith('/dl/') || a.hasAttribute('download')) return;
  e.preventDefault();
  navigate(href);
  window.scrollTo(0, 0);
}

const fmtDate = (iso) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

function PostCard({ p, i }) {
  return (
    <a className="panel guide-card" href={blogPath(p)} onClick={onArticleClick}
      style={{ transform: `rotate(${[-.6, .5, -.3, .6][i % 4]}deg)` }}>
      <div className="guide-card-top">
        <span className="pixel" style={{ fontSize: 11 }}>{p.kicker.toUpperCase()}</span>
        <Pixels rows={SPRITES[SPRITE_FOR[i % SPRITE_FOR.length]]} size={2.4} />
      </div>
      <h2 className="h-display">{p.short.split(' ').map((w, j) => <Fragment key={j}>{j ? ' ' : ''}<span style={{ whiteSpace: 'nowrap' }}>{w}</span></Fragment>)}</h2>
      <p>{p.blurb}</p>
      <span className="typewriter" style={{ fontSize: 12, color: 'var(--ink-2)', display: 'block', marginTop: 4 }}>{fmtDate(p.date)}</span>
      <span className="guide-card-more">READ THE POST →</span>
    </a>
  );
}

export function PostGrid({ posts = BLOG_META }) {
  return <div className="grid-3">{posts.map((p, idx) => <PostCard key={p.slug} p={p} i={idx} />)}</div>;
}

function BlogIndex({ missingSlug }) {
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return [...BLOG_META].sort((a, b) => b.date.localeCompare(a.date)).filter((p) => {
      if (cat !== 'all' && p.category !== cat) return false;
      if (!needle) return true;
      return `${p.title} ${p.short} ${p.blurb} ${p.kicker} ${p.description}`.toLowerCase().includes(needle);
    });
  }, [cat, q]);

  return (
    <>
      {missingSlug && (
        <div className="panel gold" style={{ padding: '18px 22px', marginBottom: 32 }}>
          <span className="kicker" style={{ color: 'var(--ink-2)' }}>404 · Post not found</span>
          <p style={{ marginTop: 6, fontWeight: 600 }}>
            We couldn’t find a post at <code className="typewriter">/blog/{missingSlug}</code>. Browse or search all {BLOG_META.length} posts below.
          </p>
        </div>
      )}
      <span className="kicker">The VoxelPort blog</span>
      <h1 className="guide-hero">
        <span className="c-title" data-text="SERVER">SERVER</span><br />
        <span className="c-title green" data-text="BLOG">BLOG</span>
      </h1>
      <p className="lede" style={{ marginTop: 18 }}>
        Minecraft news, plugin picks, hosting comparisons and troubleshooting — written as we run the servers ourselves.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 32, alignItems: 'center' }}>
        {BLOG_CATEGORIES.map(([id, label]) => (
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
          placeholder="Search posts…"
          aria-label="Search posts"
          style={{ flex: '1 1 200px', minWidth: 0, border: '3px solid var(--ink)', padding: '10px 12px', font: 'inherit', background: 'var(--card)', boxShadow: '3px 3px 0 var(--ink)' }}
        />
      </div>

      <div style={{ marginTop: 36 }}>
        {shown.length > 0 ? (
          <PostGrid posts={shown} />
        ) : (
          <div className="panel" style={{ padding: '26px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h2 className="h-display" style={{ fontSize: 32 }}>NO POSTS MATCH THAT SEARCH</h2>
              <p style={{ marginTop: 4, color: 'var(--ink-2)' }}>Try another keyword or show all {BLOG_META.length} posts.</p>
            </div>
            <button type="button" className="btn sm cream" onClick={() => { setCat('all'); setQ(''); }}>SHOW ALL POSTS</button>
          </div>
        )}
      </div>
    </>
  );
}

function BlogArticle({ p }) {
  const toc = blogToc(p);
  const related = BLOG_META.filter((x) => x.slug !== p.slug).slice(0, 3);
  return (
    <>
      <nav className="crumbs typewriter" aria-label="Breadcrumb">
        <a href="/" onClick={onArticleClick}>Home</a> / <a href="/blog" onClick={onArticleClick}>Blog</a> / <span>{p.short}</span>
      </nav>
      <span className="kicker" style={{ display: 'block', marginTop: 18 }}>{p.kicker} · {fmtDate(p.date)}</span>
      <h1 className="guide-title">{p.title}</h1>
      <p className="lede" style={{ marginTop: 14 }}>{p.description}</p>

      <div className="guide-layout">
        <aside className="panel guide-toc">
          <span className="pixel" style={{ fontSize: 11 }}>ON THIS PAGE</span>
          <ol>
            {toc.map((t) => (
              <li key={t.id}><a href={`#${t.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth' }); }}>{t.text}</a></li>
            ))}
          </ol>
          <a className="btn green sm" href="/download" style={{ textAlign: 'center' }} onClick={onArticleClick}>GET VOXELPORT</a>
        </aside>

        <div className="guide-main">
          <article className="guide-body" onClick={onArticleClick} dangerouslySetInnerHTML={{ __html: p.html }} />
          <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_BLOG} />
          <div className="panel" style={{ marginTop: 36, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', background: 'var(--card)' }}>
            <p style={{ flex: '1 1 260px', fontSize: 16, lineHeight: 1.55, color: 'var(--ink-2)' }}><b>Questions about this post?</b> Ask in <b>#help</b> on the VoxelPort Discord.</p>
            <DiscordButton small>ASK ON DISCORD</DiscordButton>
          </div>
        </div>
      </div>

      <div className="section-head" style={{ marginTop: 70, marginBottom: 30 }}>
        <span className="kicker">Keep reading</span>
        <h2 className="h-display h-section">MORE POSTS</h2>
      </div>
      <PostGrid posts={related} />
    </>
  );
}

export default function BlogPage({ slug, onBack }) {
  const p = slug ? findBlogPost(slug) : null;
  const back = (e) => { e?.preventDefault(); onBack(e); };

  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (h && /^[\w-]+$/.test(h)) setTimeout(() => document.getElementById(h)?.scrollIntoView(), 50);
    else window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="zine hb">
      <Nav links={SITE_NAV} onLogo={back} />
      <main lang="en" id="main-content" tabIndex={-1} className="wrap" style={{ paddingTop: 50, paddingBottom: 100 }}>
        {p ? <BlogArticle p={p} /> : <BlogIndex missingSlug={slug} />}
      </main>
      <Footer />
    </div>
  );
}
