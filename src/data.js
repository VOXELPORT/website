// Shared links, live-data hooks and pixel-art data for the site.
import { useEffect, useState } from 'react';

// ─── Links ────────────────────────────────────────────────────────────────────
export const GITHUB_APP = 'https://github.com/VOXELPORT/VoxelPort-App';
export const INSTAGRAM = 'https://www.instagram.com/voxelport.in/';
export const GITHUB_ORG = 'https://github.com/VOXELPORT';
export { DISCORD } from './community.js';
export const DL_STORE = 'https://apps.microsoft.com/detail/9NGRX9CFNBD6';
// Direct Windows installer from GitHub (not code-signed yet, so SmartScreen warns once).
export const DL_WIN = 'https://github.com/VOXELPORT/VoxelPort-App/releases/latest/download/VoxelPort-Setup.exe';
export const DL_LINUX = 'https://github.com/VOXELPORT/VoxelPort-App/releases/latest/download/VoxelPort-Linux.tar.gz';
// Android app (host a server from the phone). Points to the install guide,
// which links the sideload APK on GitHub Releases (sideloading needs the steps).
export const DL_ANDROID = '/guides/host-minecraft-server-android-phone';

// One relay per region; the app picks the closest. Counts and the server
// list combine both.
export const RELAYS = [
  { id: 'in', label: 'India', base: 'https://relay.voxelport.in' },
];
export const RELAY_STATUS_URL = 'https://relay.voxelport.in/api/status';
export const EXAMPLE_ADDR = 'play.voxelport.in:26137';

// Donations (UPI, India). The QR in public/upi-qr.svg encodes UPI_LINK.
export const UPI_ID = 'trazhub@upi';
export const UPI_LINK = 'upi://pay?pa=trazhub@upi&pn=VoxelPort&cu=INR&tn=Support%20VoxelPort';

// ─── Live data ────────────────────────────────────────────────────────────────

/** Polls the relay's public status endpoint. state: 'loading' | 'online' | 'offline'. */
export function useRelayStatus(intervalMs = 20000) {
  const [s, setS] = useState({ state: 'loading', tunnels: null, players: null });
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const all = await Promise.all(RELAYS.map(async (relay) => {
          const ctl = new AbortController();
          const t = setTimeout(() => ctl.abort(), 8000);
          try {
            const r = await fetch(relay.base + '/api/status', { signal: ctl.signal, cache: 'no-store' });
            return await r.json();
          } catch {
            return null;
          } finally { clearTimeout(t); }
        }));
        const up = all.filter((j) => j && j.online);
        if (!up.length) throw new Error('no relay reachable');
        const sum = (k) => up.reduce((n, j) => n + (j[k] ?? 0), 0);
        if (alive) setS({ state: 'online', tunnels: sum('tunnels'), players: sum('players') });
      } catch {
        if (alive) setS((p) => ({ ...p, state: 'offline' }));
      }
    };
    load();
    const id = setInterval(load, intervalMs);
    return () => { alive = false; clearInterval(id); };
  }, [intervalMs]);
  return s;
}

