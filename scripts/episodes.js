#!/usr/bin/env node
/**
 * themeetpatel · episodes.js
 *
 * Episodic memory CLI. Stores per-session traces under ~/.themeetpatel/episodes/.
 *
 * Naive embedding: hash-based keyword bag → 128-dim vector. Replaceable with a
 * real provider in v1.5 by editing the `embed()` function.
 *
 * Usage:
 *   episodes write --session <id> --goal "<>" [--tags "a,b"] [--artifacts "p1,p2"]
 *   episodes search "<query>" [--top 5] [--tag <t>]
 *   episodes show <ep-id>
 *   episodes timeline [--tag <t>] [--since <date>]
 *   episodes clear --since <date>
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const HOME = process.env.THEMEETPATEL_HOME || path.join(os.homedir(), '.themeetpatel');
const DIR = path.join(HOME, 'episodes');

function ensure() { if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true }); }
function load() {
  ensure();
  return fs.readdirSync(DIR).filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')));
}

/** Naive deterministic 128-dim "embedding" — hash word bag. */
function embed(text) {
  const dims = 128;
  const v = new Array(dims).fill(0);
  const words = text.toLowerCase().match(/[a-z0-9]+/g) || [];
  for (const w of words) {
    const h = crypto.createHash('sha256').update(w).digest();
    for (let i = 0; i < dims; i++) {
      v[i] += ((h[i % h.length] / 255) - 0.5);
    }
  }
  // L2 normalize
  const norm = Math.sqrt(v.reduce((a, x) => a + x * x, 0)) || 1;
  return v.map((x) => x / norm);
}

function cosine(a, b) {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot;
}

const sub = process.argv[2];
const argv = {};
for (let i = 3; i < process.argv.length; i += 2) argv[process.argv[i]] = process.argv[i + 1];

function write() {
  ensure();
  const id = 'ep-' + crypto.randomBytes(4).toString('hex');
  const goal = argv['--goal'] || '';
  const ep = {
    id,
    session_id: argv['--session'] || 'unknown',
    ts_start: argv['--start'] || new Date().toISOString(),
    ts_end: new Date().toISOString(),
    goal,
    phases: argv['--phases'] ? JSON.parse(argv['--phases']) : [],
    decisions_made: argv['--decisions'] ? JSON.parse(argv['--decisions']) : [],
    artifacts: argv['--artifacts'] ? argv['--artifacts'].split(',') : [],
    verifier_verdicts: argv['--verdicts'] ? JSON.parse(argv['--verdicts']) : {},
    cost_estimate_usd: argv['--cost'] ? Number(argv['--cost']) : null,
    tags: argv['--tags'] ? argv['--tags'].split(',').map((s) => s.trim()) : [],
    embedding_v1: embed(goal + ' ' + (argv['--tags'] || ''))
  };
  fs.writeFileSync(path.join(DIR, `${id}.json`), JSON.stringify(ep, null, 2));
  console.log(`Wrote ${id}`);
}

function search() {
  const q = process.argv[3];
  if (!q) { console.error('Need a query'); process.exit(1); }
  const top = Number(argv['--top']) || 5;
  const tag = argv['--tag'];
  const qv = embed(q);
  const eps = load().filter((e) => !tag || (e.tags || []).includes(tag));
  const scored = eps.map((e) => ({ ep: e, score: cosine(qv, e.embedding_v1 || embed(e.goal)) }))
    .sort((a, b) => b.score - a.score).slice(0, top);
  for (const { ep, score } of scored) {
    console.log(`${score.toFixed(3)}  ${ep.id}  ${ep.ts_end}  ${ep.goal}`);
    if (ep.tags?.length) console.log(`        tags: ${ep.tags.join(', ')}`);
  }
}

function show() {
  const id = process.argv[3];
  const p = path.join(DIR, `${id}.json`);
  if (!fs.existsSync(p)) { console.error(`No ${id}`); process.exit(1); }
  const ep = JSON.parse(fs.readFileSync(p, 'utf8'));
  const display = { ...ep };
  delete display.embedding_v1; // too noisy
  console.log(JSON.stringify(display, null, 2));
}

function timeline() {
  const tag = argv['--tag'];
  const since = argv['--since'] ? new Date(argv['--since']).getTime() : 0;
  const eps = load().filter((e) => (!tag || (e.tags || []).includes(tag)) && new Date(e.ts_end).getTime() >= since)
    .sort((a, b) => b.ts_end.localeCompare(a.ts_end));
  for (const e of eps) console.log(`${e.ts_end}  ${e.id}  ${e.goal.slice(0, 80)}`);
}

function clear() {
  const since = argv['--since'];
  if (!since) { console.error('clear requires --since <date>'); process.exit(1); }
  const cutoff = new Date(since).getTime();
  let removed = 0;
  for (const e of load()) {
    if (new Date(e.ts_end).getTime() >= cutoff) {
      fs.unlinkSync(path.join(DIR, `${e.id}.json`));
      removed += 1;
    }
  }
  console.log(`Removed ${removed} episodes since ${since}`);
}

if (sub === 'write') write();
else if (sub === 'search') search();
else if (sub === 'show') show();
else if (sub === 'timeline') timeline();
else if (sub === 'clear') clear();
else {
  console.log(`Usage:
  episodes write --session <id> --goal "..." [--tags "a,b"]
  episodes search "<query>" [--top 5] [--tag <t>]
  episodes show <ep-id>
  episodes timeline [--tag <t>] [--since 2026-01-01]
  episodes clear --since <date>`);
}
