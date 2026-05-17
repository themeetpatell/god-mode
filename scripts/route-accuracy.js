#!/usr/bin/env node
/**
 * themeetpatel · route-accuracy.js
 *
 * Reads evals/routing-eval.jsonl and runs each task through the router.
 * Prints a per-class accuracy breakdown so you can see *where* the router is wrong.
 *
 * Different from mcp-server/src/eval-routing.ts which only prints overall %.
 * This one stratifies by expected class so you can spot weak buckets.
 *
 * Use: `node scripts/route-accuracy.js`
 */

const fs = require('fs');
const path = require('path');

// Reuse the router via the built mcp-server output; if missing, fall back to JS port.
let routeTask;
try {
  // built file from the MCP server
  ({ routeTask } = require(path.join(__dirname, '..', 'mcp-server', 'dist', 'router.js')));
} catch {
  console.error('mcp-server/dist/router.js not found. Run `cd mcp-server && npm run build` first.');
  process.exit(1);
}

const evalPath = path.join(__dirname, '..', 'evals', 'routing-eval.jsonl');
if (!fs.existsSync(evalPath)) {
  console.error(`No eval file at ${evalPath}`);
  process.exit(1);
}

const rows = fs.readFileSync(evalPath, 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const buckets = { 'haiku-4.5': { n: 0, hit: 0, miss: [] }, 'sonnet-4.6': { n: 0, hit: 0, miss: [] }, 'opus-4.7': { n: 0, hit: 0, miss: [] } };
let totalHit = 0;
const adversarialFails = [];

for (const row of rows) {
  const expected = row.expected;
  const actual = routeTask({ task: row.task }).model;
  const b = buckets[expected] || (buckets[expected] = { n: 0, hit: 0, miss: [] });
  b.n += 1;
  if (actual === expected) {
    b.hit += 1;
    totalHit += 1;
  } else {
    b.miss.push({ task: row.task, expected, actual, reason: row.reason || '', adversarial: !!row.adversarial });
    if (row.adversarial) adversarialFails.push({ task: row.task, expected, actual });
  }
}

console.log('=== ROUTER STRATIFIED ACCURACY ===\n');
for (const [cls, b] of Object.entries(buckets)) {
  if (b.n === 0) continue;
  const pct = ((b.hit / b.n) * 100).toFixed(1);
  console.log(`${cls.padEnd(12)} ${b.hit}/${b.n}  (${pct}%)`);
}
console.log(`\nOVERALL: ${totalHit}/${rows.length}  (${((totalHit / rows.length) * 100).toFixed(1)}%)`);

if (adversarialFails.length > 0) {
  console.log(`\n=== ADVERSARIAL FAILURES (${adversarialFails.length}) ===`);
  for (const f of adversarialFails) {
    console.log(`  ✗ "${f.task}"\n      expected ${f.expected}, got ${f.actual}`);
  }
}

const allMisses = Object.values(buckets).flatMap((b) => b.miss).filter((m) => !m.adversarial);
if (allMisses.length > 0) {
  console.log(`\n=== NON-ADVERSARIAL MISSES (${allMisses.length}) ===`);
  for (const m of allMisses) {
    console.log(`  ✗ "${m.task}"\n      expected ${m.expected}, got ${m.actual}  [${m.reason}]`);
  }
}

// Gate: 80% overall + 60% adversarial
const overallPct = totalHit / rows.length;
const advTotal = rows.filter((r) => r.adversarial).length;
const advHit = advTotal - adversarialFails.length;
const advPct = advTotal === 0 ? 1 : advHit / advTotal;

console.log(`\nGate: overall ≥ 80% AND adversarial ≥ 60%`);
console.log(`  overall: ${(overallPct * 100).toFixed(1)}%  ${overallPct >= 0.8 ? '✓' : '✗'}`);
console.log(`  adversarial: ${(advPct * 100).toFixed(1)}%  (${advHit}/${advTotal})  ${advPct >= 0.6 ? '✓' : '✗'}`);

process.exit((overallPct >= 0.8 && advPct >= 0.6) ? 0 : 1);
