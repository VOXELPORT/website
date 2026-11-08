// Per-page SEO data, shared by the app (runtime <title>/meta updates) and by
// scripts/prerender.mjs (static HTML for each route, sitemap). Plain ESM, no JSX.

import { GUIDES_INDEX, findGuideMeta, guidePath } from './guides-meta.js';
import { DISCORD } from './community.js';

export const SITE = 'https://voxelport.in';
export const OG_IMAGE = `${SITE}/og-image.png`;

export const PAGES = {
  motd: {
    path: '/motd', title: 'Minecraft MOTD Editor: Colors, Gradients, Preview',
    description: 'Create a two-line Minecraft Java server MOTD with colors, gradients, formatting and a live preview. Copy or download a server.properties snippet for free.',
    heading: 'Minecraft MOTD editor',
    summary: ['Customize your Minecraft server greeting with standard colors, hex colors, gradients and text styles. Preview it and export a ready-to-use motd property.'],
  },
  home: {
    path: '/',
    title: 'VoxelPort: Free Minecraft Server Hosting, No Port Forwarding',
    description: 'Free Minecraft server hosting from your PC or Android phone: no sleep, no queue, no RAM cap, no port forwarding. Relays in India and Europe. Java + Bedrock.',
    heading: 'Host a Minecraft server from your PC or Android phone — no port forwarding',
    summary: [
      'VoxelPort is a free, open-source app for Windows and Android. It creates or imports a Minecraft: Java Edition server, installs the right Java for you, and puts it online through the VoxelPort relay — your router stays shut and your home IP stays private.',
      'Friends join with plain Minecraft using a free address like play.voxelport.in:26137; supporters can claim a custom address like yourname.voxelport.in. Bedrock players on phones and consoles can join too, via one-click Geyser + Floodgate.',
    ],
    points: [
      'No port forwarding, works behind CGNAT',
      'Free address, custom names for supporters',
      'Java + Bedrock crossplay with one switch',
      'Vanilla, Paper, Fabric and modpacks',
      'Automatic Java install (Java 25 for Minecraft 26.1+)',
      'Live CPU, RAM and TPS, plus plain-English crash help',
      'Host from a Windows PC or an Android phone',
      'Free and MIT-licensed; hosts join our Discord server',
      'A friendly Discord for help, servers and release news',
    ],
  },
  features: {
    path: '/features',
    title: 'VoxelPort Features: Relay, Custom Address, Bedrock',
    description: 'What VoxelPort does: instant relay with no port forwarding, a free public address, Java + Bedrock crossplay, automatic Java and plain-English crash help.',
    heading: 'VoxelPort features',
    summary: ['What the VoxelPort app does for the host, and why nobody who joins has to install anything: create a new server or bring your own, get a public address in seconds, and keep your router shut.'],
  },
  compare: {
    path: '/compare',
    title: 'VoxelPort vs playit.gg, ngrok and Port Forwarding',
    description: 'How VoxelPort compares with playit.gg, ngrok and port forwarding for Minecraft: signup, vanilla clients, open source, hiding your home IP and setup.',
    heading: 'VoxelPort compared with playit.gg, ngrok and port forwarding',
    summary: ['Generic tunnels work, until they don’t. VoxelPort does one job, Minecraft servers, and sets up the server and Java for you.'],
  },
  faq: {
    path: '/faq',
    title: 'VoxelPort FAQ: Minecraft Server Without Port Forwarding',
    description: 'Answers about VoxelPort: is it free, do friends install anything, Bedrock crossplay, custom addresses, mods and plugins, and your home IP.',
    heading: 'VoxelPort frequently asked questions',
    summary: ['The things people ask before they install VoxelPort, answered in plain words.'],
  },
  download: {
    path: '/download',
    title: 'Download VoxelPort: Windows and Android (Free)',
    description: 'Download VoxelPort free for Windows and Android. No ads, and hosts join our Discord server once. SmartScreen and Android APK install notes.',
    heading: 'Download VoxelPort',
    summary: ['VoxelPort is free for Windows and Android. Get the Windows installer or the Android APK.'],
  },
  support: {
    path: '/support',
    title: 'Support VoxelPort: Keep Free Minecraft Hosting Running',
    description: 'VoxelPort is free and has no ads. A small UPI tip keeps the relay online, and supporters get a badge, a pinned server and a short address.',
    heading: 'Support VoxelPort',
    summary: ['VoxelPort has no ads and hosting is free. If it saved you a fight with your router, a small tip helps keep the relay online.'],
  },
  community: {
    path: '/community',
    title: 'VoxelPort Discord: Help, Servers and Release News',
    description: 'Join the VoxelPort Discord for help hosting a Minecraft server, to show your server, find players, suggest features and get release news first.',
    heading: 'The VoxelPort Discord',
    summary: ['The VoxelPort Discord is where people ask for help, show their servers and hear about every release first. You do not need it to use VoxelPort.'],
    points: [
      'Get help with setup, crashes and modpacks',
      'Release announcements with download links',
      'Show your server and find people to play with',
      'Suggest features and report bugs',
    ],
  },
  about: {
    path: '/about',
    title: 'Who Made VoxelPort: The Developer, the Story and the Stack',
    description: 'VoxelPort is made by Garv Verma, a student in India. How it started (Jio/Airtel CGNAT), how it is built (open source, Electron + Go) and Local Miner.',
    heading: 'Who made VoxelPort',
    summary: [
      'VoxelPort is a one-person, open-source project by Garv Verma (Trazverse), a Game Design student at Poornima University in India. It started because port forwarding does not work on Jio and Airtel (CGNAT), so hosting a Minecraft server for friends was painful.',
      'It is vibe-coded with an AI coding assistant, built with Electron, Go, React and TypeScript, and it comes from Local Miner, the project and developer (Aditya) who got Garv into building it. Akshat Mehta (nerkoux), his all-time friend, manages the server. The code is open (MIT) and has hundreds of automated tests.',
    ],
    points: [
      'Who: Garv Verma (Trazverse), student developer, India',
      'How it started: a Fabric mod that grew into a desktop app and an Android app',
      'How it is made: AI-assisted (vibe-coded), open source, tested',
      'Comes from Local Miner (github.com/LocalMiner), whose developer Aditya inspired it',
      'Server managed by Akshat Mehta (nerkoux), an all-time friend',
    ],
  },
  team: {
    path: '/team',
    title: 'Join the VoxelPort Team: Moderators, Devs, Testers',
    description: 'VoxelPort needs Discord moderators, developers, Android testers, translators and guide writers. Volunteer roles, site credit and a say in what is built.',
    heading: 'Join the VoxelPort team',
    summary: [
      'VoxelPort is a one-person project that is growing, and it needs help. There is no budget yet, so every role is volunteer: you get credit, a say in what gets built and early access to builds.',
    ],
    points: [
      'Discord moderators (Hindi and Hinglish speakers especially)',
      'Developers: Electron, Go, Android, React, TypeScript',
      'Beta testers for the Android app and the desktop app',
      'Translators, guide writers and Minecraft creators',
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
    q: 'Is VoxelPort moving to a new app?',
    a: 'Yes. VoxelPort was rebuilt on newer technology: the new app (2.0 beta, Windows) is about 3 MB instead of over 100 MB and does the same things, and new features only come to it. In your current app (1.18.0) press “Update to the new VoxelPort”: it downloads and checks the new app, installs it, brings your servers, backups, VoxelPort ID, address and settings across, then removes the old app. Your server folders and worlds are never touched, and if anything goes wrong the old app and your data stay as they are. You sign in with Discord once in the new app. Microsoft Store users: the Store cannot install another app, so download the new one from the download page, open it and use its banner to bring your data over, then remove the Store version.',
  },
  {
    q: 'Windows 11 says Smart App Control blocked the installer. What do I do?',
    a: 'The new app is not code-signed yet, so with Smart App Control on, Windows blocks its installer and there is no “Run anyway” button. To install it, switch Smart App Control off: Settings › Privacy & security › Windows Security › App & browser control › Smart App Control settings › Off. Windows cannot turn it back on later without reinstalling Windows, so if you would rather not, keep using your current VoxelPort, which keeps working.',
  },
  {
    q: 'How do I host a Minecraft server without port forwarding?',
    a: 'Install VoxelPort, create or import a server, press Start and then Make public. VoxelPort connects your server out to its relay, which gives you a public address. Players connect to the relay, so nothing has to be opened on your router.',
  },
  {
    q: 'Is VoxelPort really free?',
    a: 'Yes. The app and the relay are free and open source under the MIT license. There are no ads or player limits, and players need no account. Hosts sign in with Discord and join our Discord server.',
  },
  {
    q: 'Do my friends need to install anything?',
    a: 'No. Java players use normal Minecraft: Java Edition and paste your address into Multiplayer → Add Server. Bedrock players use their normal game too.',
  },
  {
    q: 'Is there a relay in Europe?',
    a: 'Yes. VoxelPort has a relay in India and one in Europe (from app version 1.11). The Region setting is on Auto by default and picks the faster one for you; you can also choose a region by hand. Custom addresses are only on the India relay for now.',
  },
  {
    q: 'Does it work behind DS-Lite or CGNAT?',
    a: 'Yes. DS-Lite and CGNAT block incoming IPv4 connections, which breaks port forwarding. VoxelPort needs no incoming connection: your PC connects out to the relay, so it works on those connections too.',
  },
  {
    q: 'Can Bedrock players on phones and consoles join?',
    a: 'Yes. Turn on “Let Bedrock players join” in your server’s settings and VoxelPort installs Geyser and Floodgate for you (Paper and Fabric servers). Bedrock players join on the same address and port.',
  },
  {
    q: 'Can I get my own server address?',
    a: 'Yes, as a supporter. Supporters can claim a custom name so players join with yourname.voxelport.in, with no port number needed in Java Edition. Everyone gets a free address like play.voxelport.in:26137.',
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
    a: `In the VoxelPort Discord (${DISCORD}): ask in #help, suggest features, and hear about every release first. Friends who only play need no Discord at all; hosts sign in with Discord in the app. There are also step-by-step guides on this site.`,
  },
  {
    q: 'How do I keep my address when I get a new PC or phone?',
    a: 'Back it up first. In the app, open Address backup and choose a passphrase of at least 12 characters. The app locks your address key with it on your device and saves only the locked copy to your Discord account, so VoxelPort cannot read it and cannot recover a forgotten passphrase. On the new PC or phone, sign in with Discord, open Address backup and restore it. The PC app and the Android app use the same backup, so you can move between them. It needs the latest version of the app.',
  },
  {
    q: 'How is VoxelPort different from playit.gg or ngrok?',
    a: 'VoxelPort is made only for Minecraft: it sets up the server and Java for you, adds Bedrock crossplay and a free public address (custom names for supporters), asks hosts to sign in with Discord and join our server instead of making a password account, and is fully open source.',
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
      operatingSystem: 'Windows 10, Windows 11, Android',
      softwareVersion: '1.5.0',
      downloadUrl: ['https://github.com/VOXELPORT/VoxelPort-App/releases/latest'],
      featureList: [
        'Host a Minecraft server on a Windows PC or an Android phone, without port forwarding',
        'Works behind CGNAT (Jio, Airtel, mobile data)',
        'No sleep, no queue, no RAM cap',
        'Free address, custom names for supporters',
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
      sameAs: ['https://github.com/VOXELPORT/VoxelPort-App', 'https://www.instagram.com/voxelport.in/', DISCORD],
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
  if (page === 'notfound') {
    return {
      path: typeof window !== 'undefined' ? window.location.pathname : '/404',
      title: 'Page Not Found — VoxelPort',
      description: PAGES.home.description,
    };
  }
  if (page === 'guides') return GUIDES_INDEX;
  if (page.startsWith('guide:')) {
    const g = findGuideMeta(page.slice(6));
    if (g) return { path: guidePath(g), title: g.title, description: g.description, lang: g.lang };
    return {
      path: typeof window !== 'undefined' ? window.location.pathname : '/guides',
      title: 'Guide Not Found — VoxelPort',
      description: GUIDES_INDEX.description,
    };
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

/** True when a click uses modifier keys or a non-primary mouse button (new tab/window). */
export function isModifiedClick(e) {
  return !!(e && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e.button !== undefined && e.button !== 0)));
}

/** Client-side navigation to a site path (e.g. "/servers" or "/#features"). */
export function navigate(href) {
  if (href === window.location.pathname + window.location.hash) return;
  window.history.pushState(null, '', href);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
