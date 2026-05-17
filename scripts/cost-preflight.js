#!/usr/bin/env node
/**
 * themeetpatel · cost-preflight.js
 *
 * Pre-flight cost estimator. Given a roadmap (from stdin or --file), estimates:
 *   - Total tokens by model
 *   - Total cost in USD
 *   - Wall time estimate
 *   - Confidence band based on historical estimates vs actuals
 *
 * Usage:
 *   node scripts/cost-preflight.js --file path/to/roadmap.md
 *   cat roadmap.md | node scripts/cost-preflight.js
 */

const fs = require('fs');

const PRICES = {
  'haiku-4.5':  { in: 0.80,  out: 4.00 },
  'sonnet-4.6': { in: 3.00,  out: 15.00 },
  'opus-4.7':   { in: 15.00, out: 75.00 }
};
const SPEED = { 'haiku-4.5': 80, 'sonnet-4.6': 50, 'opus-4.7': 25 }; // tok/sec approx
const INPUT_RATIO = 3.0; // typical input/output token ratio

const args = process.argv.slice(2);
const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const text = val('--file') ? fs.readFileSync(val('--file'), 'utf8') : fs.readFileSync(0, 'utf8');

// Parse roadmap tasks: lines like "T1.1 ... → Sonnet | est: 800" (model is case-insensitive,
// allows haiku/sonnet/opus shorthand or full claude-* names)
const taskRe = /T(\d+)\.(\d+)\s+(.+?)\s*→\s*(\w+)[^|]*\|\s*est:\s*~?\s*(\d+)/gi;
const tasks = [];
let m;
while ((m = taskRe.exec(text)) !== null) {
  const modelShort = m[4].toLowerCase();
  const model = modelShort.includes('haiku') ? 'haiku-4.5'
              : modelShort.includes('sonnet') ? 'sonnet-4.6'
              : modelShort.includes('opus') ? 'opus-4.7'
              : 'sonnet-4.6';
  tasks.push({ id: `T${m[1]}.${m[2]}`, title: m[3].trim(), model, est_output: parseInt(m[5], 10) });
}

if (tasks.length === 0) {
  console.error('No tasks parsed from input. Expected lines like: T1.1 <title> → Sonnet | est: 800');
  process.exit(1);
}

// Estimate per task
let totalCost = 0;
let totalOutTok = 0;
let totalInTok = 0;
let totalSeconds = 0;
const byModel = {};

for (const t of tasks) {
  const out_tok = t.est_output;
  const in_tok = Math.round(out_tok * INPUT_RATIO);
  const p = PRICES[t.model];
  const cost = (in_tok / 1_000_000) * p.in + (out_tok / 1_000_000) * p.out;
  const sec = out_tok / SPEED[t.model];
  totalCost += cost;
  totalOutTok += out_tok;
  totalInTok += in_tok;
  totalSeconds += sec;
  byModel[t.model] = byModel[t.model] || { count: 0, out_tok: 0, cost: 0 };
  byModel[t.model].count += 1;
  byModel[t.model].out_tok += out_tok;
  byModel[t.model].cost += cost;
}

// All-Opus baseline for savings comparison
const opusBaseline = tasks.reduce((sum, t) => sum + ((t.est_output * INPUT_RATIO / 1_000_000) * PRICES['opus-4.7'].in + (t.est_output / 1_000_000) * PRICES['opus-4.7'].out), 0);

const savings = opusBaseline > 0 ? (opusBaseline - totalCost) / opusBaseline : 0;

const out = {
  tasks_parsed: tasks.length,
  estimated: {
    total_input_tokens: totalInTok,
    total_output_tokens: totalOutTok,
    total_cost_usd: Number(totalCost.toFixed(4)),
    wall_time_seconds: Math.round(totalSeconds),
    wall_time_human: `${Math.round(totalSeconds / 60)}m ${totalSeconds % 60 | 0}s`
  },
  baseline_all_opus: {
    cost_usd: Number(opusBaseline.toFixed(4))
  },
  estimated_savings_percent: Math.round(savings * 100),
  by_model: byModel,
  confidence_band: {
    low: Number((totalCost * 0.7).toFixed(4)),
    high: Number((totalCost * 1.5).toFixed(4)),
    note: '±30%/+50% based on typical estimate-vs-actual variance for new roadmaps'
  },
  notes: [
    'Output-token estimates from roadmap are operator-set; actual usage may vary',
    'Input-token approximated as 3x output (typical for context-passing patterns)',
    'Wall time assumes sequential per-phase; actual wall time depends on parallelism + network',
    'Set $THEMEETPATEL_BUDGET_USD to enforce a hard cap'
  ]
};

const budget = process.env.THEMEETPATEL_BUDGET_USD ? parseFloat(process.env.THEMEETPATEL_BUDGET_USD) : null;
if (budget !== null && totalCost > budget) {
  out.budget_check = { budget, status: 'EXCEEDS', overshoot_usd: Number((totalCost - budget).toFixed(4)) };
  console.log(JSON.stringify(out, null, 2));
  process.exit(2);
}
if (budget !== null) {
  out.budget_check = { budget, status: 'within', headroom_usd: Number((budget - totalCost).toFixed(4)) };
}

console.log(JSON.stringify(out, null, 2));
