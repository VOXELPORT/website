// Guide articles (/guides/<slug>). Plain ESM data shared by the React page and
// scripts/prerender.mjs, which writes each article into static HTML so search
// engines see the full text. `html` is trusted, hand-written markup: <h2 id>,
// <p>, <ul>/<ol>, <table>, <code>, <div class="tip">, and site links.

export const GUIDES_UPDATED = '2026-10-28';

const STORE = 'https://apps.microsoft.com/detail/9NGRX9CFNBD6';

const GET_APP = `<p>Get VoxelPort from the <a href="${STORE}">Microsoft Store</a> (Windows 10 and 11), download the <a href="https://github.com/VOXELPORT/VoxelPort-App/releases/latest/download/VoxelPort-Setup.exe">Windows installer directly</a> (if Windows warns, click More info → Run anyway), or get the <a href="https://github.com/VOXELPORT/VoxelPort-App/releases/latest">Linux build from GitHub</a>. It's free and open source; to host, join our Discord server once.</p>`;

export const GUIDES = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'host-minecraft-server-android-phone',
    title: 'Host a Minecraft Server on Your Android Phone (Free)',
    short: 'Host from your phone',
    description: 'Run a real Minecraft: Java server on your Android phone with the free VoxelPort app. Friends join from anywhere, no port forwarding, Java + Bedrock.',
    kicker: 'Android · Beta',
    blurb: 'Turn your Android phone into a Minecraft server: install the app, start, make public.',
    faq: [
      { q: 'Can my Android phone really run a Minecraft server?', a: 'Yes. VoxelPort for Android runs a full Paper (Java Edition) server on the phone, with a real Java 25 runtime bundled in. A phone with 6–8 GB of RAM comfortably hosts a few friends.' },
      { q: 'Do my friends need Android or the app?', a: 'No. You (the host) run the app; friends join with normal Minecraft on any device — PC, phone or console. Turn on Bedrock players and phone/console players can join too.' },
      { q: 'Why is it an APK and not on the Play Store?', a: 'The app is in beta and distributed as a direct APK for now. A Play Store listing is planned. Sideloading is safe here — it’s the same open project as the desktop app.' },
      { q: 'Will it drain my battery or data?', a: 'Hosting uses CPU and keeps the screen-off server awake, so keep the phone on a charger for long sessions. Every player’s traffic goes through your connection, so Wi‑Fi is best. On mobile data the app counts what it uses, warns you before big downloads, stops sharing at a daily limit you choose (500 MB by default), and has a Data saver mode that sends each player less.' },
      { q: 'How much mobile data does hosting use?', a: 'Roughly 10–50 MB per hour for each player online while they build or mine, and a lot more while they explore new land or fly, because new world has to be sent to them. Setting up the server downloads about 110 MB once. On a 1 GB-per-day plan that is a few players for a few hours, so host on Wi‑Fi when you can. The app shows what it used today and stops sharing at your limit.' },
      { q: 'Can friends without a paid Minecraft account join?', a: 'Yes, if you turn on "Allow cracked players" in the app (it sets online-mode to false). The trade-off is security: with the account check off, anyone can join under any name, including an admin’s, so use the whitelist or the one-tap login plugin (AuthMe) the app offers. Switching also changes players’ IDs, so existing inventories and ops won’t carry over.' },
      { q: 'Will it run well on my phone?', a: 'The app checks your phone and picks a performance level (Low-end, Balanced or High-end) that sets the view distance, mob limits, memory use and background threads to suit it. A phone with 4 GB of RAM can host a few friends on Low-end; 8 GB or more runs comfortably. You can change the level in Settings.' },
      { q: 'Does it work on Jio/Airtel or mobile data?', a: 'Yes, there’s no port forwarding and CGNAT (Jio, Airtel, mobile data) is not a problem. But mobile data is the weakest way to host: the connection can drop for a moment, and players get disconnected when it does. Wi‑Fi is much steadier.' },
    ],
    html: `
<p>Your Android phone is a small Linux computer with several gigabytes of RAM — plenty to host a Minecraft server for a few friends. VoxelPort for Android runs a real Paper (Java Edition) server right on the phone and puts it online through the VoxelPort relay, so friends join from anywhere without port forwarding.</p>

<div class="tip"><b>This is a beta build, so it has many bugs.</b> The server can stop on its own and players can get disconnected, most of all on mobile data or a phone with little RAM. Use Wi‑Fi, keep the app open, and use the <a href="/download">PC app</a> for a server that has to stay up. It is shared as a direct APK (not on the Play Store yet) and needs an arm64 phone on Android 8 or newer.</div>

<h2 id="install">Install the app</h2>
<ol>
  <li>On your phone, <a href="/dl/voxelport-android.apk" download><b>download the VoxelPort APK</b></a> (about 55 MB).</li>
  <li>Open the downloaded <code>VoxelPort.apk</code>. Android will ask to <b>allow installing from this source</b> — turn it on for your browser, then tap <b>Install</b>.</li>
  <li>If Play Protect warns about an unknown app, or says it “may be harmful” because it isn’t from the Play Store, tap <b>More details → Install anyway</b>. It’s the same open-source project as the desktop app.</li>
</ol>

<h2 id="host">Start a server</h2>
<ol>
  <li>Open VoxelPort. It first asks you to <b>Continue with Discord</b>: sign in, and join the VoxelPort Discord server if you aren’t in it yet (the app shows the invite). Then allow the notification it asks for.</li>
  <li>Under <b>Server</b>: tick <b>I agree to the Minecraft EULA</b>, leave <b>Bedrock players</b> on if you want phone/console friends to join, and pick the RAM to give it (2 GB is a safe start).</li>
  <li>Tap <b>Install</b> — it downloads the server (about 135 MB; Java is already inside the app), so <b>use Wi‑Fi</b>. On mobile data the app asks before it starts. Then tap <b>Start</b>. The first start generates the world and can take a few minutes; watch the console for <code>Done!</code>.</li>
</ol>

<h2 id="public">Let friends join</h2>
<ol>
  <li>Tap <b>Make Public</b>. Allow it to ignore battery optimisation, so Android doesn’t kill the server in the background.</li>
  <li>Copy the address it shows (like <code>play.voxelport.in:26137</code>); supporters can also claim a custom <code>yourname.voxelport.in</code>.</li>
  <li>Share it. Friends open <b>Multiplayer → Add Server</b> and paste it. Bedrock (phone/console) players use the same address.</li>
</ol>

<h2 id="backup">Keep your address on a new phone or PC</h2>
<p>Your public address belongs to a secret key stored on this phone. To keep it if you reinstall or switch devices, open the <b>Address backup</b> panel, tap <b>Back up my address</b> and choose a passphrase of at least 12 characters. The app saves a locked copy to your Discord account; VoxelPort can’t read it and can’t recover a forgotten passphrase. On the new phone (or in the PC app, which uses the same backup), sign in with Discord and tap <b>Restore my address</b>.</p>
<div class="tip"><b>Updating from an older build?</b> Android can’t update the earliest builds in place, because the app’s signing key changed. Open <b>Back up or restore your address</b> first and copy your code, then uninstall, install the new APK and restore the code. Uninstalling deletes the server files stored inside the app, so copy out anything you want to keep. Updates from now on install normally.</div>
<p>To remove a server you no longer want, stop it and tap <b>Delete server</b> under <b>Setup</b>. Your backups, address and Discord sign-in are kept.</p>

<h2 id="addons">Add plugins and mods in one tap</h2>
<p>Tap <b>Add plugins</b> to browse <a href="https://modrinth.com">Modrinth</a> from inside the app: search, tap <b>Install</b>, and the plugin (plus anything it needs) goes straight into your server. Restart to load it. Want mods instead? Under <b>Version → Change</b>, switch the server software from <b>Paper</b> (plugins) to <b>Fabric</b> (mods) and the same button browses Fabric mods. <b>Settings</b> changes the game mode, difficulty, max players, whitelist and more, and <b>Files</b> lets you browse the server folder or import your own jars.</p>

<h2 id="cracked">Friends without a Minecraft account (cracked)</h2>
<p>Under <b>Player accounts</b>, switch on <b>Allow cracked players</b> and restart. This turns off Minecraft’s account check, so people without a paid account can join. The catch: anyone can then join under <i>any</i> name, even yours. Turn on the whitelist in Settings, or tap <b>Add login protection</b> to install AuthMe, so players have to <code>/register</code> and <code>/login</code>. Switching the mode changes every player’s ID, so inventories, ops and whitelist entries from before won’t match.</p>

<h2 id="performance">Made for phones</h2>
<p>VoxelPort checks your phone’s memory and cores and picks a <b>Performance</b> level (Settings): <b>Low-end</b> for 4 GB phones, <b>Balanced</b> for most, <b>High-end</b> for 10 GB+. It sets view distance, mob limits, the garbage collector and background threads, suggests a safe amount of RAM, and warns you if the phone is hot or the battery is low. The app also stops polling when it’s in the background to save battery.</p>

<h2 id="data">Don’t burn through your mobile data</h2>
<p>When friends play on your server, their game travels through your phone’s connection. On Wi‑Fi that costs nothing; on a mobile plan (say 1 GB a day) it adds up, so the app looks after it for you:</p>
<ul>
  <li><b>Wi‑Fi is recommended.</b> A yellow card tells you when you’re on mobile data, with a shortcut to your Wi‑Fi settings, and <b>Make Public</b> asks first.</li>
  <li><b>It counts what it uses.</b> The <b>Data use</b> panel shows today’s mobile and Wi‑Fi use. The numbers are an estimate; Android’s own <i>App data usage</i> screen has the exact figure.</li>
  <li><b>A daily limit.</b> Choose <b>Wi‑Fi only</b>, 250 MB, 500 MB (the default), 1 GB, 2 GB or no limit. Near the limit you get a notification; at the limit the app stops sharing (the server keeps running on your phone) until you’re on Wi‑Fi or add more for the day.</li>
  <li><b>Data saver.</b> Gives each player a smaller world around them and fewer far-away updates, so each one uses much less data. Turn it on in <b>Data use</b>, then restart the server.</li>
  <li><b>Big downloads ask first.</b> Setting up the server (about 110 MB), app updates (about 50 MB) and large plugins or mods ask before using mobile data. Plugin pictures are hidden on mobile data too.</li>
</ul>
<p>As a rough guide, each player online uses about 10–50 MB an hour, and much more while exploring new land. If you only have a small daily allowance, host on Wi‑Fi, use Data saver, and keep the player count low.</p>

<h2 id="tips">Keep it running smoothly</h2>
<ul>
  <li><b>Keep the phone charged.</b> Hosting is steady CPU work; plug it in for long sessions.</li>
  <li><b>Wi‑Fi beats mobile data.</b> Every player’s traffic flows through your connection. On mobile data, keep an eye on the <b>Data use</b> panel.</li>
  <li><b>Don’t force-close the app.</b> The server runs in a foreground service with a notification; leave it there while you play.</li>
  <li><b>Use the console.</b> Make yourself admin with <code>op YourName</code>, or whitelist friends with <code>whitelist on</code> then <code>whitelist add Name</code>.</li>
</ul>

<p>Want a PC server instead? See <a href="/guides/how-to-make-a-minecraft-server">how to make a Minecraft server</a>, or the <a href="/guides/free-minecraft-server-hosting">free hosting comparison</a>.</p>`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'free-minecraft-server-hosting',
    title: 'Free Minecraft Server Hosting: No Sleep, No Queue (2026)',
    short: 'Free Minecraft hosting',
    description: 'Free Minecraft hosting compared: Aternos, Minehut, Falix and your own PC with VoxelPort. What each free plan limits, and which to pick for your group.',
    kicker: 'Free hosting · 2026',
    blurb: 'Aternos, Minehut, Falix and your own PC compared: sleep, queues, RAM and the catch with each.',
    faq: [
      { q: 'What is the best free Minecraft server hosting?', a: 'It depends on your PC. If you have a PC that can stay on while people play, hosting on it with VoxelPort is free with no sleep, no queue and no RAM cap. If you don’t, a cloud host like Aternos, Minehut or Falix runs the server for you, with limits on the free plan.' },
      { q: 'Is there free Minecraft hosting that doesn’t sleep?', a: 'Free cloud hosts usually stop or sleep the server when nobody is online, to save resources. A server on your own PC doesn’t: with VoxelPort it stays online until you stop it, as long as the PC is on.' },
      { q: 'Is VoxelPort really free?', a: 'Yes. The app, the relay and your public address are free and open source, with no ads and no card (hosts join our Discord server). You use your own PC’s power and internet. (Tips are optional; supporters get a badge, a pinned server and a custom yourname.voxelport.in address as a thank-you, and nothing free is ever taken away.)' },
      { q: 'How much RAM do free Minecraft hosts give?', a: 'Free plans are usually around 1–4 GB, depending on the host. On your own PC you choose: a PC with 16 GB of RAM can give a server 6–8 GB, enough for most modpacks.' },
      { q: 'Can Bedrock and phone players join a free server?', a: 'On VoxelPort, yes: turn on Bedrock players for a Paper or Fabric server and Java and Bedrock (phone, console, Windows) players join the same world. Several cloud hosts support this too, sometimes only on paid plans.' },
    ],
    html: `
<p>“Free Minecraft hosting” usually means a cloud host that runs your server on their machines for free, with limits: the server sleeps when nobody is online, you may wait in a queue to start it, and RAM is capped. There is another free option: <b>host on your own PC</b> and let a relay put it online. Here is how they compare, and the honest catch with each.</p>

<h2 id="compare">Free Minecraft server hosting compared</h2>
<table>
  <thead><tr><th>Feature</th><th>Aternos</th><th>Minehut (free)</th><th>Falix (free)</th><th>VoxelPort (your PC)</th></tr></thead>
  <tbody>
    <tr><td>Where it runs</td><td>Their servers</td><td>Their servers</td><td>Their servers</td><td>Your PC</td></tr>
    <tr><td>Sleeps when empty</td><td>Yes, after a few minutes</td><td>Yes</td><td>Idle limits and a session timer</td><td><b>No</b></td></tr>
    <tr><td>Queue to start</td><td>At busy times</td><td>Short wake-up delay</td><td>No</td><td><b>No</b></td></tr>
    <tr><td>RAM</td><td>Set by the host</td><td>About 1 GB</td><td>About 2.5–4 GB</td><td><b>As much as your PC can spare</b></td></tr>
    <tr><td>Players</td><td>Depends on resources</td><td>About 10</td><td>Not capped</td><td>As many as your PC and internet handle</td></tr>
    <tr><td>Mods and plugins</td><td>Yes</td><td>Plugins</td><td>Yes</td><td>Any: Paper, Fabric, modpacks, your own files</td></tr>
    <tr><td>Ads or account</td><td>Ads, account</td><td>Account</td><td>Ads, account</td><td><b>No ads, Discord to host</b></td></tr>
    <tr><td>Runs while your PC is off</td><td>Yes</td><td>Yes</td><td>Yes</td><td>No</td></tr>
  </tbody>
</table>
<p><small>Free plans change often. Figures for other hosts are approximate, from their sites and public reviews in October 2026; check <a href="https://aternos.org">Aternos</a>, <a href="https://minehut.com">Minehut</a> and <a href="https://falixnodes.net">Falix</a> for the current limits.</small></p>

<h2 id="pick">Which one should you pick?</h2>
<ul>
  <li><b>You have a PC that’s on while you play:</b> host on it with VoxelPort. No sleep, no queue, your own RAM, no ads, and your world files stay on your PC.</li>
  <li><b>Nobody in your group has a PC that can stay on:</b> use a cloud host. Aternos is free forever; Minehut and Falix have free plans with paid upgrades.</li>
  <li><b>You want a big modpack:</b> free cloud plans struggle with heavy modpacks. Your own PC with 8 GB+ to spare, or a paid host, works much better.</li>
  <li><b>You want it online 24/7 without a PC:</b> that needs paid hosting; no free option does this well.</li>
</ul>

<div class="tip">Playing from India? See <a href="/guides/free-minecraft-hosting-india">free Minecraft hosting in India</a> for ping, UPI-friendly paid options and Jio/Airtel notes.</div>

<h2 id="how">How free hosting on your own PC works</h2>
<p>Normally, hosting at home means port forwarding, which doesn’t work on many connections (Jio, Airtel and most mobile data use CGNAT). VoxelPort avoids it: the app connects <i>out</i> to a VoxelPort relay, the relay gives your server a public address, and players join that address. Nothing on your router changes, and your home IP stays private.</p>
<p>VoxelPort has relays in India and in Europe, and the app picks the closer one, so friends near either get low ping. You get a free address like <code>play.voxelport.in:26137</code>, and supporters can claim a custom name like <code>yourname.voxelport.in</code> that friends join without a port number.</p>

<h2 id="steps">Set up a free server in 2 minutes</h2>
${GET_APP}
<ol>
  <li>Click <b>+ Add Server</b>. Pick a template (Survival SMP, Creative, Modded…) or choose Vanilla, Paper or Fabric and a version.</li>
  <li>Choose how much RAM to give it, agree to the EULA, and click <b>Install &amp; start</b>. VoxelPort downloads the right Java for you.</li>
  <li>Click <b>Make public</b> and copy your free address.</li>
  <li>Share it. Friends add it under <b>Multiplayer → Add Server</b>. Turn on <b>Bedrock players</b> in Settings so phone and console players can join too.</li>
</ol>
<div class="tip">Moving from a cloud host? Download your world from it, put it in your new server’s folder as <code>world</code>, and start the server. See <a href="/guides/aternos-alternative-no-queue#move-world">moving a world from Aternos</a>.</div>

<h2 id="catch">The catch</h2>
<p>Your PC has to be on while people play, and it uses your internet: each player needs roughly 0.1–0.5 Mbps of upload. Most home connections handle a group of friends easily. If that doesn’t suit your group, a free cloud host is the better choice, and that’s fine.</p>`,
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: 'free-minecraft-hosting-india',
    title: 'Free Minecraft Server Hosting in India (2026)',
    short: 'Free hosting in India',
    description: 'Free Minecraft hosting in India compared: free hosts vs your own PC with VoxelPort. Works on Jio and Airtel, no port forwarding, low ping from an India relay.',
    kicker: 'India · 2026',
    blurb: 'Free hosts, cheap rupee plans and your own PC compared for players in India: ping, RAM, queues and the catch.',
    faq: [
      { q: 'Is there really free Minecraft hosting in India?', a: 'Yes, two kinds. Ad-supported free hosts run the server for you with limits: small RAM, few player slots, ads, and sleeping or queues. Or you host on your own PC for free with VoxelPort: no sleep, no queue and as much RAM as your PC can spare, but the PC has to stay on while people play.' },
      { q: 'Which free Minecraft host is best in India?', a: 'It depends on what you have. If someone in your group has a PC that can stay on, hosting on it with VoxelPort is free and has no limits from a host. If nobody does, pick a free host with an Indian server location for lower ping, and expect the usual free-plan limits.' },
      { q: 'Will it work on Jio Fiber, AirFiber or Airtel?', a: 'Yes. Most Jio and Airtel connections use CGNAT, so port forwarding does not work. VoxelPort needs no port forwarding: the app connects out to a relay in India that gives your server a public address.' },
      { q: 'Do I need a credit card, UPI or a GST number?', a: 'Not for VoxelPort. It is free, with no payment (hosts join our Discord server). Some paid hosts bill in USD or ask for business details; many Indian hosts accept UPI. That only matters if you choose a paid plan.' },
      { q: 'Can I host a Minecraft server from my phone in India?', a: 'Yes, there is an Android beta of VoxelPort that runs a Java server on the phone. Use Wi-Fi and a charger; mobile data works but is the weakest way to host.' },
    ],
    html: `
<p>If you search for free Minecraft hosting in India you will find a lot of hosts, and almost all of them run your server on their machines with limits. There is also a free option that the lists usually skip: <b>host on your own PC</b> and use a relay to put it online. Here is how the choices compare for players in India.</p>

<h2 id="options">The ways to get a free or cheap server in India</h2>
<ul>
  <li><b>An ad-supported free host.</b> They run the server for you at no cost, usually with small RAM, a few player slots, ads, and a server that sleeps when empty or a queue at busy times. Some now have Indian server locations, which helps the ping but not the limits.</li>
  <li><b>Your own PC with VoxelPort.</b> Free, no sleep, no queue, no ads, and the RAM is whatever your PC can spare. It needs to stay on while people play.</li>
  <li><b>A cheap Indian paid host.</b> Many start from a few tens to a couple of hundred rupees a month and accept UPI. Prices and plans change, so check each host’s site. You get 24/7 uptime without keeping a PC on.</li>
  <li><b>Your Android phone.</b> VoxelPort has an Android beta that runs the server on the phone. Good for a small group on Wi-Fi.</li>
</ul>

<h2 id="compare">Free host or your own PC?</h2>
<table>
  <thead><tr><th></th><th>Free hosts</th><th>Your own PC (VoxelPort)</th></tr></thead>
  <tbody>
    <tr><td>Cost</td><td>Free, with ads</td><td><b>Free, no ads, Discord to host</b></td></tr>
    <tr><td>Sleeps when empty</td><td>Usually</td><td><b>No</b></td></tr>
    <tr><td>Queue to start</td><td>At busy times</td><td><b>No</b></td></tr>
    <tr><td>RAM</td><td>Small, set by the host</td><td><b>What your PC can spare (6–8 GB on a 16 GB PC)</b></td></tr>
    <tr><td>Ping from India</td><td>Depends on the host’s location</td><td><b>Relay is in India</b></td></tr>
    <tr><td>Mods and plugins</td><td>Limited on free plans</td><td><b>Any: Paper, Fabric, modpacks</b></td></tr>
    <tr><td>Works on Jio and Airtel</td><td>Yes (they host it)</td><td><b>Yes, no port forwarding needed</b></td></tr>
    <tr><td>Online while your PC is off</td><td>Yes</td><td>No</td></tr>
  </tbody>
</table>
<p><small>Free plans change often, so check each host for its current limits. VoxelPort figures are for your own hardware and internet.</small></p>

<h2 id="why">Why this matters on Jio and Airtel</h2>
<p>Hosting at home normally means port forwarding. On most Jio Fiber, AirFiber, Airtel and mobile connections that is impossible, because they share one public IP between many customers (CGNAT). VoxelPort avoids it: the app connects <i>out</i> to a VoxelPort relay, the relay gives your server a public address like <code>play.voxelport.in:26137</code>, and friends join that. Nothing on your router changes and your home IP stays private. More detail: <a href="/guides/host-minecraft-server-jio-airtel">hosting on Jio or Airtel</a>.</p>

<h2 id="steps">Set up a free server on your PC</h2>
${GET_APP}
<ol>
  <li>Click <b>+ Add Server</b>. Pick a template or choose Vanilla, Paper or Fabric and a version.</li>
  <li>Choose how much RAM to give it (2 to 4 GB is a good start on an 8 GB PC), agree to the EULA, and click <b>Install &amp; start</b>. VoxelPort downloads the right Java for you.</li>
  <li>Click <b>Make public</b> and copy the address.</li>
  <li>Share it. Friends add it under <b>Multiplayer → Add Server</b>. Turn on <b>Bedrock players</b> in Settings so phone and console players can join too.</li>
</ol>
<div class="tip">Coming from Aternos or another host? Download your world there and drop it into the new server’s folder as <code>world</code>. See <a href="/guides/aternos-alternative-no-queue#move-world">moving a world from Aternos</a>. Prefer Hindi? <a href="/guides/minecraft-server-kaise-banaye">Minecraft server kaise banaye</a>.</div>

<h2 id="catch">The honest catch</h2>
<p>Your PC has to be on while people play, and it uses your internet: each player needs roughly 0.1–0.5 Mbps of upload, which most home connections handle easily for a group of friends. VoxelPort’s relays are one server in India and one in Europe, run by a student, so there is no uptime guarantee. If you need a server that is online 24/7 with nobody’s PC on, a paid host is the right choice, and cheap Indian ones accept UPI.</p>`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'how-to-make-a-minecraft-server',
    title: 'How to Make a Minecraft Server for Free (Java + Bedrock)',
    short: 'Make a Minecraft server',
    description: 'Make a free Minecraft server with friends in minutes: install VoxelPort, press Start, share the address. No port forwarding. Java and Bedrock players can join.',
    kicker: 'Beginner · Step by step',
    blurb: 'From nothing to friends joining: server type, RAM, Java, and putting it online.',
    faq: [
      { q: 'How do I make a Minecraft server for free?', a: 'Install VoxelPort, click + Add Server, choose a server type and version, and click Install & start. Then click Make public to get an address your friends can join. It’s free, needs no port forwarding, and you join our Discord once.' },
      { q: 'How much RAM does a Minecraft server need?', a: 'About 2 GB for a small vanilla or Paper server with a few friends, 4 GB for more players or a big world, and 6–8 GB for most modpacks. Leave at least 4 GB for Windows and your own game.' },
      { q: 'Should I use Vanilla, Paper or Fabric?', a: 'Paper for a normal survival server with plugins (it’s faster than vanilla), Fabric for mods and modpacks, and Vanilla if you want it exactly like the official game.' },
      { q: 'Can my friends join from a different house or city?', a: 'Yes. Once the server is public, anyone with the address can join from anywhere, as long as your PC and the server are on.' },
      { q: 'Can phone (Bedrock) players join a Java server?', a: 'Yes, on a Paper or Fabric server: turn on Bedrock players in VoxelPort’s server settings. It installs Geyser and Floodgate so Bedrock players join the same world.' },
    ],
    html: `
<p>Making your own Minecraft server takes about two minutes and costs nothing. This guide covers the choices that matter (server type, RAM, Java) and the part that usually goes wrong: letting friends outside your home join.</p>

<h2 id="need">What you need</h2>
<ul>
  <li>A Windows 10/11 or Linux PC with at least 8 GB of RAM (16 GB is comfortable).</li>
  <li>A normal home internet connection. Jio, Airtel and mobile data are fine.</li>
  <li>Minecraft: Java Edition for you and your friends (Bedrock players can join too, see below).</li>
</ul>

<h2 id="type">Choose a server type</h2>
<table>
  <thead><tr><th>Type</th><th>Best for</th></tr></thead>
  <tbody>
    <tr><td><b>Paper</b></td><td>Survival with friends, plugins (EssentialsX, LuckPerms…). Faster than vanilla. The usual choice.</td></tr>
    <tr><td><b>Fabric</b></td><td>Mods and modpacks (and performance mods like Lithium).</td></tr>
    <tr><td><b>Vanilla</b></td><td>Exactly the official game, no add-ons.</td></tr>
  </tbody>
</table>

<h2 id="ram">How much RAM to give it</h2>
<table>
  <thead><tr><th>Server</th><th>RAM</th></tr></thead>
  <tbody>
    <tr><td>Paper or vanilla, 2–5 friends</td><td>2–3 GB</td></tr>
    <tr><td>Paper, 5–15 players or a large world</td><td>4–6 GB</td></tr>
    <tr><td>Modpack (Fabric)</td><td>6–8 GB</td></tr>
  </tbody>
</table>
<p>More isn’t always better: leave at least 4 GB for Windows and the game you play on the same PC.</p>

<h2 id="steps">Make the server</h2>
${GET_APP}
<ol>
  <li>Open VoxelPort and click <b>+ Add Server</b>.</li>
  <li>Pick a template (Survival SMP, Creative, Modded…) or choose the type and Minecraft version yourself.</li>
  <li>Set the RAM, agree to Minecraft’s EULA, and click <b>Install &amp; start</b>. VoxelPort downloads the server and the right Java version for you.</li>
  <li>When it says <b>Online</b>, you can join it yourself at <code>localhost</code>.</li>
</ol>

<h2 id="online">Let friends join from anywhere</h2>
<p>The classic way is port forwarding, which doesn’t work on most Indian connections and many others (CGNAT). VoxelPort skips it:</p>
<ol>
  <li>Click <b>Make public</b>. You get an address like <code>play.voxelport.in:26137</code>.</li>
  <li>Supporters can optionally claim a custom name, like <code>yourname.voxelport.in</code>, so friends don’t need the port.</li>
  <li>Friends open <b>Multiplayer → Add Server</b>, paste the address and join.</li>
</ol>
<div class="tip">Want phone and console players too? Open the server’s <b>Settings</b> and turn on <b>Bedrock players</b>. They join with the same address and port as Java players. See the <a href="/guides/minecraft-java-bedrock-crossplay-server">crossplay guide</a>.</div>

<h2 id="next">Next steps</h2>
<ul>
  <li>Turn on the whitelist so only your friends can join: <code>whitelist on</code>, then <code>whitelist add Name</code> in the console.</li>
  <li>Make yourself an operator: <code>op YourName</code>.</li>
  <li>Something broke? See <a href="/guides/minecraft-server-crash-fixes">fixes for common crashes</a>.</li>
</ul>`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'minecraft-server-kaise-banaye',
    lang: 'hi-Latn',
    title: 'Minecraft Server Kaise Banaye: Free, Bina Port Forwarding',
    short: 'Server kaise banaye',
    description: 'Minecraft server kaise banaye, free mein aur bina port forwarding ke. Jio aur Airtel par bhi chalta hai. VoxelPort se step-by-step Hinglish guide.',
    kicker: 'Hinglish · Step by step',
    blurb: 'Free server banao, dosto ko join karao. Jio/Airtel pe bhi, bina port forwarding.',
    faq: [
      { q: 'Minecraft server free mein kaise banaye?', a: 'VoxelPort app install karo, + Add Server dabao, server type aur version chuno, aur Install & start karo. Phir Make public dabao, tumhe ek address milega jo dosto ko bhej sakte ho. Sab free hai, account nahi chahiye.' },
      { q: 'Jio Fiber pe port forwarding kyu nahi chalta?', a: 'Jio aur Airtel ke zyada tar connection CGNAT pe hote hain, matlab tumhare router ko public IP nahi milta. Isliye port forward karne se bhi bahar se koi connect nahi kar pata. VoxelPort relay se connect karta hai, toh port forwarding ki zarurat hi nahi.' },
      { q: 'Kitni RAM chahiye?', a: '2–5 dosto ke liye 2–3 GB kaafi hai. Zyada players ya bada world ho toh 4–6 GB, aur modpack ke liye 6–8 GB. PC mein kam se kam 4 GB Windows ke liye chhod do.' },
      { q: 'Kya phone wale dost (Bedrock) bhi join kar sakte hain?', a: 'Haan. Paper ya Fabric server ki Settings mein Bedrock players on karo. Java aur Bedrock dono ek hi world mein khel sakte hain.' },
      { q: 'Kya PC band hone pe server chalega?', a: 'Nahi. Server tumhare PC pe chalta hai, toh jab tak dost khel rahe hain, PC on rehna chahiye.' },
    ],
    html: `
<p>Dosto ke saath apna Minecraft server chahiye, par Aternos pe queue lagti hai aur port forwarding Jio pe chalta hi nahi? Koi baat nahi. Is guide mein seekho apne PC pe <b>free server kaise banaye</b> aur dosto ko kahin se bhi join kaise karaye, bina router settings chhede.</p>

<h2 id="kya-chahiye">Kya chahiye</h2>
<ul>
  <li>Windows 10/11 ya Linux PC, kam se kam 8 GB RAM.</li>
  <li>Normal internet: Jio Fiber, AirFiber, Airtel, ya mobile hotspot bhi chalega.</li>
  <li>Minecraft Java Edition (phone wale dost Bedrock se bhi aa sakte hain).</li>
</ul>

<h2 id="port-forwarding">Port forwarding kyu fail hota hai</h2>
<p>India mein zyada tar ISP <b>CGNAT</b> use karte hain: ek public IP bahut saare ghar share karte hain. Tumhare router ko asli public IP milta hi nahi, isliye 25565 port forward karne ke baad bhi dost connect nahi kar paate. VoxelPort ulta kaam karta hai: tumhara PC khud relay se connect hota hai, aur dost relay ke address pe join karte hain. Router mein kuch change nahi karna.</p>

<h2 id="steps">Server banao (2 minute)</h2>
${GET_APP}
<ol>
  <li>VoxelPort kholo aur <b>+ Add Server</b> dabao.</li>
  <li>Template chuno (Survival SMP, Creative, Modded…) ya khud type chuno: <b>Paper</b> (plugins, sabse common), <b>Fabric</b> (mods) ya <b>Vanilla</b>.</li>
  <li>RAM set karo (2–3 GB dosto ke liye kaafi hai), EULA accept karo, aur <b>Install &amp; start</b> dabao. Sahi Java bhi app khud download kar leta hai.</li>
  <li><b>Online</b> dikhe toh <b>Make public</b> dabao. Address milega, jaise <code>play.voxelport.in:26137</code>.</li>
  <li>Supporters apna custom naam claim kar sakte hain, jaise <code>tumharanaam.voxelport.in</code>, taaki port yaad na rakhna pade.</li>
  <li>Dosto ko bhejo. Woh <b>Multiplayer → Add Server</b> mein address daal ke join karenge.</li>
</ol>
<div class="tip">Phone wale dost bhi chahiye? Server ki <b>Settings</b> mein <b>Bedrock players</b> on karo. Wahi address use karke Bedrock se join kar sakte hain.</div>

<h2 id="safe">Server safe rakho</h2>
<ul>
  <li>Sirf apne dosto ko allow karo: console mein <code>whitelist on</code>, phir <code>whitelist add DostKaNaam</code>.</li>
  <li>Khud ko admin banao: <code>op TumharaNaam</code>.</li>
</ul>

<h2 id="tips">Tips</h2>
<ul>
  <li><b>Lag ho raha hai?</b> RAM thodi badhao, ya Paper use karo. App mein CPU, RAM aur TPS live dikhta hai.</li>
  <li><b>Server crash hua?</b> App simple bhasha mein batata hai kya hua aur kaise theek karein. <a href="/guides/minecraft-server-crash-fixes">Crash fixes guide</a> bhi dekho.</li>
  <li><b>Hostel Wi-Fi pe dost join nahi kar pa rahe?</b> Mobile data se try karo. <a href="/guides/minecraft-server-school-college-friends">College friends guide</a> dekho.</li>
</ul>`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'playit-gg-ngrok-hamachi-alternative',
    title: 'playit.gg, ngrok and Hamachi Alternative for Minecraft',
    short: 'Playit / ngrok / Hamachi alternative',
    description: 'A free playit.gg, ngrok and Hamachi alternative made only for Minecraft: no port forwarding, no signup for friends, friends join with plain Minecraft. What is different.',
    kicker: 'Tunnels · Compared',
    blurb: 'Playit.gg, ngrok, Hamachi and e4mc compared with VoxelPort: setup, addresses and limits.',
    faq: [
      { q: 'What is the best alternative to Hamachi for Minecraft?', a: 'A tunnel or relay, so your friends don’t install anything. With VoxelPort your friends join with plain Minecraft using an address, and there is no member limit.' },
      { q: 'Does ngrok work for Minecraft for free?', a: 'It can, but ngrok’s free plan asks you to add a credit or debit card before TCP endpoints work, and the address changes when you restart. VoxelPort needs no card and keeps your address.' },
      { q: 'Is VoxelPort like playit.gg?', a: 'Both put a home server online without port forwarding. VoxelPort is also a server manager: it installs and runs the server, Java and Bedrock support for you, and supporters can get a custom address (yourname.voxelport.in).' },
      { q: 'Do my friends need to install anything?', a: 'Not with VoxelPort, playit.gg or ngrok: they join with normal Minecraft. With Hamachi everyone installs Hamachi, and with mods like e4mc or Essential the host (and with Essential, often friends) needs the mod.' },
    ],
    html: `
<p>If port forwarding doesn’t work for you (CGNAT, a locked router, hostel Wi-Fi), you need something that connects your server <i>out</i> to the internet instead. There are several tools for this. Here is how they compare for a group of friends playing Minecraft.</p>

<h2 id="compare">Compared</h2>
<table>
  <thead><tr><th>Tool</th><th>Friends install</th><th>Address</th><th>Watch out for</th></tr></thead>
  <tbody>
    <tr><td><b>VoxelPort</b></td><td>Nothing</td><td>Stays the same; custom <code>name.voxelport.in</code> for supporters</td><td>Windows and Linux app; relays in India and Europe</td></tr>
    <tr><td>playit.gg</td><td>Nothing</td><td>Generated address; custom domains on the paid plan</td><td>Free plan limits change; check their site</td></tr>
    <tr><td>ngrok</td><td>Nothing</td><td>Changes on restart (free)</td><td>Free TCP needs a credit/debit card on your account; bandwidth cap</td></tr>
    <tr><td>Hamachi</td><td>Hamachi, for everyone</td><td>Hamachi IP</td><td>About 5 people on the free plan; a VPN running on every PC</td></tr>
    <tr><td>e4mc / Essential (mods)</td><td>Nothing / Essential mod</td><td>Changes each session</td><td>Shares a singleplayer world: only while you’re playing, limited server control</td></tr>
  </tbody>
</table>
<p><small>Based on each tool’s public docs and reviews in October 2026. Free plans change, so check the tool’s own site.</small></p>

<h2 id="different">What VoxelPort does differently</h2>
<ul>
  <li><b>It runs the server too.</b> You don’t install Java, download a server jar and then set up a tunnel: VoxelPort does all of it, with Vanilla, Paper, Fabric and modpack templates.</li>
  <li><b>A permanent address.</b> Your port belongs to your install (and a supporter’s custom <code>yourname.voxelport.in</code> too), so friends save the server once.</li>
  <li><b>Java + Bedrock.</b> One switch adds Geyser and Floodgate, and Bedrock traffic (UDP) goes through the same relay.</li>
  <li><b>No card, open source.</b> The app and the relay are MIT-licensed; hosts join our Discord server once.</li>
</ul>

<h2 id="switch">Switch in two minutes</h2>
${GET_APP}
<ol>
  <li>Already have a server folder? Click <b>Import Existing Server</b> and pick it. Otherwise click <b>+ Add Server</b>.</li>
  <li>Click <b>Start</b>, then <b>Make public</b>.</li>
  <li>Copy your address and send it to friends. Stop your old tunnel (playit agent, ngrok, Hamachi) — you don’t need it any more.</li>
</ol>
<div class="tip">Running a server outside VoxelPort (a Docker container, another panel)? Use <b>Tunnel a server I already run elsewhere</b> on the start screen: it puts any local port online the same way.</div>`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'host-minecraft-server-jio-airtel',
    title: 'Host a Minecraft Server on Jio or Airtel, No Port Forwarding',
    short: 'Host on Jio or Airtel',
    description: 'Jio and Airtel use CGNAT, so port forwarding fails. Here is how to host a Minecraft server on them anyway with a free relay, for Java and Bedrock friends.',
    kicker: 'India · CGNAT',
    blurb: 'Why port forwarding fails on Jio and Airtel, how to check for CGNAT, and the fix.',
    faq: [
      { q: 'Why doesn’t port forwarding work on Jio Fiber?', a: 'Most Jio Fiber and AirFiber connections are behind CGNAT: your router doesn’t get a public IPv4 address, so a forwarded port on your router can’t be reached from the internet. A relay such as VoxelPort avoids the problem because your PC connects out to it.' },
      { q: 'Does this work on Airtel Xstream Fiber?', a: 'Yes. Whether or not your Airtel connection has a public IP, VoxelPort only needs an outgoing connection, so it works the same way on Airtel, Jio, ACT, BSNL and other ISPs.' },
      { q: 'Can I host from a mobile hotspot?', a: 'Yes, it works on a Jio or Airtel mobile hotspot, because no incoming connections are needed. Watch your data: every player’s traffic goes through your connection.' },
      { q: 'Will my friends get good ping?', a: 'VoxelPort has a relay in India and one in Europe, and the app uses whichever is closer to you. Friends near either relay usually get low ping; friends far from both (for example in the Americas) will see higher ping.' },
    ],
    html: `
<p>You set up a Minecraft server, forwarded port 25565 on your Jio or Airtel router, and your friends still can’t join. You probably did nothing wrong. Most Indian home connections are behind <b>CGNAT</b>, which makes port forwarding impossible. This guide shows how to check, and how to host anyway, without changing any router settings.</p>

<h2 id="why">Why port forwarding doesn’t work on Jio and Airtel</h2>
<p>There aren’t enough IPv4 addresses for every home, so ISPs share one public address between many customers. This is called <b>carrier-grade NAT (CGNAT)</b>. Your router gets a private address from the ISP instead of a public one, so when a friend connects to “your” IP, they reach the ISP’s equipment, not your router. A port you forward on your router is never reached.</p>
<p>Jio Fiber and Jio AirFiber use CGNAT on most plans. Many Airtel Xstream connections do too, and mobile data and hotspots always do.</p>

<h2 id="check">How to check if you’re behind CGNAT</h2>
<ol>
  <li>Open your router’s admin page (usually <code>192.168.29.1</code> on Jio, <code>192.168.1.1</code> on Airtel) and find the <b>WAN IP</b> or <b>Internet IP</b>.</li>
  <li>Search “what is my IP” in your browser and compare.</li>
  <li>If the two are different, or the WAN IP starts with <code>100.64</code>–<code>100.127</code>, <code>10.</code>, <code>172.16</code>–<code>172.31</code> or <code>192.168.</code>, you’re behind CGNAT.</li>
</ol>

<h2 id="options">Your options</h2>
<table>
  <thead><tr><th>Option</th><th>Cost</th><th>Catch</th></tr></thead>
  <tbody>
    <tr><td>Ask your ISP for a public / static IP</td><td>Usually paid, often only on business plans</td><td>Then you still have to forward ports and expose your home IP</td></tr>
    <tr><td>IPv6</td><td>Free</td><td>Every player needs working IPv6, and many don’t</td></tr>
    <tr><td>LAN tools (Hamachi, ZeroTier, Tailscale)</td><td>Free tiers</td><td>Every friend has to install and set up the same tool</td></tr>
    <tr><td>A relay (VoxelPort)</td><td>Free</td><td>Your PC must stay on while people play</td></tr>
  </tbody>
</table>
<p>A relay is the easiest because your friends don’t install anything. Your PC opens an <i>outgoing</i> connection to the relay, which CGNAT allows, and the relay gives you a public address. Players connect to the relay, and it passes their connection to your PC.</p>

<h2 id="steps">Step by step: host with VoxelPort</h2>
${GET_APP}
<ol>
  <li>Open VoxelPort and click <b>+ Add Server</b>. Pick a template such as <b>Survival SMP</b>, or choose Vanilla, Paper or Fabric and a Minecraft version.</li>
  <li>Set the RAM (VoxelPort suggests an amount for your PC), tick <b>I agree to the Minecraft EULA</b>, and click <b>Install &amp; start</b>. VoxelPort downloads the server and the right Java version for you.</li>
  <li>When the server is online, click <b>Make public</b>. You get an address like <code>play.voxelport.in:26137</code>.</li>
  <li>Supporters can type a name under <b>Get a custom address</b> and click <b>Claim</b>. Friends can then join with <code>yourname.voxelport.in</code> and no port number.</li>
  <li>Send the address to your friends. In Minecraft they go to <b>Multiplayer → Add Server</b> and paste it.</li>
</ol>
<div class="tip"><b>Already have a server folder?</b> Use <b>Import Existing Server</b>. If you start your server some other way, use <b>Tunnel a server I already run elsewhere</b> and enter its port.</div>

<h2 id="tips">Tips for a smooth server in India</h2>
<ul>
  <li><b>Use a wired connection</b> for the PC that hosts the server if you can. Wi-Fi drops cause lag spikes for everyone.</li>
  <li><b>Upload speed matters more than download.</b> Each player needs a steady stream of data from your PC. Most fiber plans have plenty; mobile hotspots get tight with more than a few players.</li>
  <li><b>Lower the view distance</b> in the server’s <b>Settings</b> (8–10 chunks is fine) to cut both CPU load and data use.</li>
  <li><b>Watch TPS</b> in VoxelPort’s performance panel. 20 TPS means the server keeps up; lower means it’s overloaded.</li>
  <li><b>Bedrock friends?</b> Turn on <b>Let Bedrock players join</b>. See <a href="/guides/minecraft-java-bedrock-crossplay-server">the crossplay guide</a>.</li>
</ul>`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'minecraft-server-without-port-forwarding',
    title: 'Host a Minecraft Server Without Port Forwarding (Free)',
    short: 'No port forwarding',
    description: 'Host a Minecraft Java server from your own PC without touching your router. How tunnels and relays work, how they compare, and a free step-by-step setup.',
    kicker: 'Any ISP · Any country',
    blurb: 'How relays and tunnels work, how they compare, and a free setup in five steps.',
    faq: [
      { q: 'Is hosting without port forwarding safe?', a: 'It’s safer than port forwarding. Nothing on your router is opened, and players connect to the relay, so they never see your home IP address.' },
      { q: 'Is it slower than port forwarding?', a: 'Traffic takes one extra hop through the relay, which adds a little ping depending on how far you and your players are from it. For most groups it isn’t noticeable.' },
      { q: 'Do my friends need to install anything?', a: 'No. Java players use normal Minecraft and paste your address into Multiplayer → Add Server.' },
    ],
    html: `
<p>Port forwarding is the classic way to host a Minecraft server: open port 25565 on your router and give friends your IP. It often fails. Your ISP may use CGNAT, you may not have access to the router, or you may not want strangers to see your home IP. You can skip it entirely.</p>

<h2 id="how">How hosting without port forwarding works</h2>
<p>Routers block <i>incoming</i> connections but allow <i>outgoing</i> ones. A relay uses that: your PC connects out to a server on the internet and keeps the connection open. The relay gives you a public address, and when a player connects to that address, the relay sends their traffic down the connection your PC already opened.</p>
<p>For players it looks like a normal server address. For you it means no router settings, it works behind CGNAT, school or office networks and mobile data, and your home IP stays private.</p>

<h2 id="compare">Your options compared</h2>
<table>
  <thead><tr><th>Method</th><th>Players install something?</th><th>Account needed?</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td>Port forwarding</td><td>No</td><td>No</td><td>Needs router access and a public IP; exposes your IP</td></tr>
    <tr><td>Virtual LAN (Hamachi, ZeroTier, Tailscale)</td><td>Yes, every player</td><td>Yes</td><td>Fine for 2–3 friends, painful for more</td></tr>
    <tr><td>General tunnels (playit.gg, ngrok)</td><td>No</td><td>Usually</td><td>Work for any game or app; you set up the server yourself</td></tr>
    <tr><td>VoxelPort</td><td>No</td><td>No</td><td>Made for Minecraft: sets up the server and Java, Bedrock crossplay, custom address for supporters</td></tr>
    <tr><td>Paid hosting</td><td>No</td><td>Yes</td><td>Runs 24/7 without your PC, but costs money monthly</td></tr>
  </tbody>
</table>

<h2 id="steps">Free setup in five steps</h2>
${GET_APP}
<ol>
  <li>Click <b>+ Add Server</b> and pick a template or a server type (Vanilla, Paper or Fabric) and version.</li>
  <li>Choose the RAM, agree to the Minecraft EULA, and click <b>Install &amp; start</b>. Java is installed automatically if you don’t have the right version.</li>
  <li>Wait for the server to show <b>Online</b>, then click <b>Make public</b>.</li>
  <li>Copy the address, for example <code>play.voxelport.in:26137</code>. Supporters can claim a custom name like <code>yourname.voxelport.in</code> instead.</li>
  <li>Friends open Minecraft, go to <b>Multiplayer → Add Server</b>, paste the address and join.</li>
</ol>
<div class="tip">To stop sharing, click <b>Stop public tunnel</b>. The server keeps running for you locally; nobody else can reach it.</div>

<h2 id="limits">Good to know</h2>
<ul>
  <li><b>Your PC must be on</b> while people play. If you want a server that runs 24/7, you need paid hosting or an always-on machine.</li>
  <li><b>RAM:</b> 2–4 GB is enough for a small vanilla or Paper server; modpacks need 6 GB or more.</li>
  <li><b>Already running a server?</b> Use <b>Tunnel a server I already run elsewhere</b> and enter its port. It also works with a singleplayer world opened to LAN.</li>
</ul>`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'play-minecraft-with-friends-different-wifi',
    title: 'Play Minecraft With Friends on Different Wi-Fi',
    short: 'Friends on different Wi-Fi',
    description: '“Open to LAN” only works on the same Wi-Fi. Here are the ways to play Minecraft with friends who live somewhere else — free and paid, for Java and Bedrock.',
    kicker: 'Multiplayer basics',
    blurb: 'Why LAN only works at home, and every way to play with friends elsewhere.',
    faq: [
      { q: 'Why can’t my friend join my LAN world?', a: '“Open to LAN” only announces your world on your own network. A friend on different Wi-Fi can’t see or reach it unless you put it online with a relay, a virtual LAN tool or port forwarding.' },
      { q: 'Is there a free alternative to Realms?', a: 'Yes. You can host a server on your own PC and share it with a free relay such as VoxelPort. The difference is that your PC must be on while people play; Realms runs all the time.' },
      { q: 'Can Java and Bedrock players play together?', a: 'Not in Realms or LAN. A Java server with Geyser and Floodgate lets Bedrock players join; VoxelPort can install both with one switch.' },
    ],
    html: `
<p>“Open to LAN” is great when everyone is in the same house. As soon as a friend is on different Wi-Fi, it stops working: LAN worlds are only visible on your own network. Here are the ways around it.</p>

<h2 id="options">The options</h2>
<table>
  <thead><tr><th>Way</th><th>Cost</th><th>Works for</th><th>Your PC must be on?</th></tr></thead>
  <tbody>
    <tr><td>Minecraft Realms</td><td>Monthly subscription</td><td>Java <i>or</i> Bedrock (not both together)</td><td>No</td></tr>
    <tr><td>Bedrock: join through Xbox friends</td><td>Free</td><td>Bedrock only</td><td>Yes</td></tr>
    <tr><td>Your own server + VoxelPort</td><td>Free</td><td>Java, plus Bedrock with crossplay</td><td>Yes</td></tr>
    <tr><td>Paid server hosting</td><td>Monthly</td><td>Java and Bedrock</td><td>No</td></tr>
  </tbody>
</table>

<h2 id="java">Java Edition: share your world in a few minutes</h2>
<p>You have two choices.</p>
<p><b>Option A: a proper server (recommended).</b> The world keeps running even when you’re not in it, and friends can join anytime your PC is on.</p>
${GET_APP}
<ol>
  <li>In VoxelPort, click <b>+ Add Server</b> and choose a template such as <b>Survival SMP</b>.</li>
  <li>Agree to the EULA and click <b>Install &amp; start</b>.</li>
  <li>Click <b>Make public</b> and send your friends the address.</li>
  <li>They open <b>Multiplayer → Add Server</b>, paste it, and join.</li>
</ol>
<p><b>Option B: share a singleplayer world you’re already in.</b></p>
<ol>
  <li>In your world, press Esc → <b>Open to LAN</b> → <b>Start LAN World</b>. Minecraft shows the port in chat, for example “Local game hosted on port 51234”.</li>
  <li>In VoxelPort, click <b>Tunnel a server I already run elsewhere</b>, enter that port and click <b>Start hosting</b>.</li>
  <li>Send your friends the address VoxelPort shows.</li>
</ol>
<div class="tip">With Option B the world closes when you leave it. If you play together often, Option A is less hassle. You can also move a singleplayer world into a server: copy the world folder into the server folder and name it <code>world</code>.</div>

<h2 id="bedrock">Bedrock Edition (phone, console, Windows)</h2>
<p>Bedrock players who are Xbox friends can join each other’s worlds directly through the <b>Friends</b> tab, for free. That only works while the host is in the world, and only for Bedrock players.</p>
<p>To mix Java and Bedrock players, or to keep a world running without the host in it, run a Java server with crossplay. See <a href="/guides/minecraft-java-bedrock-crossplay-server">how to set up a Java + Bedrock server</a>.</p>

<h2 id="tips">Tips</h2>
<ul>
  <li>Everyone must use the <b>same Minecraft version</b> as the server (Java), or a version Geyser supports (Bedrock).</li>
  <li>Turn on the <b>whitelist</b> in the server’s <b>Settings</b> if you only want your friends to join.</li>
  <li>Supporters can claim a <a href="/guides/free-minecraft-server-address">custom address</a> so friends don’t have to remember a port number.</li>
</ul>`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'minecraft-java-bedrock-crossplay-server',
    title: 'Minecraft Java + Bedrock Crossplay Server (Free, 2026)',
    short: 'Java + Bedrock crossplay',
    description: 'Make a Minecraft server that Java and Bedrock players can both join: PC, phone and console friends on one address with Geyser and Floodgate.',
    kicker: 'Crossplay · Geyser',
    blurb: 'Geyser and Floodgate explained, one-click setup, and how Bedrock players connect.',
    faq: [
      { q: 'Do Bedrock players need a Java account?', a: 'No. Floodgate lets Bedrock players join with their Xbox / Microsoft account only. By default their names start with a dot, for example .Steve, so they can’t clash with Java names.' },
      { q: 'Can console players join?', a: 'Xbox, PlayStation and Switch don’t let you add custom servers directly. Players on consoles usually use a community workaround such as BedrockConnect. Phones, tablets and Windows can add the server normally.' },
      { q: 'Which server types support crossplay?', a: 'Geyser runs as a plugin on Paper or as a mod on Fabric. In VoxelPort, the switch is available on Paper and Fabric servers.' },
    ],
    html: `
<p>Minecraft has two editions that normally can’t play together: <b>Java Edition</b> on PC, and <b>Bedrock Edition</b> on phones, tablets, consoles and Windows. With two free, open-source add-ons, Geyser and Floodgate, Bedrock players can join a Java server.</p>

<h2 id="how">How Geyser and Floodgate work</h2>
<ul>
  <li><b>Geyser</b> translates between the Bedrock and Java protocols. Bedrock players connect to Geyser, and to the server they look like Java players.</li>
  <li><b>Floodgate</b> lets Bedrock players join without owning Java Edition, using only their Microsoft account.</li>
</ul>
<p>Bedrock connects over <b>UDP</b> (default port 19132), while Java uses TCP. That’s why crossplay usually means opening a second port. With VoxelPort you don’t have to: the relay carries both.</p>

<h2 id="steps">Set it up in one click</h2>
${GET_APP}
<ol>
  <li>Click <b>+ Add Server</b> and choose the <b>Java + Bedrock</b> template. It creates a Paper server with Geyser and Floodgate already installed.</li>
  <li>Or, for an existing Paper or Fabric server: open it, click <b>Settings</b> and turn on <b>Let Bedrock players join</b>. VoxelPort downloads Geyser and Floodgate (and Fabric API on Fabric) and restarts the server.</li>
  <li>Click <b>Make public</b>. Next to the Java address, VoxelPort shows a <b>Bedrock</b> line with a server address and a port.</li>
</ol>

<h2 id="join">How Bedrock players join</h2>
<ol>
  <li>Open Minecraft (Bedrock) and go to <b>Play → Servers</b>.</li>
  <li>Scroll down and tap <b>Add Server</b>.</li>
  <li>Enter any name, then the <b>server address</b> and <b>port</b> exactly as VoxelPort shows them on the Bedrock line.</li>
  <li>Save and join.</li>
</ol>
<div class="tip"><b>Why do Bedrock players need the port?</b> Java Edition can look up the port automatically from a DNS record, so <code>yourname.voxelport.in</code> works on its own. Bedrock doesn’t support that lookup, so Bedrock players always enter the port.</div>

<h2 id="consoles">Console players</h2>
<p>Xbox, PlayStation and Switch only show featured servers and don’t have an <b>Add Server</b> button. Console players typically join custom servers through community tools such as <b>BedrockConnect</b>, which they set up once on their console. Phones, tablets and Windows don’t need this.</p>

<h2 id="limits">Things that work differently for Bedrock players</h2>
<ul>
  <li>Some Java-only features, such as certain mods and resource packs, don’t show up for Bedrock players.</li>
  <li>Bedrock’s combat and redstone behave like Java’s on the server, which can feel slightly different to Bedrock players.</li>
  <li>Keep Geyser up to date. New Bedrock versions usually need a Geyser update; turning the switch off and on again in VoxelPort reinstalls the latest version.</li>
</ul>`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'free-minecraft-server-address',
    title: 'Free Minecraft Server Address (Custom for Supporters)',
    short: 'Server address',
    description: 'How to get a free Minecraft server address, and a custom one with no port number like yourname.voxelport.in. What you get free and what supporters get.',
    kicker: 'Addresses · DNS',
    blurb: 'Your free play.voxelport.in address, a custom yourname.voxelport.in for supporters, and how SRV records remove the port number.',
    faq: [
      { q: 'Is the custom address free?', a: 'The regular address (like play.voxelport.in:26137) is free for everyone. A custom name like yourname.voxelport.in is a supporter perk. A name that isn’t used for 60 days is released so others can claim it, unless its owner is a supporter.' },
      { q: 'Why does my address work without a port?', a: 'VoxelPort creates a DNS SRV record for your name. Minecraft Java looks up that record and finds the port automatically.' },
      { q: 'Can I use my own domain?', a: 'Yes. Add an SRV record on your domain pointing to play.voxelport.in and your VoxelPort port. Your port stays the same for your install, so the record keeps working.' },
    ],
    html: `
<p>An address like <code>play.voxelport.in:26137</code> works, but it’s hard to remember and easy to mistype. A custom address such as <code>yourname.voxelport.in</code> (a supporter perk) is easier to share, and Java players don’t need to type a port.</p>

<h2 id="claim">Claim a custom address (supporters)</h2>
<p>Your free address always works. New custom names are a supporter perk: <a href="/support#supporters">see how to become a supporter</a>.</p>
${GET_APP}
<ol>
  <li>Start your server and click <b>Make public</b>.</li>
  <li>Under <b>Get a custom address</b>, type a name: 3–20 letters, numbers or dashes.</li>
  <li>Click <b>Claim</b>. After a short wait the address shows as <b>Your address</b>.</li>
  <li>Share <code>yourname.voxelport.in</code>. Java players paste it into <b>Multiplayer → Add Server</b> as it is.</li>
</ol>
<p>Each install can hold one name. Use <b>Change</b> to switch names or <b>Remove</b> to release it. If a name isn’t used for 60 days, it’s released automatically.</p>
<div class="tip">New names can take a minute or two to work everywhere, because DNS changes need time to spread. If a friend gets “Unknown host”, wait a bit and try again.</div>

<h2 id="srv">How Minecraft skips the port: SRV records</h2>
<p>Normally a domain name only points to an IP address, so you still need the port. Minecraft Java also checks for a special DNS record called an <b>SRV record</b>, named <code>_minecraft._tcp.yourname.voxelport.in</code>, which says “the server for this name is at play.voxelport.in, port 26137”. Minecraft reads that and connects to the right port by itself.</p>
<p>When you claim a name, VoxelPort creates that SRV record for you and reserves your port, so the address keeps working every time you go public.</p>

<h2 id="bedrock">Bedrock players still need the port</h2>
<p>Bedrock Edition doesn’t read SRV records. Bedrock players enter your name as the server address and the port shown in VoxelPort on the Bedrock line. See <a href="/guides/minecraft-java-bedrock-crossplay-server">the crossplay guide</a>.</p>

<h2 id="own-domain">Using your own domain</h2>
<p>If you own a domain, you can point a name like <code>mc.example.com</code> at your VoxelPort server:</p>
<ol>
  <li>Open VoxelPort and note your public port (like 26137). It stays the same for your install, so the record keeps working.</li>
  <li>At your DNS provider, add an <b>SRV</b> record: service <code>_minecraft</code>, protocol <code>_tcp</code>, name <code>mc</code>, priority <code>0</code>, weight <code>5</code>, port <i>your VoxelPort port</i>, target <code>play.voxelport.in</code>.</li>
  <li>Java players can then join with <code>mc.example.com</code>.</li>
</ol>`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'minecraft-server-crash-fixes',
    title: 'Minecraft Server Crashing? Common Errors and Fixes',
    short: 'Fix server crashes',
    description: 'Fix common Minecraft server errors: out of memory, wrong Java version, port in use, failed to bind, mod conflicts. What each crash message means and the fix.',
    kicker: 'Troubleshooting',
    blurb: 'The errors that stop Minecraft servers, what they mean, and the fix for each.',
    faq: [
      { q: 'Where do I find the crash reason?', a: 'Look at the last lines of the server console or the logs/latest.log file. Mod and plugin crashes also write a file in the crash-reports folder. VoxelPort reads the console for you and explains common causes in plain English.' },
      { q: 'How much RAM should a Minecraft server have?', a: 'About 2–4 GB for a small vanilla or Paper server, and 6–10 GB for big modpacks. Leave at least 2–3 GB for Windows and anything else running on the PC.' },
      { q: 'Which Java version does my server need?', a: 'Minecraft 26.1 and newer need Java 25. Minecraft 1.20.5 to 1.21.x need Java 21, and 1.18 to 1.20.4 need Java 17.' },
    ],
    html: `
<p>When a Minecraft server stops, the reason is almost always in the last 20 lines of the console. Find the message below that matches yours. VoxelPort recognises most of these automatically and shows the explanation and a fix button when your server stops.</p>

<h2 id="port">“FAILED TO BIND TO PORT” / “Address already in use”</h2>
<p><b>Meaning:</b> another program is already using the server’s port, usually another Minecraft server that’s still running.</p>
<p><b>Fix:</b> close the other server (check Task Manager for <code>java.exe</code>), or change <code>server-port</code> in <code>server.properties</code> (in VoxelPort: the server’s <b>Settings</b>).</p>

<h2 id="heap">“Could not reserve enough space for object heap”</h2>
<p><b>Meaning:</b> the server is set to use more RAM than Java can get. It’s common with 32-bit Java or when the RAM setting is higher than the free memory on your PC.</p>
<p><b>Fix:</b> lower the RAM (the <code>-Xmx</code> value), and make sure you use 64-bit Java.</p>

<h2 id="oom">“java.lang.OutOfMemoryError”</h2>
<p><b>Meaning:</b> the server ran out of the RAM it was given, from too many players, chunks or mods.</p>
<p><b>Fix:</b> give it more RAM, lower <code>view-distance</code> and <code>simulation-distance</code>, or remove heavy mods.</p>

<h2 id="java-version">“UnsupportedClassVersionError … class file version 69.0”</h2>
<p><b>Meaning:</b> the server needs a newer Java than the one running it. Class file version 61 means Java 17, 65 means Java 21, and 69 means Java 25.</p>
<p><b>Fix:</b> install the right Java (Java 25 for Minecraft 26.1+, Java 21 for 1.20.5–1.21.x) and start the server with it. VoxelPort picks and installs the right Java automatically.</p>

<h2 id="eula">“You need to agree to the EULA in order to run the server”</h2>
<p><b>Meaning:</b> every server must accept Mojang’s EULA once.</p>
<p><b>Fix:</b> open <code>eula.txt</code> in the server folder and change <code>eula=false</code> to <code>eula=true</code>, after reading the EULA at minecraft.net/eula.</p>

<h2 id="mods">Mod errors: wrong version, missing dependency, Mixin failures</h2>
<ul>
  <li><b>“requires minecraft … but only the wrong version is present”:</b> a mod is made for another Minecraft version. Download the right version of that mod, or remove it.</li>
  <li><b>“requires … which is missing”:</b> a mod needs another mod. Most Fabric mods need <b>Fabric API</b>; the error names what’s missing.</li>
  <li><b>“Mixin apply failed”:</b> a mod is incompatible with this Minecraft version or with another mod. Update it, or remove recently added mods one at a time.</li>
</ul>

<h2 id="plugins">“Could not load 'plugins/…'” / “Error occurred while enabling”</h2>
<p><b>Meaning:</b> a Paper/Spigot plugin failed, usually because it’s built for a different Minecraft version.</p>
<p><b>Fix:</b> update the plugin, or move it out of the <code>plugins</code> folder to confirm it’s the cause.</p>

<h2 id="jar">“Invalid or corrupt jarfile” / “Unable to access jarfile”</h2>
<p><b>Meaning:</b> <code>server.jar</code> is missing, renamed or only partly downloaded.</p>
<p><b>Fix:</b> download the server jar again and make sure the start command uses the right file name.</p>

<h2 id="lock">“session.lock” / “The directory is already locked”</h2>
<p><b>Meaning:</b> another Minecraft process has the world open.</p>
<p><b>Fix:</b> close the other server or game using that world (end <code>java.exe</code> in Task Manager), then start again.</p>

<h2 id="permission">“AccessDeniedException” / “Access is denied”</h2>
<p><b>Meaning:</b> the server can’t write to its folder. It happens with read-only folders and folders synced by OneDrive.</p>
<p><b>Fix:</b> move the server to a normal folder such as Documents (outside OneDrive), and don’t run it from a ZIP file or a protected location like Program Files.</p>

<h2 id="lag">The server doesn’t crash but lags</h2>
<p>Check the server’s TPS (ticks per second). 20 is perfect; below about 15 players will notice. Lower the view distance, limit farms with many entities, and use Paper instead of Vanilla for better performance. VoxelPort shows CPU, RAM and TPS live while the server runs.</p>`,
  },
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'minecraft-server-school-college-friends',
    title: 'Minecraft Server for School or College Friends (Free)',
    short: 'School & college friends',
    description: 'Make a free Minecraft server for your school or college friends: no router access, no hostel Wi-Fi settings, no port forwarding. Works from a laptop or phone.',
    kicker: 'Friends · Free',
    blurb: 'A free server for your class or hostel: setup, whitelist, and campus Wi-Fi problems.',
    faq: [
      { q: 'Can I host a Minecraft server on college Wi-Fi?', a: 'Often yes, because VoxelPort only makes an outgoing connection, like a website. Some campus networks block games or unusual ports. If it doesn’t work, host from home or use a mobile hotspot, and follow your college’s network rules.' },
      { q: 'Why can’t my friends in the same hostel see my LAN world?', a: 'Many hostel and campus networks use “client isolation”, which stops devices on the Wi-Fi from talking to each other. LAN worlds can’t be seen there. Putting the server online with an address gets around it.' },
      { q: 'How many friends can join a free server?', a: 'It depends on your PC and upload speed, not on VoxelPort. A normal laptop giving the server 4 GB handles about 5–10 players on Paper; a desktop handles more.' },
      { q: 'Do my friends need to pay or sign up?', a: 'No. They need their own copy of Minecraft. Nobody needs a VoxelPort account, and only the host installs VoxelPort.' },
    ],
    html: `
<p>Realms costs money every month, and “Open to LAN” stops working as soon as someone goes home. If you want one Minecraft world for your class, batch or hostel, the cheapest way is to host it yourself and share an address. It takes about five minutes and costs nothing.</p>

<h2 id="plan">Who should host</h2>
<p>The world lives on the host’s PC, so it’s only online while that PC is on. Pick the person who:</p>
<ul>
  <li>has the <b>best PC or laptop</b> (8 GB of RAM or more is comfortable),</li>
  <li>has <b>home broadband</b> (Jio Fiber, Airtel and similar are fine, even with CGNAT),</li>
  <li>and is happy to keep it running in the evenings or at weekends when you all play.</li>
</ul>
<div class="tip">Want two hosts? Take turns: zip the server folder, share it, and the other person uses <b>Import Existing Server</b>. Only run it on one PC at a time, or the world splits into two copies.</div>

<h2 id="setup">Set up the server</h2>
${GET_APP}
<ol>
  <li>Click <b>+ Add Server</b> and pick <b>Survival SMP</b>. If some friends play on phones, pick <b>Java + Bedrock</b> instead.</li>
  <li>Give it 3–4 GB of RAM, agree to the Minecraft EULA, and click <b>Install &amp; start</b>.</li>
  <li>When it says <b>Online</b>, click <b>Make public</b>.</li>
  <li>Supporters can claim a name such as <code>ourclass.voxelport.in</code> under <b>Get a custom address</b>; the free address also stays the same between restarts.</li>
  <li>Post the address in your class or hostel group chat. Friends add it under <b>Multiplayer → Add Server</b>.</li>
</ol>

<h2 id="whitelist">Keep strangers out: the whitelist</h2>
<p>Anyone who sees a public address can try to join. If the server is only for your group, turn on the whitelist:</p>
<ol>
  <li>In VoxelPort, open the server’s <b>Settings</b> and turn on <b>white-list</b>.</li>
  <li>In the console, add each friend by their Minecraft name: <code>whitelist add Name</code>.</li>
  <li>Make yourself an operator with <code>op YourName</code> so you can manage the game from inside Minecraft.</li>
</ol>
<p>Players who aren’t on the list see “You are not whitelisted on this server” and can’t join.</p>

<h2 id="campus">Campus and hostel Wi-Fi problems</h2>
<table>
  <thead><tr><th>Problem</th><th>Why</th><th>What to do</th></tr></thead>
  <tbody>
    <tr><td>Friends in the same hostel can’t see your LAN world</td><td>Campus Wi-Fi isolates devices from each other</td><td>Use the public address instead of LAN</td></tr>
    <tr><td>A friend on campus Wi-Fi gets “Connection timed out”</td><td>The network blocks game ports</td><td>That friend joins from mobile data or a hotspot</td></tr>
    <tr><td>The host can’t go public from campus</td><td>The network blocks the connection to the relay</td><td>Host from home, or from a phone hotspot (watch the data)</td></tr>
  </tbody>
</table>
<div class="tip">Campus networks have rules. Don’t try to get around blocks your college has put in place on purpose; host from home instead.</div>

<h2 id="ideas">Ideas for a class server</h2>
<ul>
  <li><b>Batch SMP:</b> plain survival where everyone builds a town together. The <b>Survival SMP</b> template is made for this.</li>
  <li><b>Build project:</b> recreate your school or campus on a <b>Creative Flat</b> server.</li>
  <li><b>Hardcore event:</b> one life each, over a weekend. Use the <b>Hardcore</b> template.</li>
  <li><b>Mixed devices:</b> PC and phone players together with the <b>Java + Bedrock</b> template. See <a href="/guides/minecraft-bedrock-server-phone-players">the phone players guide</a>.</li>
</ul>`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'play-minecraft-modpack-with-friends-free',
    title: 'Play a Minecraft Modpack With Friends for Free',
    short: 'Modpacks with friends',
    description: 'Host a Minecraft modpack server for free and play with friends: import your server folder, put it online with VoxelPort. No port forwarding or paid hosting.',
    kicker: 'Mods · Modpacks',
    blurb: 'Host a CurseForge or Modrinth modpack for free and get friends connected.',
    faq: [
      { q: 'Do my friends need the modpack installed?', a: 'Yes. Everyone joining a modded server needs the same modpack, at the same version, installed through the CurseForge app, the Modrinth app or a launcher such as Prism Launcher.' },
      { q: 'How much RAM does a modpack server need?', a: 'Light packs run on 4–6 GB. Big kitchen-sink packs (All the Mods, large tech packs) need 8–10 GB for the server alone, so the host PC needs 16 GB or more in total.' },
      { q: 'Can Bedrock players join a modpack server?', a: 'Usually not. Bedrock players can’t load Java mods, so modpacks are Java-only.' },
      { q: 'Where do I get the server files for a modpack?', a: 'On the modpack’s CurseForge page, open Files and download the Server Pack. On Modrinth, many packs offer a server pack too; otherwise you can put the pack’s mods on a Fabric server yourself.' },
    ],
    html: `
<p>Modpacks are more fun with friends, but modpack hosting costs money and free hosts often don’t have enough RAM for big packs. If you have a decent PC, you can host the pack yourself for free. Your friends only need the same modpack installed.</p>

<h2 id="before">Before you start</h2>
<ul>
  <li><b>RAM:</b> the server needs its own memory, on top of your game if you play on the same PC. See the table below.</li>
  <li><b>Same version for everyone:</b> the server and every player must use exactly the same modpack version.</li>
  <li><b>Java version:</b> modpacks for Minecraft 1.20.5–1.21.x need Java 21; newer ones need Java 25; older ones (1.18–1.20.4) need Java 17.</li>
</ul>
<table>
  <thead><tr><th>Modpack size</th><th>Server RAM</th><th>Host PC total RAM</th></tr></thead>
  <tbody>
    <tr><td>Light (under 100 mods)</td><td>4–6 GB</td><td>12 GB or more</td></tr>
    <tr><td>Medium (100–250 mods)</td><td>6–8 GB</td><td>16 GB or more</td></tr>
    <tr><td>Heavy (250+ mods, e.g. All the Mods)</td><td>8–10 GB</td><td>16–32 GB</td></tr>
  </tbody>
</table>

<h2 id="server-pack">Step 1: get the modpack’s server files</h2>
<ol>
  <li>Open the modpack’s page on <b>CurseForge</b> or <b>Modrinth</b> and go to <b>Files</b> or <b>Versions</b>.</li>
  <li>Download the <b>Server Pack</b> (sometimes called “Server Files”) for the same version your friends will play.</li>
  <li>Unzip it into a normal folder such as <code>Documents\\MyPackServer</code> (not inside OneDrive, and not in Downloads).</li>
  <li>Run the pack’s start file: usually <code>start.bat</code>, <code>run.bat</code> or <code>startserver.bat</code>. The first run downloads the mod loader (Forge, NeoForge or Fabric) and can take a few minutes.</li>
  <li>If it stops and asks you to accept the EULA, open <code>eula.txt</code>, change it to <code>eula=true</code>, and run the start file again.</li>
  <li>To give it more RAM, edit <code>user_jvm_args.txt</code> (Forge and NeoForge) or the <code>-Xmx</code> value in the start file, for example <code>-Xmx8G</code>.</li>
</ol>
<p>Wait until the console says <code>Done</code>. The server is now running on your PC, on port 25565.</p>

<h2 id="online">Step 2: put it online for friends</h2>
${GET_APP}
<ol>
  <li>In VoxelPort, click <b>Tunnel a server I already run elsewhere</b>.</li>
  <li>Enter the port (<code>25565</code> unless you changed <code>server-port</code>) and click <b>Start hosting</b>.</li>
  <li>Copy the address it shows, or, as a supporter, claim a name such as <code>ourpack.voxelport.in</code>.</li>
  <li>Friends launch the same modpack, go to <b>Multiplayer → Add Server</b>, and paste the address.</li>
</ol>
<div class="tip"><b>Making your own pack instead?</b> For a small Fabric pack, use VoxelPort’s <b>Modded (Fabric)</b> template, then drop mods into its <code>mods</code> folder and give friends the same mods. Client-only mods (shaders, minimaps, Sodium) stay on players’ PCs, not on the server.</div>

<h2 id="friends">How friends install the modpack</h2>
<ul>
  <li><b>CurseForge app:</b> search for the modpack, install the same version as the server, and press Play.</li>
  <li><b>Modrinth app or Prism Launcher:</b> same idea; pick the matching version.</li>
  <li>Give the pack at least 4–6 GB of RAM in the launcher settings, or it may freeze while loading.</li>
</ul>

<h2 id="errors">Common modpack errors</h2>
<table>
  <thead><tr><th>Error</th><th>Fix</th></tr></thead>
  <tbody>
    <tr><td>“Mod rejections” or “Mismatched mod channel list”</td><td>A friend has a different modpack version or extra mods. Everyone installs exactly the server’s version.</td></tr>
    <tr><td>“Connection timed out” while joining</td><td>Big packs take a while to start. Wait for <code>Done</code> in the server console and try again.</td></tr>
    <tr><td>Server closes with OutOfMemoryError</td><td>Give the server more RAM in <code>user_jvm_args.txt</code>.</td></tr>
    <tr><td>“UnsupportedClassVersionError”</td><td>Wrong Java version. See <a href="/guides/minecraft-server-crash-fixes">the crash fixes guide</a>.</td></tr>
    <tr><td>Server crashes on start after you added a mod</td><td>It’s probably client-only. Remove shaders, minimaps and similar mods from the server’s <code>mods</code> folder.</td></tr>
  </tbody>
</table>`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'aternos-alternative-no-queue',
    title: 'Free Aternos Alternative With No Queue (Minecraft)',
    short: 'Aternos alternative',
    description: 'A free Aternos alternative with no queue and no sleep: host Minecraft on your own PC with VoxelPort and use as much RAM as it can spare. Trade-offs explained.',
    kicker: 'Free hosting · Compared',
    blurb: 'Free hosting compared, and how to host with no queue on your own PC.',
    faq: [
      { q: 'Why is there a queue on Aternos?', a: 'Aternos is free for everyone, so at busy times there aren’t enough free servers for everyone who wants to start one, and you wait for a slot.' },
      { q: 'Is hosting on my own PC really free?', a: 'Yes. The server software is free, and VoxelPort puts it online for free. You only use the electricity and internet you already pay for.' },
      { q: 'Can I move my Aternos world to my own PC?', a: 'Yes. Download your world from the Worlds page in Aternos, unzip it into your new server folder, and name the folder world.' },
      { q: 'When is Aternos the better choice?', a: 'If you don’t have a PC that can stay on while people play, or your PC has little RAM, a host like Aternos is still a good option, because it runs the server for you.' },
    ],
    html: `
<p>Aternos is a popular free Minecraft host, and a good one. But at busy times you may wait in a queue just to start your server, it shuts down when nobody is online, and free servers get limited resources. If you have a PC, you can host on it instead: no queue, no idle shutdown, and as much RAM as your PC can spare.</p>

<h2 id="compare">Free Minecraft hosting compared</h2>
<table>
  <thead><tr><th>Option</th><th>Queue</th><th>Runs while your PC is off?</th><th>RAM</th><th>Cost</th></tr></thead>
  <tbody>
    <tr><td>Aternos</td><td>At busy times</td><td>Yes, while players are online</td><td>Set by the host</td><td>Free, with ads</td></tr>
    <tr><td>Other free hosts</td><td>Sometimes</td><td>Usually, with limits</td><td>Small on free plans</td><td>Free tier, paid upgrades</td></tr>
    <tr><td>Your own PC + VoxelPort</td><td>None</td><td>No</td><td>As much as your PC has</td><td>Free</td></tr>
    <tr><td>Paid hosting</td><td>None</td><td>Yes, 24/7</td><td>What you pay for</td><td>Monthly</td></tr>
  </tbody>
</table>
<p>For Aternos, Minehut and Falix side by side, see <a href="/guides/free-minecraft-server-hosting">free Minecraft server hosting compared</a>.</p>

<h2 id="why">Why host on your own PC</h2>
<ul>
  <li><b>No queue:</b> the server starts in seconds, whenever you want.</li>
  <li><b>No idle shutdown:</b> it keeps running until you stop it, even with nobody online.</li>
  <li><b>Your RAM:</b> a PC with 16 GB can give a server 6–8 GB, enough for bigger modpacks.</li>
  <li><b>Full control:</b> any plugin, mod, datapack or world file, and direct access to the folder.</li>
  <li><b>Low ping in India:</b> VoxelPort’s relay is in India.</li>
</ul>
<p>The catch: <b>your PC has to be on</b> while people play. If that doesn’t work for your group, stay with Aternos or a paid host.</p>

<h2 id="steps">Set it up</h2>
${GET_APP}
<ol>
  <li>Click <b>+ Add Server</b>. Pick a template, or choose Vanilla, Paper or Fabric and a version.</li>
  <li>Choose the RAM, agree to the EULA, and click <b>Install &amp; start</b>. VoxelPort installs the right Java too.</li>
  <li>Click <b>Make public</b>. You don’t need to forward ports, even on Jio or Airtel.</li>
  <li>Copy the address it shows (like <code>play.voxelport.in:26137</code>).</li>
  <li>Share it. Friends join under <b>Multiplayer → Add Server</b>.</li>
</ol>

<h2 id="move-world">Move your world from Aternos</h2>
<ol>
  <li>In Aternos, open <b>Worlds</b> and download your world.</li>
  <li>In VoxelPort, stop the server and open its folder.</li>
  <li>Rename the new <code>world</code> folder (for example to <code>world-old</code>), then unzip your Aternos world there and name it <code>world</code>.</li>
  <li>Start the server. Use the same Minecraft version as on Aternos, or newer.</li>
</ol>
<div class="tip">Using plugins on Aternos? Install the same plugins on your new Paper server; most plugin config files can be copied across as they are.</div>`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'minecraft-bedrock-server-phone-players',
    title: 'Minecraft Server Your Friends Can Join From Phones',
    short: 'Server for phone players',
    description: 'Make a Minecraft server friends can join from phones and consoles. Turn on Bedrock support in VoxelPort and everyone joins on one address, no port forwarding.',
    kicker: 'Bedrock · Android · iPhone',
    blurb: 'A server friends can join from Android and iPhone, and how to add it on the phone.',
    faq: [
      { q: 'Can I host the server on my phone?', a: 'Not with VoxelPort. The server runs on a Windows or Linux PC. Your friends, and you, can then play on phones.' },
      { q: 'Do phone players need Minecraft Java?', a: 'No. They play the normal Minecraft app on their phone. The server uses Geyser and Floodgate to let them in, and Floodgate means they only need their Microsoft (Xbox) account.' },
      { q: 'Does the host need to buy Minecraft Java Edition?', a: 'No. Running the server doesn’t require owning Java Edition. You only need it if you also want to play Java on the PC.' },
      { q: 'Why does my phone say “Unable to connect to world”?', a: 'Usually the port is wrong or missing, the server isn’t public yet, or Geyser needs an update for a new Minecraft version. The fixes are in this guide.' },
    ],
    html: `
<p>Most of your friends play Minecraft on their phones? You can still have your own server. You run it on a PC, and friends join from the Minecraft app on Android or iPhone (the Bedrock edition, once called Pocket Edition). PC players can join too.</p>

<h2 id="how">How it works</h2>
<p>VoxelPort runs a Java server with two free add-ons: <b>Geyser</b>, which lets the phone version talk to a Java server, and <b>Floodgate</b>, which lets phone players log in with just their Microsoft account. The relay carries the phone traffic too, so you don’t forward any ports.</p>
<div class="tip">You need a <b>PC</b> to host (Windows 10/11 or Linux), and it must stay on while people play. The phones only play.</div>

<h2 id="setup">Set up the server on your PC</h2>
${GET_APP}
<ol>
  <li>Click <b>+ Add Server</b> and choose the <b>Java + Bedrock</b> template. Geyser and Floodgate are installed for you.</li>
  <li>Agree to the EULA and click <b>Install &amp; start</b>.</li>
  <li>When it’s <b>Online</b>, click <b>Make public</b>.</li>
  <li>Find the <b>Bedrock</b> line. It shows a <b>server address</b> and a <b>port</b>, for example <code>play.voxelport.in</code> and <code>26137</code>. Send both to your friends.</li>
</ol>

<h2 id="phone">Add the server on the phone</h2>
<ol>
  <li>Open Minecraft on the phone and tap <b>Play</b>.</li>
  <li>Open the <b>Servers</b> tab and scroll to the bottom.</li>
  <li>Tap <b>Add Server</b>.</li>
  <li><b>Server Name:</b> anything, for example “Our SMP”.</li>
  <li><b>Server Address:</b> the address from the Bedrock line, without the port.</li>
  <li><b>Port:</b> the number from the Bedrock line, in place of the default 19132.</li>
  <li>Tap <b>Save</b>, then tap the server to join.</li>
</ol>
<p>Players may be asked to sign in to their Microsoft account the first time. Phone players show up with a dot before their name, like <code>.Steve</code>.</p>

<h2 id="fix">“Unable to connect to world” and other problems</h2>
<table>
  <thead><tr><th>Problem</th><th>Fix</th></tr></thead>
  <tbody>
    <tr><td>Unable to connect to world</td><td>Check that the port is the one on VoxelPort’s Bedrock line, not 19132, and that the server is public.</td></tr>
    <tr><td>“Outdated server” or “Outdated client”</td><td>Update Minecraft on the phone. If the phone is newer than Geyser, turn <b>Let Bedrock players join</b> off and on in Settings to get the latest Geyser.</td></tr>
    <tr><td>It worked yesterday, not today</td><td>A Minecraft update probably came out. Update Geyser as above.</td></tr>
    <tr><td>Works on Wi-Fi but not mobile data (or the other way round)</td><td>Restart the Minecraft app, and turn off any VPN or data saver on the phone.</td></tr>
    <tr><td>“You are not whitelisted”</td><td>Phone players need the dot: <code>whitelist add .Steve</code>.</td></tr>
  </tbody>
</table>

<h2 id="tips">Tips for phone-heavy servers</h2>
<ul>
  <li><b>Keep the view distance at 8 or below</b> in Settings. Phones show less anyway, and it saves server power.</li>
  <li><b>Supporters can claim a custom name</b> like <code>oursmp.voxelport.in</code> so the address is easy to type on a phone. Phone players still enter the port.</li>
  <li><b>Consoles</b> (Xbox, PlayStation, Switch) can’t add servers directly. See <a href="/guides/minecraft-java-bedrock-crossplay-server">the crossplay guide</a> for what console players can do.</li>
</ul>`,
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: 'free-minecraft-server-hosting-europe',
    title: 'Free Minecraft Server Hosting in Europe (Low Ping)',
    short: 'Hosting in Europe',
    description: 'Free Minecraft server hosting for Europe with no port forwarding and low ping from a European relay. Works behind DS-Lite and CGNAT, Java and Bedrock.',
    kicker: 'Europe · Free',
    blurb: 'A relay in Europe, free and with no port forwarding: how to host a Minecraft server for friends in Germany, the UK, France and the rest of Europe.',
    faq: [
      { q: 'Is there a VoxelPort relay in Europe?', a: 'Yes. Since version 1.11 the app has a relay in Europe next to the one in India, and the Region setting (Auto by default) picks the faster one for you.' },
      { q: 'Do my friends have to live in Europe too?', a: 'No, but ping is lowest when you and your friends are all reasonably close to the relay you use. You can change the region in the app, and the status page shows live ping from your browser.' },
      { q: 'Is it really free?', a: 'Yes. The app, the relay and the address are free, with no queue (hosts join our Discord server). Custom names like yourname.voxelport.in are a supporter perk and are only available on the India relay for now.' },
      { q: 'What happens to player IP addresses?', a: 'The relay needs an IP address to pass a connection along, but it keeps it in memory only for as long as the connection lasts and does not write it to its logs. The privacy notice has the details.' },
    ],
    html: `
<p>If you live in Germany, the UK, France, the Netherlands, Poland, Spain, Italy or anywhere else in Europe, you can host a Minecraft Java server from your own PC for free, without opening a single port on your router. VoxelPort now runs a relay in Europe, so the traffic between you and your friends does not have to travel to another continent.</p>

<h2 id="why">Why the relay location matters</h2>
<p>A relay sits between you and your players: your PC connects out to it, and your friends connect to it. Every packet takes that detour, so ping depends on how far you and your friends are from the relay. A relay on the other side of the world adds a lot; one in Europe adds very little for players in Europe. The <a href="/status">status page</a> shows the live ping from your own browser to each relay.</p>

<h2 id="region">How the app picks a region</h2>
<p>In VoxelPort 1.11 and newer, the <b>Region</b> setting on the server screen has three options: <b>Auto (fastest)</b>, <b>India</b> and <b>Europe</b>. Auto measures both relays when you click <b>Make public</b> and uses the faster one. You can also choose Europe by hand. Your public address then uses the Europe address, for example <code>play-eu.voxelport.in:26000</code>.</p>

<h2 id="steps">Set it up in five steps</h2>
${GET_APP}
<ol>
  <li>Click <b>+ Add Server</b>, pick Vanilla, Paper or Fabric and a version, and click <b>Install &amp; start</b>. Java is installed for you.</li>
  <li>When the server shows <b>Online</b>, check that <b>Region</b> is on <b>Auto</b> (or <b>Europe</b>) and click <b>Make public</b>.</li>
  <li>Copy the address the app shows.</li>
  <li>Friends open Minecraft, go to <b>Multiplayer → Add Server</b>, paste the address and join. They need nothing installed.</li>
  <li>For Bedrock players on phones and consoles, switch on <b>Let Bedrock players join</b> in the server settings.</li>
</ol>

<h2 id="good">Good to know</h2>
<ul>
  <li><b>Your PC must stay on</b> while people play. VoxelPort is not 24/7 hosting; for that you need a paid host or an always-on machine.</li>
  <li><b>The Europe relay is new</b> and run by one student, so there is no uptime guarantee. If it is down, switch the Region to India and your server keeps working.</li>
  <li><b>Custom addresses</b> (a supporter perk) are only on the India relay for now. An address stays on the relay where it was claimed.</li>
  <li><b>Behind a shared IP address?</b> Many European providers use CGNAT or DS-Lite, which breaks port forwarding. Relays work anyway: see <a href="/guides/minecraft-server-dslite-cgnat-europe">the DS-Lite and CGNAT guide</a>.</li>
</ul>`,
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: 'minecraft-server-dslite-cgnat-europe',
    title: 'Minecraft Server Behind DS-Lite or CGNAT: Host It Anyway',
    short: 'DS-Lite and CGNAT',
    description: 'Behind DS-Lite or CGNAT with no public IPv4? You can still host a Minecraft server: VoxelPort connects out to a relay, so nothing needs opening on your router.',
    kicker: 'Europe · Any ISP',
    blurb: 'Why port forwarding fails on DS-Lite and CGNAT, how to check which one you have, and the simple fix.',
    faq: [
      { q: 'What is DS-Lite?', a: 'Dual-Stack Lite gives your connection an IPv6 address and a shared IPv4 address that is used by many customers at once. Incoming IPv4 connections cannot reach your router, so port forwarding for IPv4 does not work.' },
      { q: 'What is CGNAT?', a: 'Carrier-grade NAT means your provider shares one public IPv4 address between many customers. Like DS-Lite, it blocks incoming IPv4 connections. It is also very common on mobile internet.' },
      { q: 'Can I just use IPv6 instead?', a: 'Only if every player also has IPv6, and many do not. A relay works for players on both IPv4 and IPv6, because they connect to the relay, not to your home connection.' },
    ],
    html: `
<p>You open port 25565 on your router, and your friends still cannot join. In many cases the port forwarding is fine. The problem is that your internet provider never gives your router a public IPv4 address of its own. This is the case on DS-Lite and CGNAT connections, which are used by several cable, fibre and mobile providers in Europe.</p>

<h2 id="check">How to check which one you have</h2>
<ol>
  <li>Open your router's status page and look at the <b>WAN IPv4 address</b>.</li>
  <li>Open a "what is my IP" site on a device in your network and compare. If the two IPv4 addresses differ, or the router's address starts with <code>100.64</code> to <code>100.127</code>, <code>10.</code> or <code>192.168.</code>, you are behind CGNAT.</li>
  <li>If your router shows <b>no IPv4 address at all</b> but an IPv6 one, or its status page says <b>DS-Lite</b>, you are on DS-Lite.</li>
</ol>

<h2 id="options">What still works</h2>
<table>
  <thead><tr><th>Method</th><th>Works on DS-Lite / CGNAT?</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td>Port forwarding (IPv4)</td><td>No</td><td>Incoming IPv4 never reaches your router</td></tr>
    <tr><td>Direct IPv6</td><td>Sometimes</td><td>Needs IPv6 on you and on every player</td></tr>
    <tr><td>Virtual LAN (Hamachi, ZeroTier, Tailscale)</td><td>Yes</td><td>Every player must install it and sign up</td></tr>
    <tr><td>A relay (VoxelPort)</td><td>Yes</td><td>Players need nothing installed; your PC connects out</td></tr>
    <tr><td>Paid hosting</td><td>Yes</td><td>Costs money every month</td></tr>
  </tbody>
</table>

<h2 id="fix">The free fix with VoxelPort</h2>
<p>A relay does not need an incoming connection. Your PC connects <i>out</i> to the relay, which every connection type allows, and the relay hands players a public address. VoxelPort has a relay in Europe, so ping stays low for friends nearby.</p>
${GET_APP}
<ol>
  <li>Create or import a server in the app and start it.</li>
  <li>Click <b>Make public</b> and copy the address.</li>
  <li>Friends paste it into <b>Multiplayer → Add Server</b>.</li>
</ol>
<div class="tip">There is no need to change anything in your router, and you do not need to call your provider to ask for a public IP address. The <a href="/guides/free-minecraft-server-hosting-europe">Europe guide</a> explains the region setting.</div>`,
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: 'minecraft-server-ohne-portfreigabe-kostenlos',
    lang: 'de',
    title: 'Minecraft Server ohne Portfreigabe hosten (kostenlos)',
    short: 'Ohne Portfreigabe (DE)',
    description: 'Minecraft Server ohne Portfreigabe kostenlos hosten, auch bei DS-Lite und CGNAT. So geht es mit VoxelPort: Java und Bedrock, ohne Router-Einstellungen.',
    kicker: 'Deutsch · Kostenlos',
    blurb: 'So hostest du einen Minecraft-Server von zu Hause, ohne Ports im Router freizugeben, auch bei DS-Lite oder CGNAT.',
    faq: [
      { q: 'Muss ich im Router einen Port freigeben?', a: 'Nein. Dein PC baut selbst eine ausgehende Verbindung zum Relay auf. Am Router musst du nichts einstellen.' },
      { q: 'Funktioniert das bei DS-Lite oder CGNAT?', a: 'Ja. Bei DS-Lite und CGNAT kommen eingehende IPv4-Verbindungen nicht bis zu deinem Router, aber ein Relay braucht keine eingehende Verbindung.' },
      { q: 'Was kostet VoxelPort?', a: 'Nichts. Die App, das Relay und die Adresse sind kostenlos, ohne Konto und ohne Warteschlange.' },
      { q: 'Müssen meine Freunde etwas installieren?', a: 'Nein. Sie öffnen Minecraft, gehen auf Mehrspieler, Server hinzufügen, fügen deine Adresse ein und treten bei.' },
    ],
    html: `
<p>Du willst mit Freunden Minecraft spielen, aber die Portfreigabe im Router klappt nicht? Bei vielen Anschlüssen liegt das an DS-Lite oder CGNAT: Dein Anbieter gibt dir keine eigene öffentliche IPv4-Adresse, und eingehende Verbindungen erreichen deinen Router nie. Mit einem Relay kannst du trotzdem einen Server hosten, ohne irgendetwas freizugeben.</p>

<h2 id="relay">So funktioniert ein Relay</h2>
<p>Router blockieren eingehende Verbindungen, erlauben aber ausgehende. Dein PC verbindet sich deshalb von sich aus mit dem Relay und hält die Verbindung offen. Das Relay gibt dir eine öffentliche Adresse. Wenn ein Freund sich damit verbindet, leitet das Relay den Verkehr durch die bestehende Verbindung zu deinem PC. Deine Heim-IP bleibt dabei für deine Mitspieler unsichtbar.</p>
<p>VoxelPort hat ein Relay in Europa, damit der Ping für Spieler in Deutschland und den Nachbarländern niedrig bleibt.</p>

<h2 id="schritte">In fünf Schritten einrichten</h2>
${GET_APP}
<ol>
  <li>Klicke auf <b>+ Add Server</b>, wähle Vanilla, Paper oder Fabric und eine Version und klicke auf <b>Install &amp; start</b>. Java wird bei Bedarf automatisch installiert.</li>
  <li>Sobald der Server <b>Online</b> anzeigt, klicke auf <b>Make public</b>. Die Einstellung <b>Region</b> steht auf <b>Auto</b>, dann wählt die App das schnellere Relay selbst.</li>
  <li>Kopiere die angezeigte Adresse.</li>
  <li>Deine Freunde öffnen Minecraft, gehen auf <b>Mehrspieler → Server hinzufügen</b>, fügen die Adresse ein und treten bei.</li>
  <li>Für Bedrock-Spieler auf Handy oder Konsole schaltest du in den Servereinstellungen <b>Let Bedrock players join</b> ein.</li>
</ol>

<h2 id="hinweise">Gut zu wissen</h2>
<ul>
  <li><b>Dein PC muss laufen</b>, solange gespielt wird. VoxelPort ist kein 24/7-Hosting.</li>
  <li><b>Das Relay in Europa ist neu</b> und wird von einem Studenten betrieben, daher gibt es keine Verfügbarkeitsgarantie. Fällt es aus, stelle die Region auf Indien, dann läuft dein Server weiter.</li>
  <li><b>Datenschutz:</b> Das Relay schreibt keine IP-Adressen in seine Logs. Einzelheiten stehen in der <a href="/legal">Datenschutzerklärung</a> (auf Englisch).</li>
  <li>Mehr zu DS-Lite und CGNAT: <a href="/guides/minecraft-server-dslite-cgnat-europe">Guide auf Englisch</a>.</li>
</ul>`,
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: 'voxelport-fabric-mod-install-guide',
    title: 'VoxelPort Fabric Mod: Install and Use (MC 26.1-26.3)',
    short: 'Fabric mod guide',
    description: 'Install the VoxelPort Fabric mod for Minecraft 26.1 to 26.3: an Open to VoxelPort pause-menu button and /voxelport start to put your world online.',
    kicker: 'Fabric mod · Free',
    blurb: 'Install the VoxelPort Fabric mod, press Open to VoxelPort, and your friends can join: steps, commands, regions and fixes.',
    faq: [
      { q: 'Do my friends need the mod?', a: 'No. Only the host installs it. Friends join with normal Minecraft: Java Edition using the address the mod gives you.' },
      { q: 'Which Minecraft versions does the mod support?', a: 'Minecraft 26.1, 26.1.1, 26.1.2, 26.2 and 26.3 with Fabric Loader 0.18.6 or newer on Java 25 or newer. When a new Minecraft version changes something the mod hooks into, the mod needs an update, so use the newest release.' },
      { q: 'Mod or app: which should I use?', a: 'Use the mod if you want to stay inside Minecraft and open your current world with one button. Use the VoxelPort app if you want to create and manage servers, install plugins and mods, run Bedrock crossplay, back up worlds or keep a friends-only list. They use the same relays.' },
      { q: 'Does my game have to stay open?', a: 'Yes. The address works while your world or server is running. VoxelPort is not a 24/7 host, and the relays are run by one student with no uptime guarantee.' },
      { q: 'Is it free, and do I need an account?', a: 'It is free and open source (MIT). There is no account: the mod creates a private device token on first use.' },
      { q: 'Which relay does it use?', a: 'With the default settings it measures the India and Europe relays and uses the closer one, so you do not choose anything. Your friends join play.voxelport.in:port (India) or play-eu.voxelport.in:port (Europe).' },
    ],
    html: `
<p>The VoxelPort Fabric mod adds one button to Minecraft: <b>Open to VoxelPort</b>. Open your world to LAN, press it, and the mod connects out to a VoxelPort relay and gives you a public address. Your friends paste that address into Multiplayer and join from <b>normal Minecraft</b>, with no port forwarding on your router and nothing installed on their side.</p>

<div class="tip"><b>Mod or app?</b> This is the small option for people who want to stay in the game. The <a href="/download">VoxelPort app</a> does much more: it creates and manages servers, installs plugins and mods, runs Bedrock crossplay and keeps backups. Both use the same relays, and you can use either.</div>

<h2 id="requirements">What you need</h2>
<table>
  <thead><tr><th></th><th>Needed</th></tr></thead>
  <tbody>
    <tr><td>Minecraft: Java Edition</td><td>26.1, 26.1.1, 26.1.2, 26.2 or 26.3</td></tr>
    <tr><td>Fabric Loader</td><td>0.18.6 or newer</td></tr>
    <tr><td>Java</td><td>25 or newer (the Minecraft launcher installs it for these versions)</td></tr>
    <tr><td>Internet</td><td>Outbound HTTPS/WSS to <code>relay.voxelport.in</code> and <code>eu.voxelport.in</code> on port 443</td></tr>
  </tbody>
</table>
<p>Only the <b>host</b> installs the mod. The mod needs VoxelPort's relay service, so it does not work offline.</p>

<h2 id="install">Install the mod</h2>
<ol>
  <li>Install <b>Fabric Loader</b> for your Minecraft version with the official installer from <a href="https://fabricmc.net/use/installer/" target="_blank" rel="noreferrer">fabricmc.net</a>. It adds a Fabric profile to the Minecraft launcher.</li>
  <li>Download the latest <b>VoxelPort-Fabric.jar</b> from the <a href="https://github.com/VOXELPORT/VoxelPort/releases/latest" target="_blank" rel="noreferrer">GitHub releases page</a>.</li>
  <li>Press <b>Win + R</b>, type <code>%appdata%\\.minecraft\\mods</code> and press Enter (create the <code>mods</code> folder if it is not there). Put the jar in it. On macOS and Linux the folder is <code>.minecraft/mods</code> in your home or Library folder.</li>
  <li>Start the <b>Fabric</b> profile in the launcher. When the game opens, the mod is loaded.</li>
</ol>

<h2 id="singleplayer">Share a singleplayer world</h2>
<ol>
  <li>Open your world.</li>
  <li>Press <b>Esc</b>, click <b>Open to LAN</b> and start the LAN world.</li>
  <li>Press <b>Esc</b> again and click <b>Open to VoxelPort</b>.</li>
  <li>The address is copied to your clipboard, for example <code>play.voxelport.in:26137</code> (India) or <code>play-eu.voxelport.in:26137</code> (Europe). Send it to your friends.</li>
  <li>They open Minecraft, go to <b>Multiplayer → Add Server</b>, paste the address and join.</li>
</ol>
<p>The button changes to <b>VoxelPort: Live</b>. Click it to see the address, how long you have been live and how many players are connected. The relay ping is shown in the player-list header (hold <b>Tab</b>). To stop sharing, leave the world.</p>

<h2 id="server">Share a Fabric server</h2>
<ol>
  <li>Install Fabric Loader on your server and put the mod jar in the server's <code>mods</code> folder.</li>
  <li>Start the server.</li>
  <li>As an operator, run <code>/voxelport start</code> in the console or in game. It prints the public address.</li>
  <li>Share that address. <code>/voxelport status</code> shows it again at any time.</li>
</ol>

<h2 id="commands">Commands</h2>
<p><code>/voxelport</code> also works as <code>/voxel</code> and <code>/vp</code>. They need game-master permissions (operator level 2).</p>
<table>
  <thead><tr><th>Command</th><th>What it does</th></tr></thead>
  <tbody>
    <tr><td><code>/voxelport start</code></td><td>Go public using the server's own port</td></tr>
    <tr><td><code>/voxelport start &lt;port&gt;</code></td><td>Go public with a different local port</td></tr>
    <tr><td><code>/voxelport status</code></td><td>Show the address, uptime, players and relay ping</td></tr>
    <tr><td><code>/voxelport stop</code></td><td>Stop sharing</td></tr>
  </tbody>
</table>

<h2 id="regions">India or Europe?</h2>
<p>VoxelPort has a relay in India and one in Europe. When you press the button, the mod measures both and uses the closer one, so you do not choose anything. Ping is lowest when you and your friends are all reasonably close to the relay in use. You can see live relay status on the <a href="/status">status page</a>.</p>

<h2 id="update">Update the mod</h2>
<p>Download the newest jar from the releases page, delete the old VoxelPort jar from your <code>mods</code> folder and put the new one in. Minecraft updates can break mods that hook into the game, so after updating Minecraft, check that the mod has a release for your version.</p>

<h2 id="fixes">If something goes wrong</h2>
<ul>
  <li><b>No "Open to VoxelPort" button:</b> you are probably not on the Fabric profile, the jar is not in the right <code>mods</code> folder, or your Minecraft version is not 26.1 to 26.3. Check the game's mod list or the log.</li>
  <li><b>It will not connect:</b> allow outbound HTTPS/WSS to <code>relay.voxelport.in</code> and <code>eu.voxelport.in</code> on port 443. Some school and work networks block it. Check the <a href="/status">status page</a> too.</li>
  <li><b>Friends cannot join:</b> make sure they use the exact address from the Live screen or <code>/voxelport status</code>, and that your world or server is still running.</li>
  <li><b>The game crashes on start:</b> check the Java version (25 or newer), make sure the Fabric Loader is 0.18.6 or newer, and use the latest mod release.</li>
  <li><b>Want your own relay or token?</b> Optional. Settings are in <code>config/voxelport/settings.properties</code> (<code>relay_url</code>, <code>public_host</code>). Set the <code>VOXELPORT_TOKEN</code> environment variable to use your own token.</li>
</ul>
<p>Still stuck? Ask in the <a href="/community">Discord</a> or open an issue on <a href="https://github.com/VOXELPORT/VoxelPort/issues" target="_blank" rel="noreferrer">GitHub</a>.</p>

<h2 id="privacy">What the mod stores and sends</h2>
<ul>
  <li><b>Stored on your computer:</b> a random device token.</li>
  <li><b>Sent to the relay:</b> that token, the mod name and version (for support), and your game's network traffic while you share, which is passed on and never inspected.</li>
  <li><b>Not collected:</b> passwords, email, chat, inventory, world data or analytics.</li>
</ul>
<p>Details are in the <a href="/legal">privacy notice</a>.</p>`,
  },
];

