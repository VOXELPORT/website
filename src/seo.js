// Per-page SEO data, shared by the app (runtime <title>/meta updates) and by
// scripts/prerender.mjs (static HTML for each route, sitemap). Plain ESM, no JSX.

import { GUIDES_INDEX, findGuide, guidePath } from './guides.js';
import { DISCORD } from './community.js';

export const SITE = 'https://voxelport.in';
export const OG_IMAGE = `${SITE}/og-image.png`;
export const STORE_URL = 'https://apps.microsoft.com/detail/9NGRX9CFNBD6';

export const PAGES = {
  home: {
    path: '/',
    title: 'VoxelPort: Free Minecraft Server Hosting, No Port Forwarding',
    description: 'Free Minecraft server hosting from your PC or Android phone: no sleep, no queue, no RAM cap, no port forwarding. Friends join in seconds, Java + Bedrock crossplay. Free & open source.',
    heading: 'Host a Minecraft server from your PC or Android phone — no port forwarding',
    summary: [
      'VoxelPort is a free, open-source app for Windows, Linux and Android. It creates or imports a Minecraft: Java Edition server, installs the right Java for you, and puts it online through the VoxelPort relay — your router stays shut and your home IP stays private.',
      'Friends join with plain Minecraft using an address like play.voxelport.in:26137, or your own free address like yourname.voxelport.in. Bedrock players on phones and consoles can join too, via one-click Geyser + Floodgate.',
    ],
    points: [
      'No port forwarding, works behind CGNAT',
      'Free custom address: yourname.voxelport.in',
      'Java + Bedrock crossplay with one switch',
      'Vanilla, Paper, Fabric and modpacks',
      'Automatic Java install (Java 25 for Minecraft 26.1+)',
      'Live CPU, RAM and TPS, plus plain-English crash help',
      'Host from a Windows or Linux PC, or an Android phone',
      'No account or login, free and MIT-licensed',
      'A friendly Discord for help, servers and release news',
    ],
  },
  features: {
    path: '/features',
    title: 'VoxelPort Features: Relay, Custom Address, Bedrock Crossplay, Auto Java',
    description: 'Everything VoxelPort does: instant relay with no port forwarding, a free yourname.voxelport.in address, Java + Bedrock crossplay, automatic Java, direct routing for low ping, and plain-English crash help.',
    heading: 'VoxelPort features',
    summary: ['What the VoxelPort app does for the host, and why nobody who joins has to install anything: create a new server or bring your own, get a public address in seconds, and keep your router shut.'],
  },
  compare: {
    path: '/compare',
    title: 'VoxelPort vs playit.gg, ngrok and Port Forwarding',
    description: 'How VoxelPort compares with playit.gg, ngrok and port forwarding for hosting a Minecraft server: signup, vanilla clients, open source, hiding your home IP and setup.',
    heading: 'VoxelPort compared with playit.gg, ngrok and port forwarding',
    summary: ['Generic tunnels work, until they don’t. VoxelPort does one job, Minecraft servers, and sets up the server and Java for you.'],
  },
  faq: {
    path: '/faq',
    title: 'VoxelPort FAQ: Hosting a Minecraft Server Without Port Forwarding',
    description: 'Answers to the common questions about VoxelPort: is it free, do friends need to install anything, Bedrock crossplay, custom addresses, mods and plugins, and your home IP.',
    heading: 'VoxelPort frequently asked questions',
    summary: ['The things people ask before they install VoxelPort, answered in plain words.'],
  },
  download: {
    path: '/download',
    title: 'Download VoxelPort: Windows, Linux and Android (Free)',
    description: 'Download VoxelPort free for Windows (Microsoft Store or direct installer), Linux and Android. No account, no ads. Install notes for SmartScreen and the Android APK.',
    heading: 'Download VoxelPort',
    summary: ['VoxelPort is free for Windows, Linux and Android. Get it from the Microsoft Store, the direct Windows installer, the Linux build on GitHub, or the Android APK.'],
  },
  support: {
    path: '/support',
    title: 'Support VoxelPort: Keep Free Minecraft Hosting Running',
    description: 'VoxelPort is free and has no ads. A small UPI tip keeps the relay online, and supporters get a badge, a pinned server and a short address.',
    heading: 'Support VoxelPort',
    summary: ['VoxelPort has no ads, no accounts and no paid plan. If it saved you a fight with your router, a small tip helps keep the relay online.'],
  },
  community: {
    path: '/community',
    title: 'VoxelPort Discord: Help, Servers and Release News',
    description: 'Join the VoxelPort Discord to get help hosting a Minecraft server, show your server, find players, suggest features and hear about every release first. Free to join.',
    heading: 'The VoxelPort Discord',
    summary: ['The VoxelPort Discord is where people ask for help, show their servers and hear about every release first. You do not need it to use VoxelPort.'],
    points: [
      'Get help with setup, crashes and modpacks',
      'Release announcements with download links',
      'Show your server and find people to play with',
      'Suggest features and report bugs',
    ],
  },
  servers: {
    path: '/servers',
    title: 'Minecraft Server List — Public VoxelPort Servers Online Now',
    description: 'Browse public Minecraft servers hosted with VoxelPort: survival, creative, hardcore and modded, Java and Bedrock. Copy the address and join. Updated live.',
    heading: 'Minecraft server list',
    summary: ['Public Minecraft servers hosted with VoxelPort that are online right now — survival, creative, hardcore and modded, many with Bedrock crossplay. Copy an address and join with vanilla Minecraft.'],
  },
  status: {
    path: '/status',
    title: 'VoxelPort Relay Status — Live Uptime and Ping',
    description: 'Live status of the VoxelPort relay: servers online, players connected, and ping for the direct and Cloudflare routes, measured from your browser.',
    heading: 'VoxelPort relay status',
    summary: ['Live uptime and ping for the VoxelPort relay that connects players to hosted Minecraft servers, on both the direct route and the Cloudflare route.'],
  },
  legal: {
    path: '/legal',
    title: 'License, Privacy & Terms — VoxelPort',
    description: 'VoxelPort’s MIT license, privacy notice, terms of use and trademark notes, in plain words: what data the app and relay handle, and what they never collect.',
    heading: 'VoxelPort legal & policies',
    summary: ['The MIT license, privacy notice, terms of use and trademark notes for the VoxelPort app and relay, in plain words.'],
  },
};

