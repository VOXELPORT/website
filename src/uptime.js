import { useSyncExternalStore } from 'react';

// The uptime report: a monitor on our web server probes every public VoxelPort service once a minute and keeps the history
// (see deploy/uptime). The nav pill, the home page and /uptime all read the same file; this module fetches it once per
// minute for the whole page, however many components ask.
export const UPTIME_URL = 'https://voxelport.in/dl/uptime.json';
export const STALE_MS = 5 * 60 * 1000;
const DAY = 86400000;

let snapshot = { state: 'loading', data: null, error: '', now: 0 };
const listeners = new Set();
let timer = null;

async function load() {
  try {
    const res = await fetch(UPTIME_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    snapshot = { state: 'ready', data, error: '', now: Date.now() };
  } catch (e) {
    snapshot = { ...snapshot, state: snapshot.data ? 'ready' : 'error', error: String(e.message || e) };
  }
  listeners.forEach((l) => l());
}

function subscribe(callback) {
  listeners.add(callback);
  if (!timer) {
    load();
    timer = setInterval(load, 60000);
  }
  return () => {
    listeners.delete(callback);
    if (!listeners.size) {
      clearInterval(timer);
      timer = null;
    }
  };
}

/** The raw report, for /uptime. */
export function useUptimeReport() {
  return useSyncExternalStore(subscribe, () => snapshot, () => snapshot);
}

/** One-glance summary for the nav and the home page. Every number says what it covers. */
export function summarize({ state, data, now }) {
  if (state === 'loading') return { status: 'loading' };
  if (!data) return { status: 'error' };
  const stale = now - data.updated > STALE_MS;
  const down = data.targets.filter((t) => !t.up);
  const relays = data.targets.filter((t) => t.group === 'Relays');
  const relayPct = relays.length ? Math.min(...relays.map((t) => t.pct30 ?? 100)) : null;
  const monitoredDays = (data.updated - data.since) / DAY;
  // last 30 days, all services together: checks passed / checks made, per day
  const days = [];
  for (let i = 29; i >= 0; i -= 1) {
    const key = new Date(now - i * DAY).toISOString().slice(0, 10);
    let u = 0;
    let t = 0;
    for (const target of data.targets) {
      const d = target.days.find((x) => x.d === key);
      if (d) { u += d.u; t += d.t; }
    }
    days.push({ key, u, t });
  }
  return {
    status: stale ? 'stale' : down.length ? 'down' : 'ok',
    down,
    up: data.targets.length - down.length,
    total: data.targets.length,
    relayPct,
    windowDays: Math.min(30, monitoredDays),
    since: data.since,
    updated: data.updated,
    days,
  };
}

export function useUptime() {
  return summarize(useUptimeReport());
}

export const fmtPct = (v) => (v === null || v === undefined ? '—' : `${v.toFixed(v === 100 ? 0 : 2)}%`);
