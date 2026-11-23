// Page copy that more than one page (or the build) uses. Plain ESM with no JSX.
import { EXAMPLE_ADDR } from './data.js';

/** The links every page's nav shares. (The Discord button is added by Nav itself.) */
export const SITE_NAV = [
  ['Features', '/features'],
  ['Guides', '/guides'],
  ['Blog', '/blog'],
  ['Servers', '/servers'],
  ['Download', '/download'],
  ['Support', '/support'],
];

export const HOME_COPY = {
  category: ["Open-source Minecraft server manager", "Gestor de servidores de Minecraft de código abierto"],
  tagline: ["Your world. Your hardware.", "Tu mundo. Tu equipo."],
  intro: ["Run a Minecraft server on your Windows PC or Android phone. Give friends an address they can join without port forwarding.", "Ejecuta un servidor de Minecraft en tu PC con Windows o en tu teléfono Android. Comparte una dirección con tus amigos sin abrir puertos en el router."],
  crossplay: ["Java + Bedrock crossplay", "Juego cruzado Java + Bedrock"],
  openSource: ["Free and open source", "Gratis y de código abierto"],
  playerAccounts: ["Players need no account", "Los jugadores no necesitan cuenta"],
  seeApp: ["See the app", "Ver la aplicación"],
  download: ["Download", "Descargar"],
  releaseLabel: ["Latest desktop release", "Última versión para PC"],
  releaseIntro: ["Create or import a server, manage it from the live console, and make it public from the same app.", "Crea o importa un servidor, adminístralo desde la consola en vivo y hazlo público desde la aplicación."],
  releaseLink: ["What's new", "Novedades"],
  walkthroughLabel: ["Product walkthrough", "Demostración"],
  walkthroughTitle: ["VoxelPort in action", "VoxelPort en acción"],
  walkthroughIntro: ["Start a server, make it public, and share the address. Your world and files stay on your device.", "Inicia un servidor, hazlo público y comparte la dirección. Tu mundo y tus archivos se quedan en tu dispositivo."],
  videoLabel: ['Silent walkthrough of the VoxelPort Windows app', 'Demostración sin audio de VoxelPort para Windows'],
  platforms: ["Windows and Android", "Windows y Android"],
  managementTitle: ["Manage and share your server", "Administra y comparte tu servidor"],
  managementIntro: ["Create a Vanilla, Paper, or Fabric server, or import one you already run. Manage backups, plugins, and players from VoxelPort.", "Crea un servidor Vanilla, Paper o Fabric, o importa uno que ya tengas. Gestiona las copias de seguridad, los complementos y los jugadores desde VoxelPort."],
  downloadFor: ['Download for', 'Descargar para'],
  allDownloads: ["All downloads", "Todas las descargas"],
  discordRequirement: ["Server operators sign in with Discord and join the VoxelPort Discord server.", "Los administradores inician sesión con Discord y se unen al servidor de VoxelPort."],
  connection: ["Your device runs the server. VoxelPort's relay connects players to it, even behind CGNAT.", "Tu dispositivo ejecuta el servidor. El relé de VoxelPort conecta a los jugadores, incluso detrás de CGNAT."],
  exploreTitle: ["Explore VoxelPort", "Explora VoxelPort"],
  socialTitle: ["Find us online", "Encuéntranos en línea"],
};

export const HOME_EXPLORE = [
  ['Features', 'Server management, relays and crossplay', 'Gestión de servidores, relés y juego cruzado', '/features'],
  ['Guides', 'Set up and share a server', 'Configura y comparte un servidor', '/guides'],
  ['Server list', 'Find a public Minecraft server', 'Encuentra un servidor público de Minecraft', '/servers'],
  ['Community', 'Meet other VoxelPort users', 'Conoce a otros usuarios de VoxelPort', '/community'],
  ['Help & FAQ', 'Answers to common questions', 'Respuestas a las preguntas más comunes', '/faq'],
];

export const TICKER = ['No port forwarding', 'A free .voxelport.in address', 'Bedrock players too', 'Java set up for you', 'Players need no account', 'Open source', 'Free to use'];

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
  { sprite: 'bolt', title: 'INSTANT RELAY', desc: 'Your server dials out to the relay and gets a public address, usually within seconds of pressing Make public. No DNS, no static IP, no router changes.', home: true },
  { sprite: 'grass', title: 'VANILLA CLIENTS', desc: 'Friends join with plain Minecraft. No client mods, no launchers, no patches — ever.', home: true },
  { sprite: 'lock', title: 'ROUTER STAYS SHUT', desc: 'Nothing to open on your side. Players connect to the relay, never to your home IP.' },
  { sprite: 'card', title: 'FRIENDS NEED NOTHING', desc: 'Friends join with plain Minecraft: no account, no login, no mods. You join our Discord server once to use the app, and a private device key is created on first run. Free, with no card.' },
  { sprite: 'signal', title: 'DIRECT ROUTING', desc: 'Your server connects straight to the relay, a shorter path than the Cloudflare route on many networks (13 ms vs 151 ms in one test from Delhi; yours will vary), and falls back to Cloudflare automatically if a network blocks it.' },
  { sprite: 'heart', title: 'FREE & OPEN', desc: 'MIT-licensed app and relay. Read the code, fork it, or run your own relay.', home: true },
  { sprite: 'house', title: 'YOUR ADDRESS', desc: 'Every server gets a free address like play.voxelport.in:26137. Supporters can claim yourname.voxelport.in, with no port number.', home: true },
  { sprite: 'diamond', title: 'BEDROCK TOO', desc: 'One switch installs Geyser + Floodgate, so phone, console and PC players share one world.', home: true },
  { sprite: 'head1', title: 'CRASH HELP', desc: 'If your server stops, VoxelPort says why in plain words — and offers the fix. Plus live CPU, RAM and TPS.', home: true },
];