export const FAQ = [
  {
    q: 'How do I host a Minecraft server without port forwarding?',
    a: 'Install VoxelPort, create or import a server, press Start and then Make public. VoxelPort connects your server out to its relay, which gives you a public address. Players connect to the relay, so nothing has to be opened on your router.',
  },
  {
    q: 'Is VoxelPort really free?',
    a: 'Yes. The app and the relay are free and open source under the MIT license. There are no accounts, ads, player limits or paid tiers.',
  },
  {
    q: 'Do my friends need to install anything?',
    a: 'No. Java players use normal Minecraft: Java Edition and paste your address into Multiplayer → Add Server. Bedrock players use their normal game too.',
  },
  {
    q: 'Can Bedrock players on phones and consoles join?',
    a: 'Yes. Turn on “Let Bedrock players join” in your server’s settings and VoxelPort installs Geyser and Floodgate for you (Paper and Fabric servers). Bedrock players join on the same address and port.',
  },
  {
    q: 'Can I get my own server address?',
    a: 'Yes, for free. While your server is public, claim a name and players join with yourname.voxelport.in — no port number needed in Java Edition.',
  },
  {
    q: 'Does it work with mods, plugins and modpacks?',
    a: 'Yes. VoxelPort can set up Vanilla, Paper and Fabric servers, import any server folder you already have, or put any server that is already running online.',
  },
  {
    q: 'Does VoxelPort hide my home IP address?',
    a: 'Yes. Players only ever connect to the relay, never to your PC, so your home IP address isn’t exposed to them.',
  },
  {
    q: 'Where can I get help or ask a question?',
    a: `In the VoxelPort Discord (${DISCORD}): ask in #help, suggest features, and hear about every release first. You do not need Discord to use VoxelPort itself. There are also step-by-step guides on this site.`,
  },
  {
    q: 'How is VoxelPort different from playit.gg or ngrok?',
    a: 'VoxelPort is made only for Minecraft: it sets up the server and Java for you, adds Bedrock crossplay and a free custom address, needs no account, and is fully open source.',
  },
];

