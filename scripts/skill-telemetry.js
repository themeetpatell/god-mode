#!/usr/bin/env node
/**
 * themeetpatel · skill-telemetry.js
 *
 * Two modes:
 *   1) Hook mode (called by hooks.json) — records a skill load event to ~/.themeetpatel/skill-loads.jsonl
 *   2) Report mode (CLI invocation) — summarizes which skills are loaded, when, how often
 *
 * Schema for skill-loads.jsonl rows:
 *   { ts, session_id, skill_name, load_source: 'progressive' | 'explicit' | 'hook' }
 *
 * Usage:
 *   node scripts/skill-telemetry.js                # report — last 30 days
 *   node scripts/skill-telemetry.js --record <name> --source <source>  # manual record
 *   node scripts/skill-telemetry.js --dead         # skills never loaded in 30 days
 *   node scripts/skill-telemetry.js --csv          # CSV export
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = process.env.THEMEETPATEL_HOME || path.join(os.homedir(), '.themeetpatel');
const LOG = path.join(HOME, 'skill-loads.jsonl');

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };

function ensureDir() {
  if (!fs.existsSync(HOME)) fs.mkdirSync(HOME, { recursive: true });
}

function record() {
  ensureDir();
  let raw = '';
  process.stdin.on('data', (c) => (raw += c));
  process.stdin.on('end', () => {
    try {
      let skillName = val('--record');
      const source = val('--source') || 'hook';
      // If called as a hook, parse stdin for skill info
      if (!skillName && raw) {
        const payload = JSON.parse(raw);
        skillName = payload?.tool_input?.skill || payload?.tool_input?.name || 'unknown';
      }
      if (!skillName) return;
      const row = {
        ts: new Date().toISOString(),
        session_id: process.env.CLAUDE_SESSION_ID || 'unknown',
        skill_name: skillName,
        load_source: source
      };
      fs.appendFileSync(LOG, JSON.stringify(row) + '\n');
    } catch {
      // hooks never crash sessions
    }
  });
}

function loadRows() {
  if (!fs.existsSync(LOG)) return [];
  return fs.readFileSync(LOG, 'utf8')
    .split('\n').filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean);
}

function listAllSkills() {
  const root = path.join(__dirname, '..', 'skills');
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root).filter((d) => fs.statSync(path.join(root, d)).isDirectory());
}

function report() {
  const rows = loadRows();
  const all = listAllSkills();
  const sinceMs = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recent = rows.filter((r) => new Date(r.ts).getTime() >= sinceMs);

  const counts = {};
  for (const r of recent) {
    counts[r.skill_name] = (counts[r.skill_name] || 0) + 1;
  }

  if (flag('--csv')) {
    console.log('skill,loads_30d,last_loaded');
    const lastLoaded = {};
    for (const r of recent) {
      if (!lastLoaded[r.skill_name] || r.ts > lastLoaded[r.skill_name]) lastLoaded[r.skill_name] = r.ts;
    }
    for (const s of all) {
      console.log(`${s},${counts[s] || 0},${lastLoaded[s] || ''}`);
    }
    return;
  }

  if (flag('--dead')) {
    const dead = all.filter((s) => !(counts[s] > 0));
    console.log(`\n=== SKILLS NEVER LOADED (last 30 days) ===`);
    if (dead.length === 0) console.log('(none — every skill triggered at least once)');
    for (const s of dead) console.log(`  ${s}`);
    return;
  }

  console.log(`\n=== SKILL TELEMETRY (last 30 days) ===`);
  console.log(`Skills total: ${all.length}`);
  console.log(`Skills used:  ${Object.keys(counts).length}`);
  console.log(`Total loads:  ${recent.length}`);

  console.log(`\n--- TOP USED ---`);
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  for (const [s, n] of sorted.slice(0, 15)) {
    console.log(`  ${s.padEnd(28)} ${n}`);
  }

  const dead = all.filter((s) => !(counts[s] > 0));
  if (dead.length > 0) {
    console.log(`\n--- NEVER LOADED (candidates for deprecation) ---`);
    for (const s of dead) console.log(`  ${s}`);
  }
}

if (flag('--record') || (process.stdin.isTTY === false && args.length === 0)) {
  // hook mode (stdin pipe + no args)
  record();
} else {
  report();
}
