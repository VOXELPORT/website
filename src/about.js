// The /about (who made VoxelPort, how it started, how it is built) and /team (who we need) pages.
// Plain ESM with no JSX so scripts/prerender.mjs can import it for the static HTML and llms.txt.

export const DEV = {
  name: 'Garv Verma',
  handle: 'Trazverse',
  github: 'https://github.com/trazhub',
  linkedin: 'https://www.linkedin.com/in/trazverse',
  email: 'traz@voxelport.in',
};

/** Local Miner: the project that inspired VoxelPort. */
export const LOCALMINER = {
  site: 'https://localm.eu.org',
  github: 'https://github.com/LocalMiner',
  dev: 'Aditya',
  devGithub: 'https://github.com/healer-op',
};

/** The story, one section each. `paras` are plain text. */
export const ABOUT = [
  {
    id: 'who',
    kicker: 'The developer',
    title: 'WHO MADE IT.',
    paras: [
      'VoxelPort is made by me, Garv Verma (online: Trazverse), a Game Design student at Poornima University in India. It is a one-person project: I design it, build it, run the relay, answer the tickets and write the guides.',
      'I am a student with no budget, so everything here is free and open source. If something is broken or confusing, that is on me, and I want to hear about it.',
    ],
  },
  {
    id: 'start',
    kicker: 'How it started',
    title: 'THE PROBLEM.',
    paras: [
      'I wanted to play Minecraft with my friends on a server running on my own PC. That means port forwarding, and on most Indian connections (Jio, Airtel, hostel Wi-Fi) it simply does not work, because many customers share one public IP address (CGNAT). The usual answers were paying for hosting or waiting in a free host’s queue.',
      'So I built a way around it. The first version of VoxelPort was a small Fabric mod. It grew into a desktop app for Windows and Linux that creates the server, installs Java, and puts the server online through a relay. Then came the Microsoft Store version, a Discord community, and an Android app (still in beta) that hosts a server from a phone.',
      'One early lesson: my own internet routed relay traffic through another country, which made the ping about 151 ms. Adding a direct route to the relay, with an automatic fallback, brought it down to about 13 ms. Most of the work since has been this kind of problem.',
    ],
  },
  {
    id: 'how',
    kicker: 'How it is made',
    title: 'HOW I BUILT IT.',
    paras: [
      'VoxelPort is vibe-coded: I build it with an AI coding assistant. I describe what I want, the AI writes the code, and I run it on real PCs and phones, read what breaks, and ship the fixes. I say this openly because it matters when you decide how much to trust it.',
      'To make up for that, the code is open (MIT) for anyone to read, it has hundreds of automated tests and a build pipeline that runs them, and every release is tested before it goes out. It still has bugs, so please report them.',
    ],
    stack: [
      ['Desktop app', 'Electron and Node.js, for Windows and Linux (and the Microsoft Store)'],
      ['Relay', 'Go, on a server in India. Hosts connect out over an encrypted WebSocket; players connect to the public port the relay assigns. It forwards traffic and does not store worlds or player data'],
      ['Android app', 'Runs a Java server on the phone with a bundled Java runtime and a Go tunnel (beta)'],
      ['Website', 'React and Vite, with every page pre-rendered so search engines can read it'],
      ['Discord bot', 'TypeScript: support tickets, AI answers in English, Hindi and Hinglish, release announcements, moderation tools'],
      ['Builds', 'GitHub Actions for tests, installers and releases'],
    ],
  },
  {
    id: 'inspiration',
    kicker: 'Where the idea came from',
    title: 'INSPIRED BY LOCAL MINER.',
    paras: [
      'VoxelPort was inspired by Local Miner, a project with the same goal: host a Minecraft server on your own PC without port forwarding or a VPN. I worked with the Local Miner team, and seeing what they were building is what pushed me to make my own take on it.',
      'If you like the idea, go and look at their work too.',
    ],
  },
  {
    id: 'thanks',
    kicker: 'Standing on open source',
    title: 'THANK YOU TO.',
    paras: [
      'VoxelPort exists because of other people’s open-source work, and I am grateful to all of them.',
    ],
    credits: [
      ['PaperMC and Fabric', 'the server software VoxelPort installs and runs'],
      ['GeyserMC and Floodgate', 'Bedrock crossplay'],
      ['Eclipse Temurin (Adoptium)', 'the Java runtime the app downloads and verifies for you'],
      ['Modrinth', 'the plugin and mod library the in-app installer browses'],
      ['Electron, Go, React and the open-source community', 'the tools it is built with'],
    ],
  },
];

