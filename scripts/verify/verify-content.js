#!/usr/bin/env node
/**
 * themeetpatel · verify-content.js
 *
 * Runs the verifier protocol for class: content (founder posts, LinkedIn, newsletters, etc.).
 *
 * Inputs (via stdin or --file <path>):
 *   plain text of the content to verify
 *
 * Outputs (stdout JSON):
 *   verdict, anti-pattern hits, specificity count, verdict reason
 */

const fs = require('fs');

const ANTI_PATTERNS = [
  { pattern: /\bin a world where\b/i, name: 'in a world where' },
  { pattern: /\bin today'?s fast[- ]paced\b/i, name: "in today's fast-paced" },
  { pattern: /\blet'?s dive into\b/i, name: "let's dive into" },
  { pattern: /\bit'?s not just .{1,30} it'?s\b/i, name: 'contrast template' },
  { pattern: /\bgame[- ]changer\b/i, name: 'game-changer' },
  { pattern: /\brevolutionary\b/i, name: 'revolutionary' },
  { pattern: /\bdisruptive\b/i, name: 'disruptive' },
  { pattern: /\bunlock the power of\b/i, name: 'unlock the power of' },
  { pattern: /\bharness\b/i, name: 'harness' },
  { pattern: /\bwhether you'?re (a|an|the)\b/i, name: 'whether-you-are stuffing' },
  { pattern: /\bat the end of the day\b/i, name: 'at the end of the day' },
  { pattern: /\bnavigate\b/i, name: 'navigate (non-literal)' },
  { pattern: /\bleverage\b/i, name: 'leverage' },
  { pattern: /\bempower\b/i, name: 'empower' },
  { pattern: /\breach out\b/i, name: 'reach out' },
  { pattern: /\bsynergy\b/i, name: 'synergy' },
  { pattern: /\becosystem\b/i, name: 'ecosystem (when vague)' },
  { pattern: /\btransformation\b/i, name: 'transformation' },
  { pattern: /\bhope you'?re well\b/i, name: 'hope you are well' },
  { pattern: /\bquick (question|favor)\b/i, name: 'quick question/favor' },
  { pattern: /\bpicking your brain\b/i, name: 'picking your brain' },
  { pattern: /\bper my (last|previous) email\b/i, name: 'per my last email' },
  { pattern: /\bcircling back\b/i, name: 'circling back' }
];

function readInput() {
  const fileIdx = process.argv.indexOf('--file');
  if (fileIdx >= 0 && process.argv[fileIdx + 1]) {
    return fs.readFileSync(process.argv[fileIdx + 1], 'utf8');
  }
  return fs.readFileSync(0, 'utf8');
}

function countSpecifics(text) {
  // Numbers (excluding small standalone)
  const numbers = (text.match(/\b\$?\d{2,}(?:[,.\d]*)?[KMB]?\b/g) || []).length;
  // Dates / years
  const dates = (text.match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(?:uary|ruary|ch|il|e|y|ust|tember|ober|ember)?\s+\d{1,4}\b|\b\d{4}\b|\bQ[1-4]\b/g) || []).length;
  // Proper nouns (cap word in middle of sentence, very rough)
  const propers = (text.match(/(?<=\s|^)[A-Z][a-z]{2,}/g) || []).length;
  // Currency
  const currency = (text.match(/\b(USD|AED|EUR|GBP|INR)\b/g) || []).length;
  return { numbers, dates, propers, currency, total: numbers + dates + Math.min(propers, 5) + currency };
}

const text = readInput();
const wordCount = (text.trim().split(/\s+/) || []).length;

const hits = ANTI_PATTERNS.filter((p) => p.pattern.test(text));
const specifics = countSpecifics(text);

let verdict = 'pass';
const defects = [];

if (hits.length > 2) {
  verdict = 'fail';
  defects.push({ severity: 'major', what: `${hits.length} anti-patterns detected`, where: hits.map((h) => h.name).join(', ') });
} else if (hits.length > 0) {
  verdict = 'conditional pass';
  defects.push({ severity: 'minor', what: `${hits.length} anti-pattern(s) survive`, where: hits.map((h) => h.name).join(', ') });
}

if (wordCount > 200 && specifics.total < 4) {
  verdict = 'fail';
  defects.push({ severity: 'major', what: `lived specificity too low (${specifics.total}, need ≥4 on ${wordCount}-word piece)`, where: '' });
}

const result = {
  verdict,
  task_class: 'content',
  word_count: wordCount,
  anti_pattern_hits: hits.map((h) => h.name),
  lived_specificity: specifics,
  defects,
  evidence: [
    { source: 'anti-pattern scan', observation: `${hits.length} of ${ANTI_PATTERNS.length} patterns matched` },
    { source: 'specificity counter', observation: `${specifics.total} concrete proofs in ${wordCount} words` }
  ],
  re_verify_command: 'node scripts/verify/verify-content.js --file <path>',
  confidence: 'high'
};

console.log(JSON.stringify(result, null, 2));
process.exit(verdict === 'fail' ? 1 : 0);
