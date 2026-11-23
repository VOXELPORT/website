// Lightweight blog metadata (no full HTML bodies), mirroring guides-meta.js so
// the nav, sitemap and SEO helpers don't bundle every post's HTML.

export const BLOG_INDEX = {
  path: '/blog',
  title: 'VoxelPort Blog: Minecraft Server & Hosting News',
  description: 'Minecraft server news, hosting comparisons, plugin picks and update breakdowns from the VoxelPort team.',
};

export const BLOG_CATEGORIES = [
  ['all', 'All Posts'],
  ['updates', 'Minecraft Updates'],
  ['hosting', 'Hosting & Servers'],
  ['plugins', 'Plugins & Mods'],
  ['voxelport', 'VoxelPort News'],
];

export const BLOG_META = [
  {
    slug: 'best-minecraft-server-plugins-2026',
    category: 'plugins',
    date: '2026-11-24',
    title: 'The Best Minecraft Server Plugins for 2026 (Paper & Fabric)',
    short: 'Best plugins for 2026',
    description: 'The Minecraft server plugins worth installing in 2026: essentials, anti-grief, performance and fun plugins for Paper and Fabric, with what each one actually fixes.',
    kicker: 'Plugins',
    blurb: 'Essentials, anti-grief, performance and fun — the plugins worth your server’s first hour.',
  },
  {
    slug: 'minecraft-server-lag-fix-guide',
    category: 'hosting',
    date: '2026-11-24',
    title: 'Minecraft Server Lag: Why It Happens and How to Fix It',
    short: 'Fix server lag',
    description: 'Why a Minecraft server lags: TPS drops, chunk loading, redstone and entity spam explained, with the settings and plugins that actually fix each cause.',
    kicker: 'Troubleshooting',
    blurb: 'TPS drops, chunk loading, redstone and entity spam — what actually causes lag and the fix for each.',
  },
  {
    slug: 'free-vs-paid-minecraft-hosting-2026',
    category: 'hosting',
    date: '2026-11-24',
    title: 'Free vs Paid Minecraft Hosting: What You Actually Get (2026)',
    short: 'Free vs paid hosting',
    description: 'Free Minecraft hosting vs paid plans compared honestly: what you give up for free (sleep, queues, RAM limits) and when paying for a host plan is actually worth it.',
    kicker: 'Hosting · 2026',
    blurb: 'What free hosting actually costs you in sleep, queues and RAM — and when paying is worth it.',
  },
];

export const blogPath = (p) => `/blog/${p.slug}`;
export const findBlogMeta = (slug) => BLOG_META.find((p) => p.slug === slug);