export const GUIDES_INDEX = {
  path: '/guides',
  title: 'Minecraft Server Guides: Hosting, Crossplay, Fixes',
  description: 'Free guides for hosting a Minecraft server from home: no port forwarding, India and Europe, Jio and Airtel, CGNAT, Bedrock crossplay and crash fixes.',
};

export const guidePath = (g) => `/guides/${g.slug}`;
export const findGuide = (slug) => GUIDES.find((g) => g.slug === slug);

/** Section headings for the table of contents: [{ id, text }]. */
export function guideToc(g) {
  return [...g.html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map((m) => ({ id: m[1], text: m[2].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&') }));
}

/** JSON-LD for a guide: Article, breadcrumbs and FAQ. */
export function guideJsonLd(g, site) {
  const url = site + guidePath(g);
  const out = [
    {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: g.title, description: g.description, url, mainEntityOfPage: url,
      image: `${site}/og-image.png`, datePublished: GUIDES_UPDATED, dateModified: GUIDES_UPDATED, inLanguage: g.lang || 'en',
      author: { '@type': 'Organization', name: 'VoxelPort', url: `${site}/` },
      publisher: { '@type': 'Organization', name: 'VoxelPort', url: `${site}/`, logo: { '@type': 'ImageObject', url: `${site}/logo.png` } },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'VoxelPort', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: `${site}/guides` },
        { '@type': 'ListItem', position: 3, name: g.short, item: url },
      ],
    },
  ];
  if (g.faq?.length) {
    out.push({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: g.faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    });
  }
  return out;
}