export const STEPS = [
  { n: '1', title: 'INSTALL', desc: 'Grab the app — Windows or Android. Free, and you join our Discord once.', sprite: 'grass' },
  { n: '2', title: 'HIT START', desc: 'Create or import a server and press Start. Java is handled for you.', sprite: 'bolt' },
  { n: '3', title: 'COPY ADDRESS', desc: `VoxelPort hands you an address like ${EXAMPLE_ADDR}.`, sprite: 'card' },
  { n: '4', title: 'FRIENDS JOIN', desc: 'They paste it into Multiplayer → Add Server. That’s it.', sprite: 'heart' },
];

// Last checked against the sources below. Only what those pages state is claimed; "Not checked" means we did not verify it.
export const COMPARE = {
  verifiedOn: '2026-11-20',
  sources: [
    ['playit.gg', 'https://playit.gg/', 'Home page: free tier, "no port forwarding", Premium from $3/month, supported games'],
    ['playit.gg agent', 'https://github.com/playit-cloud/playit-agent', 'Source repository of the agent (BSD-2-Clause license)'],
    ['ngrok pricing', 'https://ngrok.com/pricing', 'Plans: Free, Hobbyist and pay-as-you-go; TCP on the free plan needs credit-card verification'],
    ['VoxelPort', 'https://github.com/VOXELPORT/VoxelPort-App', 'This project: MIT-licensed app and relay'],
  ],
  definitions: [
    ['Server management', 'Creating, installing, starting and configuring the Minecraft server itself (versions, Java, console, backups, plugins).'],
    ['Connectivity', 'Giving a server on your own device an address players can reach without opening a port on your router. This is what a tunnel or relay does.'],
    ['Hosting', 'Running the server on the provider’s computers. None of the tools here do that: the server stays on your hardware.'],
  ],
};

export const RIVALS = [
  { name: 'VoxelPort', tag: 'Server manager + relay', note: 'Manages a Minecraft server on your own device and connects it through its relay. Made for Minecraft only; free and open source (MIT). Your device must stay on.', verdict: 'Management and connectivity', us: true },
  { name: 'playit.gg', tag: 'Game tunnel', note: 'A tunnel for game servers, with Minecraft Java and Bedrock among 21 listed games and custom TCP/UDP tunnels for others. It connects a server you run yourself; it does not create or manage the Minecraft server. Free tier, with Premium from $3 a month.', verdict: 'Connectivity' },
  { name: 'ngrok', tag: 'General tunnel', note: 'A general-purpose tunnelling service, strongest for HTTP and development. Has a free plan; TCP endpoints on it need credit-card verification, and Hobbyist and pay-as-you-go plans are metered. Does not manage a Minecraft server.', verdict: 'Connectivity' },
  { name: 'Port forwarding', tag: 'Router setting', note: 'Free and direct, but needs access to your router, exposes your home IP to players, and does not work where the ISP shares one public address between customers (CGNAT).', verdict: 'Connectivity, by hand' },
];

const Y = { k: 'yes', t: 'YES' };
const N = { k: 'no', t: 'NO' };
const P = (t) => ({ k: 'part', t });
/** Feature, then VoxelPort, playit.gg, ngrok, port forwarding. Each cell is what the sources above state. */
export const TABLE = [
  ['Creates and manages the Minecraft server', Y, N, N, N],
  ['No router port forwarding needed', Y, Y, Y, N],
  ['Players join with plain Minecraft', Y, P('Not checked'), P('Not checked'), Y],
  ['Free to use', Y, P('Free tier; Premium $3/mo+'), P('Free plan; paid tiers'), P('Your ISP')],
  ['Open source', P('App and relay (MIT)'), P('Agent (BSD-2-Clause)'), P('Not checked'), P('n/a')],
  ['Players connect to a provider address, not your home IP', Y, Y, P('Not checked'), N],
  ['Works for games other than Minecraft', N, Y, Y, Y],
  ['Runs the server on its own computers (hosting)', N, N, N, N],
];

/** Where each page of the site is, for the "explore" tiles on the home page. */
export const EXPLORE = [
  { href: '/features', tag: 'The powers', title: 'FEATURES', blurb: 'Everything the app does, and how direct routing cuts your lag.', sprite: 'bolt' },
  { href: '/guides', tag: 'Field manual', title: 'GUIDES', blurb: 'Step-by-step help: Bedrock, Android, mods, crashes.', sprite: 'grass' },
  { href: '/compare', tag: 'Rivals', title: 'COMPARE', blurb: 'VoxelPort next to playit.gg, ngrok and port forwarding.', sprite: 'diamond' },
  { href: '/faq', tag: 'Your questions', title: 'FAQ', blurb: 'The questions people ask before they install.', sprite: 'card' },
  { href: '/servers', tag: 'Live directory', title: 'SERVER LIST', blurb: 'Public servers that are online right now. Copy one and join.', sprite: 'house' },
  { href: '/status', tag: 'Live ping', title: 'RELAY STATUS', blurb: 'Is the relay up? Ping measured from your own browser.', sprite: 'signal' },
  { href: '/uptime', tag: 'Reliability', title: 'UPTIME REPORT', blurb: 'How often each relay and service was up: percentages and 90 days of history.', sprite: 'tower' },
  { href: '/support', tag: 'Keep it free', title: 'SUPPORT', blurb: 'A tip jar, and the perks that come with a thank-you.', sprite: 'heart' },
  { href: '/legal', tag: 'The fine print', title: 'PRIVACY & LEGAL', blurb: 'What we collect (almost nothing), the license and terms.', sprite: 'lock' },
];
