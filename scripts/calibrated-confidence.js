#!/usr/bin/env node
/**
 * themeetpatel · calibrated-confidence.js
 *
 * Wraps the router's confidence output with historical pass-rate calibration.
 * Replaces "high/medium/low" with actual probability based on what *did* happen
 * historically for similar task signatures.
 *
 * Reads:
 *   ~/.themeetpatel/ledger.jsonl  (history)
 *
 * Writes:
 *   ~/.themeetpatel/confidence-calibration.json   (per-bucket calibration curves)
 *
 * Bucket key = `${routed_model}|${primary_pattern_hit}` (or just routed_model if no patterns).
 *
 * Usage:
 *   node scripts/calibrated-confidence.js                    # build calibration
 *   node scripts/calibrated-confidence.js --query <model>    # estimate for a model
 *   node scripts/calibrated-confidence.js --query "sonnet-4.6|refactor"
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = process.env.THEMEETPATEL_HOME || path.join(os.homedir(), '.themeetpatel');
const LEDGER = path.join(HOME, 'ledger.jsonl');
const OUT = path.join(HOME, 'confidence-calibration.json');

const args = process.argv.slice(2);
const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };

function loadRows() {
  if (!fs.existsSync(LEDGER)) return [];
  return fs.readFileSync(LEDGER, 'utf8').split('\n').filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}

function build() {
  const rows = loadRows();
  if (rows.length === 0) {
    console.log('Ledger empty. Run some sessions first.');
    return {};
  }

  const buckets = {};
  for (const r of rows) {
    if (!r.verifier_verdict || r.verifier_verdict === 'skipped') continue;
    const primaryPattern = (r.patterns_hit && r.patterns_hit[0]) || 'no-pattern';
    const key = `${r.routed_model || 'unknown'}|${primaryPattern}`;
    buckets[key] = buckets[key] || { n: 0, pass: 0, conditional: 0, fail: 0 };
    buckets[key].n += 1;
    if (r.verifier_verdict === 'pass') buckets[key].pass += 1;
    if (r.verifier_verdict === 'conditional') buckets[key].conditional += 1;
    if (r.verifier_verdict === 'fail') buckets[key].fail += 1;
  }

  const calibration = {};
  for (const [key, b] of Object.entries(buckets)) {
    if (b.n < 3) continue; // not enough data
    const passRate = b.pass / b.n;
    // Confidence interval (Wilson 95%) for bucket
    const z = 1.96;
    const p = passRate;
    const n = b.n;
    const denom = 1 + z * z / n;
    const centre = (p + z * z / (2 * n)) / denom;
    const margin = z * Math.sqrt((p * (1 - p) + z * z / (4 * n)) / n) / denom;
    calibration[key] = {
      n: b.n,
      pass_rate: Number(passRate.toFixed(3)),
      ci_low: Number((centre - margin).toFixed(3)),
      ci_high: Number((centre + margin).toFixed(3)),
      reliability: b.n >= 20 ? 'high' : b.n >= 8 ? 'medium' : 'low'
    };
  }

  if (!fs.existsSync(HOME)) fs.mkdirSync(HOME, { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ generated_at: new Date().toISOString(), sample: rows.length, calibration }, null, 2));
  return calibration;
}

if (val('--query')) {
  const cal = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')).calibration : build();
  const key = val('--query');
  if (cal[key]) {
    const c = cal[key];
    console.log(`${key}`);
    console.log(`  pass rate:         ${(c.pass_rate * 100).toFixed(1)}%  (n=${c.n})`);
    console.log(`  95% CI:            ${(c.ci_low * 100).toFixed(1)}% – ${(c.ci_high * 100).toFixed(1)}%`);
    console.log(`  reliability:       ${c.reliability}`);
  } else {
    console.log(`No calibration data for "${key}". Try just the model: "sonnet-4.6"`);
    console.log('Available keys:');
    for (const k of Object.keys(cal).slice(0, 20)) console.log(`  ${k}  (n=${cal[k].n})`);
  }
  process.exit(0);
}

const cal = build();
console.log(`\n=== CALIBRATED CONFIDENCE ===`);
console.log(`Sample: see file ${OUT}`);
console.log(`Buckets with sufficient data (n≥3): ${Object.keys(cal).length}\n`);

const sorted = Object.entries(cal).sort((a, b) => b[1].n - a[1].n).slice(0, 20);
console.log(`${'bucket'.padEnd(40)} ${'n'.padEnd(4)} ${'pass'.padEnd(7)} ${'95% CI'.padEnd(15)} reliability`);
for (const [key, c] of sorted) {
  console.log(`${key.padEnd(40)} ${String(c.n).padEnd(4)} ${(c.pass_rate * 100).toFixed(0).padStart(4)}%   ${(c.ci_low * 100).toFixed(0)}% – ${(c.ci_high * 100).toFixed(0)}%   ${c.reliability}`);
}
console.log(`\nWritten to ${OUT} for router consumption.`);
