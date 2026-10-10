import { useEffect } from 'react';
import { Nav, Footer } from './ui.jsx';
import { EXAMPLE_ADDR } from './data.js';

const SECTIONS = [
  ['mit-license', 'MIT License', 'var(--grass)'],
  ['privacy-notice', 'Privacy', 'var(--red)'],
  ['terms-of-use', 'Terms', 'var(--gold)'],
  ['trademarks', 'Trademarks', 'var(--diamond)'],
];

const UPDATED = 'October 2026';

/** Scroll to a section id without changing the hash route. */
function jump(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function LegalPage({ onBack }) {
  // Deep links look like #/legal#privacy-notice.
  useEffect(() => {
    const target = window.location.hash.split('#')[2];
    if (target) setTimeout(() => jump(target), 50);
    else window.scrollTo(0, 0);
  }, []);

  const back = (e) => { e?.preventDefault(); onBack(e); };

  return (
    <div className="zine">
      <Nav links={[['← Back to site', '#', back]]} relay={null} onLogo={back} />

      <main className="wrap legal" style={{ maxWidth: 860, paddingTop: 60, paddingBottom: 100 }}>
        <span className="kicker">The fine print</span>
        <h1 style={{ fontSize: 'clamp(60px, 10vw, 120px)', fontWeight: 400, lineHeight: .95, marginTop: 10 }}>
          <span className="c-title" data-text="LEGAL &">LEGAL &amp;</span><br />
          <span className="c-title green" data-text="POLICIES">POLICIES</span>
        </h1>
        <p className="lede" style={{ marginTop: 22 }}>
          How VoxelPort works, what data it handles, and what you can do with it — in plain words.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
          {SECTIONS.map(([id, label, color], i) => (
            <button key={id} className="chip" onClick={() => jump(id)}
              style={{ background: color, cursor: 'pointer', transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)`, color: color === 'var(--red)' ? 'var(--card)' : 'var(--ink)' }}>
              {label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ── MIT LICENSE ── */}
        <Section id="mit-license" n="01" title="MIT LICENSE" color="var(--grass)">
          <p>Copyright © 2026 trazhub (Garv Verma).</p>
          <p>
            Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
            documentation files (the “Software”), to deal in the Software without restriction, including without limitation the
            rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
            persons to whom the Software is furnished to do so, subject to the following conditions:
          </p>
          <p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
          <p className="typewriter" style={{ fontSize: 14, color: 'var(--muted)' }}>
            THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
            COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
            OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
          </p>
          <Callout color="var(--grass)">
            The license files live with the code:{' '}
            <a href="https://github.com/VOXELPORT/VoxelPort-App/blob/main/LICENSE" target="_blank" rel="noreferrer">desktop app</a> and{' '}
            <a href="https://github.com/VOXELPORT/relay/blob/main/LICENSE" target="_blank" rel="noreferrer">relay</a>. Study it, fork it, improve it.
          </Callout>
        </Section>

        {/* ── PRIVACY ── */}
        <Section id="privacy-notice" n="02" title="PRIVACY NOTICE" color="var(--red)">
          <p>
            VoxelPort is a desktop app and a relay server. This notice says exactly what data they handle and where
            it goes. Nothing is hidden: the code for both is public.
          </p>

          <Sub color="var(--red)">Stored on your computer</Sub>
          <p>
            The desktop app keeps its device token in its user-data folder (encrypted with your OS keychain where available).
            Nothing is stored on your players’ machines.
          </p>
          <Table rows={[
            ['What', 'Contents', 'Purpose', 'Kept'],
            ['Device token', 'An auto-generated vp_… key', 'Identifies your host to the relay so you keep the same address', 'Until you delete it'],
            ['Settings', 'Relay URL, ports, your server list (app)', 'Remembers your setup', 'Until you delete it'],
          ]} />

          <Sub color="var(--red)">Sent to the relay</Sub>
          <p>
            Hosts connect to <Code>wss://direct.voxelport.in:26499</Code> first and fall back to <Code>wss://relay.voxelport.in</Code>
            (routed through Cloudflare) if that fails. Players connect to <Code>play.voxelport.in:&lt;port&gt;</Code>.
          </p>
          <Table rows={[
            ['When', 'Data', 'Why'],
            ['You start hosting', 'Your device token', `Registers your host; the relay assigns a public address like ${EXAMPLE_ADDR}`],
            ['A player joins', 'Minecraft game traffic (Java, and Bedrock if you turned it on)', 'The relay passes bytes between the player and your server. It does not read or store packet contents.'],
            ['While hosting', 'A periodic ping', 'Keeps the connection alive and measures relay ping'],
            ['You claim a custom address', 'The name you pick, linked to a one-way hash of your device token', 'Publishes yourname.voxelport.in in public DNS. Kept until you remove it, or after 60 days unused.'],
            ['You list your server (opt-in)', 'Server name, description, version, game mode, player count', 'Shown publicly on voxelport.in/servers only while your server is public. Never stored.'],
          ]} />

          <Sub color="var(--red)">What the relay logs</Sub>
          <p>
            For abuse prevention and capacity planning the relay writes a short line per hosting session to its server log: the first
            8 characters of your token, the public port, how long the session lasted, how many player connections it had, and how
            many bytes went through. It does <b>not</b> log IP addresses, player names, chat or any game content.
          </p>

          <Sub color="var(--red)">Never collected</Sub>
          <List items={[
            'Passwords, emails or accounts of any kind',
            'Minecraft chat, inventories, worlds or other game data',
            'Location, device fingerprints or hardware IDs',
            'Analytics, telemetry or crash reports',
          ]} />

          <Sub color="var(--red)">IP addresses</Sub>
          <p>
            Any internet connection reveals your IP address to the server you connect to, so the relay sees the IP of hosts and
            players while they are connected. It uses it only to enforce per-IP connection limits and keeps it in memory for the
            length of the connection. On the Cloudflare route, Cloudflare also sees it as the network carrier.
          </p>

          <Sub color="var(--red)">This website</Sub>
          <p>
            No cookies, no analytics, no ad trackers. Fonts are served from this site. Your browser fetches the relay’s public
            status and the latest release numbers from GitHub’s public API to show them on the page. The site itself is delivered
            through Cloudflare.
          </p>

          <Sub color="var(--red)">Where the relay is</Sub>
          <p>
            There is <b>one relay, in India</b> — VoxelPort is free and self-funded, so that’s what we can run. Hosts and players
            near India get the best ping (often under 50 ms); Europe and the Americas typically see 150–250 ms of relay overhead.
            More regions may come if the project grows — support it on{' '}
            <a href="https://github.com/sponsors/trazhub" target="_blank" rel="noreferrer">GitHub Sponsors</a>.
          </p>

          <Sub color="var(--red)">Sharing &amp; deleting</Sub>
          <p>
            Your data is never sold or shared with advertisers. To delete everything, uninstall the app and remove its user-data
            folder, or delete <Code>config/voxelport/</Code> from your Minecraft folder. A new token is created next time you host.
          </p>

          <Callout color="var(--red)">Questions about data? Email <Code>garv@trazz.art</Code>.</Callout>
          <Updated />
        </Section>

        {/* ── TERMS ── */}
        <Section id="terms-of-use" n="03" title="TERMS OF USE" color="var(--gold)">
          <p>By installing or using the VoxelPort desktop app or relay, you agree to these terms. If you don’t, please don’t use VoxelPort.</p>

          <Sub color="var(--gold)">1 · What VoxelPort is</Sub>
          <p>
            A free, open-source tool for Minecraft: Java Edition that connects a server you run to players over the internet through
            a relay, without port forwarding. It is not a server-hosting service and is not affiliated with Mojang or Microsoft.
          </p>

          <Sub color="var(--gold)">2 · Your responsibilities</Sub>
          <List items={[
            'Run legitimate Minecraft: Java Edition server software and follow the Minecraft EULA.',
            'Be old enough in your country to agree to these terms (or have a parent or guardian agree).',
            'Keep your device token private — it is the only key to your relay address.',
          ]} />

          <Sub color="var(--gold)">3 · Don’t use VoxelPort to</Sub>
          <List items={[
            'Host or distribute pirated Minecraft content.',
            'Flood or abuse the relay, open automated connections, or tunnel anything that isn’t Minecraft multiplayer.',
            'Use someone else’s token or impersonate another host.',
            'Send malicious, illegal or harmful content.',
          ]} />

          <Sub color="var(--gold)">4 · Availability &amp; warranty</Sub>
          <p>
            VoxelPort is best-effort and provided “as is”. The relay can go offline for maintenance or unexpected reasons and
            sessions can drop without notice. We are not responsible for lost worlds, progress or connection problems —
            always keep your own backups.
          </p>

          <Sub color="var(--gold)">5 · Suspension</Sub>
          <p>Tokens used to break these terms can be blocked from the relay. The service is free, so no refunds apply.</p>

          <Sub color="var(--gold)">6 · Forks &amp; changes</Sub>
          <p>
            The code is MIT-licensed, so you can fork and modify it. Forks must not pretend to be the official VoxelPort app,
            or use the official relay without permission. These terms may change; continuing to use VoxelPort after an update means
            you accept it.
          </p>

          <Callout color="var(--gold)">Questions about these terms? Email <Code>garv@trazz.art</Code>.</Callout>
          <Updated />
        </Section>

        {/* ── TRADEMARKS ── */}
        <Section id="trademarks" n="04" title="TRADEMARKS" color="var(--diamond)">
          <p>
            VoxelPort is an independent, unofficial project. It is not affiliated with, endorsed or sponsored by any of the trademark
            holders below. All trademarks belong to their owners.
          </p>
          <Table rows={[
            ['Name', 'Owner', 'How VoxelPort uses it'],
            ['Minecraft', 'Mojang AB / Microsoft', 'To describe what VoxelPort is for. VoxelPort ships no Minecraft code or assets.'],
            ['Fabric', 'The Fabric Project', 'A server type the app can set up for you.'],
            ['Java', 'Oracle', 'The runtime Minecraft servers use.'],
            ['Geyser, Floodgate', 'GeyserMC', 'Installed on request so Bedrock players can join.'],
            ['Modrinth', 'Rinth, Inc.', 'Where Fabric versions of Geyser, Floodgate and Fabric API are downloaded from.'],
            ['GitHub', 'Microsoft', 'Where the source code and downloads are hosted.'],
            ['Cloudflare', 'Cloudflare, Inc.', 'Network provider for the website and the fallback relay route.'],
          ]} />
          <p>
            The VoxelPort name, logo and relay infrastructure belong to trazhub (Garv Verma). The code is MIT-licensed, but the name and
            branding may not be used for unofficial forks without permission. You need your own legitimate copy of Minecraft and must
            accept the <a href="https://www.minecraft.net/eula" target="_blank" rel="noreferrer">Minecraft EULA</a> to run a server.
          </p>
          <Callout color="var(--diamond)">Think we’re misusing a trademark you own? Email <Code>garv@trazz.art</Code> and we’ll fix it.</Callout>
          <Updated />
        </Section>
      </main>

      <Footer />
    </div>
  );
}

function Section({ id, n, title, color, children }) {
  return (
    <section id={id} className="panel legal-section" style={{ scrollMarginTop: 90 }}>
      <div className="legal-head" style={{ background: color, color: color === 'var(--red)' ? 'var(--card)' : 'var(--ink)' }}>
        <span className="pixel" style={{ fontSize: 15 }}>#{n}</span>
        <h2 className="h-display" style={{ fontSize: 'clamp(34px, 5vw, 50px)', color: 'inherit' }}>{title}</h2>
      </div>
      <div className="legal-body">{children}</div>
    </section>
  );
}

const Sub = ({ children, color }) => (
  <h3 className="h-display" style={{ fontSize: 28, marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
    <span style={{ width: 14, height: 14, background: color, border: '2.5px solid var(--ink)', flex: 'none' }} />{children}
  </h3>
);
const Code = ({ children }) => <code className="typewriter" style={{ fontWeight: 700, background: 'var(--paper-2)', border: '2px solid var(--ink)', padding: '0 6px', fontSize: '.92em', overflowWrap: 'anywhere' }}>{children}</code>;
const Callout = ({ children, color }) => <div className="sticker" style={{ background: color, textTransform: 'none', letterSpacing: 0, fontSize: 15, fontFamily: 'var(--body)', fontWeight: 600, lineHeight: 1.6, padding: '14px 18px', transform: 'rotate(-.4deg)', color: color === 'var(--red)' ? 'var(--card)' : 'var(--ink)' }}>{children}</div>;
const List = ({ items }) => <ul className="ticks">{items.map((t) => <li key={t}>{t}</li>)}</ul>;
const Updated = () => <p className="typewriter" style={{ fontSize: 13, color: 'var(--muted)' }}>Last updated: {UPDATED}</p>;

function Table({ rows }) {
  const [head, ...body] = rows;
  return (
    <div className="table-scroll" style={{ overflowX: 'auto' }}>
      <table className="table legal-table">
        <thead><tr>{head.map((h) => <th key={h}>{h.toUpperCase()}</th>)}</tr></thead>
        <tbody>{body.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
