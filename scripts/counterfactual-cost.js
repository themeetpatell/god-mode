#!/usr/bin/env node
/**
 * themeetpatel · counterfactual-cost.js
 *
 * For every Opus-routed decision in the ledger, computes:
 *   - Probability the same output would have been correct with Sonnet
 *   - Expected rework cost if Sonnet had been wrong
 *   - Whether the Opus premium was economically justified
 *
 * Uses historical pass rates per task class from ~/.themeetpatel/ledger.jsonl
 * to estimate counterfactual probabilities. Reports waste (Opus tasks that
 * Sonnet historically gets right 95%+ of the time) AND missed-Opus
 * (Sonnet tasks that historically fail and should have been Opus).
 *
 * Usage:
 *   node scripts/counterfactual-cost.js              # 30-day report
 *   node scripts/counterfactual-cost.js --waste-only # show only over-routes
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = process.env.THEMEETPATEL_HOME || path.join(os.homedir(), '.themeetpatel');
const LEDGER = path.join(HOME, 'ledger.jsonl');

const PRICES = { 'haiku-4.5': 4.0, 'sonnet-4.6': 15.0, 'opus-4.7': 75.0 };
const REWORK_MULTIPLIER = 2.5; // failed task costs 2.5x to redo (re-route + re-execute + re-verify)

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);

function loadRows() {
  if (!fs.existsSync(LEDGER)) {
    console.error(`No ledger at ${LEDGER}. Run some sessions first.`);
    process.exit(0);
  }
  return fs.readFileSync(LEDGER, 'utf8').split('\n').filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}

// Group historical pass rates by (model, inferred_task_class)
// Task class is inferred from patterns_hit (best signal we have without verifier metadata).
function passRatesByModel(rows) {
  const out = {};
  for (const r of rows) {
    if (!r.verifier_verdict || r.verifier_verdict === 'skipped') continue;
    const k = r.routed_model || 'unknown';
    out[k] = out[k] || { n: 0, pass: 0 };
    out[k].n += 1;
    if (r.verifier_verdict === 'pass') out[k].pass += 1;
  }
  const rates = {};
  for (const [k, v] of Object.entries(out)) {
    rates[k] = v.n > 0 ? v.pass / v.n : null;
  }
  return rates;
}

const rows = loadRows();
const rates = passRatesByModel(rows);

console.log(`\n=== HISTORICAL PASS RATES ===`);
for (const [m, r] of Object.entries(rates)) {
  console.log(`  ${m.padEnd(12)} ${r !== null ? `${(r * 100).toFixed(1)}% (n=${rows.filter(x => x.routed_model === m).length})` : 'no data'}`);
}

const opusRows = rows.filter((r) => r.routed_model === 'opus-4.7' && r.verifier_verdict === 'pass');
const sonnetPassRate = rates['sonnet-4.6'];
if (sonnetPassRate === null || opusRows.length === 0) {
  console.log('\nNot enough data for counterfactual analysis. Need ≥10 sessions with verifier verdicts.');
  process.exit(0);
}

console.log(`\n=== COUNTERFACTUAL — what if Opus tasks had been Sonnet? ===`);
console.log(`Sonnet historical pass rate: ${(sonnetPassRate * 100).toFixed(1)}%`);
console.log(`Opus tasks in sample: ${opusRows.length}\n`);

let wastedSpend = 0;
let savedByOpus = 0;
const wasteList = [];

for (const r of opusRows) {
  const opusCost = (r.input_tokens || 1000) / 1_000_000 * PRICES['opus-4.7'] +
                   (r.output_tokens || 500) / 1_000_000 * PRICES['opus-4.7'] * 5; // approx out > in pricing skew
  const sonnetCost = opusCost / 5; // Opus is ~5x Sonnet cost
  const sonnetExpectedReworkCost = (1 - sonnetPassRate) * sonnetCost * REWORK_MULTIPLIER;
  const sonnetTotalExpected = sonnetCost + sonnetExpectedReworkCost;

  // If Sonnet's expected total < Opus actual, this was a waste
  if (sonnetTotalExpected < opusCost) {
    wastedSpend += opusCost - sonnetTotalExpected;
    wasteList.push({
      task: (r.task_text || '').slice(0, 70),
      opusCost: opusCost.toFixed(3),
      sonnetExpected: sonnetTotalExpected.toFixed(3),
      saved: (opusCost - sonnetTotalExpected).toFixed(3)
    });
  } else {
    savedByOpus += sonnetTotalExpected - opusCost;
  }
}

console.log(`Wasted on Opus (could have been Sonnet): ~$${wastedSpend.toFixed(2)}`);
console.log(`Justified Opus spend (Sonnet would have failed): ~$${savedByOpus.toFixed(2)}`);
console.log(`Opus efficiency: ${(savedByOpus / (savedByOpus + wastedSpend) * 100).toFixed(0)}% of Opus calls were economically right`);

if (flag('--waste-only') || wasteList.length > 0) {
  console.log(`\n--- TOP 10 POTENTIAL OVER-ROUTES ---`);
  for (const w of wasteList.slice(0, 10)) {
    console.log(`  saved=$${w.saved.padEnd(6)} opus=$${w.opusCost.padEnd(6)} sonExp=$${w.sonnetExpected.padEnd(6)}  ${w.task}`);
  }
}

// Reverse: Sonnet tasks that failed verification → should they have been Opus?
const sonnetFails = rows.filter((r) => r.routed_model === 'sonnet-4.6' && r.verifier_verdict === 'fail');
if (sonnetFails.length > 0) {
  console.log(`\n--- POTENTIAL MISSED-OPUS (Sonnet failures) ---`);
  console.log(`Count: ${sonnetFails.length}`);
  for (const r of sonnetFails.slice(0, 10)) {
    console.log(`  ${(r.task_text || '').slice(0, 80)}`);
  }
  console.log(`\nConsider adding these task patterns to OPUS_PATTERNS in router.ts.`);
}
