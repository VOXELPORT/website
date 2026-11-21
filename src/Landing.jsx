import { HOME_COPY, HOME_EXPLORE } from './content.js';
import { DL_ANDROID, DL_WIN, DISCORD, GITHUB_APP, INSTAGRAM, useDetectedOS } from './data.js';
import { ES_NAV, useLanguage } from './language.js';
import { RELEASES } from './release.js';
import { navigate, isModifiedClick } from './seo.js';
import { V2Nav, V2Footer } from './V2Shell.jsx';

function PageLink({ href, children, ...props }) {
  return <a {...props} href={href} onClick={(event) => {
    if (isModifiedClick(event)) return;
    event.preventDefault();
    navigate(href);
    window.scrollTo(0, 0);
  }}>{children}</a>;
}

function startShowcase(video) {
  if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  video.muted = true;
  video.play().catch(() => {
    // Playback controls remain available when the browser blocks autoplay.
  });
}

export default function Landing() {
  const { text } = useLanguage();
  const os = useDetectedOS();
  const download = os === 'android' ? DL_ANDROID : DL_WIN;

  return <div className="v2d vp-home" id="top">
    <V2Nav />

    <main id="main-content" tabIndex={-1}>
      <section className="vp-hero" aria-labelledby="vp-title">
        <div className="vp-container vp-hero-grid">
          <div className="vp-intro">
            <p className="vp-kicker">{text(...HOME_COPY.category)}</p>
            <h1 id="vp-title">VoxelPort<span>.</span></h1>
            <p className="vp-tagline">{text(...HOME_COPY.tagline)}</p>
            <p className="vp-lede">{text(...HOME_COPY.intro)}</p>
            <div className="vp-actions">
              <PageLink href="/download" className="vp-button vp-primary">{text(...HOME_COPY.download)}</PageLink>
              <a href="#showcase" className="vp-button">{text(...HOME_COPY.seeApp)}</a>
            </div>
            <ul className="vp-facts">
              <li>{text(...HOME_COPY.crossplay)}</li>
              <li>{text(...HOME_COPY.openSource)}</li>
              <li>{text(...HOME_COPY.playerAccounts)}</li>
            </ul>
          </div>
          <aside className="vp-release">
            <p className="vp-kicker">{text(...HOME_COPY.releaseLabel)}</p>
            <PageLink className="vp-release-title" href="/new-app">VoxelPort {RELEASES.windows.version}</PageLink>
            <p>{text(...HOME_COPY.releaseIntro)}</p>
            <PageLink className="vp-text-link" href="/new-app">{text(...HOME_COPY.releaseLink)}</PageLink>
          </aside>
        </div>
      </section>

      <section className="vp-feature" id="showcase" aria-labelledby="vp-feature-title">
        <div className="vp-container">
          <div className="vp-section-head">
            <div>
              <p className="vp-kicker">{text(...HOME_COPY.walkthroughLabel)}</p>
              <h2 id="vp-feature-title">{text(...HOME_COPY.walkthroughTitle)}</h2>
            </div>
            <p>{text(...HOME_COPY.walkthroughIntro)}</p>
          </div>
          <article className="vp-showcase" id="workflow">
            <div className="vp-media">
              <video ref={startShowcase} controls muted playsInline preload="none" poster="/showcase/app-share-address.webp" aria-label={text(...HOME_COPY.videoLabel)}>
                <source src="/showcase/desktop.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="vp-showcase-copy" id="how">
              <p className="vp-kicker">{text(...HOME_COPY.platforms)}</p>
              <h3>{text(...HOME_COPY.managementTitle)}</h3>
              <p>{text(...HOME_COPY.managementIntro)}</p>
              <div className="vp-actions" id="download">
                <a href={download} className="vp-button vp-primary">{text(...HOME_COPY.downloadFor)} {os === 'android' ? 'Android' : 'Windows'}</a>
                <PageLink href="/download" className="vp-button">{text(...HOME_COPY.allDownloads)}</PageLink>
              </div>
              <p className="vp-download-note">{text(...HOME_COPY.discordRequirement)}</p>
            </div>
          </article>
          <p className="vp-connection" id="architecture">{text(...HOME_COPY.connection)}</p>
        </div>
      </section>

      <section className="vp-container vp-explore" id="why" aria-labelledby="vp-explore-title">
        <h2 id="vp-explore-title">{text(...HOME_COPY.exploreTitle)}</h2>
        <ul className="vp-directory">
          {HOME_EXPLORE.map(([title, description, spanish, href]) => <li key={href}>
            <PageLink href={href}><strong>{text(title, ES_NAV[href])}</strong><span>{text(description, spanish)}</span></PageLink>
          </li>)}
        </ul>
        <div className="vp-social">
          <h3>{text(...HOME_COPY.socialTitle)}</h3>
          <ul>
            <li><a href={DISCORD}>Discord</a></li>
            <li><a href={GITHUB_APP}>GitHub</a></li>
            <li><a href={INSTAGRAM}>Instagram</a></li>
          </ul>
        </div>
      </section>
    </main>

    <V2Footer />
  </div>;
}