export const ABOUT_NOTE =
  'VoxelPort is not affiliated with Mojang, Microsoft, Fabric or PaperMC. Minecraft is a trademark of Mojang AB.';

/** Who the project needs. Volunteer for now: said plainly on the page. */
export const TEAM_INTRO =
  'VoxelPort is a one-person project that is growing, and I would like help from people who care about it. There is no budget yet, so every role here is volunteer. In return you get credit, a say in what gets built, early access to builds, and a project you can point to.';

export const TEAM_ROLES = [
  {
    title: 'DISCORD MODERATORS',
    sprite: 'head1',
    body: 'Keep the community friendly, answer people who are stuck, and help with support tickets. Hindi and Hinglish speakers are especially useful, because that is who most of the members are.',
    asks: 'Patience, fairness, and some Minecraft know-how. You will start by helping in tickets with me.',
  },
  {
    title: 'DEVELOPERS',
    sprite: 'bolt',
    body: 'Work on the Electron desktop app (Node.js), the Go relay, the Android app, the React website or the TypeScript Discord bot. Everything is on GitHub, so you can start with an issue or a small pull request.',
    asks: 'Experience in any of those. AI-assisted coding is fine here, as long as you test what you submit.',
  },
  {
    title: 'BETA TESTERS',
    sprite: 'diamond',
    body: 'Try the Android beta (arm64 phone, Android 8 or newer) and the desktop app on different PCs, internet providers and Minecraft versions, and tell us exactly what breaks.',
    asks: 'A phone or PC and the time to write a clear bug report. Screenshots help a lot.',
  },
  {
    title: 'TRANSLATORS',
    sprite: 'signal',
    body: 'Help bring the app, the guides and this website to more languages. Hinglish already exists; Hindi, Marathi, Tamil, Bengali and others would help a lot of players.',
    asks: 'Fluent in the language and comfortable with Minecraft words.',
  },
  {
    title: 'GUIDE WRITERS & CREATORS',
    sprite: 'heart',
    body: 'Write guides, make short videos or reels, or run a Minecraft channel and show how to host with VoxelPort. Content in Indian languages is the biggest gap.',
    asks: 'A clear voice. Be honest about what VoxelPort can and cannot do (the PC has to stay on).',
  },
  {
    title: 'MODDERS & SERVER OWNERS',
    sprite: 'house',
    body: 'Test modpacks and plugins with VoxelPort, tell us what to improve, and list your server so other people can find it.',
    asks: 'A server or a modpack you care about.',
  },
];

export const TEAM_HOW = [
  {
    title: '1. Say hello',
    body: 'Join the Discord and open a ticket, or email me. Tell me which role, what you have built or done before, and a link if you have one (GitHub, a channel, a server).',
  },
  {
    title: '2. We talk',
    body: 'I reply personally. We agree on something small to start with: a bug to fix, a ticket to help with, a guide to write.',
  },
  {
    title: '3. You are on the team',
    body: 'Do it well and you get credited on this page and a role in the Discord. There is no contract and no pressure: you can stop any time.',
  },
];

export const TEAM_NOTE =
  'We will never ask you for money, a password or a Minecraft or Microsoft login. If anyone claiming to be VoxelPort does, it is a scam: tell a moderator.';
