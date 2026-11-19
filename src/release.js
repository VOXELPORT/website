// One place for release facts the website states. Plain ESM, no JSX: the build (scripts/prerender.mjs) reads it too.
//
// Everything here was checked on `verifiedOn` against the sources named next to it. When a release changes, update this file and
// nothing else: the download page, the home page and llms.txt read from it. Never type a version, size or checksum anywhere else.

export const VERIFIED_ON = '2026-11-20';

const APP = 'https://github.com/VOXELPORT/VoxelPort-App';

export const RELEASES = {
  verifiedOn: VERIFIED_ON,

  // Source: https://github.com/VOXELPORT/VoxelPort-App/releases/tag/v2.0.0 (release assets and their digests).
  windows: {
    label: 'Windows app',
    version: '2.0.0',
    channel: 'Stable',
    releasedOn: '2026-11-18',
    installer: 'VoxelPort-Setup.exe',
    sizeBytes: 3279649,
    sha256: '1ea882d43039febc66c91449615343e1346deccc7ff55bba2d84f13df32916dc',
    downloadUrl: `${APP}/releases/latest/download/VoxelPort-Setup.exe`,
    checksumsUrl: `${APP}/releases/download/v2.0.0/SHA256SUMS.txt`,
    releaseUrl: `${APP}/releases/tag/v2.0.0`,
    changelogUrl: `${APP}/releases`,
    requirements: [
      'Windows 10 or Windows 11, 64-bit',
      'A free Discord account (you sign in once and join the VoxelPort Discord server)',
      'No router settings. Java is installed by the app when a server needs it.',
    ],
  },

  // Source: the live update feed https://voxelport.in/dl/android.json (read again by the download page) and the app's build file
  // (minSdk 26 = Android 8.0). The feed wins over the values below whenever the page can read it.
  android: {
    label: 'Android app',
    version: '1.0.0',
    versionCode: 22,
    channel: 'Stable',
    sizeBytes: 54638754,
    sha256: '0b2197a8c98fb5974b2957d6f6df09004c2104251dce73c584c44dd11095801a',
    downloadUrl: 'https://voxelport.in/dl/voxelport-android.apk',
    feedUrl: '/dl/android.json',
    guideUrl: '/guides/host-minecraft-server-android-phone',
    requirements: [
      'Android 8.0 (API 26) or newer',
      'Installing an APK from outside Google Play: allow installs from your browser, then tap through the Play Protect prompt',
      'A free Discord account (you sign in once and join the VoxelPort Discord server)',
    ],
  },

  // No beta is current: 2.0.0 is the stable release. (The 2.0.0-beta releases on GitHub are old pre-releases.)
  beta: null,

  notAvailable: ['macOS', 'Linux'],
};

export const fmtMB = (bytes) => `${(bytes / 1048576).toFixed(1)} MB`;
export const fmtDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// ─── Windows security warnings: one wording, used by the FAQ, the download page and the build's static text ──────────────────────────

export const WIN_VERIFY_COMMAND = 'Get-FileHash .\\VoxelPort-Setup.exe -Algorithm SHA256';

export const WIN_SMARTSCREEN =
  'Windows may show “Windows protected your PC” (SmartScreen) and name the publisher as unknown. That happens because the VoxelPort installer is not code-signed yet: a signing certificate comes from a certificate authority or a signing programme, and VoxelPort, a free open-source project, has not completed that step. A warning does not mean the file is harmful, and it does not prove the file is safe either, so check it first. Download only from the official release page on GitHub (github.com/VOXELPORT/VoxelPort-App/releases), compare the file’s SHA-256 checksum with the SHA256SUMS.txt on the same release, and continue only if they match and you trust where you got it. If anything differs, do not run the file and ask in our Discord.';

export const WIN_SMART_APP_CONTROL =
  'Windows 11 Smart App Control blocks installers that are not code-signed and offers no “Run anyway” button. We do not recommend turning Smart App Control off for VoxelPort: Windows cannot turn it back on without reinstalling Windows. Safer options: keep using the VoxelPort version you already have, use the Android app, or wait for a code-signed release. Signing is something we want but cannot offer yet.';

export const WIN_VERIFY_HOW =
  `After downloading, open PowerShell in the folder with the file and run ${WIN_VERIFY_COMMAND}. The hash it prints must match the VoxelPort-Setup.exe line in SHA256SUMS.txt on the release page. Updates inside the app are checked separately, against a public key built into the app.`;
