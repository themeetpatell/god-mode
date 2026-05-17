#!/usr/bin/env node
/**
 * themeetpatel · long-task.js
 *
 * Long-running task primitive. Kicks off work in the background, persists
 * state to ~/.themeetpatel/long-tasks/<id>.json, and lets you check status
 * or retrieve results later.
 *
 * The actual work is delegated to a child process — could be a shell command,
 * a Node script, or a wrapper around another tool. The long-task layer just
 * gives it durable identity + status.
 *
 * Usage:
 *   long-task start --cmd "<shell command>" --label "audit 200 PRs"
 *   long-task status <id>
 *   long-task list
 *   long-task result <id>
 *   long-task cancel <id>
 *   long-task gc                # remove tasks > 7 days old
 *
 * Task state schema:
 *   { id, label, cmd, started_at, finished_at?, exit_code?, pid?, log_path, status: queued|running|done|failed|cancelled }
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');
const crypto = require('crypto');

const HOME = process.env.THEMEETPATEL_HOME || path.join(os.homedir(), '.themeetpatel');
const TASKS_DIR = path.join(HOME, 'long-tasks');
const LOGS_DIR = path.join(HOME, 'long-tasks', 'logs');

function ensure() {
  if (!fs.existsSync(TASKS_DIR)) fs.mkdirSync(TASKS_DIR, { recursive: true });
  if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });
}

function writeState(id, state) { fs.writeFileSync(path.join(TASKS_DIR, `${id}.json`), JSON.stringify(state, null, 2)); }
function readState(id) {
  const p = path.join(TASKS_DIR, `${id}.json`);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}
function listTasks() {
  ensure();
  return fs.readdirSync(TASKS_DIR).filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(TASKS_DIR, f), 'utf8')))
    .sort((a, b) => (b.started_at || '').localeCompare(a.started_at || ''));
}

function start(args) {
  ensure();
  const cmd = args['--cmd'];
  const label = args['--label'] || 'unlabeled';
  if (!cmd) { console.error('Need --cmd "<command>"'); process.exit(1); }

  const id = 'lt-' + crypto.randomBytes(4).toString('hex');
  const logPath = path.join(LOGS_DIR, `${id}.log`);
  const logFd = fs.openSync(logPath, 'w');

  // Detach so the process survives parent exit
  const child = spawn('bash', ['-c', cmd], {
    detached: true,
    stdio: ['ignore', logFd, logFd]
  });
  child.unref();

  const state = {
    id,
    label,
    cmd,
    started_at: new Date().toISOString(),
    pid: child.pid,
    log_path: logPath,
    status: 'running'
  };
  writeState(id, state);
  console.log(JSON.stringify({ started: id, pid: child.pid, log: logPath }, null, 2));
}

function isAlive(pid) {
  try { process.kill(pid, 0); return true; } catch { return false; }
}

function status(id) {
  const s = readState(id);
  if (!s) { console.error(`No task ${id}`); process.exit(1); }
  if (s.status === 'running' && !isAlive(s.pid)) {
    // Reap: process exited; we don't know the exit code without IPC, so mark done
    s.status = 'done';
    s.finished_at = new Date().toISOString();
    s.exit_code = null; // unknown without IPC
    writeState(id, s);
  }
  console.log(JSON.stringify(s, null, 2));
}

function result(id) {
  const s = readState(id);
  if (!s) { console.error(`No task ${id}`); process.exit(1); }
  if (fs.existsSync(s.log_path)) {
    console.log(fs.readFileSync(s.log_path, 'utf8'));
  } else {
    console.log('(log file missing)');
  }
}

function cancel(id) {
  const s = readState(id);
  if (!s) { console.error(`No task ${id}`); process.exit(1); }
  if (s.pid && isAlive(s.pid)) {
    try { process.kill(s.pid, 'SIGTERM'); } catch {}
  }
  s.status = 'cancelled';
  s.finished_at = new Date().toISOString();
  writeState(id, s);
  console.log(JSON.stringify({ cancelled: id }, null, 2));
}

function gc() {
  ensure();
  const now = Date.now();
  let removed = 0;
  for (const t of listTasks()) {
    const age = now - new Date(t.started_at).getTime();
    if (age > 7 * 24 * 60 * 60 * 1000) {
      try {
        fs.unlinkSync(path.join(TASKS_DIR, `${t.id}.json`));
        if (fs.existsSync(t.log_path)) fs.unlinkSync(t.log_path);
        removed += 1;
      } catch {}
    }
  }
  console.log(`Removed ${removed} task(s) > 7 days old.`);
}

const sub = process.argv[2];
const argv = {};
for (let i = 3; i < process.argv.length; i += 2) argv[process.argv[i]] = process.argv[i + 1];

if (sub === 'start')       start(argv);
else if (sub === 'status') status(process.argv[3]);
else if (sub === 'list')   console.log(JSON.stringify(listTasks(), null, 2));
else if (sub === 'result') result(process.argv[3]);
else if (sub === 'cancel') cancel(process.argv[3]);
else if (sub === 'gc')     gc();
else {
  console.log(`Usage:
  long-task start --cmd "<shell command>" --label "<short label>"
  long-task status <id>
  long-task list
  long-task result <id>
  long-task cancel <id>
  long-task gc`);
}