/** Latest published release tag for the app (from GitHub, cached per session). */
export function useLatestReleases() {
  const [v, setV] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('vp-app-release')) || { app: null }; } catch { return { app: null }; }
  });
  useEffect(() => {
    if (v.app) return;
    let alive = true;
    fetch('https://api.github.com/repos/VOXELPORT/VoxelPort-App/releases/latest')
      .then((r) => (r.ok ? r.json() : null)).then((j) => (j && j.tag_name) || null).catch(() => null)
      .then((app) => {
        if (!alive) return;
        setV({ app });
        try { if (app) sessionStorage.setItem('vp-app-release', JSON.stringify({ app })); } catch { /* storage unavailable */ }
      });
    return () => { alive = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return v;
}

// ─── Pixel art ────────────────────────────────────────────────────────────────

export const PAL = {
  O: '#15120F', // ink outline
  G: '#6DBE45', g: '#4E9A2F', // grass
  D: '#8B5A36', d: '#6B4226', s: '#A27752', // dirt
  V: '#5FAE3B', v: '#3F7F25', // logo green
  C: '#43C8D8', c: '#2A93A6', w: '#BFF4F9', // diamond
  R: '#C8262B', r: '#8E1A1E', p: '#F28B8B', // heart / red
  Y: '#F6CB2F', y: '#C99A12', // gold
  S: '#9A958D', t: '#6E6A63', // stone
  K: '#FFFBF2', // cream
  B: '#2E5FA8', b: '#1F4378', // blue
  P: '#D9A066', // skin-ish (generic)
  H: '#5A3A22', // hair-ish
};

export const SPRITES = {
  logo: [
    'OOOO.....OOOO',
    'OVVO.....OVVO',
    'OVVO.....OVVO',
    'OvVVO...OVVvO',
    '.OVVO...OVVO.',
    '.OvVVO.OVVvO.',
    '..OVVO.OVVO..',
    '..OvVVOVVvO..',
    '...OVVVVVO...',
    '...OvVVVvO...',
    '....OVVVO....',
    '.....OOO.....',
  ],
  grass: [
    'OOOOOOOOOOOOOOOO',
    'OGGgGGGGgGGGgGGO',
    'OGgGGGgGGGGgGGgO',
    'OGGGgGGGGgGGGGGO',
    'OgGGGGgGGGGGgGGO',
    'OGgDGGgDGGgGDGgO',
    'ODDDgDDDdDDgDDDO',
    'ODsDDDDDDDDDDsDO',
    'ODDDDdDDsDDDDDDO',
    'ODdDDDDDDDDdDDDO',
    'ODDDsDDDDdDDDDsO',
    'ODDDDDDdDDDDDDDO',
    'ODsDDDDDDDDsDDDO',
    'ODDDDdDDDDDDDdDO',
    'ODDDDDDDsDDDDDDO',
    'OOOOOOOOOOOOOOOO',
  ],
  diamond: [
    '...OOOOOO...',
    '..OwwCCCcO..',
    '.OwwCCCCccO.',
    'OwCCCCCCCccO',
    'OCCCCCCCCccO',
    '.OCCCCCCccO.',
    '..OCCCCccO..',
    '...OCCccO...',
    '....OCcO....',
    '.....OO.....',
  ],
  heart: [
    '.OO...OO.',
    'OpRO.ORRO',
    'OpRRORRRO',
    'ORRRRRRrO',
    '.ORRRRrO.',
    '..ORRrO..',
    '...OrO...',
    '....O....',
  ],
  lock: [
    '...OOOO...',
    '..OSSSSO..',
    '.OSO..OSO.',
    '.OSO..OSO.',
    'OOOOOOOOOO',
    'OYYYYYYYyO',
    'OYYYOOYYyO',
    'OYYYOOYYyO',
    'OYYYYYYYyO',
    'OyyyyyyyyO',
    'OOOOOOOOOO',
  ],
  bolt: [
    '.....OOOO',
    '....OYYyO',
    '...OYYyO.',
    '..OYYyO..',
    '.OYYYYYO.',
    'OOOOYyO..',
    '...OYO...',
    '..OYO....',
    '.OyO.....',
    '.OO......',
  ],
  signal: [
    '..........OO',
    '..........OO',
    '.......OO.OO',
    '.......OO.OO',
    '....OO.OO.OO',
    '....OO.OO.OO',
    '.OO.OO.OO.OO',
    '.OO.OO.OO.OO',
  ],
  card: [
    'OOOOOOOOOOOO',
    'OKKKKKKKKKKO',
    'OKOOOKKKKKKO',
    'OKOBOKSSSSKO',
    'OKOOOKKKKKKO',
    'OKKKKKSSSKKO',
    'OKKKKKKKKKKO',
    'OOOOOOOOOOOO',
  ],
  house: [
    '......OO......',
    '.....OrrO.....',
    '....OrRRrO....',
    '...OrRRRRrO...',
    '..OrRRRRRRrO..',
    '.OOOOOOOOOOOO.',
    '..OKKKKKKKKO..',
    '..OKBBKKBBKO..',
    '..OKBBKKBBKO..',
    '..OKKKKKKKKO..',
    '..OKKKODOKKO..',
    '..OKKKODOKKO..',
    '..OOOOOOOOOO..',
  ],
  tower: [
    '...OOOOOO...',
    '...OCCCCO...',
    '...OCwCcO...',
    '...OCCCcO...',
    '....OOOO....',
    '....OSSO....',
    '...OSStSO...',
    '...OStSSO...',
    '..OSSStSSO..',
    '..OStSSStO..',
    '.OSSSStSSSO.',
    '.OOOOOOOOOO.',
  ],
  head1: [
    'OOOOOOOO',
    'OHHHHHHO',
    'OHPPPPHO',
    'OPKOOKPO',
    'OPPPPPPO',
    'OPPOOPPO',
    'OPPPPPPO',
    'OOOOOOOO',
  ],
  head2: [
    'OOOOOOOO',
    'OYYYYYYO',
    'OYPPPPYO',
    'OPKBBKPO',
    'OPPPPPPO',
    'OPPRRPPO',
    'OPPPPPPO',
    'OOOOOOOO',
  ],
  head3: [
    'OOOOOOOO',
    'OGGGGGGO',
    'OgGGGGgO',
    'OGOOGOOO',
    'OGGGGGGO',
    'OGGOOGGO',
    'OGgGGgGO',
    'OOOOOOOO',
  ],
};
