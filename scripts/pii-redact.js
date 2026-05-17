#!/usr/bin/env node
/**
 * themeetpatel · pii-redact.js
 *
 * Redacts PII from text — used by the audit log, the ledger, and any deliverable
 * the user marks as "external-share." Patterns are conservative; better to over-redact
 * than to leak.
 *
 * Usage:
 *   echo "Contact meet@finanshels.com or call +971501234567" | node scripts/pii-redact.js
 *   node scripts/pii-redact.js --file path/to/file.md
 *   node scripts/pii-redact.js --strict --file path/to/file.md
 */

const fs = require('fs');

const PATTERNS = [
  { name: 'email', re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, replace: '[REDACTED-EMAIL]' },
  { name: 'phone-intl', re: /\+?\d{1,3}[\s-]?\(?\d{1,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}/g, replace: '[REDACTED-PHONE]' },
  { name: 'ssn-us', re: /\b\d{3}-\d{2}-\d{4}\b/g, replace: '[REDACTED-SSN]' },
  { name: 'credit-card', re: /\b(?:\d[ -]*?){13,16}\b/g, replace: '[REDACTED-CC]' },
  { name: 'aws-key', re: /\bAKIA[0-9A-Z]{16}\b/g, replace: '[REDACTED-AWS-KEY]' },
  { name: 'anthropic-key', re: /\bsk-ant-[A-Za-z0-9_-]{20,}/g, replace: '[REDACTED-ANTHROPIC-KEY]' },
  { name: 'openai-key', re: /\bsk-(proj-)?[A-Za-z0-9_-]{20,}/g, replace: '[REDACTED-OPENAI-KEY]' },
  { name: 'github-token', re: /\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36}\b/g, replace: '[REDACTED-GITHUB-TOKEN]' },
  { name: 'jwt', re: /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, replace: '[REDACTED-JWT]' },
  { name: 'private-key-block', re: /-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+PRIVATE KEY-----/g, replace: '[REDACTED-PRIVATE-KEY]' },
  { name: 'iban', re: /\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}\b/g, replace: '[REDACTED-IBAN]' },
  { name: 'uuid', re: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/g, replace: '[REDACTED-UUID]' }
];

const STRICT_PATTERNS = [
  // Strict mode also redacts: street addresses (rough), DOBs, IP addresses
  { name: 'ipv4', re: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, replace: '[REDACTED-IP]' },
  { name: 'dob-iso', re: /\b\d{4}-\d{2}-\d{2}\b/g, replace: '[REDACTED-DATE]' }
];

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };

function redact(text, strict = false) {
  let out = text;
  const hits = {};
  const patterns = strict ? [...PATTERNS, ...STRICT_PATTERNS] : PATTERNS;
  for (const p of patterns) {
    const matches = out.match(p.re) || [];
    if (matches.length > 0) hits[p.name] = matches.length;
    out = out.replace(p.re, p.replace);
  }
  return { redacted: out, hits };
}

let input = '';
const file = val('--file');
if (file) input = fs.readFileSync(file, 'utf8');
else input = fs.readFileSync(0, 'utf8');

const { redacted, hits } = redact(input, flag('--strict'));

if (flag('--report-only')) {
  console.log(JSON.stringify({ file: file || 'stdin', hits, total: Object.values(hits).reduce((a, b) => a + b, 0) }, null, 2));
} else {
  console.log(redacted);
  if (Object.keys(hits).length > 0) {
    console.error('\n[pii-redact] hits: ' + JSON.stringify(hits));
  }
}
