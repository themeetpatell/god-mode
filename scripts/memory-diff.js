#!/usr/bin/env node
/**
 * themeetpatel · memory-diff.js
 *
 * Shows what changed in memory + beliefs since a given timestamp.
 * Run at session start to give the CEO a "what changed while I was away" digest.
 *
 * Usage:
 *   node scripts/memory-diff.js --since 2026-05-10
 *   node scripts/memory-diff.js --since-last-session
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = process.env.THEMEETPATEL_HOME || path.join(os.homedir(), '.themeetpatel');
const MEM_FILE = path.join(HOME, 'memory', 'default.json');
const BELIEFS_FILE = path.join(HOME, 'beliefs.jsonl');
const LAST_SEEN = path.join(HOME, 'memory-diff-cursor.json');

const args = process.argv.slice(2);
const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const flag = (n) => args.includes(n);

function getSince() {
  if (val('--since')) return new Date(val('--since')).getTime();
  if (flag('--since-last-session')) {
    if (fs.existsSync(LAST_SEEN)) {
      return new Date(JSON.parse(fs.readFileSync(LAST_SEEN, 'utf8')).ts).getTime();
    }
  }
  // default: last 7 days
  return Date.now() - 7 * 24 * 60 * 60 * 1000;
}

const since = getSince();
const sinceISO = new Date(since).toISOString();

const diff = { since: sinceISO, memory_changes: [], beliefs_added: [], beliefs_revised: [] };

if (fs.existsSync(MEM_FILE)) {
  const mem = JSON.parse(fs.readFileSync(MEM_FILE, 'utf8'));
  if (mem.updated_at && new Date(mem.updated_at).getTime() >= since) {
    diff.memory_changes.push({ file: 'default.json', updated_at: mem.updated_at });
  }
}

if (fs.existsSync(BELIEFS_FILE)) {
  const rows = fs.readFileSync(BELIEFS_FILE, 'utf8').split('\n').filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  for (const r of rows) {
    const t = new Date(r.ts).getTime();
    if (t < since) continue;
    if (r.supersedes) diff.beliefs_revised.push({ id: r.id, replaces: r.supersedes, statement: r.statement });
    else if (r.statement) diff.beliefs_added.push({ id: r.id, statement: r.statement });
  }
}

console.log(JSON.stringify(diff, null, 2));

// Update cursor
if (!fs.existsSync(HOME)) fs.mkdirSync(HOME, { recursive: true });
fs.writeFileSync(LAST_SEEN, JSON.stringify({ ts: new Date().toISOString() }, null, 2));
