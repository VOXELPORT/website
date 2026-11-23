// Blog posts (/blog/<slug>). Plain ESM data shared by the React page and
// scripts/prerender.mjs, which writes each post into static HTML so search
// engines see the full text. `html` is trusted, hand-written markup: <h2 id>,
// <p>, <ul>/<ol>, <table>, <code>, <div class="tip">, and site links.
// Mirrors guides.js; kept separate because a blog updates far more often and
// carries its own per-post date instead of one shared "updated" stamp.

export const BLOG = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'best-minecraft-server-plugins-2026',
    date: '2026-11-24',
    title: 'The Best Minecraft Server Plugins for 2026 (Paper & Fabric)',
    short: 'Best plugins for 2026',
    description: 'The Minecraft server plugins worth installing in 2026: essentials, anti-grief, performance and fun plugins for Paper and Fabric, with what each one actually fixes.',
    kicker: 'Plugins',
    blurb: 'Essentials, anti-grief, performance and fun — the plugins worth your server’s first hour.',
    html: `
<p>A fresh Paper or Fabric server is capable but bare: no protection against griefers, no economy, no warps. These are the plugins that solve a real, common problem rather than just adding clutter — install in roughly this order.</p>

<h2 id="essentials">The essentials layer</h2>
<p><b>EssentialsX</b> (Paper) is still the backbone of a small-to-medium survival server: homes, warps, teleport requests, kits and a basic economy, all in one plugin with no configuration required to get something useful. On Fabric, the closest equivalent is a combination of <b>Lithium</b>-friendly mods plus <b>Simple Voice Chat</b> and a lightweight teleport mod, since Fabric's plugin ecosystem favors small, focused mods over one do-everything suite.</p>
<div class="tip"><b>Don't install the whole EssentialsX family at once.</b> EssentialsX, EssentialsXChat and EssentialsXSpawn cover almost everyone's needs; the extra modules (Discord, Protect, AntiBuild) duplicate what dedicated plugins below already do better.</div>

<h2 id="anti-grief">Anti-grief and protection</h2>
<p><b>WorldGuard</b> paired with <b>WorldEdit</b> is the standard for claiming and protecting regions — spawn, shops, and player plots can all be flagged against PvP, block breaking or explosions independently. For a more hands-off, player-driven claim system (useful if you don't want to manually draw every region), <b>GriefPrevention</b> lets players claim land themselves with a simple golden shovel, which scales much better on servers with more than a handful of players.</p>
<p>Pick one or the other, not both — they fight over the same block-protection events and double your plugin's memory footprint for no benefit.</p>

<h2 id="performance">Performance plugins (Paper specific)</h2>
<p>These don't add features; they make the server survive more players and more redstone without the TPS collapsing:</p>
<ul>
  <li><b>Chunky</b> — pre-generates chunks in the background at a controlled rate, so players don't cause lag spikes by exploring new terrain live.</li>
  <li><b>Spark</b> — a profiler, not a fix by itself, but the single most useful tool for finding out what is actually causing your lag before you guess.</li>
  <li><b>ClearLag</b> or a scheduled <code>/kill</code> on dropped items — entity buildup from unclaimed drops is one of the most common, most overlooked lag sources on survival servers.</li>
</ul>

<h2 id="fun">Plugins that keep players around</h2>
<ul>
  <li><b>Vault</b> — not a plugin players notice directly, but the economy bridge almost every shop/job/casino plugin depends on. Install it before you install anything that touches money.</li>
  <li><b>CMI</b> — a heavier alternative to EssentialsX with cosmetics, particle effects and more polish, worth it once your server has an active playerbase that wants more than the basics.</li>
  <li><b>Jobs Reborn</b> — gives players a reason to do mundane tasks (mining, farming, fishing) for a steady income, which keeps new players engaged past their first hour.</li>
</ul>

<h2 id="installing">Installing plugins with VoxelPort</h2>
<p>If you're hosting with VoxelPort, drop <code>.jar</code> files into your server's <code>plugins</code> folder (Paper) or <code>mods</code> folder (Fabric) from the app's file browser, then restart the server from the dashboard. VoxelPort already installs <b>Geyser</b> and <b>Floodgate</b> for you automatically when you turn on Bedrock players — no need to add those yourself.</p>

<div class="tip"><b>One plugin per problem.</b> Before installing anything, name the actual problem it solves. Plugins installed "just in case" are the single biggest cause of slow server startup, plugin conflicts, and mystery crashes months later.</div>
`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'minecraft-server-lag-fix-guide',
    date: '2026-11-24',
    title: 'Minecraft Server Lag: Why It Happens and How to Fix It',
    short: 'Fix server lag',
    description: 'Why a Minecraft server lags: TPS drops, chunk loading, redstone and entity spam explained, with the settings and plugins that actually fix each cause.',
    kicker: 'Troubleshooting',
    blurb: 'TPS drops, chunk loading, redstone and entity spam — what actually causes lag and the fix for each.',
    html: `
<p>"Lag" gets blamed for everything, but a Minecraft server's performance problems almost always trace back to one of four causes. Finding which one you have takes two minutes; guessing wastes hours.</p>

<h2 id="tps">Start with your TPS</h2>
<p>Run <code>/tps</code> (Paper/Spigot) in-game or in console. A healthy server holds <b>20.0</b>. Anywhere from 15-19 is a real but minor slowdown; below 10 is the kind of lag players will actively complain about. If TPS is fine but players still report lag, the problem is network latency (ping), not the server itself — and switching to a closer relay region, or checking your own upload bandwidth, is the actual fix, not a plugin.</p>

<h2 id="causes">The four real causes</h2>
<h3>1. Too many entities</h3>
<p>Dropped items, arrows, boats and especially farmed mobs (villager farms, mob grinders not clearing fast enough) pile up and each one costs the server a tiny amount of processing every tick. A redstone farm producing 10,000 items an hour that nobody collects is a slow, silent TPS killer.</p>
<p><b>Fix:</b> a plugin like ClearLag, or simply raising <code>item-despawn-rate</code> in <code>paper-world-defaults.yml</code> so dropped items vanish sooner.</p>

<h3>2. Redstone and hopper spam</h3>
<p>Hoppers transferring items every tick, and large redstone contraptions running constantly, are expensive. A single active hopper line isn't a problem; forty of them moving items nonstop across a big farm complex is.</p>
<p><b>Fix:</b> raise <code>hopper-transfer</code> in <code>spigot.yml</code> from the default (slowing hopper speed slightly, usually unnoticeable to players) — this alone recovers meaningful TPS on farm-heavy servers.</p>

<h3>3. Chunk loading and view distance</h3>
<p>Every chunk a player can see has to be loaded, lit and kept simulated. A view distance of 10-12 is standard; pushing it to 16+ "for a better view" multiplies server load for a benefit most players won't even notice.</p>
<p><b>Fix:</b> lower <code>view-distance</code> and <code>simulation-distance</code> in <code>server.properties</code> — simulation distance in particular can usually be 2-4 lower than view distance with zero complaints.</p>

<h3>4. Not enough RAM, or RAM set wrong</h3>
<p>Giving a server too little RAM causes garbage-collection pauses that look exactly like lag spikes. Giving it too much RAM (more than the world and playerbase need) doesn't help and can actually make GC pauses longer. For a small survival server (1-6 players), 2-4 GB is usually plenty; more only helps once you're regularly over 10-15 concurrent players or running a heavily modded pack.</p>

<h2 id="checklist">A five-minute lag checklist</h2>
<ol>
  <li>Run <code>/tps</code> — confirm it's actually a server-side problem, not ping.</li>
  <li>Install Spark and run a 60-second profile during a laggy moment to see exactly what's eating time.</li>
  <li>Check for unclaimed item/mob buildup near farms.</li>
  <li>Lower view-distance/simulation-distance a notch if you haven't touched the defaults.</li>
  <li>Confirm RAM allocation matches player count, not a guess.</li>
</ol>

<div class="tip"><b>Hosting with VoxelPort?</b> The app shows live CPU, RAM and TPS right in the dashboard, so you can catch a lag spike as it happens instead of waiting for a player to complain.</div>
`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'which-minecraft-version-for-new-server',
    date: '2026-11-27',
    title: 'Which Minecraft Version Should You Pick for a New Server?',
    short: 'Picking a version',
    description: 'Latest vs an older stable Minecraft version for a new server: plugin and mod support, player compatibility, and which version actually makes sense for Vanilla, Paper and Fabric servers in 2026.',
    kicker: 'Getting started',
    blurb: 'Newest isn’t always best — how to actually choose a version for Vanilla, Paper or Fabric.',
    html: `
<p>"Just use the latest version" is right more often than not, but not always — and getting it wrong means either missing features your players expect, or fighting broken plugins and mods for months. Here's how to actually decide.</p>

<h2 id="vanilla">Vanilla: almost always latest</h2>
<p>If you're not running any plugins or mods, there's very little reason not to run the newest stable release. Vanilla has no compatibility layer to break, and new versions bring content most players want to see (new blocks, mobs, structures). The only exception is a server built around a specific older-version experience on purpose — a 1.8 PvP server, for instance, where the point is the old combat mechanics, not new content.</p>

<h2 id="paper">Paper (plugins): one version behind is often safer</h2>
<p>Plugin authors need time to update after a Minecraft release, and some popular plugins lag weeks or months behind a major version. Running the very latest version the day it drops means a real chance that a plugin you depend on — an essentials suite, an anti-grief plugin, a core economy plugin — simply isn't compatible yet.</p>
<p>The safer pattern: check your must-have plugins' update pages first, then pick the newest version those plugins already fully support, rather than the newest version Minecraft has shipped. For a brand-new server with no plugins chosen yet, latest is fine; for one built around a specific plugin stack, work backward from the plugins.</p>

<h2 id="fabric">Fabric (mods): compatibility is tighter and slower</h2>
<p>Mods are more version-sensitive than plugins — a mod built for one Minecraft version frequently won't load at all on the next, let alone work correctly, because mods hook much deeper into the game's internals than plugins do. This is especially true for modpacks, where every single mod in the pack has to support the same version simultaneously.</p>
<p>For Fabric, decide the version by looking at <b>Fabric API</b> and your core mods' supported versions first — never the newest Minecraft release in isolation. A modpack built for 1.21.x will often not have a 1.22.x counterpart for weeks or months after release.</p>

<h2 id="player-compat">Will your players even notice?</h2>
<p>Minecraft clients can usually connect to a server one or two major versions behind their own without issue (the client just reports which versions are supported), so running a slightly older stable version rarely locks out players — it's your plugins and mods version-locking the server, not the players' ability to connect.</p>

<h2 id="deciding">A simple way to decide</h2>
<table>
<thead><tr><th>Server type</th><th>Pick</th></tr></thead>
<tbody>
<tr><td>Vanilla, no plugins</td><td>Latest stable release</td></tr>
<tr><td>Paper with a plugin stack already chosen</td><td>Newest version all your must-have plugins fully support</td></tr>
<tr><td>Fabric with a modpack</td><td>Whatever version the modpack (and Fabric API) targets — not Minecraft's latest</td></tr>
<tr><td>New server, plugins/mods not decided yet</td><td>Latest stable — you can always pin a version once you know what you're installing</td></tr>
</tbody>
</table>

<div class="tip"><b>Changing version later is usually fine for worlds</b>, moving forward — Minecraft reliably upgrades old world saves to newer versions. Going backward to an older version after upgrading is the move that risks world corruption, so always back up before changing versions either direction.</div>
`,
  },
];

export const blogPath = (p) => `/blog/${p.slug}`;
export const findBlogPost = (slug) => BLOG.find((p) => p.slug === slug);

/** Section headings for the table of contents: [{ id, text }]. Same shape as guideToc. */
export function blogToc(p) {
  return [...p.html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map((m) => ({ id: m[1], text: m[2].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&') }));
}

/** JSON-LD for a blog post: BlogPosting and breadcrumbs. */
export function blogJsonLd(p, site) {
  const url = site + blogPath(p);
  return [
    {
      '@context': 'https://schema.org', '@type': 'BlogPosting',
      headline: p.title, description: p.description, url, mainEntityOfPage: url,
      image: `${site}/og-image.png`, datePublished: p.date, dateModified: p.date,
      author: { '@type': 'Organization', name: 'VoxelPort', url: `${site}/` },
      publisher: { '@type': 'Organization', name: 'VoxelPort', url: `${site}/`, logo: { '@type': 'ImageObject', url: `${site}/logo.png` } },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'VoxelPort', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site}/blog` },
        { '@type': 'ListItem', position: 3, name: p.short, item: url },
      ],
    },
  ];
}
