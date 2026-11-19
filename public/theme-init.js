// Apply the saved choice before the page paints. New visitors follow their device.
(() => {
  let saved;
  try { saved = localStorage.getItem('voxelport-theme'); } catch { /* Storage is optional. */ }
  const theme = saved === 'light' || saved === 'dark'
    ? saved
    : window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
})();

// With JavaScript, the static text copy (.prerender) stays hidden until React replaces it, so it cannot shift as fonts load.
// (Lives here, not inline in the HTML, so the Content Security Policy can forbid inline scripts.)
document.documentElement.classList.add("js");
