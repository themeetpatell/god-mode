#!/usr/bin/env node
/**
 * themeetpatel · budgets.js
 *
 * Manage budget caps and report spend against them.
 * Reads ~/.themeetpatel/budgets/ + ~/.themeetpatel/ledger.jsonl
 *
 * Usage:
 *   budgets set --type per_month_usd --value 500
 *   budgets set --project <slug> --type per_project_usd --value 200
 *   budgets status
 *   budgets report --month 2026-05
 *   budgets clear --project <slug>
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = process.env.THEMEETPATEL_HOME || path.join(os.homedir(), '.themeetpatel');
const BUDGET_DIR = path.join(HOME, 'budgets');
const LEDGER = path.join(HOME, 'ledger.jsonl');

function ensure() { if (!fs.existsSync(BUDGET_DIR)) fs.mkdirSync(BUDGET_DIR, { recursive: true }); }

const args = process.argv.slice(2);
const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const sub = args[0];

function load(filename) {
  ensure();
  const p = path.join(BUDGET_DIR, filename);
  if (!fs.existsSync(p)) return {};
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}
function save(filename, data) {
  ensure();
  fs.writeFileSync(path.join(BUDGET_DIR, filename), JSON.stringify(data, null, 2));
}

function loadLedger() {
  if (!fs.existsSync(LEDGER)) return [];
  return fs.readFileSync(LEDGER, 'utf8').split('\n').filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}

function spendForPeriod(rows, sinceMs) {
  return rows.filter((r) => new Date(r.ts).getTime() >= sinceMs)
    .reduce((sum, r) => sum + (r.cost_usd || 0), 0);
}

if (sub === 'set') {
  const project = val('--project') || 'default';
  const type = val('--type');
  const value = parseFloat(val('--value'));
  if (!type || isNaN(value)) { console.error('Need --type and --value'); process.exit(1); }
  const filename = project === 'default' ? 'monthly.json' : `${project}.json`;
  const cfg = load(filename);
  cfg[type] = value;
  cfg.updated_at = new Date().toISOString();
  save(filename, cfg);
  console.log(`Saved: ${filename} → ${type} = $${value}`);
}
else if (sub === 'status') {
  const ledger = loadLedger();
  const monthStart = new Date();
  monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  const monthSpend = spendForPeriod(ledger, monthStart.getTime());

  const monthly = load('monthly.json');

  console.log(`\n=== BUDGET STATUS ===`);
  console.log(`Period: ${monthStart.toISOString().slice(0, 7)}\n`);

  if (monthly.per_month_usd) {
    const pct = (monthSpend / monthly.per_month_usd) * 100;
    console.log(`Monthly cap:  $${monthly.per_month_usd.toFixed(2).padStart(8)}   used: $${monthSpend.toFixed(2).padStart(8)}  (${pct.toFixed(0)}%)   remaining: $${(monthly.per_month_usd - monthSpend).toFixed(2)}`);
  } else {
    console.log(`Monthly cap:  (none set)   used: $${monthSpend.toFixed(2)}`);
  }
  if (monthly.per_session_usd) {
    console.log(`Per-session:  $${monthly.per_session_usd.toFixed(2)}`);
  }

  // Project caps
  ensure();
  const projects = fs.readdirSync(BUDGET_DIR).filter((f) => f.endsWith('.json') && f !== 'monthly.json');
  if (projects.length > 0) {
    console.log('\nPROJECT CAPS:');
    for (const f of projects) {
      const cfg = load(f);
      const slug = f.replace('.json', '');
      // Match ledger rows tagged with project slug via session_id prefix (convention)
      const projectSpend = ledger.filter((r) => (r.session_id || '').startsWith(slug) && new Date(r.ts).getTime() >= monthStart.getTime())
        .reduce((sum, r) => sum + (r.cost_usd || 0), 0);
      if (cfg.per_project_usd) {
        const pct = (projectSpend / cfg.per_project_usd) * 100;
        const flag = pct >= 95 ? '⚠' : pct >= 80 ? '!' : ' ';
        console.log(`  ${slug.padEnd(20)} $${cfg.per_project_usd.toFixed(2).padStart(8)}   used: $${projectSpend.toFixed(2).padStart(8)}  (${pct.toFixed(0)}%) ${flag}`);
      }
    }
  }
}
else if (sub === 'report') {
  const month = val('--month') || new Date().toISOString().slice(0, 7);
  const start = new Date(month + '-01').getTime();
  const ledger = loadLedger();
  const periodRows = ledger.filter((r) => r.ts && r.ts.startsWith(month));
  const spend = periodRows.reduce((sum, r) => sum + (r.cost_usd || 0), 0);
  console.log(`Period: ${month}`);
  console.log(`Rows: ${periodRows.length}`);
  console.log(`Total spend: $${spend.toFixed(2)}`);
}
else if (sub === 'clear') {
  const project = val('--project');
  if (!project) { console.error('Need --project'); process.exit(1); }
  const p = path.join(BUDGET_DIR, `${project}.json`);
  if (fs.existsSync(p)) { fs.unlinkSync(p); console.log(`Removed ${p}`); }
  else { console.log(`No budget for ${project}`); }
}
else {
  console.log(`Usage:
  budgets set --type per_month_usd --value 500
  budgets set --project <slug> --type per_project_usd --value 200
  budgets status
  budgets report --month 2026-05
  budgets clear --project <slug>`);
}