/** JSON-LD for the home page. */
export function homeJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'VoxelPort',
      url: `${SITE}/`,
      image: OG_IMAGE,
      description: PAGES.home.description,
      applicationCategory: 'UtilitiesApplication',
      applicationSubCategory: 'Minecraft server hosting',
      operatingSystem: 'Windows 10, Windows 11, Linux, Android',
      softwareVersion: '1.5.0',
      downloadUrl: [STORE_URL, 'https://github.com/VOXELPORT/VoxelPort-App/releases/latest'],
      featureList: [
        'Host a Minecraft server on a Windows/Linux PC or an Android phone, without port forwarding',
        'Works behind CGNAT (Jio, Airtel, mobile data)',
        'No sleep, no queue, no RAM cap',
        'Free custom address: yourname.voxelport.in',
        'Java + Bedrock crossplay (Geyser + Floodgate)',
        'Vanilla, Paper, Fabric and modpacks',
        'Automatic Java install',
        'Live CPU, RAM and TPS, plain-English crash help',
      ],
      keywords: 'free minecraft server hosting, minecraft server without port forwarding, aternos alternative, minecraft server india, java bedrock crossplay',
      isAccessibleForFree: true,
      license: 'https://opensource.org/licenses/MIT',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@type': 'Organization', name: 'VoxelPort', url: `${SITE}/`, logo: `${SITE}/logo.png`, sameAs: ['https://www.instagram.com/voxelport.in/', DISCORD] },
      sameAs: [STORE_URL, 'https://github.com/VOXELPORT/VoxelPort-App', 'https://www.instagram.com/voxelport.in/', DISCORD],
    },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'VoxelPort', url: `${SITE}/` },
  ];
}

/** JSON-LD for the FAQ page (the questions are shown there, so the markup belongs there). */
export function faqJsonLd() {
  return [{
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }];
}

// ─── Runtime helpers (browser only) ─────────────────────────────────────────

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/** Title, description and path for a route key ('home', 'guides', 'guide:<slug>', …). */
export function pageMeta(page) {
  if (page === 'guides') return GUIDES_INDEX;
  if (page.startsWith('guide:')) {
    const g = findGuide(page.slice(6));
    if (g) return { path: guidePath(g), title: g.title, description: g.description, lang: g.lang };
    return GUIDES_INDEX;
  }
  return PAGES[page] || PAGES.home;
}

/** Updates <title> and the page-specific meta tags after a client-side route change. */
export function applyPageMeta(page) {
  const p = pageMeta(page);
  const url = SITE + p.path;
  document.title = p.title;
  document.documentElement.lang = p.lang || 'en';
  setMeta('meta[name="description"]', 'content', p.description);
  setMeta('link[rel="canonical"]', 'href', url);
  setMeta('meta[property="og:url"]', 'content', url);
  setMeta('meta[property="og:title"]', 'content', p.title);
  setMeta('meta[property="og:description"]', 'content', p.description);
  setMeta('meta[name="twitter:title"]', 'content', p.title);
  setMeta('meta[name="twitter:description"]', 'content', p.description);
}

/** Client-side navigation to a site path (e.g. "/servers" or "/#features"). */
export function navigate(href) {
  if (href === window.location.pathname + window.location.hash) return;
  window.history.pushState(null, '', href);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
