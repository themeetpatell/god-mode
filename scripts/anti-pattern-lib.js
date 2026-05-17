#!/usr/bin/env node
/**
 * themeetpatel · anti-pattern-lib.js
 *
 * Anti-pattern library that grows from failed verifier verdicts.
 * Each `fail` becomes a permanent eval case + a verifier rule.
 *
 * Stores at ~/.themeetpatel/anti-patterns.jsonl
 *
 * Usage:
 *   anti-pattern-lib record --class <code|content|...> --bad "<excerpt>" --reason "<why bad>"
 *   anti-pattern-lib list [--class <class>]
 *   anti-pattern-lib check --class <class> --file <path>       # runs every anti-pattern in the class against the file
 *   anti-pattern-lib promote-to-router-eval <id>               # convert to routing eval case (if applicable)
 *
 * Schema:
 *   { id, ts, class, bad_excerpt, reason, source_session?, evidence_url? }
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const HOME = process.env.THEMEETPATEL_HOME || path.join(os.homedir(), '.themeetpatel');
const FILE = path.join(HOME, 'anti-patterns.jsonl');

function ensure() { if (!fs.existsSync(HOME)) fs.mkdirSync(HOME, { recursive: true }); }
function rows() {
  ensure();
  if (!fs.existsSync(FILE)) return [];
  return fs.readFileSync(FILE, 'utf8').split('\n').filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}

const sub = process.argv[2];
const argv = {};
for (let i = 3; i < process.argv.length; i += 2) argv[process.argv[i]] = process.argv[i + 1];

if (sub === 'record') {
  const row = {
    id: 'ap-' + crypto.randomBytes(3).toString('hex'),
    ts: new Date().toISOString(),
    class: argv['--class'],
    bad_excerpt: argv['--bad'],
    reason: argv['--reason'],
    source_session: argv['--session']
  };
  ensure();
  fs.appendFileSync(FILE, JSON.stringify(row) + '\n');
  console.log(`Recorded ${row.id}: ${row.reason}`);
}
else if (sub === 'list') {
  const cls = argv['--class'];
  for (const r of rows()) {
    if (cls && r.class !== cls) continue;
    console.log(`${r.id}  [${r.class}]  ${r.reason}`);
    console.log(`     bad: ${(r.bad_excerpt || '').slice(0, 80)}`);
  }
}
else if (sub === 'check') {
  const cls = argv['--class'];
  const filePath = argv['--file'];
  if (!cls || !filePath) { console.error('Need --class and --file'); process.exit(1); }
  const text = fs.readFileSync(filePath, 'utf8');
  const found = [];
  for (const r of rows()) {
    if (r.class !== cls) continue;
    if (text.toLowerCase().includes((r.bad_excerpt || '').toLowerCase())) {
      found.push(r);
    }
  }
  if (found.length === 0) {
    console.log(JSON.stringify({ ok: true, file: filePath, class: cls, hits: 0 }, null, 2));
  } else {
    console.log(JSON.stringify({ ok: false, file: filePath, class: cls, hits: found.length, anti_patterns: found.map((f) => ({ id: f.id, reason: f.reason })) }, null, 2));
    process.exit(1);
  }
}
else if (sub === 'promote-to-router-eval') {
  console.log('Stub: in v1.5 this auto-appends a routing-eval.jsonl case derived from the anti-pattern.');
}
else {
  console.log(`Usage:
  anti-pattern-lib record --class <c> --bad "<excerpt>" --reason "<why>"
  anti-pattern-lib list [--class <c>]
  anti-pattern-lib check --class <c> --file <path>
  anti-pattern-lib promote-to-router-eval <id>`);
}
