import { useEffect, useRef } from 'react';

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * The 3D voxel world behind the home hero. three.js is fetched after the first paint, so the
 * page text shows immediately; the painted landscape stays underneath as the fallback.
 */
export default function HeroWorld({ labels }) {
  const host = useRef(null);
  const world = useRef(null);
  const latest = useRef(labels);

  useEffect(() => {
    latest.current = labels;
    world.current?.setLabels(labels);
  }, [labels]);

  useEffect(() => {
    if (!host.current || !webglAvailable()) return undefined;
    let cancelled = false;
    const start = () => import('./world3d.js').then(({ mountWorld }) => {
      if (cancelled || !host.current) return;
      world.current = mountWorld(host.current, latest.current);
    }).catch(() => { /* the static backdrop stays */ });
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 200));
    const handle = idle(start);
    return () => {
      cancelled = true;
      (window.cancelIdleCallback || clearTimeout)(handle);
      world.current?.dispose();
      world.current = null;
    };
  }, []);

  return <div className="w3" ref={host} aria-hidden="true" />;
}
