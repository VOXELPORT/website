// Page copy that more than one page (or the build) uses. Plain ESM with no JSX.
import { EXAMPLE_ADDR } from './data.js';

/** The links every page's nav shares. (The Discord button is added by Nav itself.) */
export const SITE_NAV = [
  ['Features', '/features'],
  ['Guides', '/guides'],
  ['Servers', '/servers'],
  ['Download', '/download'],
  ['Support', '/support'],
];

export const TICKER = ['No port forwarding', 'Your own .voxelport.in address', 'Bedrock players too', 'Java set up for you', 'No signup', 'Open source', 'Free forever'];

export const PATHS = [
  {
    tag: 'New server', color: 'green', sprite: 'grass', title: 'START FROM SCRATCH',
    desc: 'Pick Vanilla, Paper or Fabric and a version. VoxelPort downloads the server, installs the right Java and starts it for you.',
    points: ['Right Java version installed automatically', 'Official, checksum-verified downloads', 'Live console, players & ping'],
  },
  {
    tag: 'Your server', color: 'gold', sprite: 'diamond', title: 'BRING YOUR OWN',
    desc: 'Already have a world, a modpack or a server running somewhere else? Import the folder or point VoxelPort at its port and go public.',
    points: ['Import any server folder', 'Tunnel a server that’s already running', 'Modpacks & any server jar'],
  },
];

// `home: true` marks the six that the home page shows; /features shows all nine.
export const FEATURES = [
  { sprite: 'bolt', title: 'INSTANT RELAY', desc: 'Your server dials out to the relay and gets a public address in seconds. No DNS, no static IP, no router.', home: true },
  { sprite: 'grass', title: 'VANILLA CLIENTS', desc: 'Friends join with plain Minecraft. No client mods, no launchers, no patches — ever.', home: true },
  { sprite: 'lock', title: 'ROUTER STAYS SHUT', desc: 'Nothing to open on your side. Players connect to the relay, never to your home IP.' },
  { sprite: 'card', title: 'NO SIGNUP', desc: 'No account, no login, no token to copy. A private device key is created on first run. (Discord is where we hang out, not a requirement.)' },
  { sprite: 'signal', title: 'DIRECT ROUTING', desc: 'Hosts connect straight to the relay for ~10–20 ms pings, and fall back to Cloudflare automatically if a network blocks it.' },
  { sprite: 'heart', title: 'FREE & OPEN', desc: 'MIT-licensed app and relay. Read the code, fork it, or run your own relay.', home: true },
  { sprite: 'house', title: 'YOUR OWN ADDRESS', desc: 'Claim yourname.voxelport.in for free. Friends join without typing a port number.', home: true },
  { sprite: 'diamond', title: 'BEDROCK TOO', desc: 'One switch installs Geyser + Floodgate, so phone, console and PC players share one world.', home: true },
  { sprite: 'head1', title: 'CRASH HELP', desc: 'If your server stops, VoxelPort says why in plain words — and offers the fix. Plus live CPU, RAM and TPS.', home: true },
];

export const STEPS = [
  { n: '1', title: 'INSTALL', desc: 'Grab the app — Windows, Linux or Android. No account needed.', sprite: 'grass' },
  { n: '2', title: 'HIT START', desc: 'Create or import a server and press Start. Java is handled for you.', sprite: 'bolt' },
  { n: '3', title: 'COPY ADDRESS', desc: `VoxelPort hands you an address like ${EXAMPLE_ADDR}.`, sprite: 'card' },
  { n: '4', title: 'FRIENDS JOIN', desc: 'They paste it into Multiplayer → Add Server. That’s it.', sprite: 'heart' },
];

export const RIVALS = [
  { name: 'VoxelPort', tag: 'Made for MC', note: 'Built for Minecraft only. Vanilla clients, no signup, one simple app, fully open source.', verdict: '✓ The right tool', us: true },
  { name: 'playit.gg', tag: 'General tunnel', note: 'Works for lots of games, but it’s a generic agent with freemium limits and no Minecraft tuning.', verdict: '~ Freemium' },
  { name: 'ngrok', tag: 'Dev tunnel', note: 'Great for webhooks and HTTP. Clunky for game servers, and TCP sits behind paid tiers.', verdict: '~ Not for games' },
  { name: 'Port forwarding', tag: 'The old way', note: 'Needs router access, exposes your real IP and invites scans. Many ISPs block it anyway (CGNAT).', verdict: '✕ Risky' },
];

const Y = { k: 'yes', t: 'YES' };
const N = { k: 'no', t: 'NO' };
const P = (t) => ({ k: 'part', t });
/** Feature, then VoxelPort, playit.gg, ngrok, port forwarding. */
export const TABLE = [
  ['No port forwarding', Y, Y, Y, N],
  ['Vanilla clients', Y, Y, P('TCP only'), Y],
  ['No signup', Y, P('Freemium'), P('Account'), Y],
  ['Open source', Y, N, N, P('—')],
  ['Hides your home IP', Y, Y, Y, N],
  ['Sets up Java & server', Y, N, N, N],
  ['Minecraft-specific', Y, N, N, P('Manual')],
];

/** Where each page of the site is, for the "explore" tiles on the home page. */
export const EXPLORE = [
  { href: '/features', tag: 'The powers', title: 'FEATURES', blurb: 'Everything the app does, and how direct routing cuts your lag.', sprite: 'bolt' },
  { href: '/guides', tag: 'Field manual', title: 'GUIDES', blurb: 'Step-by-step help: Bedrock, Android, mods, crashes.', sprite: 'grass' },
  { href: '/compare', tag: 'Rivals', title: 'COMPARE', blurb: 'VoxelPort next to playit.gg, ngrok and port forwarding.', sprite: 'diamond' },
  { href: '/faq', tag: 'Your questions', title: 'FAQ', blurb: 'The questions people ask before they install.', sprite: 'card' },
  { href: '/servers', tag: 'Live directory', title: 'SERVER LIST', blurb: 'Public servers that are online right now. Copy one and join.', sprite: 'house' },
  { href: '/status', tag: 'Live ping', title: 'RELAY STATUS', blurb: 'Is the relay up? Ping measured from your own browser.', sprite: 'signal' },
  { href: '/support', tag: 'Keep it free', title: 'SUPPORT', blurb: 'A tip jar, and the perks that come with a thank-you.', sprite: 'heart' },
  { href: '/legal', tag: 'The fine print', title: 'PRIVACY & LEGAL', blurb: 'What we collect (almost nothing), the license and terms.', sprite: 'lock' },
];
