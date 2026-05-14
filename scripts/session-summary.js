#!/usr/bin/env node
/**
 * themeetpatel · session-summary.js
 *
 * Stop hook. Reads .themeetpatel/routing.log for the current project and
 * prints a one-shot summary of which subagents (Haiku/Sonnet/Opus specialists)
 * were used this session, plus a rough savings estimate vs. all-Opus.
 *
 * Output goes to stderr so it appears in the Claude Code UI without
 * polluting any stdout consumers.
 */

const fs = require('fs');
const path = require('path');

const ROUGH_COSTS = {
  'haiku-specialist': 1,
  'sonnet-engineer': 5,
  'opus-architect': 15,
  'synthesizer': 1,
  'god-mode-ceo': 15,
};

try {
  const cwd = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const logPath = path.join(cwd, '.themeetpatel', 'routing.log');
  if (!fs.existsSync(logPath)) process.exit(0);

  const lines = fs.readFileSync(logPath, 'utf8').trim().split('\n').filter(Boolean);
  if (lines.length === 0) process.exit(0);

  const counts = {};
  for (const line of lines) {
    const [, name] = line.split('\t');
    counts[name] = (counts[name] || 0) + 1;
  }

  let actualCost = 0;
  let opusBaseline = 0;
  const breakdown = [];
  for (const [name, n] of Object.entries(counts)) {
    const c = ROUGH_COSTS[name] ?? 5;
    actualCost += c * n;
    opusBaseline += 15 * n;
    breakdown.push(`${name}: ${n}`);
  }

  const savedPct =
    opusBaseline > 0 ? Math.round(((opusBaseline - actualCost) / opusBaseline) * 100) : 0;

  const out = [
    '',
    '─── themeetpatel · session summary ───',
    `routed calls: ${lines.length}  (${breakdown.join(', ')})`,
    `rough cost units: ${actualCost}   vs all-Opus baseline: ${opusBaseline}`,
    `estimated savings: ~${savedPct}%`,
    '──────────────────────────────────────',
    '',
  ].join('\n');

  process.stderr.write(out);

  // Truncate the log so the next session starts clean.
  fs.writeFileSync(logPath, '');
} catch (e) {
  // Silent fail — hooks must never break a session.
}
