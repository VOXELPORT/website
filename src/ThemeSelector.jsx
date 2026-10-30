import { useEffect, useState } from 'react';

export default function ThemeSelector() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111614' : '#FAF9F5');
  }, [theme]);

  const select = (next) => {
    setTheme(next);
    try { localStorage.setItem('voxelport-theme', next); } catch { /* Theme still works when storage is unavailable. */ }
  };

  return (
    <div className="v3-theme-selector" role="group" aria-label="Color theme">
      <button type="button" aria-label="Light theme" title="Light theme" aria-pressed={theme === 'light'} onClick={() => select('light')}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></svg>
      </button>
      <button type="button" aria-label="Dark theme" title="Dark theme" aria-pressed={theme === 'dark'} onClick={() => select('dark')}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.5 13.5A8.6 8.6 0 0 1 10.5 3 8.7 8.7 0 1 0 20.5 13.5Z" /></svg>
      </button>
    </div>
  );
}
