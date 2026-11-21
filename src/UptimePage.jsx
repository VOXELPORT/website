import { useCallback, useEffect, useState } from 'react';
import { Nav, Footer } from './ui.jsx';
import { SITE_NAV } from './content.js';
import { DISCORD } from './data.js';

// The uptime report: a monitor on our web server probes every public VoxelPort service once a minute and keeps the history
// (see deploy/uptime in the website repo). This page only reads that file.
const UPTIME_URL = 'https://voxelport.in/dl/uptime.json';
const STALE_MS = 5 * 60 * 1000;

const fmtPct = (v) => (v === null || v === undefined ? '—' : `${v.toFixed(v === 100 ? 0 : 2)}%`);
const barColor = (u, t) => {
  if (!t) return 'var(--paper-2)';
  const p = (u / t) * 100;
  return p >= 99.9 ? 'var(--grass)' : p >= 98 ? 'var(--gold)' : 'var(--bad, #ff6b6b)';
};
const ago = (ms, now) => {
  const s = Math.max(0, Math.round((now - ms) / 1000));
  if (s < 90) return 'just now';
  const m = Math.round(s / 60);
  if (m < 90) return `${m} min`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h} h`;
  return `${Math.round(h / 24)} days`;
};
const span = (a, b, now) => {
  const m = Math.max(1, Math.round(((b ?? now) - a) / 60000));
  return m < 90 ? `${m} min` : m < 2880 ? `${Math.round(m / 60)} h` : `${Math.round(m / 1440)} days`;
};

function DayBars({ days, now }) {
  // 90 slots, oldest left; days without data are blank.
  const byDay = new Map(days.map((d) => [d.d, d]));
  const slots = [];
  for (let i = 89; i >= 0; i--) {
    const key = new Date(now - i * 86400000).toISOString().slice(0, 10);
    slots.push([key, byDay.get(key)]);
  }
  return (
    <div style={{ display: 'flex', gap: 2, height: 30, alignItems: 'stretch' }} aria-label="Last 90 days, one bar per day">
      {slots.map(([key, d]) => (
        <div
          key={key}
          title={d ? `${key}: ${fmtPct(Math.round((d.u / d.t) * 10000) / 100)} up` : `${key}: no data yet`}
          style={{ flex: 1, minWidth: 2, background: barColor(d?.u, d?.t), border: '1px solid var(--ink)', opacity: d ? 1 : 0.35 }}
        />
      ))}
    </div>
  );
}

function Row({ t, now }) {
  return (
    <div className="panel" style={{ padding: '16px 20px', marginTop: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>{t.label}</div>
          {t.note && <div className="typewriter" style={{ fontSize: 12, color: 'var(--muted)' }}>{t.note}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="typewriter" style={{ fontSize: 12, color: 'var(--muted)' }}>
            {t.up ? `up for ${span(t.since, null, now)}${t.ms ? ` · ${t.ms} ms` : ''}` : `down for ${span(t.since, null, now)}${t.error ? ` · ${t.error}` : ''}`}
          </span>
          <span className="pixel" style={{ fontSize: 12, padding: '4px 10px', border: '2px solid var(--ink)', background: t.up ? 'var(--grass)' : 'var(--bad, #ff6b6b)', color: '#07090c' }}>{t.up ? 'UP' : 'DOWN'}</span>
        </div>
      </div>
      <div style={{ marginTop: 12 }}><DayBars days={t.days} now={now} /></div>
      <div className="typewriter" style={{ display: 'flex', gap: 22, flexWrap: 'wrap', marginTop: 10, fontSize: 13 }}>
        {[['24 h', t.pct24], ['7 days', t.pct7], ['30 days', t.pct30], ['90 days', t.pct90]].map(([label, v]) => (
          <span key={label}><span style={{ color: 'var(--muted)' }}>{label}</span> <b>{fmtPct(v)}</b></span>
        ))}
      </div>
    </div>
  );
}

export default function UptimePage({ onBack }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [now, setNow] = useState(0);

  const load = useCallback(async () => {
    try {
      const res = await fetch(UPTIME_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
      setNow(Date.now());
      setError('');
    } catch (e) {
      setError(String(e.message || e));
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const first = setTimeout(load, 0);
    const timer = setInterval(load, 60000);
    return () => { clearTimeout(first); clearInterval(timer); };
  }, [load]);

  const back = (e) => { e?.preventDefault(); onBack(e); };
  const stale = data && now - data.updated > STALE_MS;
  const down = data ? data.targets.filter((t) => !t.up) : [];
  const banner = !data
    ? error ? ['REPORT UNAVAILABLE', 'The uptime report could not be loaded. Try again in a minute.', 'var(--gold)'] : ['LOADING…', 'Reading the latest checks.', 'var(--paper-2)']
    : stale ? ['MONITOR NOT REPORTING', `The last check was ${ago(data.updated, now)} ago, so the numbers below may be out of date.`, 'var(--gold)']
    : down.length === 0 ? ['ALL SYSTEMS OPERATIONAL', 'Every service answered its last check.', 'var(--grass)']
    : [`${down.length} ${down.length === 1 ? 'SERVICE IS' : 'SERVICES ARE'} DOWN`, down.map((t) => t.label).join(', '), 'var(--bad, #ff6b6b)'];
  const groups = data ? [...new Set(data.targets.map((t) => t.group))] : [];

  return (
    <div className="zine hb">
      <Nav links={SITE_NAV} relay={null} onLogo={back} />

      <main lang="en" id="main-content" tabIndex={-1} className="wrap" style={{ paddingTop: 60, paddingBottom: 100, maxWidth: 1000 }}>
        <span className="kicker">Checked every minute</span>
        <h1 style={{ fontSize: 'clamp(56px, 10vw, 120px)', fontWeight: 400, lineHeight: .95, marginTop: 10 }}>
          <span className="c-title" data-text="UPTIME">UPTIME</span><br />
          <span className="c-title green" data-text="REPORT">REPORT</span>
        </h1>

        <div className="panel" style={{ marginTop: 34, padding: '18px 22px', background: banner[2], color: !data && !error ? 'var(--ink)' : '#07090c', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span className="h-display" style={{ fontSize: 30, color: 'inherit' }}>{banner[0]}</span>
          <span style={{ fontWeight: 600 }}>{banner[1]}</span>
        </div>

        {/* Reserve the height of the results while they load, so the text below does not jump when they arrive. */}
        {!data && <div aria-hidden="true" style={{ minHeight: 1500 }} />}
        {groups.map((g) => (
          <section key={g} style={{ marginTop: 36 }}>
            <span className="kicker">{g}</span>
            {data.targets.filter((t) => t.group === g).map((t) => <Row key={t.key} t={t} now={now} />)}
          </section>
        ))}

        {data && (
          <section style={{ marginTop: 40 }}>
            <span className="kicker">Recent incidents</span>
            <div className="panel" style={{ padding: '14px 20px', marginTop: 14 }}>
              {data.incidents.length === 0 ? (
                <p style={{ margin: 0 }}>No incidents recorded since the monitor started.</p>
              ) : data.incidents.slice(0, 12).map((i) => (
                <div key={`${i.key}-${i.start}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', padding: '8px 0', borderBottom: '1px dashed var(--muted)' }}>
                  <span><b>{i.label}</b> <span className="typewriter" style={{ color: 'var(--muted)', fontSize: 13 }}>{i.error || ''}</span></span>
                  <span className="typewriter" style={{ fontSize: 13 }}>
                    {new Date(i.start).toLocaleString()} · {i.end ? `lasted ${span(i.start, i.end, now)}` : 'still going'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="panel" style={{ marginTop: 40, padding: '18px 22px' }}>
          <span className="kicker">About these numbers</span>
          <p style={{ marginTop: 8, lineHeight: 1.65 }}>
            A small monitor on our web server asks each service whether it is working once a minute, and tries a second time before it counts a failure.
            Percentages cover the time since monitoring began{data ? ` (${new Date(data.since).toLocaleDateString()})` : ''}, so a new service shows fewer days. This is a
            single viewpoint: if our web server itself is down, this page stops updating and says so above. VoxelPort is a free project run by one person, so none of this is a
            guarantee. See something wrong? Tell us in <b>#help</b> on the <a href={DISCORD} target="_blank" rel="noopener noreferrer">Discord</a>, or check the live ping on the <a href="/status">status page</a>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
