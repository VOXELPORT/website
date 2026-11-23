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
  {
    slug: 'java-bedrock-crossplay-minecraft-server',
    category: 'hosting',
    date: '2026-11-27',
    title: 'Java and Bedrock Crossplay on the Same Minecraft Server (2026 Guide)',
    short: 'Java + Bedrock crossplay',
    description: 'How to let Java and Bedrock (phone, console, Windows) players join the same Minecraft server: Geyser and Floodgate explained, what breaks, and how to fix skins, inventory and commands.',
    kicker: 'Crossplay',
    blurb: 'How Geyser and Floodgate let phone, console and PC players share one world — and what actually breaks.',
  },
  {
    slug: 'which-minecraft-version-for-new-server',
    category: 'hosting',
    date: '2026-11-27',
    title: 'Which Minecraft Version Should You Pick for a New Server?',
    short: 'Picking a version',
    description: 'Latest vs an older stable Minecraft version for a new server: plugin and mod support, player compatibility, and which version actually makes sense for Vanilla, Paper and Fabric servers in 2026.',
    kicker: 'Getting started',
    blurb: 'Newest isn’t always best — how to actually choose a version for Vanilla, Paper or Fabric.',
  },
];

export const blogPath = (p) => `/blog/${p.slug}`;
export const findBlogMeta = (slug) => BLOG_META.find((p) => p.slug === slug);
