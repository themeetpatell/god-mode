#!/usr/bin/env node
/**
 * themeetpatel · beliefs.js
 *
 * CLI for the belief register at ~/.themeetpatel/beliefs.jsonl
 *
 * Usage:
 *   node scripts/beliefs.js --active                                  list current beliefs
 *   node scripts/beliefs.js --all                                     full log incl superseded
 *   node scripts/beliefs.js --about "DB"                              search
 *   node scripts/beliefs.js --add "<statement>" [--scope <s>] [--confidence <0-1>] [--evidence "a,b,c"]
 *   node scripts/beliefs.js --revise <id> --new "<statement>" [--reason "..."]
 *   node scripts/beliefs.js --history <id>                            see the supersedes chain
 *   node scripts/beliefs.js --prune                                   remove unused > 90 days
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const HOME = process.env.THEMEETPATEL_HOME || path.join(os.homedir(), '.themeetpatel');
const FILE = path.join(HOME, 'beliefs.jsonl');

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };

function ensure() { if (!fs.existsSync(HOME)) fs.mkdirSync(HOME, { recursive: true }); }
function rows() {
  ensure();
  if (!fs.existsSync(FILE)) return [];
  return fs.readFileSync(FILE, 'utf8').split('\n').filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}
function append(row) { ensure(); fs.appendFileSync(FILE, JSON.stringify(row) + '\n'); }
function rewrite(allRows) { ensure(); fs.writeFileSync(FILE, allRows.map((r) => JSON.stringify(r)).join('\n') + '\n'); }

function activeBeliefs(all) {
  // A belief is active if no row supersedes it
  const supersededIds = new Set(all.filter((r) => r.supersedes).map((r) => r.supersedes));
  return all.filter((r) => !supersededIds.has(r.id) && !r.superseded_by);
}

function newId() {
  return 'b-' + crypto.randomBytes(3).toString('hex');
}

if (flag('--active')) {
  const a = activeBeliefs(rows());
  if (a.length === 0) console.log('No active beliefs. Use --add to write one.');
  for (const b of a) {
    console.log(`${b.id} [${b.scope || '-'}] conf=${b.confidence?.toFixed(2) || '-'}  ${b.statement}`);
    if (b.evidence?.length) console.log(`     evidence: ${b.evidence.join(', ')}`);
  }
  process.exit(0);
}

if (flag('--all')) {
  for (const b of rows()) console.log(JSON.stringify(b));
  process.exit(0);
}

if (val('--about')) {
  const q = val('--about').toLowerCase();
  for (const b of activeBeliefs(rows())) {
    if (b.statement.toLowerCase().includes(q)) console.log(`${b.id}  ${b.statement}`);
  }
  process.exit(0);
}

if (val('--add')) {
  const row = {
    id: newId(),
    ts: new Date().toISOString(),
    statement: val('--add'),
    scope: val('--scope') || 'project',
    confidence: val('--confidence') ? parseFloat(val('--confidence')) : 0.7,
    evidence: val('--evidence') ? val('--evidence').split(',').map((s) => s.trim()) : []
  };
  append(row);
  console.log(`Wrote ${row.id}: ${row.statement}`);
  process.exit(0);
}

if (val('--revise')) {
  const oldId = val('--revise');
  const newStatement = val('--new');
  if (!newStatement) { console.error('Need --new "<new statement>"'); process.exit(1); }
  const all = rows();
  const old = all.find((r) => r.id === oldId);
  if (!old) { console.error(`No belief ${oldId}`); process.exit(1); }
  const newRow = {
    id: newId(),
    ts: new Date().toISOString(),
    statement: newStatement,
    scope: old.scope,
    confidence: 0.7,
    evidence: val('--reason') ? [val('--reason')] : [],
    supersedes: oldId
  };
  append(newRow);
  // mark old as superseded by appending a meta row
  append({ id: oldId, ts: new Date().toISOString(), op: 'mark_superseded', superseded_by: newRow.id, superseded_at: new Date().toISOString() });
  console.log(`${oldId} → ${newRow.id}`);
  process.exit(0);
}

if (val('--history')) {
  const id = val('--history');
  const all = rows();
  const chain = [];
  let cur = all.find((r) => r.id === id);
  while (cur) {
    chain.push(cur);
    if (cur.supersedes) cur = all.find((r) => r.id === cur.supersedes);
    else break;
  }
  for (const b of chain.reverse()) {
    console.log(`${b.ts}  ${b.id}  ${b.statement || b.op}`);
  }
  process.exit(0);
}

if (flag('--prune')) {
  // Stub: in a real implementation, cross-reference with session logs to find unused beliefs > 90 days
  console.log('Prune is a stub in v1.4. In v1.5 it will cross-ref with session logs and prompt before removing.');
  process.exit(0);
}

console.log(`Usage:
  node scripts/beliefs.js --active
  node scripts/beliefs.js --add "<statement>" [--scope <user|project|domain>] [--confidence 0.0-1.0] [--evidence "a,b,c"]
  node scripts/beliefs.js --revise <id> --new "<new statement>" [--reason "..."]
  node scripts/beliefs.js --about "<keyword>"
  node scripts/beliefs.js --history <id>
  node scripts/beliefs.js --all
  node scripts/beliefs.js --prune`);
