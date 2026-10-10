// Guide articles (/guides/<slug>). Plain ESM data shared by the React page and
// scripts/prerender.mjs, which writes each article into static HTML so search
// engines see the full text. `html` is trusted, hand-written markup: <h2 id>,
// <p>, <ul>/<ol>, <table>, <code>, <div class="tip">, and site links.

export const GUIDES_UPDATED = '2026-10-10';

const STORE = 'https://apps.microsoft.com/detail/9NGRX9CFNBD6';

const GET_APP = `<p>Get VoxelPort from the <a href="${STORE}">Microsoft Store</a> (Windows 10 and 11) or download the <a href="https://github.com/VOXELPORT/VoxelPort-App/releases/latest">Linux build from GitHub</a>. It's free, open source, and needs no account.</p>`;

export const GUIDES = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'host-minecraft-server-jio-airtel',
    title: 'How to Host a Minecraft Server on Jio or Airtel Without Port Forwarding',
    short: 'Host on Jio or Airtel',
    description: 'Port forwarding doesn’t work on most Jio Fiber, AirFiber and Airtel connections because of CGNAT. Here’s how to check, and how to host a Minecraft server for friends anyway — free.',
    kicker: 'India · CGNAT',
    blurb: 'Why port forwarding fails on Jio and Airtel, how to check for CGNAT, and the fix.',
    faq: [
      { q: 'Why doesn’t port forwarding work on Jio Fiber?', a: 'Most Jio Fiber and AirFiber connections are behind CGNAT: your router doesn’t get a public IPv4 address, so a forwarded port on your router can’t be reached from the internet. A relay such as VoxelPort avoids the problem because your PC connects out to it.' },
      { q: 'Does this work on Airtel Xstream Fiber?', a: 'Yes. Whether or not your Airtel connection has a public IP, VoxelPort only needs an outgoing connection, so it works the same way on Airtel, Jio, ACT, BSNL and other ISPs.' },
      { q: 'Can I host from a mobile hotspot?', a: 'Yes, it works on a Jio or Airtel mobile hotspot, because no incoming connections are needed. Watch your data: every player’s traffic goes through your connection.' },
      { q: 'Will my friends get good ping?', a: 'VoxelPort’s relay is in India, so friends in India usually get low ping. Friends abroad connect through India too, so their ping will be higher.' },
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
  <li>Optional: type a name under <b>Get a custom address — free</b> and click <b>Claim</b>. Friends can then join with <code>yourname.voxelport.in</code> and no port number.</li>
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
    title: 'How to Host a Minecraft Server Without Port Forwarding (Free)',
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
    <tr><td>VoxelPort</td><td>No</td><td>No</td><td>Made for Minecraft: sets up the server and Java, Bedrock crossplay, free custom address</td></tr>
    <tr><td>Paid hosting</td><td>No</td><td>Yes</td><td>Runs 24/7 without your PC, but costs money monthly</td></tr>
  </tbody>
</table>

<h2 id="steps">Free setup in five steps</h2>
${GET_APP}
<ol>
  <li>Click <b>+ Add Server</b> and pick a template or a server type (Vanilla, Paper or Fabric) and version.</li>
  <li>Choose the RAM, agree to the Minecraft EULA, and click <b>Install &amp; start</b>. Java is installed automatically if you don’t have the right version.</li>
  <li>Wait for the server to show <b>Online</b>, then click <b>Make public</b>.</li>
  <li>Copy the address, for example <code>play.voxelport.in:26137</code>. Claim a free name if you want <code>yourname.voxelport.in</code> instead.</li>
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
    title: 'How to Play Minecraft With Friends on Different Wi-Fi (Java & Bedrock)',
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
  <li>Claim a <a href="/guides/free-minecraft-server-address">free custom address</a> so friends don’t have to remember a port number.</li>
</ul>`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'minecraft-java-bedrock-crossplay-server',
    title: 'How to Make a Minecraft Server Java and Bedrock Players Can Both Join',
    short: 'Java + Bedrock crossplay',
    description: 'Let Bedrock players on phones, consoles and Windows join a Java server using Geyser and Floodgate. What they do, how to set them up in one click, and how Bedrock players connect.',
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
    title: 'How to Get a Free Custom Minecraft Server Address (No Port Number)',
    short: 'Free custom address',
    description: 'Replace play.voxelport.in:26137 with yourname.voxelport.in for free. How SRV records let Java players skip the port, how to claim a name, and how to use your own domain.',
    kicker: 'Addresses · DNS',
    blurb: 'Get yourname.voxelport.in for free, and how SRV records remove the port number.',
    faq: [
      { q: 'Is the custom address really free?', a: 'Yes. Every VoxelPort install can claim one name under voxelport.in at no cost. A name that isn’t used for 60 days is released so others can claim it.' },
      { q: 'Why does my address work without a port?', a: 'VoxelPort creates a DNS SRV record for your name. Minecraft Java looks up that record and finds the port automatically.' },
      { q: 'Can I use my own domain?', a: 'Yes. Add an SRV record on your domain pointing to play.voxelport.in and your VoxelPort port. Claim a voxelport.in name first so your port stays reserved.' },
    ],
    html: `
<p>An address like <code>play.voxelport.in:26137</code> works, but it’s hard to remember and easy to mistype. A custom address such as <code>yourname.voxelport.in</code> is easier to share, and Java players don’t need to type a port.</p>

<h2 id="claim">Claim your free address</h2>
${GET_APP}
<ol>
  <li>Start your server and click <b>Make public</b>.</li>
  <li>Under <b>Get a custom address — free</b>, type a name: 3–20 letters, numbers or dashes.</li>
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
  <li>Claim a voxelport.in name first, so your public port is reserved and won’t change.</li>
  <li>At your DNS provider, add an <b>SRV</b> record: service <code>_minecraft</code>, protocol <code>_tcp</code>, name <code>mc</code>, priority <code>0</code>, weight <code>5</code>, port <i>your VoxelPort port</i>, target <code>play.voxelport.in</code>.</li>
  <li>Java players can then join with <code>mc.example.com</code>.</li>
</ol>`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'minecraft-server-crash-fixes',
    title: 'Minecraft Server Crashing? Common Errors and How to Fix Them',
    short: 'Fix server crashes',
    description: 'What “Failed to bind to port”, “Could not reserve enough space for object heap”, OutOfMemoryError, UnsupportedClassVersionError and other Minecraft server errors mean, and how to fix each one.',
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
    slug: 'minecraft-server-linux-raspberry-pi',
    title: 'Host a Minecraft Server on Linux, a Raspberry Pi or a Mac Without Port Forwarding',
    short: 'Linux, Pi & Mac (CLI)',
    description: 'Put a Minecraft server on a VPS, Raspberry Pi, home server, Docker or Mac online with one command: free, open source, no port forwarding, Java and Bedrock.',
    kicker: 'Command line',
    blurb: 'The VoxelPort CLI: one command for headless servers, Raspberry Pi, Docker and macOS.',
    faq: [
      { q: 'Does the VoxelPort CLI work on a Raspberry Pi?', a: 'Yes. There are builds for 64-bit Raspberry Pi OS (ARM64) and older 32-bit Pis (ARMv7). The install script picks the right one.' },
      { q: 'Can I use it with Pterodactyl, Pelican or Docker?', a: 'Yes. Run the Docker image next to your server and point it at the server with --host, or run the CLI on the machine and give it the server’s port.' },
      { q: 'Is there a Windows version?', a: 'On Windows, use the VoxelPort app from the Microsoft Store. It does the same thing, and also sets up the server and Java for you.' },
    ],
    html: `
<p>No desktop? No problem. The <b>VoxelPort CLI</b> is a single small program that puts a Minecraft server online from a VPS, a Raspberry Pi, a home server, a Docker container or a Mac, without port forwarding. It uses the same free relay as the VoxelPort app, so it works behind CGNAT and keeps your IP hidden.</p>

<h2 id="install">Install</h2>
<p>On Linux (x86-64, ARM64, Raspberry Pi) or macOS, run:</p>
<p><code>curl -fsSL https://voxelport.in/install.sh | sh</code></p>
<p>The script downloads the right build from <a href="https://github.com/VOXELPORT/cli/releases">GitHub</a>, checks its checksum, and installs the <code>voxelport</code> command.</p>

<h2 id="share">Share your server</h2>
<ol>
  <li>Start your Minecraft server as usual (Vanilla, Paper, Fabric, Forge, a modpack: anything).</li>
  <li>Run <code>voxelport up</code> (or <code>voxelport up 25570</code> if it isn't on port 25565).</li>
  <li>The CLI prints an address like <code>play.voxelport.in:26137</code>. Friends paste it into <b>Multiplayer → Add Server</b>.</li>
</ol>
<table>
  <thead><tr><th>Add this</th><th>To get</th></tr></thead>
  <tbody>
    <tr><td><code>--name traz</code></td><td>The free address <code>traz.voxelport.in</code> (no port for Java players)</td></tr>
    <tr><td><code>--bedrock</code></td><td>Bedrock players too (needs Geyser on UDP 19132)</td></tr>
    <tr><td><code>--list --mode survival</code></td><td>A spot on <a href="/servers">voxelport.in/servers</a>, with live player count</td></tr>
    <tr><td><code>--host mc</code></td><td>A server on another machine or Docker container</td></tr>
  </tbody>
</table>

<h2 id="boot">Keep it running</h2>
<p>Run <code>voxelport service install</code> with the same options to start VoxelPort at boot (systemd on Linux, launchd on macOS). It reconnects by itself after network drops. On Linux, run <code>sudo loginctl enable-linger $USER</code> once so it keeps running when you log out.</p>

<h2 id="docker">Docker</h2>
<p><code>docker run -d --network host -v voxelport:/data ghcr.io/voxelport/cli up 25565</code></p>
<p>The volume keeps your identity, and with it your address. In Docker Compose, put VoxelPort next to your server container and use <code>--host</code> with the server's service name. The <a href="https://github.com/VOXELPORT/cli#docker">README</a> has a full example.</p>

<h2 id="identity">Your address belongs to your identity file</h2>
<p>On first run the CLI creates <code>~/.config/voxelport/token</code>. Your port and custom address are tied to it, so keep it, and don't run two machines with the same file. If you delete it you get a new address.</p>
<div class="tip">Hosting from a Windows PC? Use the <a href="https://apps.microsoft.com/detail/9NGRX9CFNBD6">VoxelPort app</a> instead. It also installs the server and Java for you. See <a href="/guides/minecraft-server-without-port-forwarding">the step-by-step guide</a>.</div>`,
  },
];

export const GUIDES_INDEX = {
  path: '/guides',
  title: 'Minecraft Server Guides — Hosting, Crossplay and Fixes | VoxelPort',
  description: 'Free guides for hosting a Minecraft server from home: without port forwarding, on Jio and Airtel, with Java + Bedrock crossplay, a free custom address, and fixes for common crashes.',
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
      image: `${site}/og-image.png`, datePublished: GUIDES_UPDATED, dateModified: GUIDES_UPDATED, inLanguage: 'en',
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
