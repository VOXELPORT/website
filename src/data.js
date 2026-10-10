// Shared links, live-data hooks and pixel-art data for the site.
import { useEffect, useState } from 'react';

// ─── Links ────────────────────────────────────────────────────────────────────
export const GITHUB_APP = 'https://github.com/VOXELPORT/VoxelPort-App';
export const GITHUB_ORG = 'https://github.com/VOXELPORT';
export const DL_STORE = 'https://apps.microsoft.com/detail/9NGRX9CFNBD6';
export const DL_WIN = 'https://github.com/VOXELPORT/VoxelPort-App/releases/latest/download/VoxelPort-Setup.exe';
export const DL_WIN_PORTABLE = 'https://github.com/VOXELPORT/VoxelPort-App/releases/latest/download/VoxelPort-Portable.exe';
export const DL_LINUX = 'https://github.com/VOXELPORT/VoxelPort-App/releases/latest/download/VoxelPort-Linux.tar.gz';

export const RELAY_STATUS_URL = 'https://relay.voxelport.in/api/status';
export const EXAMPLE_ADDR = 'play.voxelport.in:26137';

// ─── Live data ────────────────────────────────────────────────────────────────

/** Polls the relay's public status endpoint. state: 'loading' | 'online' | 'offline'. */
export function useRelayStatus(intervalMs = 20000) {
  const [s, setS] = useState({ state: 'loading', tunnels: null, players: null });
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const ctl = new AbortController();
        const t = setTimeout(() => ctl.abort(), 8000);
        const r = await fetch(RELAY_STATUS_URL, { signal: ctl.signal, cache: 'no-store' });
        clearTimeout(t);
        const j = await r.json();
        if (alive) setS({ state: j.online ? 'online' : 'offline', tunnels: j.tunnels ?? 0, players: j.players ?? 0 });
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
