import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const src = path.join(import.meta.dirname, '..', 'src');
const files = fs.readdirSync(src).filter((f) => /\.(js|jsx)$/.test(f));
const read = (f) => fs.readFileSync(path.join(src, f), 'utf8');

test('no page still tells hosts that no account or signup is needed', () => {
  const old = [/No account needed/i, /no accounts and no paid plan/i, /No account, no card/i, /NO SIGNUP'/, /Free · no signup/, /No account or login/i, /needs no account/i, /with no account and/i, /No account\. No hoops/i, /No signup', Y/];
  for (const f of files) for (const pattern of old) assert.ok(!pattern.test(read(f)), `${f} still says ${pattern}`);
});

test('the privacy notice explains the Discord sign-in and what is kept', () => {
  const legal = read('LegalPage.jsx');
  for (const phrase of ['Discord sign-in', 'permanent Discord ID', 'does not receive or keep your email address', 'Players who', 'Discord session']) assert.ok(legal.includes(phrase), phrase);
});

test('the main pages say Discord membership is part of hosting', () => {
  assert.match(read('content.js'), /join our Discord/i);
  assert.match(read('seo.js'), /hosts join our Discord server/i);
});

test('the legal page describes Discord membership, supporter ranks and tip data, and no longer says there are no accounts or refunds', () => {
  const legal = read('LegalPage.jsx');
  for (const gone of ['Passwords, emails or accounts of any kind', 'The service is free, so no refunds apply']) assert.ok(!legal.includes(gone), gone);
  for (const phrase of ['Discord membership', 'Supporter ranks', 'UPI transaction ID', 'deleted 60 days', 'Cloudflare', 'voice chat', 'players, connections and bytes per minute']) assert.ok(legal.includes(phrase), phrase);
});
