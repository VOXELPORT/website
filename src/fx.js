/*
 * Site-wide motion, applied by delegation so every page (including lazily loaded ones) gets it
 * without per-component code:
 *   - cards lean toward the cursor ([data-tilt], .panel, .guide-card)
 *   - a soft light follows the cursor across cards ([data-spot], .panel, .guide-card)
 *   - sections rise in as they scroll into view (.rv, plus the main blocks of inner pages)
 * Nothing runs for people who prefer reduced motion; tilt is mouse/trackpad only.
 */

const TILT = '[data-tilt], .v2d-inner main .panel:not(.page-hero *), .v2d-inner .guide-card';
const SPOT = '[data-spot], [data-tilt], .v2d-inner main .panel, .v2d-inner .guide-card';
const AUTO_REVEAL = '.v2d-inner main :is(.page-hero, .section-head, .panel, .guide-card, .faq-item, .page-cta, .table-scroll)';

export function startFx() {
  if (typeof window === 'undefined') return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------------------------------------------------------- tilt + spotlight */
  let current = null;
  let raf = 0;
  let last = null;
  const apply = () => {
    raf = 0;
    if (!last) return;
    const { el, x, y } = last;
    const r = el.getBoundingClientRect();
    const px = (x - r.left) / r.width;
    const py = (y - r.top) / r.height;
    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
    if (el.matches(TILT) && !reduce) {
      const max = Number(el.dataset.tiltMax) || (r.width > 520 ? 3 : 6);
      el.style.setProperty('--rx', `${((0.5 - py) * max).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${((px - 0.5) * max).toFixed(2)}deg`);
      el.classList.add('is-tilting');
    }
  };
  const leave = (el) => {
    el.classList.remove('is-tilting');
    el.style.removeProperty('--rx');
    el.style.removeProperty('--ry');
    el.style.setProperty('--mx', '-999px');
  };
  if (fine) {
    document.addEventListener('pointermove', (e) => {
      const el = e.target instanceof Element ? e.target.closest(SPOT) : null;
      if (current && current !== el) leave(current);
      current = el;
      if (!el) return;
      last = { el, x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
    document.addEventListener('pointerleave', () => { if (current) leave(current); current = null; });
  }

  /* ---------------------------------------------------------------- reveal on scroll */
  if (reduce || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  const scan = () => {
    document.querySelectorAll(AUTO_REVEAL).forEach((el) => {
      if (!el.classList.contains('rv')) el.classList.add('rv', 'rv-auto');
    });
    document.querySelectorAll('.rv:not([data-rv])').forEach((el) => {
      el.dataset.rv = '1';
      // already on screen when the page renders: show at once rather than animate in from nothing
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) el.classList.add('in', 'rv-now');
      else io.observe(el);
    });
  };
  document.documentElement.classList.add('fx');
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; scan(); });
  }).observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
  scan();
}
