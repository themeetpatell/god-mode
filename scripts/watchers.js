#!/usr/bin/env node
/**
 * themeetpatel · watchers.js
 *
 * Minimal CLI for managing watcher configs at ~/.themeetpatel/watchers/.
 *
 * Companion: scripts/watcher-daemon.js (the actual poller — invoke via cron/systemd).
 *
 * Usage:
 *   watchers add --name <n> --type <cron|file_change|webhook|metric> --schedule <expr> --goal "<...>"
 *   watchers list
 *   watchers enable <name>
 *   watchers disable <name>
 *   watchers test <name>
 *   watchers remove <name>
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

const HOME = process.env.THEMEETPATEL_HOME || path.join(os.homedir(), '.themeetpatel');
const DIR = path.join(HOME, 'watchers');
const LOG = path.join(DIR, 'log.jsonl');

function ensure() { if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true }); }

const sub = process.argv[2];
const argv = {};
for (let i = 3; i < process.argv.length; i += 2) argv[process.argv[i]] = process.argv[i + 1];

function configPath(name) { return path.join(DIR, `${name}.json`); }

function add() {
  ensure();
  const name = argv['--name'];
  if (!name) { console.error('Need --name'); process.exit(1); }
  const config = {
    name,
    type: argv['--type'] || 'cron',
    schedule: argv['--schedule'],
    path: argv['--path'],
    endpoint: argv['--endpoint'],
    metric_url: argv['--metric-url'],
    op: argv['--op'],
    value: argv['--value'] ? Number(argv['--value']) : undefined,
    action: {
      kind: 'god_mode_session',
      goal: argv['--goal'],
      constraints: argv['--constraints']
    },
    approval: {
      auto_run: argv['--auto-run'] === 'true',
      require_approval_before_external_writes: argv['--no-approval'] !== 'true'
    },
    destinations: argv['--to'] ? argv['--to'].split(',') : [],
    enabled: true,
    created_at: new Date().toISOString()
  };
  fs.writeFileSync(configPath(name), JSON.stringify(config, null, 2));
  console.log(`Added watcher ${name}`);
}

function list() {
  ensure();
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json') && f !== 'log.jsonl');
  if (files.length === 0) { console.log('No watchers configured.'); return; }
  for (const f of files) {
    const c = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
    console.log(`${c.enabled ? '[ON ]' : '[OFF]'} ${c.name.padEnd(28)} ${c.type.padEnd(14)} ${c.schedule || c.path || c.endpoint || ''}`);
  }
}

function setEnabled(name, val) {
  const p = configPath(name);
  if (!fs.existsSync(p)) { console.error(`No watcher ${name}`); process.exit(1); }
  const c = JSON.parse(fs.readFileSync(p, 'utf8'));
  c.enabled = val;
  fs.writeFileSync(p, JSON.stringify(c, null, 2));
  console.log(`${name}: ${val ? 'enabled' : 'disabled'}`);
}

function test(name) {
  const p = configPath(name);
  if (!fs.existsSync(p)) { console.error(`No watcher ${name}`); process.exit(1); }
  const c = JSON.parse(fs.readFileSync(p, 'utf8'));
  console.log(`\n=== DRY RUN: ${c.name} ===`);
  console.log(`Type: ${c.type}`);
  console.log(`Would trigger action: ${JSON.stringify(c.action, null, 2)}`);
  console.log(`Destinations: ${c.destinations.join(', ') || '(none)'}`);
  console.log(`Approval mode: ${c.approval.auto_run ? 'auto-run' : 'manual approval required'}`);
  console.log(`\nIn production, the watcher-daemon would invoke the God Mode CEO with the goal above.`);
}

function remove(name) {
  const p = configPath(name);
  if (!fs.existsSync(p)) { console.error(`No watcher ${name}`); process.exit(1); }
  fs.unlinkSync(p);
  console.log(`Removed ${name}`);
}

if (sub === 'add') add();
else if (sub === 'list') list();
else if (sub === 'enable') setEnabled(process.argv[3], true);
else if (sub === 'disable') setEnabled(process.argv[3], false);
else if (sub === 'test') test(process.argv[3]);
else if (sub === 'remove') remove(process.argv[3]);
else {
  console.log(`Usage:
  watchers add --name <n> --type <cron|file_change|webhook|metric> [--schedule "0 8 * * 1-5"] [--goal "..."]
  watchers list
  watchers enable <name>
  watchers disable <name>
  watchers test <name>
  watchers remove <name>`);
}
