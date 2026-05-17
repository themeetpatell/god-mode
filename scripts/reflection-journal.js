#!/usr/bin/env node
/**
 * themeetpatel · reflection-journal.js
 *
 * End-of-day / end-of-week / end-of-month reflection generator.
 * Reads ledger.jsonl + episodes/ + beliefs.jsonl and produces a markdown digest
 * the user can scan in 90 seconds.
 *
 * Usage:
 *   reflection-journal day                    # today
 *   reflection-journal week                   # last 7 days
 *   reflection-journal month                  # last 30 days
 *   reflection-journal quarter                # last 90 days, with OKR alignment check
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = process.env.THEMEETPATEL_HOME || path.join(os.homedir(), '.themeetpatel');
const LEDGER = path.join(HOME, 'ledger.jsonl');
const EPISODES_DIR = path.join(HOME, 'episodes');
const BELIEFS = path.join(HOME, 'beliefs.jsonl');

const period = process.argv[2] || 'day';
const PERIODS = { day: 1, week: 7, month: 30, quarter: 90 };
const days = PERIODS[period] || 7;
const since = Date.now() - days * 24 * 60 * 60 * 1000;

function loadJsonl(p) {
  if (!fs.existsSync(p)) return [];
  return fs.readFileSync(p, 'utf8').split('\n').filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}

function loadEpisodes() {
  if (!fs.existsSync(EPISODES_DIR)) return [];
  return fs.readdirSync(EPISODES_DIR).filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(EPISODES_DIR, f), 'utf8')));
}

const ledger = loadJsonl(LEDGER).filter((r) => new Date(r.ts).getTime() >= since);
const episodes = loadEpisodes().filter((e) => new Date(e.ts_end).getTime() >= since);
const beliefs = loadJsonl(BELIEFS).filter((b) => new Date(b.ts).getTime() >= since);

const sessions = new Set(ledger.map((r) => r.session_id)).size;
const tasks = ledger.length;
const verifierPass = ledger.filter((r) => r.verifier_verdict === 'pass').length;
const verifierFail = ledger.filter((r) => r.verifier_verdict === 'fail').length;
const newBeliefs = beliefs.filter((b) => !b.supersedes && b.statement);
const revisedBeliefs = beliefs.filter((b) => b.supersedes);

const tagCount = {};
for (const e of episodes) for (const t of e.tags || []) tagCount[t] = (tagCount[t] || 0) + 1;
const topTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

console.log(`# Reflection — last ${days} day${days > 1 ? 's' : ''} (since ${new Date(since).toISOString().slice(0, 10)})

## Activity
- Sessions: ${sessions}
- Tasks routed: ${tasks}
- Episodes closed: ${episodes.length}

## Quality
- Verifier pass: ${verifierPass}
- Verifier fail: ${verifierFail}
- Pass rate: ${tasks > 0 ? ((verifierPass / Math.max(1, verifierPass + verifierFail)) * 100).toFixed(1) : '-'}%

## Topics worked on
${topTags.map(([t, n]) => `- ${t} (${n} episodes)`).join('\n') || '- (no tagged episodes)'}

## Beliefs
- New beliefs written: ${newBeliefs.length}
${newBeliefs.slice(0, 5).map((b) => `  - ${b.id}: ${b.statement}`).join('\n')}
- Beliefs revised: ${revisedBeliefs.length}
${revisedBeliefs.slice(0, 5).map((b) => `  - ${b.supersedes} → ${b.id}: ${b.statement}`).join('\n')}

## What shipped (top 5 episodes by recency)
${episodes.slice(0, 5).map((e) => `- ${e.goal}  (${e.id})`).join('\n')}

## Unresolved / open
${episodes.filter((e) => Object.values(e.verifier_verdicts || {}).includes('conditional') || Object.values(e.verifier_verdicts || {}).includes('fail')).slice(0, 5).map((e) => `- ${e.goal}  (${e.id}) — has conditional/fail verdicts`).join('\n') || '- (none flagged)'}

${period === 'quarter' ? `
## OKR alignment check
This is a stub in v1.4. In v1.5, paste your stated OKRs into ~/.themeetpatel/okrs.md and this section will compute episode tags vs OKR keywords to show what % of your work aligned to your stated priorities.
` : ''}

## Next
- Run \`node scripts/anti-pattern-lib.js list\` to review patterns to avoid
- Run \`node scripts/calibrated-confidence.js\` to refresh router calibration
- ${period === 'week' ? `Want a deeper reflection? \`node scripts/reflection-journal.js month\`` : ''}
`);
