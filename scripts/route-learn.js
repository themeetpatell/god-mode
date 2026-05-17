#!/usr/bin/env node
/**
 * themeetpatel · route-learn.js
 *
 * Reads ~/.themeetpatel/ledger.jsonl and produces:
 *   1) An accuracy report per pattern bucket (Haiku / Sonnet / Opus)
 *   2) A suggested weight-update file at ~/.themeetpatel/router-weights.json
 *
 * The router (mcp-server/src/router.ts) reads router-weights.json on boot
 * (when present) and uses it to break ties and adjust pattern strength.
 *
 * Ledger row schema (one JSON object per line in ledger.jsonl):
 * {
 *   ts: ISO-8601,
 *   session_id: string,
 *   task_id: string,
 *   task_text: string,
 *   routed_model: "haiku-4.5" | "sonnet-4.6" | "opus-4.7",
 *   actual_model: same | "downscaled" | "escalated",
 *   escalated_to: optional model,
 *   outcome: "shipped" | "rework" | "failed" | "skipped",
 *   verifier_verdict: "pass" | "conditional" | "fail" | "skipped",
 *   input_tokens: number,
 *   output_tokens: number,
 *   cost_usd: number,
 *   wall_ms: number,
 *   patterns_hit: string[]   // which router patterns matched
 * }
 *
 * Use: `node scripts/route-learn.js` (no args).
 * Set THEMEETPATEL_HOME to override ~/.themeetpatel.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = process.env.THEMEETPATEL_HOME || path.join(os.homedir(), '.themeetpatel');
const LEDGER = path.join(HOME, 'ledger.jsonl');
const WEIGHTS_OUT = path.join(HOME, 'router-weights.json');

if (!fs.existsSync(LEDGER)) {
  console.error(`No ledger found at ${LEDGER}. Run a few God Mode sessions first.`);
  process.exit(0);
}

const rows = fs.readFileSync(LEDGER, 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    try { return JSON.parse(line); } catch { return null; }
  })
  .filter(Boolean);

if (rows.length === 0) {
  console.error('Ledger is empty.');
  process.exit(0);
}

// 1. Per-model outcome accuracy
const byModel = {};
for (const r of rows) {
  const m = r.routed_model;
  byModel[m] = byModel[m] || { n: 0, pass: 0, conditional: 0, fail: 0, escalated: 0, downscaled: 0 };
  const b = byModel[m];
  b.n += 1;
  if (r.verifier_verdict === 'pass') b.pass += 1;
  if (r.verifier_verdict === 'conditional') b.conditional += 1;
  if (r.verifier_verdict === 'fail') b.fail += 1;
  if (r.actual_model === 'escalated') b.escalated += 1;
  if (r.actual_model === 'downscaled') b.downscaled += 1;
}

// 2. Per-pattern accuracy (every pattern that hit, did the route work?)
const byPattern = {};
for (const r of rows) {
  const patterns = r.patterns_hit || [];
  for (const p of patterns) {
    byPattern[p] = byPattern[p] || { hits: 0, passed: 0, failed: 0, escalated: 0 };
    const b = byPattern[p];
    b.hits += 1;
    if (r.verifier_verdict === 'pass') b.passed += 1;
    if (r.verifier_verdict === 'fail') b.failed += 1;
    if (r.actual_model === 'escalated') b.escalated += 1;
  }
}

// 3. Compute suggested weights — multiplier per pattern
// Default weight = 1.0. Decrease if pattern is unreliable. Increase if pattern is very reliable.
const weights = {};
for (const [p, b] of Object.entries(byPattern)) {
  if (b.hits < 5) continue; // not enough data
  const passRate = b.passed / b.hits;
  const escRate = b.escalated / b.hits;
  // simple heuristic: shrink weight when escalation or fail is common
  let w = 1.0;
  w *= (0.5 + passRate);          // 0.5..1.5 by pass rate
  w *= (1.0 - 0.5 * escRate);     // shrink up to 50% if escalated often
  weights[p] = Math.round(w * 100) / 100;
}

// 4. Print human report
console.log('\n=== ROUTING ACCURACY ===');
for (const [m, b] of Object.entries(byModel)) {
  const passRate = ((b.pass / b.n) * 100).toFixed(1);
  console.log(`${m.padEnd(12)}  n=${b.n}  pass=${passRate}%  cond=${b.conditional}  fail=${b.fail}  escalated=${b.escalated}  downscaled=${b.downscaled}`);
}

console.log('\n=== PATTERN HEALTH (≥5 hits) ===');
for (const [p, b] of Object.entries(byPattern).filter(([, b]) => b.hits >= 5)) {
  const passRate = ((b.passed / b.hits) * 100).toFixed(0);
  console.log(`  ${p.padEnd(28)} hits=${b.hits.toString().padEnd(4)} pass=${passRate}%  esc=${b.escalated}`);
}

// 5. Write weights file for the router
fs.mkdirSync(HOME, { recursive: true });
fs.writeFileSync(WEIGHTS_OUT, JSON.stringify({ generatedAt: new Date().toISOString(), sampleSize: rows.length, weights }, null, 2));

console.log(`\nWrote ${Object.keys(weights).length} weight overrides to ${WEIGHTS_OUT}`);
console.log('The router will pick these up on next boot.');
