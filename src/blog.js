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
    slug: 'free-vs-paid-minecraft-hosting-2026',
    date: '2026-11-24',
    title: 'Free vs Paid Minecraft Hosting: What You Actually Get (2026)',
    short: 'Free vs paid hosting',
    description: 'Free Minecraft hosting vs paid plans compared honestly: what you give up for free (sleep, queues, RAM limits) and when paying for a host plan is actually worth it.',
    kicker: 'Hosting · 2026',
    blurb: 'What free hosting actually costs you in sleep, queues and RAM — and when paying is worth it.',
    html: `
<p>"Free Minecraft hosting" always has a catch — the question is which catch you can live with. Here's what each option actually costs you, honestly, including VoxelPort's own trade-off.</p>

<h2 id="free-hosts">Free hosting services (Aternos, Minehut, Falix)</h2>
<p>These run your server on their shared hardware for free, paid for by limiting you in ways that only show up once you're actually playing:</p>
<ul>
  <li><b>Sleep timers</b> — the server shuts down after a few minutes of no players, and the next person to join has to wait for it to boot back up (often 1-3 minutes).</li>
  <li><b>Start queues</b> — at peak hours, you may wait behind other servers for a slot to even start.</li>
  <li><b>RAM caps</b> — usually 1-4 GB shared across everyone currently on that physical machine, which gets worse the more popular the free tier gets.</li>
  <li><b>Plugin/mod restrictions</b> — some are blocked outright to protect the shared hardware from abuse.</li>
</ul>
<p>These are genuinely fine for a casual server with 1-3 friends who don't mind a short wait when the server's been idle.</p>

<h2 id="paid-hosts">Paid hosting plans</h2>
<p>A paid VPS or Minecraft-specific host (Shockbyte, Apex, BisectHosting, or a general VPS like Hetzner/OVH you configure yourself) removes sleep timers and queues entirely, gives you dedicated RAM, and usually allows any plugin or mod. The real cost is money — typically $5-15/month for a small server, scaling up with player count and RAM.</p>
<p>Paying makes sense once: your server is active enough that a sleep timer genuinely annoys people, you're running a heavier modpack that needs guaranteed RAM, or you want to run it as a long-term community project rather than a weekend thing with friends.</p>

<h2 id="own-pc">Running it on your own PC or phone (VoxelPort)</h2>
<p>This is a third option that's different from both: the server runs on hardware you already own, so there's no monthly cost and no shared-hardware RAM cap — you can give it as much RAM as your device can spare. VoxelPort's relay replaces the "hosting" part (connectivity, so friends can join without port forwarding) without touching the "running the server" part (that's still your PC or phone).</p>
<p>The trade-off is the mirror image of a paid host's: your device has to stay on while people play, since the server isn't running on someone else's always-on hardware. For a group of friends who mostly play together at scheduled times, that's rarely a real downside. For a server meant to be always-on and joinable by strangers at any hour, a paid host's 24/7 hardware availability is the better fit.</p>

<h2 id="which">Which one should you pick?</h2>
<table>
<thead><tr><th>Situation</th><th>Best fit</th></tr></thead>
<tbody>
<tr><td>A few friends, play together at set times</td><td>Your own PC/phone (VoxelPort) — no cost, no RAM cap, no sleep timer</td></tr>
<tr><td>Casual, don't mind short wait times</td><td>Free hosting (Aternos, Minehut)</td></tr>
<tr><td>Public server, needs to be online 24/7</td><td>Paid hosting — the only option with guaranteed uptime when your own device is off</td></tr>
<tr><td>Heavy modpack, need guaranteed high RAM</td><td>Paid hosting, or your own PC if it has the RAM to spare</td></tr>
</tbody>
</table>

<div class="tip">See the full breakdown in our guide on <a href="/guides/free-minecraft-server-hosting">free Minecraft server options</a>, which compares the exact limits of Aternos, Minehut and Falix side by side.</div>
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
