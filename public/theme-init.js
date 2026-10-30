// Apply the saved choice before the page paints. New visitors follow their device.
(() => {
  let saved;
  try { saved = localStorage.getItem('voxelport-theme'); } catch { /* Storage is optional. */ }
  const theme = saved === 'light' || saved === 'dark'
    ? saved
    : window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
})();
