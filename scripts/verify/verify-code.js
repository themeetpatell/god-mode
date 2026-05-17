#!/usr/bin/env node
/**
 * themeetpatel · verify-code.js
 *
 * Runs the verifier protocol for class: code.
 *
 * Inputs (via env or stdin JSON):
 *   { repo_path, test_command?, type_command?, lint_command? }
 *
 * Outputs (stdout JSON, ledger-compatible):
 *   {
 *     verdict: "pass" | "conditional pass" | "fail",
 *     evidence: [{ source, observation }],
 *     defects: [{ severity, what, where }],
 *     re_verify_command: string,
 *     confidence: "high" | "medium" | "low"
 *   }
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function readInput() {
  if (process.argv[2]) {
    try { return JSON.parse(process.argv[2]); } catch {}
  }
  const stdin = fs.readFileSync(0, 'utf8').trim();
  if (stdin) try { return JSON.parse(stdin); } catch {}
  return {};
}

function run(cmd, cwd) {
  try {
    const out = execSync(cmd, { cwd, stdio: ['ignore', 'pipe', 'pipe'], timeout: 120_000 });
    return { ok: true, output: out.toString().trim() };
  } catch (e) {
    return { ok: false, output: (e.stdout?.toString() || '') + (e.stderr?.toString() || ''), code: e.status };
  }
}

function detectCommands(repo) {
  const out = { test: null, type: null, lint: null };
  const pkgPath = path.join(repo, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const scripts = pkg.scripts || {};
    if (scripts.test) out.test = 'npm test --silent';
    if (scripts.typecheck) out.type = 'npm run typecheck --silent';
    else if (fs.existsSync(path.join(repo, 'tsconfig.json'))) out.type = 'npx tsc --noEmit';
    if (scripts.lint) out.lint = 'npm run lint --silent';
  }
  if (fs.existsSync(path.join(repo, 'pyproject.toml')) || fs.existsSync(path.join(repo, 'pytest.ini'))) {
    out.test = out.test || 'pytest -q';
    out.type = out.type || 'mypy . --ignore-missing-imports';
    out.lint = out.lint || 'ruff check .';
  }
  if (fs.existsSync(path.join(repo, 'go.mod'))) {
    out.test = out.test || 'go test ./...';
    out.type = out.type || 'go vet ./...';
    out.lint = out.lint || 'golangci-lint run';
  }
  return out;
}

function findSmells(repo) {
  const defects = [];
  const grep = (pattern, files = '*.ts,*.tsx,*.js,*.jsx,*.py,*.go') => {
    try {
      const cmd = `grep -rn --include="{${files}}" -E "${pattern}" "${repo}" || true`;
      const out = execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
      return out.split('\n').filter(Boolean);
    } catch { return []; }
  };
  const todos = grep('TODO|FIXME|XXX|HACK');
  if (todos.length > 0) defects.push({ severity: 'minor', what: `${todos.length} TODO/FIXME markers`, where: todos.slice(0, 3).join(' | ') });
  const consoleLogs = grep('console\\.log', '*.ts,*.tsx,*.js,*.jsx');
  if (consoleLogs.length > 0) defects.push({ severity: 'minor', what: `${consoleLogs.length} console.log calls`, where: consoleLogs.slice(0, 3).join(' | ') });
  // common secret patterns
  const secrets = grep('(api[_-]?key|secret[_-]?key|password)\\s*=\\s*["\\x27][A-Za-z0-9_\\-]{16,}', '*.ts,*.tsx,*.js,*.jsx,*.py,*.go');
  if (secrets.length > 0) defects.push({ severity: 'critical', what: `${secrets.length} probable hardcoded secret(s)`, where: secrets.slice(0, 3).join(' | ') });
  return defects;
}

const input = readInput();
const repo = input.repo_path || process.cwd();
const cmds = {
  test: input.test_command || detectCommands(repo).test,
  type: input.type_command || detectCommands(repo).type,
  lint: input.lint_command || detectCommands(repo).lint
};

const evidence = [];
const defects = [...findSmells(repo)];

if (cmds.test) {
  const r = run(cmds.test, repo);
  evidence.push({ source: cmds.test, observation: r.ok ? 'tests passed' : `tests failed (exit ${r.code})` });
  if (!r.ok) defects.push({ severity: 'critical', what: 'test failure', where: cmds.test });
} else {
  evidence.push({ source: 'detect', observation: 'no test command detected' });
  defects.push({ severity: 'major', what: 'no tests', where: 'project root' });
}

if (cmds.type) {
  const r = run(cmds.type, repo);
  evidence.push({ source: cmds.type, observation: r.ok ? 'type check passed' : `type check failed` });
  if (!r.ok) defects.push({ severity: 'major', what: 'type errors', where: cmds.type });
}

if (cmds.lint) {
  const r = run(cmds.lint, repo);
  evidence.push({ source: cmds.lint, observation: r.ok ? 'lint clean' : 'lint warnings/errors' });
  if (!r.ok) defects.push({ severity: 'minor', what: 'lint warnings', where: cmds.lint });
}

const criticals = defects.filter((d) => d.severity === 'critical').length;
const majors = defects.filter((d) => d.severity === 'major').length;
const verdict = criticals > 0 ? 'fail' : (majors > 0 ? 'conditional pass' : 'pass');

const result = {
  verdict,
  task_class: 'code',
  evidence,
  defects,
  re_verify_command: cmds.test || 'npm test',
  confidence: cmds.test ? 'high' : 'low'
};

console.log(JSON.stringify(result, null, 2));
process.exit(verdict === 'fail' ? 1 : 0);
