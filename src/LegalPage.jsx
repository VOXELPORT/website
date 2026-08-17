import { useEffect } from 'react';
import './index.css';

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const GREEN = '#00FFB2';
const MAGENTA = '#FF4FA3';
const YELLOW = '#FFD84A';
const VIOLET = '#B084F5';
const VOID = '#0A0A0A';

const SECTION_COLORS = { '01': GREEN, '02': MAGENTA, '03': YELLOW, '04': VIOLET };

export default function LegalPage({ section, onBack }) {
  useEffect(() => { window.scrollTo(0, 0); }, [section]);

  return (
    <div className="vp-legal" style={{ background: VOID, minHeight: '100vh', color: '#E8E8E8', fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav className="nav">
        <a href="#" className="nav-logo" onClick={onBack}>
          <span style={{ display: 'inline-block', width: 22, height: 22, border: `1.5px solid ${GREEN}`, borderRadius: 5, boxShadow: '0 0 14px rgba(0,255,178,.4)' }} />
          VOXEL<span>PORT</span>
        </a>
        <ul className="nav-links">
          <li>
            <button
              onClick={onBack}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: MONO, fontSize: '0.72rem', color: '#9a9a9a', letterSpacing: '0.06em' }}
            >
              ← BACK TO SITE
            </button>
          </li>
        </ul>
      </nav>

      <div className="vp-legal-body" style={{ maxWidth: 760, margin: '0 auto', padding: '8rem 2.5rem 6rem' }}>

        {/* Page header */}
        <div style={{ marginBottom: '4rem', borderBottom: '1px solid var(--border)', paddingBottom: '3rem' }}>
          <div className="section-label" style={{ marginBottom: '1rem' }}>LEGAL</div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 0.9, letterSpacing: '-0.02em', color: '#fff' }}>
            LEGAL &<br /><span style={{ color: GREEN, textShadow: '0 0 44px rgba(0,255,178,.35)' }}>POLICIES</span>
          </h1>
          <p style={{ marginTop: '1.5rem', color: '#9a9a9a', fontWeight: 300, lineHeight: 1.75, maxWidth: 500 }}>
            Everything you need to know about how VoxelPort works, what data it handles, and what rights you have.
          </p>

          {/* Jump links */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '2rem' }}>
            {[['MIT License', GREEN], ['Privacy Notice', MAGENTA], ['Terms of Use', YELLOW], ['Trademarks', VIOLET]].map(([l, c]) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/ /g, '-')}`}
                style={{
                  fontFamily: MONO, fontSize: '0.68rem', color: '#9a9a9a',
                  padding: '0.4rem 1rem', border: `1px solid ${c}40`, borderRadius: 100,
                  textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = c; e.currentTarget.style.borderColor = c; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#9a9a9a'; e.currentTarget.style.borderColor = `${c}40`; }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>

        {/* ── MIT LICENSE ──────────────────────────────────────────────────── */}
        <LegalSection id="mit-license" title="MIT License" label="01">
          <p>Copyright © 2026 trazhub (Garv Verma). All rights reserved.</p>
          <p>
            Permission is hereby granted, free of charge, to any person obtaining a copy
            of this software and associated documentation files (the "Software"), to deal
            in the Software without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:
          </p>
          <p>
            The above copyright notice and this permission notice shall be included in all
            copies or substantial portions of the Software.
          </p>
          <p style={{ color: '#6a6a6a', fontSize: '0.9rem', lineHeight: 1.8 }}>
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
          </p>
          <Callout color={GREEN}>
            The full license text is available in the{' '}
            <a href="https://github.com/VOXELPORT/VoxelPortPlugin/blob/main/LICENSE" target="_blank" rel="noreferrer" style={{ color: GREEN }}>
              LICENSE file on GitHub
            </a>. VoxelPort is free and open-source — you are encouraged to study, fork, and improve it.
          </Callout>
        </LegalSection>

        {/* ── PRIVACY NOTICE ───────────────────────────────────────────────── */}
        <LegalSection id="privacy-notice" title="Privacy Notice" label="02">
          <p>
            VoxelPort is a desktop app and Fabric mod. This notice explains exactly what data it
            handles, where it goes, and what your rights are. We believe in radical transparency —
            everything VoxelPort does with data is described below with no ambiguity.
          </p>

          <SubHeading color={MAGENTA}>What is stored on your machine</SubHeading>
          <p>
            The desktop app stores its device token in the app's user-data folder.
            The Fabric mod stores settings under <Code>config/voxelport/settings.properties</Code>.
            Nothing is stored on your players' machines.
          </p>
          <Table rows={[
            ['File', 'Contents', 'Purpose', 'Retention'],
            ['VoxelPort config / token', 'An auto-generated device token (vp_…) and the relay address', 'Authenticates your host with the relay and tells it where to forward player connections', 'Stays until you delete it. No account or Discord is involved.'],
          ]} />

          <SubHeading color={MAGENTA}>What is sent to the VoxelPort relay</SubHeading>
          <p>
            VoxelPort connects to <Code>wss://relay.voxelport.in/ws</Code> (the relay) and sends data only
            at these moments:
          </p>
          <Table rows={[
            ['Event', 'Data sent', 'Why'],
            ['Host startup', 'Your device token', 'Registers your host with the relay, which assigns a public port (e.g. play.voxelport.in:25312)'],
            ['A player connects', 'Game traffic only — proxied Minecraft packets', 'The relay bridges the player\'s connection to your server. The relay sees connection IP addresses as a natural consequence of the TCP/WebSocket link, but does not inspect or store packet contents.'],
            ['Heartbeat', 'A periodic ping', 'Keeps the relay connection alive and lets VoxelPort detect drops'],
          ]} />

          <SubHeading color={MAGENTA}>What is NOT collected</SubHeading>
          <List items={[
            'Passwords of any kind',
            'Email addresses',
            'Device fingerprints or any identifier beyond your server token',
            'Minecraft chat messages',
            'Minecraft inventory, world data, or game state (only raw TCP packets are proxied — the relay does not inspect them)',
            'Location data',
            'Crash reports or telemetry',
            'Any analytics or usage tracking',
          ]} />

          <SubHeading color={MAGENTA}>Relay server location — India only (transparency notice)</SubHeading>
          <p>
            Currently, VoxelPort operates a <strong style={{ color: '#fff' }}>single relay server located in India</strong>.
            This is an honest limitation of the project — running servers in multiple regions costs money,
            and VoxelPort is a free, self-funded project by a solo developer.
          </p>
          <p>What this means for you in practice:</p>
          <List items={[
            'Players in or near India (South Asia, Southeast Asia, Middle East) will get the best latency — typically under 50ms.',
            'Players in Europe or North America may see higher relay latency (100–250ms typical). The game itself is still fully playable but you may notice slightly delayed block updates compared to a local network.',
            'The relay adds latency on top of your normal Minecraft connection. If you and your friends are all on fast connections in distant regions, the India relay will be the bottleneck.',
            'Australia and South America are the most affected regions — relay overhead may be noticeable.',
          ]} />
          <Callout color={MAGENTA}>
            <strong>Future plans:</strong> If VoxelPort grows and receives enough community support (GitHub stars,
            donations via{' '}
            <a href="https://github.com/sponsors/trazhub" target="_blank" rel="noreferrer" style={{ color: MAGENTA }}>GitHub Sponsors</a>),
            the plan is to expand to relay nodes in Europe (Germany/France) and North America (US East)
            so all players get under 80ms relay overhead. This is entirely dependent on the project
            gaining enough traction to justify the infrastructure cost. Right now, one server is what
            we can afford.
          </Callout>

          <SubHeading color={MAGENTA}>IP addresses and the relay</SubHeading>
          <p>
            When you connect to the relay server (either as a host or a joiner), your IP address
            is visible to the relay server as a standard part of the TCP/WebSocket handshake.
            This is unavoidable for any internet-connected service. The relay does not log,
            store, or share IP addresses. Connections are short-lived and closed when the session ends.
          </p>

          <SubHeading color={MAGENTA}>Data sharing</SubHeading>
          <p>
            VoxelPort does not sell, rent, or share your data with any third party, advertiser,
            or analytics service. The only external contact is the VoxelPort bot server and relay
            described above, both operated by trazhub.
          </p>

          <SubHeading color={MAGENTA}>How to delete your data</SubHeading>
          <p>
            Uninstall the desktop app (and delete its user-data folder), or remove the{' '}
            <Code>config/voxelport/</Code> folder from your Minecraft install. Deleting the
            device token immediately stops it from working; a new one is generated the next
            time you host.
          </p>

          <SubHeading color={MAGENTA}>No account required</SubHeading>
          <p>
            VoxelPort does not require an account, a login, or Discord membership. A private
            device token (<Code>vp_…</Code>) is generated automatically on first run and used
            only to authenticate your tunnel with the relay. Keep it private — it is the only
            credential for your relay slot.
          </p>

          <SubHeading color={MAGENTA}>Questions</SubHeading>
          <p>If you have any questions about data handling, email trazhub at <Code>garv@trazz.art</Code>.</p>
          <p style={{ color: '#6a6a6a', fontSize: '0.85rem' }}>Last updated: May 2026</p>
        </LegalSection>

        {/* ── TERMS OF USE ─────────────────────────────────────────────────── */}
        <LegalSection id="terms-of-use" title="Terms of Use" label="03">
          <p>
            By installing or using the VoxelPort plugin or Fabric server mod, you agree to these terms.
            If you do not agree, do not install or use VoxelPort.
          </p>

          <SubHeading color={YELLOW}>1. What VoxelPort is</SubHeading>
          <p>
            VoxelPort is a free, open-source desktop app and Fabric mod for Minecraft: Java Edition
            that lets you connect a self-hosted server to players over the internet through a relay network,
            without port forwarding. Players join with vanilla Minecraft. VoxelPort is not a server
            hosting service and is not affiliated with Mojang, Microsoft, or any other company.
          </p>

          <SubHeading color={YELLOW}>2. Eligibility</SubHeading>
          <List items={[
            'You must run legitimate Minecraft: Java Edition server software.',
            'You must comply with the Minecraft End User License Agreement (EULA) when running a server.',
            'You must not be under any age restriction that prevents you from agreeing to these terms in your jurisdiction.',
          ]} />

          <SubHeading color={YELLOW}>3. Acceptable use</SubHeading>
          <p>You agree not to use VoxelPort to:</p>
          <List items={[
            'Host or distribute pirated Minecraft content.',
            'Abuse the relay network — including deliberately flooding it, opening automated connections, or using it for any purpose other than Minecraft multiplayer.',
            'Attempt to impersonate another user or use a token that is not yours.',
            'Share your server token publicly or with others to bypass the token system.',
            'Use the relay to transmit malicious, illegal, or harmful content.',
            'Reverse-engineer the relay protocol or admin endpoints for malicious purposes.',
          ]} />

          <SubHeading color={YELLOW}>4. Availability</SubHeading>
          <p>
            VoxelPort is provided on a best-effort basis. The relay server and bot may go offline
            for maintenance, upgrades, or unexpected reasons. We do not guarantee uptime, session
            stability, or connection quality. Sessions may be terminated at any time without notice.
          </p>

          <SubHeading color={YELLOW}>5. No warranty</SubHeading>
          <p>
            VoxelPort is provided "as is" without warranty of any kind. You use it entirely at
            your own risk. We are not responsible for any loss of world data, game progress,
            corrupted saves, or connection issues that arise from using the plugin or relay.
            Always back up your worlds independently.
          </p>

          <SubHeading color={YELLOW}>6. Suspension</SubHeading>
          <p>
            If you violate these terms, your device token may be blocked from the relay so it can
            no longer register. No refund applies since the service is free.
          </p>

          <SubHeading color={YELLOW}>7. Modifications to terms</SubHeading>
          <p>
            These terms may be updated at any time. Continued use of the app or mod after changes are
            published constitutes acceptance of the updated terms.
          </p>

          <SubHeading color={YELLOW}>8. Open source</SubHeading>
          <p>
            VoxelPort is MIT-licensed. You are free to fork, modify, and redistribute it
            under the terms of the MIT License. Modified versions must not impersonate the
            official VoxelPort app or mod or connect to the official relay without permission.
          </p>

          <Callout color={YELLOW}>
            Questions about these terms? Email <Code>garv@trazz.art</Code>.
          </Callout>
          <p style={{ color: '#6a6a6a', fontSize: '0.85rem' }}>Last updated: May 2026</p>
        </LegalSection>

        {/* ── TRADEMARKS ───────────────────────────────────────────────────── */}
        <LegalSection id="trademarks" title="Copyrights & Trademarks" label="04">
          <p>
            VoxelPort is an independent, unofficial, open-source project. It is not affiliated
            with, endorsed by, sponsored by, or in any way officially connected to any of the
            trademark holders listed below. All trademarks are the property of their respective owners.
          </p>

          <SubHeading color={VIOLET}>Third-party trademarks referenced by VoxelPort</SubHeading>
          <Table rows={[
            ['Name', 'Owner', 'How VoxelPort uses it'],
            ['Minecraft', 'Mojang AB / Microsoft Corporation', 'VoxelPort is software for Minecraft: Java Edition servers. "Minecraft" is used solely to describe compatibility and purpose.'],
            ['Fabric', 'The Fabric Project', 'VoxelPort provides a mod for Fabric. "Fabric" describes the mod loader it runs on.'],
            ['CurseForge', 'Overwolf', 'VoxelPort is distributed on CurseForge. The name describes where the mod can be downloaded.'],
            ['Java', 'Oracle Corporation', '"Java" refers to the Java programming language and runtime used to run Minecraft servers and VoxelPort.'],
            ['GitHub', 'Microsoft Corporation', 'VoxelPort\'s source code is hosted on GitHub. "GitHub" is used to refer to the code repository.'],
          ]} />

          <SubHeading color={VIOLET}>VoxelPort's own intellectual property</SubHeading>
          <p>
            The name "VoxelPort", the VoxelPort logo, and the relay infrastructure are the
            intellectual property of trazhub (Garv Verma). The plugin source code is released
            under the MIT License (see above). The VoxelPort name and branding may not be used
            to represent unofficial forks or derivative projects without permission.
          </p>

          <SubHeading color={VIOLET}>Minecraft EULA compliance</SubHeading>
          <p>
            VoxelPort does not distribute any Minecraft game files, assets, or binaries.
            Users of VoxelPort must own a legitimate copy of Minecraft: Java Edition and agree
            to the{' '}
            <a href="https://www.minecraft.net/en-us/eula" target="_blank" rel="noreferrer" style={{ color: VIOLET }}>
              Minecraft End User License Agreement
            </a>
            {' '}when running any Minecraft server software.
          </p>

          <SubHeading color={VIOLET}>Reporting a trademark concern</SubHeading>
          <p>
            If you believe VoxelPort is misusing a trademark you own, please contact trazhub
            at <Code>garv@trazz.art</Code> and the issue will be addressed promptly.
          </p>
          <p style={{ color: '#6a6a6a', fontSize: '0.85rem' }}>Last updated: May 2026</p>
        </LegalSection>

      </div>

      {/* Footer strip */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ fontFamily: MONO, fontSize: '0.62rem', color: '#6a6a6a', letterSpacing: '0.06em' }}>
          © 2026 VOXELPORT · BUILT BY TRAZHUB · MIT LICENSE
        </span>
        <button
          onClick={onBack}
          style={{
            fontFamily: MONO, fontSize: '0.68rem', background: 'none',
            border: '1px solid var(--border-bright)', color: '#9a9a9a', padding: '0.4rem 1rem', borderRadius: 8,
            cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase',
          }}
        >
          ← BACK TO SITE
        </button>
      </div>
    </div>
  );
}

// ── Shared sub-components ──────────────────────────────────────────────────────

function LegalSection({ id, title, label, children }) {
  const color = SECTION_COLORS[label] || GREEN;
  return (
    <section id={id} style={{ marginBottom: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border)', scrollMarginTop: '80px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.2rem', marginBottom: '2rem' }}>
        <span style={{ fontFamily: MONO, fontSize: '1rem', color, letterSpacing: '0.1em' }}>{label}</span>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 0.95, letterSpacing: '0.02em', color: '#fff' }}>{title}</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {children}
      </div>
    </section>
  );
}

function SubHeading({ children, color = GREEN }) {
  return (
    <h3 style={{ fontFamily: MONO, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', color: '#fff', marginTop: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {children}
    </h3>
  );
}

function Code({ children }) {
  return (
    <code style={{ fontFamily: MONO, fontSize: '0.82em', background: 'rgba(0,255,178,0.07)', color: GREEN, padding: '0.15em 0.45em', borderRadius: 4, border: '1px solid rgba(0,255,178,0.15)' }}>{children}</code>
  );
}

function Callout({ children, color = GREEN }) {
  return (
    <div style={{ background: `${color}0d`, borderLeft: `2px solid ${color}`, borderRadius: '0 8px 8px 0', padding: '1rem 1.4rem', fontSize: '0.92rem', color: '#9a9a9a', lineHeight: 1.75, fontWeight: 300 }}>{children}</div>
  );
}

function List({ items }) {
  return (
    <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: '0.95rem', color: '#9a9a9a', lineHeight: 1.7, fontWeight: 300 }}>{item}</li>
      ))}
    </ul>
  );
}

function Table({ rows }) {
  const [header, ...body] = rows;
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 10 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
        <thead>
          <tr>
            {header.map((h, i) => (
              <th key={i} style={{ background: 'rgba(255,255,255,.02)', padding: '0.75rem 1rem', textAlign: 'left', fontFamily: MONO, fontSize: '0.62rem', color: '#6a6a6a', letterSpacing: '0.1em', borderBottom: '1px solid var(--border)', fontWeight: 400 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} style={{ borderBottom: ri === body.length - 1 ? 'none' : '1px solid var(--border)' }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ padding: '0.85rem 1rem', color: ci === 0 ? '#fff' : '#9a9a9a', fontFamily: ci === 0 ? MONO : "'Space Grotesk', sans-serif", fontSize: ci === 0 ? '0.76rem' : '0.88rem', lineHeight: 1.65, fontWeight: 300, verticalAlign: 'top' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
