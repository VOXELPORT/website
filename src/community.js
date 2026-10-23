// The VoxelPort Discord: where people ask for help, share servers and hear about releases first.
// One place for the invite and the wording, used by the pages, the build (prerender) and llms.txt.
// Plain ESM with no JSX so scripts/prerender.mjs can import it.

export const DISCORD = 'https://discord.gg/JAUfmey2fP';

export const DISCORD_LINE =
  'Ask for help, show off your server, find people to play with, and hear about every new release first.';

/** What is in the server, shown on /community. */
export const DISCORD_PERKS = [
  {
    sprite: 'head1',
    title: 'HELP & SETUP',
    desc: 'Stuck on a crash, a port or a modpack? Export an error report from the desktop app and attach it to a ticket in #open-a-ticket. The bot answers first and reads logs and screenshots. Press “I need a person for this” to stop AI replies and request our team.',
  },
  {
    sprite: 'bolt',
    title: 'RELEASES FIRST',
    desc: 'Every new desktop and Android release is announced in #announcements with the download links. Press the button in the welcome channel if you want a ping.',
  },
  {
    sprite: 'house',
    title: 'SHOW YOUR SERVER',
    desc: 'Post your address and your builds in #showcase, and find people to play on it.',
  },
  {
    sprite: 'heart',
    title: 'SUGGEST & REPORT',
    desc: 'Something broken, or a feature you want? Say so in #suggestions. This is where the next update comes from.',
  },
  {
    sprite: 'diamond',
    title: 'PICK YOUR ROLES',
    desc: 'Java or Bedrock, phone host or PC host, modder: choose what fits in #roles so people know who to ask.',
  },
  {
    sprite: 'signal',
    title: 'RELAY STATUS',
    desc: 'Type /status in the server to see whether VoxelPort is working right now, and how many servers and players are online.',
  },
];
