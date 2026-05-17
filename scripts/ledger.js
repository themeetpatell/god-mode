#!/usr/bin/env node
/**
 * themeetpatel · ledger.js
 *
 * Cost ledger CLI. Reads ~/.themeetpatel/ledger.jsonl and reports:
 *   - Per-session cost summary
 *   - Per-model token + cost breakdown
 *   - Escalation rate (downgrades + upgrades)
 *   - Verifier pass rate per model
 *   - Savings vs all-Opus baseline
 *   - Routing waste signals (model used but escalated, model used but verifier failed)
 *
 * Usage:
 *   node scripts/ledger.js                 # last 30 days summary
 *   node scripts/ledger.js --session <id>  # one session
 *   node scripts/ledger.js --since 2026-04-01
 *   node scripts/ledger.js --csv           # CSV export for spreadsheet
 *   node scripts/ledger.js --waste         # only show waste rows
 *
 * Ledger row schema (one JSON object per line in ledger.jsonl):
 * {
 *   ts, session_id, task_id, task_text,
 *   routed_model, actual_model, escalated_to,
 *   input_tokens, output_tokens, cost_usd, wall_ms,
 *   outcome, verifier_verdict,
 *   patterns_hit
 * }
 *
 * Per-million pricing (May 2026 reference; adjust if Anthropic changes prices):
 *   Haiku 4.5:   input $0.80 / output $4.00
 *   Sonnet 4.6:  input $3.00 / output $15.00
 *   Opus 4.7:    input $15.00 / output $75.00
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = process.env.THEMEETPATEL_HOME || path.join(os.homedir(), '.themeetpatel');
const LEDGER = path.join(HOME, 'ledger.jsonl');

const PRICES = {
  'haiku-4.5':  { input: 0.80,  output: 4.00 },
  'sonnet-4.6': { input: 3.00,  output: 15.00 },
  'opus-4.7':   { input: 15.00, output: 75.00 }
};

const COST_RATIO = {
  'haiku-4.5':  1,
  'sonnet-4.6': 5,
  'opus-4.7':   15
};

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const value = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
};

function loadRows() {
  if (!fs.existsSync(LEDGER)) {
    console.error(`No ledger found at ${LEDGER}. The ledger is populated as you run sessions.`);
    console.error('To bootstrap: run a God Mode session with the ledger-write hook enabled.');
    process.exit(0);
  }
  return fs.readFileSync(LEDGER, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => { try { return JSON.parse(line); } catch { return null; } })
    .filter(Boolean);
}

function filterRows(rows) {
  const sessionId = value('--session');
  const since = value('--since');
  const sinceTs = since ? new Date(since).getTime() : Date.now() - 30 * 24 * 60 * 60 * 1000;

  return rows.filter((r) => {
    if (sessionId && r.session_id !== sessionId) return false;
    const ts = new Date(r.ts).getTime();
    if (ts < sinceTs) return false;
    if (flag('--waste')) {
      const wasted = r.verifier_verdict === 'fail' ||
                     (r.actual_model && r.routed_model !== r.actual_model);
      if (!wasted) return false;
    }
    return true;
  });
}

function costOf(row) {
  if (typeof row.cost_usd === 'number') return row.cost_usd;
  const model = row.actual_model && row.actual_model !== 'escalated' && row.actual_model !== 'downscaled'
    ? row.actual_model
    : row.routed_model;
  const p = PRICES[model];
  if (!p) return 0;
  return (row.input_tokens || 0) / 1_000_000 * p.input + (row.output_tokens || 0) / 1_000_000 * p.output;
}

function csvReport(rows) {
  const headers = ['ts', 'session_id', 'task_id', 'routed_model', 'actual_model', 'input_tokens', 'output_tokens', 'cost_usd', 'verifier_verdict', 'outcome'];
  console.log(headers.join(','));
  for (const r of rows) {
    console.log(headers.map((h) => h === 'cost_usd' ? costOf(r).toFixed(4) : (r[h] ?? '')).join(','));
  }
}

function humanReport(rows) {
  if (rows.length === 0) {
    console.log('No ledger rows match the filter.');
    return;
  }

  console.log(`\n=== LEDGER REPORT ===`);
  console.log(`Rows: ${rows.length}`);
  if (value('--session')) console.log(`Session: ${value('--session')}`);
  else console.log(`Window: last ${Math.round((Date.now() - new Date(rows[0].ts).getTime()) / 86_400_000)} days (from oldest row)`);

  // Per-model breakdown
  const byModel = {};
  for (const r of rows) {
    const m = r.routed_model || 'unknown';
    byModel[m] = byModel[m] || { n: 0, in_tok: 0, out_tok: 0, cost: 0, pass: 0, cond: 0, fail: 0, esc: 0, down: 0 };
    const b = byModel[m];
    b.n += 1;
    b.in_tok += r.input_tokens || 0;
    b.out_tok += r.output_tokens || 0;
    b.cost += costOf(r);
    if (r.verifier_verdict === 'pass') b.pass += 1;
    if (r.verifier_verdict === 'conditional') b.cond += 1;
    if (r.verifier_verdict === 'fail') b.fail += 1;
    if (r.actual_model === 'escalated') b.esc += 1;
    if (r.actual_model === 'downscaled') b.down += 1;
  }

  console.log(`\n--- PER MODEL ---`);
  console.log(`${'model'.padEnd(12)}  n     in tok       out tok      cost      pass%   esc   down`);
  let totalCost = 0;
  let totalOpusBaseline = 0;
  for (const [m, b] of Object.entries(byModel)) {
    const passPct = b.n ? ((b.pass / b.n) * 100).toFixed(0) : '-';
    console.log(`${m.padEnd(12)}  ${String(b.n).padEnd(4)}  ${String(b.in_tok).padEnd(11)}  ${String(b.out_tok).padEnd(11)}  $${b.cost.toFixed(2).padStart(7)}  ${passPct.padStart(5)}%  ${String(b.esc).padStart(3)}   ${String(b.down).padStart(3)}`);
    totalCost += b.cost;
    // Opus baseline = same input/output tokens but priced as Opus
    const op = PRICES['opus-4.7'];
    totalOpusBaseline += (b.in_tok / 1_000_000) * op.input + (b.out_tok / 1_000_000) * op.output;
  }

  const savings = totalOpusBaseline > 0 ? ((totalOpusBaseline - totalCost) / totalOpusBaseline) * 100 : 0;
  console.log(`\n--- SAVINGS ---`);
  console.log(`Routed total cost:     $${totalCost.toFixed(2)}`);
  console.log(`All-Opus baseline:     $${totalOpusBaseline.toFixed(2)}`);
  console.log(`Estimated savings:     ${savings.toFixed(1)}%  ($${(totalOpusBaseline - totalCost).toFixed(2)})`);

  // Verifier health
  const totalPass = Object.values(byModel).reduce((a, b) => a + b.pass, 0);
  const totalCond = Object.values(byModel).reduce((a, b) => a + b.cond, 0);
  const totalFail = Object.values(byModel).reduce((a, b) => a + b.fail, 0);
  const totalVerified = totalPass + totalCond + totalFail;
  if (totalVerified > 0) {
    console.log(`\n--- VERIFIER HEALTH ---`);
    console.log(`Pass:        ${totalPass}  (${((totalPass / totalVerified) * 100).toFixed(1)}%)`);
    console.log(`Conditional: ${totalCond}  (${((totalCond / totalVerified) * 100).toFixed(1)}%)`);
    console.log(`Fail:        ${totalFail}  (${((totalFail / totalVerified) * 100).toFixed(1)}%)`);
  }

  // Escalation rate
  const totalEsc = Object.values(byModel).reduce((a, b) => a + b.esc, 0);
  const totalDown = Object.values(byModel).reduce((a, b) => a + b.down, 0);
  if (totalEsc + totalDown > 0) {
    console.log(`\n--- ROUTING ADJUSTMENTS ---`);
    console.log(`Escalations: ${totalEsc}  (${((totalEsc / rows.length) * 100).toFixed(1)}% of routes)`);
    console.log(`Downscales:  ${totalDown}  (${((totalDown / rows.length) * 100).toFixed(1)}% of routes)`);
  }

  // Waste flags
  const wasted = rows.filter((r) => r.verifier_verdict === 'fail');
  if (wasted.length > 0) {
    console.log(`\n--- WASTE: TASKS THAT FAILED VERIFICATION (${wasted.length}) ---`);
    for (const r of wasted.slice(0, 10)) {
      console.log(`  ${r.task_id || '-'}  [${r.routed_model}]  ${(r.task_text || '').slice(0, 70)}`);
    }
    if (wasted.length > 10) console.log(`  ... +${wasted.length - 10} more (use --csv for full list)`);
  }

  console.log(``);
}

const all = loadRows();
const filtered = filterRows(all);

if (flag('--csv')) {
  csvReport(filtered);
} else {
  humanReport(filtered);
}
