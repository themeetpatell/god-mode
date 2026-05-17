#!/usr/bin/env node
/**
 * themeetpatel · verify-research.js
 *
 * Runs the verifier protocol for class: research.
 *
 * Inputs (stdin or --file): a research brief in any format. We scan for:
 *   - Citation density (URLs / source markers per claim-y sentence)
 *   - Source tier balance (A/B/C/D based on heuristics)
 *   - Presence of required sections: "WHAT WOULD MAKE THIS WRONG", "GAPS", "SOURCES"
 *   - Recency (any year >2 years old without date is suspicious)
 *   - Hedging-heavy sentences (red flag for vagueness)
 *
 * Output: JSON verdict.
 */

const fs = require('fs');

function readInput() {
  const idx = process.argv.indexOf('--file');
  if (idx >= 0 && process.argv[idx + 1]) return fs.readFileSync(process.argv[idx + 1], 'utf8');
  return fs.readFileSync(0, 'utf8');
}

const text = readInput();
const lines = text.split('\n');
const defects = [];
const evidence = [];

// 1) Source extraction (URLs + [bracketed] cites)
const urls = text.match(/https?:\/\/[^\s)]+/g) || [];
const bracketCites = text.match(/\[[^\]]+\]/g) || [];
const totalCites = urls.length + bracketCites.length;
evidence.push({ source: 'citation count', observation: `${urls.length} URLs, ${bracketCites.length} bracketed cites = ${totalCites} total` });

// 2) Source tier heuristic
const tiers = { A: 0, B: 0, C: 0, D: 0, unknown: 0 };
const A_HOSTS = ['sec.gov', 'gov.', 'ftc.gov', 'fda.gov', 'who.int', 'oecd.org', 'imf.org', 'worldbank.org', 'eurostat'];
const B_HOSTS = ['nytimes.com', 'wsj.com', 'ft.com', 'reuters.com', 'bloomberg.com', 'economist.com'];
const C_HOSTS = ['gartner.com', 'forrester.com', 'idc.com'];
const D_HOSTS = ['medium.com', 'substack.com', 'reddit.com', 'twitter.com', 'x.com'];

for (const url of urls) {
  const host = (url.match(/https?:\/\/(?:www\.)?([^/]+)/) || [])[1] || '';
  if (A_HOSTS.some((h) => host.includes(h))) tiers.A++;
  else if (B_HOSTS.some((h) => host.includes(h))) tiers.B++;
  else if (C_HOSTS.some((h) => host.includes(h))) tiers.C++;
  else if (D_HOSTS.some((h) => host.includes(h))) tiers.D++;
  else tiers.unknown++;
}
evidence.push({ source: 'tier classifier', observation: `A:${tiers.A} B:${tiers.B} C:${tiers.C} D:${tiers.D} unknown:${tiers.unknown}` });

const totalKnown = tiers.A + tiers.B + tiers.C + tiers.D;
const ABRatio = totalKnown > 0 ? (tiers.A + tiers.B) / totalKnown : 0;
if (totalKnown > 0 && ABRatio < 0.5) {
  defects.push({ severity: 'major', what: `source mix C/D-heavy (A+B = ${(ABRatio * 100).toFixed(0)}% of classifiable sources)`, where: 'citations' });
}

// 3) Required sections
const requiredSections = [
  { name: 'WHAT WOULD MAKE THIS WRONG', regex: /what would make this wrong/i, severity: 'major' },
  { name: 'GAPS / UNCERTAINTIES', regex: /(gaps|uncertainties|key unknowns)/i, severity: 'minor' },
  { name: 'SOURCES / SOURCE MAP', regex: /(sources|source map|references)/i, severity: 'minor' }
];
for (const s of requiredSections) {
  if (!s.regex.test(text)) {
    defects.push({ severity: s.severity, what: `missing section: ${s.name}`, where: 'brief structure' });
  }
}

// 4) Claim density: sentences that look like factual claims vs cites
const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.length > 20);
const factualLooking = sentences.filter((s) => /\d|\bis the\b|\bare the\b|\b(growth|market|share|users|customers)\b/i.test(s));
const claimToCiteRatio = totalCites === 0 ? Infinity : factualLooking.length / Math.max(1, totalCites);
evidence.push({ source: 'claim density', observation: `${factualLooking.length} claim-like sentences, ${totalCites} cites, ratio ${claimToCiteRatio.toFixed(1)} claims/cite` });
if (claimToCiteRatio > 4 && factualLooking.length > 5) {
  defects.push({ severity: 'major', what: `low citation density (${claimToCiteRatio.toFixed(1)} claims per cite — target ≤ 3)`, where: 'brief body' });
}

// 5) Recency hint: bare year mentions <2024 without date context
const oldYears = text.match(/\b(20(?:1[0-9]|2[0-3]))\b/g) || [];
if (oldYears.length > 0 && !/\b(historic|since|founded|established|launched in)\b/i.test(text)) {
  defects.push({ severity: 'minor', what: `${oldYears.length} pre-2024 year mention(s) without recency context`, where: oldYears.slice(0, 3).join(', ') });
}

// 6) Hedge density (vagueness signal)
const hedges = (text.match(/\b(might|may|could|generally|typically|often|sometimes|in general|broadly)\b/gi) || []).length;
if (hedges > sentences.length * 0.4 && sentences.length > 10) {
  defects.push({ severity: 'minor', what: `hedge-heavy (${hedges} hedges in ${sentences.length} sentences) — distinguish facts from inferences`, where: 'tone' });
}

const criticals = defects.filter((d) => d.severity === 'critical').length;
const majors = defects.filter((d) => d.severity === 'major').length;
const verdict = criticals > 0 ? 'fail' : (majors > 0 ? 'conditional pass' : 'pass');

const result = {
  verdict,
  task_class: 'research',
  citation_count: totalCites,
  source_tiers: tiers,
  claim_to_cite_ratio: Number(claimToCiteRatio.toFixed(2)),
  defects,
  evidence,
  re_verify_command: 'node scripts/verify/verify-research.js --file <path>',
  confidence: totalCites >= 5 ? 'high' : 'medium'
};

console.log(JSON.stringify(result, null, 2));
process.exit(verdict === 'fail' ? 1 : 0);
