import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { startFx } from './fx.js'

startFx()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Vercel Web Analytics and Speed Insights: cookie-free page-view counts and real-user performance numbers. They load after the page
// is interactive (a separate chunk, never blocking the first paint) and only report from a Vercel deployment: elsewhere, and on
// localhost, the scripts do nothing. Both are served from this site's own /_vercel/ path, so the Content Security Policy needs no
// extra host.
if (import.meta.env.PROD) {
  const later = window.requestIdleCallback || ((f) => setTimeout(f, 1500))
  later(() => {
    import('@vercel/analytics').then((m) => m.inject())
    import('@vercel/speed-insights').then((m) => m.injectSpeedInsights())
  })
}
