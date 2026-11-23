// Google AdSense: one slot component. The loader script itself is already in index.html (loads on every
// page, which is what AdSense's site verification needs); this just renders a unit once you have a slot id.
// Until VITE_ADSENSE_CLIENT is set, every AdSlot renders nothing, so pages are unaffected before approval.
import { useEffect, useRef } from 'react';

export const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT || '';

/**
 * A single ad unit. Pass the slot id from the AdSense dashboard once you create one there
 * (Ads > By ad unit > Display ads). Until VITE_ADSENSE_CLIENT is set, this renders nothing —
 * safe to place in pages ahead of approval.
 */
export function AdSlot({ slot, format = 'auto', style, fullWidthResponsive = true, label = 'Advertisement' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ADSENSE_CLIENT || !slot || !ref.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense throws if the slot already rendered (e.g. a fast route change back to this page) — harmless.
    }
  }, [slot]);

  if (!ADSENSE_CLIENT || !slot) return null;

  return (
    <div className="ad-slot" style={{ margin: '28px 0', textAlign: 'center', ...style }}>
      <span className="ad-slot-label typewriter" aria-hidden="true">{label}</span>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}
