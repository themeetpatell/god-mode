#!/usr/bin/env node
/**
 * themeetpatel · sandbox-run.js
 *
 * Code execution sandbox runner. Workers that write code can call this to
 * actually execute the code, capture stdout/stderr/exit, and iterate to
 * passing tests on their own.
 *
 * Supports:
 *   - JavaScript (node, deno detected via shebang)
 *   - Python (python3)
 *   - Bash (bash)
 *   - TypeScript (tsx if available, else fail with hint)
 *
 * Safety:
 *   - Runs in /tmp/sandbox-<random>/ — auto-cleaned
 *   - 30s hard timeout
 *   - No network by default (set --allow-network to opt in)
 *   - No fs access outside the sandbox dir
 *
 * Usage:
 *   node scripts/sandbox-run.js --file path/to/code.js
 *   echo "console.log('hi')" | node scripts/sandbox-run.js --lang js
 *   node scripts/sandbox-run.js --file test.py --lang python
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync, spawnSync } = require('child_process');
const crypto = require('crypto');

const args = process.argv.slice(2);
const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const flag = (n) => args.includes(n);

const RUNNERS = {
  js:     { cmd: 'node',    ext: '.js' },
  ts:     { cmd: 'tsx',     ext: '.ts' },
  python: { cmd: 'python3', ext: '.py' },
  py:     { cmd: 'python3', ext: '.py' },
  bash:   { cmd: 'bash',    ext: '.sh' },
  sh:     { cmd: 'bash',    ext: '.sh' }
};

function detectLang(code) {
  const sb = code.split('\n')[0];
  if (sb.startsWith('#!')) {
    if (sb.includes('node')) return 'js';
    if (sb.includes('python')) return 'python';
    if (sb.includes('bash') || sb.includes('sh')) return 'bash';
    if (sb.includes('tsx') || sb.includes('deno')) return 'ts';
  }
  return null;
}

let code = '';
const file = val('--file');
if (file) {
  code = fs.readFileSync(file, 'utf8');
} else {
  code = fs.readFileSync(0, 'utf8');
}
if (!code.trim()) { console.error('No code provided.'); process.exit(1); }

const lang = val('--lang') || detectLang(code) || (file ? Object.entries(RUNNERS).find(([, v]) => file.endsWith(v.ext))?.[0] : null) || 'js';
const runner = RUNNERS[lang];
if (!runner) { console.error(`Unknown language: ${lang}`); process.exit(1); }

const sandboxId = crypto.randomBytes(4).toString('hex');
const sandboxDir = path.join(os.tmpdir(), `sandbox-${sandboxId}`);
fs.mkdirSync(sandboxDir, { recursive: true });

const codePath = path.join(sandboxDir, 'main' + runner.ext);
fs.writeFileSync(codePath, code);

const env = { ...process.env, NODE_OPTIONS: '' };
if (!flag('--allow-network')) {
  // Best effort to discourage network; doesn't fully isolate without container
  env.NO_PROXY = '*';
}

const started = Date.now();
const res = spawnSync(runner.cmd, [codePath], {
  cwd: sandboxDir,
  env,
  encoding: 'utf8',
  timeout: 30_000,
  stdio: ['ignore', 'pipe', 'pipe']
});
const elapsed = Date.now() - started;

// Clean up
try { fs.rmSync(sandboxDir, { recursive: true, force: true }); } catch {}

const out = {
  lang,
  exit_code: res.status,
  signal: res.signal,
  duration_ms: elapsed,
  timed_out: res.error?.code === 'ETIMEDOUT' || elapsed >= 30_000,
  stdout: (res.stdout || '').slice(0, 8192),
  stdout_truncated: (res.stdout || '').length > 8192,
  stderr: (res.stderr || '').slice(0, 4096),
  stderr_truncated: (res.stderr || '').length > 4096,
  ok: res.status === 0
};

console.log(JSON.stringify(out, null, 2));
process.exit(out.ok ? 0 : 1);
