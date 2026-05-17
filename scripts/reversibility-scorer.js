#!/usr/bin/env node
/**
 * themeetpatel · reversibility-scorer.js
 *
 * Scores an action or decision on how hard it is to undo if wrong.
 * The CEO routes irreversible actions through extra approval gates.
 *
 * Input (stdin or --action):
 *   one-line description of the action/decision
 *
 * Output: JSON with score 0-10 (0 = trivial undo, 10 = unrecoverable)
 *         plus the undo procedure if known
 */

const fs = require('fs');

const PATTERNS = [
  // (regex, score 0-10, undo-difficulty notes)
  { re: /\bdelete\b.*\b(prod|production|main|master)\b/i, score: 10, undo: 'restore from backup if exists; otherwise unrecoverable' },
  { re: /\bdrop\s+(table|database)\b/i,                  score: 10, undo: 'restore from backup; risk of data loss between backup and drop' },
  { re: /\bforce.{0,8}push\b/i,                          score: 8,  undo: 'restore from local clone or git reflog within ~30 days' },
  { re: /\bdeploy\b.*\bprod\b/i,                          score: 6,  undo: 'rollback to previous tagged release; downtime possible' },
  { re: /\bsend\b.*\bemail\b/i,                           score: 7,  undo: 'cannot unsend; can only send follow-up correction' },
  { re: /\bpublish\b.*\b(post|article|tweet|linkedin)\b/i, score: 5, undo: 'can edit/delete but cached versions persist' },
  { re: /\bsubmit\b.*\b(contract|signature|agreement|invoice|payment)\b/i, score: 9, undo: 'requires counterparty consent or legal process' },
  { re: /\bwire\b.*\b(payment|funds|money)\b/i,           score: 10, undo: 'recall possible within hours via bank; not always granted' },
  { re: /\bmerge\b.*\b(pr|pull request)\b/i,              score: 4,  undo: 'revert commit; CI re-runs; usually clean' },
  { re: /\bfire\b|\blay off\b|\bterminate\b/i,            score: 9,  undo: 'legally and relationally hard to reverse' },
  { re: /\bhire\b|\boffer\b.*\bcandidate\b/i,             score: 6,  undo: 'can rescind before signed; after signed, severance + relationship cost' },
  { re: /\bsign\b.*\b(contract|loa|agreement)\b/i,        score: 8,  undo: 'requires counterparty consent and legal review' },
  { re: /\bannounce\b.*\b(layoff|restructure|departure)\b/i, score: 9, undo: 'message is out; comms cannot be retracted' },
  { re: /\bupdate\b.*\b(schema|migration)\b/i,             score: 5, undo: 'run down migration if exists; data integrity risk if not' },
  { re: /\brename\b.*\b(domain|brand|product)\b/i,          score: 7, undo: 'SEO/customer-confusion debt; can revert but cost is high' },
  { re: /\b(quit|resign)\b/i,                              score: 8,  undo: 'rarely reversed; long-term relationship + role implications' },
  { re: /\b(post|publish)\b.*\b(tweet|x|linkedin)\b/i,    score: 5,  undo: 'can delete but screenshots persist' }
];

const args = process.argv.slice(2);
const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };

const action = val('--action') || fs.readFileSync(0, 'utf8').trim();

let score = 2; // default: most ordinary actions are easy to undo
let matched = [];
let undoNotes = ['Most ordinary actions can be reversed within minutes'];

for (const p of PATTERNS) {
  if (p.re.test(action)) {
    if (p.score > score) {
      score = p.score;
      undoNotes = [p.undo];
    } else if (p.score === score) {
      undoNotes.push(p.undo);
    }
    matched.push({ pattern: p.re.source, score: p.score });
  }
}

const verdict = score >= 8 ? 'irreversible-or-near' : score >= 5 ? 'high-cost-to-undo' : score >= 3 ? 'recoverable' : 'trivial';
const approval = score >= 8 ? 'require explicit user confirmation phrase' :
                 score >= 5 ? 'require single-click user approval' :
                 score >= 3 ? 'log + proceed' : 'auto';

console.log(JSON.stringify({
  action,
  reversibility_score: score,
  verdict,
  matched_patterns: matched,
  undo_procedure: undoNotes,
  approval_recommendation: approval,
  notes: 'v1.4 pattern-based heuristic. v1.5 will use a learned model.'
}, null, 2));
