// One place for everything about supporting VoxelPort. The website renders it, and the build
// also writes it to https://voxelport.in/support.json, which the desktop and Android apps read
// (so hosting links and wording can change without shipping an app update).
//
// The donation target itself (the UPI ID, the GitHub Sponsors page) is NOT read from that file by
// the apps: it is built into them, so a changed website can never redirect anyone's tip.

export const CONTACT = 'traz@voxelport.in';

// ─── Supporter perks ──────────────────────────────────────────────────────────────
// Everything free stays free: supporters get recognition and a few conveniences, never more
// capacity than anyone else, and nothing is taken away from free hosts.
export const SUPPORTER = {
  intro:
    'VoxelPort stays free for everyone: hosting, custom addresses and the public server list. If you want to chip in, supporters get a few extras as a thank-you.',
  tiers: [
    {
      name: 'Supporter',
      inr: 99,
      perks: [
        '★ Supporter badge on the server list, and your server pinned to the top',
        'Your custom address never expires from disuse (free addresses are released after 60 days unused)',
      ],
    },
    {
      name: 'Supporter+',
      inr: 299,
      perks: [
        'Everything in Supporter',
        'A short address of 1–2 characters, like vp.voxelport.in (first come, first served; you pick it)',
      ],
    },
  ],
  how:
    `Tip any amount (₹99 or more for Supporter, ₹299 or more for Supporter+) by UPI, then email ${CONTACT} with your UPI reference number and your server's address (like mysmp.voxelport.in). It's switched on by hand, usually within a day or two.`,
  fine: 'Perks are a thank-you for a donation, not a purchase, and last as long as VoxelPort runs. If one is ever misused it can be taken back.',
};

// ─── Paid hosting recommendations ─────────────────────────────────────────────────
// For people who outgrow a PC or phone that has to stay on. Add a host here once you have its
// referral link, then redeploy the site; the apps pick it up within a day. With no entries the
// apps show no hosting section at all.
//
//   { id: 'host-id',                 // lowercase letters, digits, dashes
//     name: 'Host name',
//     blurb: 'One short line on who it suits.',
//     url: 'https://…your referral link…',
//     for: ['desktop', 'android'],    // which app shows it (leave out for both)
//     affiliate: true }               // true if VoxelPort earns a commission
export const HOSTS = {
  intro: {
    desktop: 'Your PC has to stay on for friends to play. If you want a server that is up 24/7, a paid host is the easy way.',
    android: 'A phone sleeps, overheats and runs out of battery. If you want a server that is up 24/7, a paid host is the easy way.',
  },
  disclosure:
    "Some of these are affiliate links: VoxelPort may earn a commission if you sign up, at no extra cost to you. VoxelPort itself stays free either way.",
  items: [],
};

export const SUPPORT = { version: 1, contact: CONTACT, supporter: SUPPORTER, hosts: HOSTS };
