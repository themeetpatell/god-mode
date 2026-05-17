#!/usr/bin/env node
/**
 * themeetpatel · hallucination-scorer.js
 *
 * Scans a text deliverable for unsupported factual claims and scores
 * "hallucination risk." Different from the verifier (which checks code/structure):
 * this checks "did the LLM invent facts."
 *
 * Heuristic v1.4 (no external model required):
 *   - Extract numeric claims (percentages, dollar amounts, counts)
 *   - Extract named-entity-like proper nouns
 *   - Check whether they appear ANYWHERE in the sources cited in the doc
 *     (URLs, file:line refs, [src: ...] tags from provenance-chain)
 *   - Flag any numeric/named claim that has no source
 *
 * v1.5: actually fetch URLs and check.
 * v1.6: separate model invocation for cross-check.
 *
 * Usage:
 *   echo "<text>" | node scripts/hallucination-scorer.js
 *   node scripts/hallucination-scorer.js --file path/to/brief.md
 */

const fs = require('fs');

const args = process.argv.slice(2);
const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };

const text = val('--file') ? fs.readFileSync(val('--file'), 'utf8') : fs.readFileSync(0, 'utf8');

// Extract claims
const numericClaims = text.match(/\b(?:\$|AED |USD |€|£)?[\d,]+(?:\.\d+)?(?:[KMB]|%|x)?\b/g) || [];
const namedEntities = text.match(/\b(?:[A-Z][a-z]+ )+(?:Inc|LLC|Ltd|Corp|GmbH|Pty)?\b/g) || [];
// Lots of stuff matches that aren't entities; cap to multi-word capitalized
const realEntities = namedEntities.filter((e) => e.split(' ').length >= 2 && !/^The /.test(e));

// Extract sources cited
const urls = text.match(/https?:\/\/[^\s)]+/g) || [];
const fileRefs = text.match(/\[src:\s*[^\]]+\]/g) || [];
const inferenceTags = text.match(/\[inferred[^\]]*\]/g) || [];

// "Source context" = everything between source tags + URLs themselves
const sourceContext = [...urls, ...fileRefs].join(' ').toLowerCase();

const unsupportedNumeric = numericClaims.filter((c) => {
  // is this number mentioned in source context? if not, it's at risk
  // (very rough — real version would fetch URLs)
  const clean = c.replace(/[\$,€£%xKMB]| /gi, '');
  if (!clean || clean.length < 2) return false;
  return !sourceContext.includes(clean);
});

const unsupportedEntities = realEntities.filter((e) => !sourceContext.includes(e.toLowerCase()));

const totalClaims = numericClaims.length + realEntities.length;
const totalUnsupported = unsupportedNumeric.length + unsupportedEntities.length;
const risk = totalClaims > 0 ? (totalUnsupported / totalClaims) : 0;

let verdict;
if (risk > 0.5) verdict = 'high-risk';
else if (risk > 0.25) verdict = 'medium-risk';
else if (risk > 0.1) verdict = 'low-risk';
else verdict = 'minimal-risk';

const out = {
  verdict,
  risk_score: Number(risk.toFixed(3)),
  total_claims: totalClaims,
  numeric_claims: numericClaims.length,
  named_entities: realEntities.length,
  unsupported_numeric: unsupportedNumeric.slice(0, 10),
  unsupported_entities: unsupportedEntities.slice(0, 10),
  sources_cited: { urls: urls.length, file_refs: fileRefs.length },
  inference_tags: inferenceTags.length,
  notes: [
    'v1.4 heuristic — does not fetch URLs',
    'Best paired with provenance-chain skill',
    'For high-stakes content, run a real model cross-check (v1.6)'
  ]
};

console.log(JSON.stringify(out, null, 2));
process.exit(risk > 0.5 ? 1 : 0);
