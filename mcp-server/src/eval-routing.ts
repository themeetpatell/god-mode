#!/usr/bin/env tsx
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { routeTask } from "./router.js";

const evalPath = join(process.cwd(), "..", "evals", "routing-eval.jsonl");
const raw = await readFile(evalPath, "utf8");
const rows: Array<{ task: string; expected: string; reason?: string; adversarial?: boolean }> =
  raw.trim().split("\n").filter(Boolean).map((line) => JSON.parse(line));

const buckets: Record<string, { n: number; hit: number; miss: typeof rows }> = {
  "haiku-4.5": { n: 0, hit: 0, miss: [] },
  "sonnet-4.6": { n: 0, hit: 0, miss: [] },
  "opus-4.7": { n: 0, hit: 0, miss: [] }
};
let totalHit = 0;
let advTotal = 0;
let advHit = 0;
const verbose = process.env.VERBOSE === "1";

for (const row of rows) {
  const decision = routeTask({ task: row.task });
  const ok = decision.model === row.expected;
  const b = buckets[row.expected] || (buckets[row.expected] = { n: 0, hit: 0, miss: [] });
  b.n += 1;
  if (row.adversarial) advTotal += 1;
  if (ok) {
    b.hit += 1;
    totalHit += 1;
    if (row.adversarial) advHit += 1;
    if (verbose) console.log(`✓ ${row.task}`);
  } else {
    b.miss.push(row);
    console.log(`✗ ${row.adversarial ? "[ADV] " : ""}${row.task}\n    expected ${row.expected}, got ${decision.model}\n    rationale: ${decision.rationale}`);
  }
}

console.log("\n=== STRATIFIED ACCURACY ===");
for (const [k, b] of Object.entries(buckets)) {
  if (b.n === 0) continue;
  console.log(`${k.padEnd(12)} ${b.hit}/${b.n}  (${((b.hit / b.n) * 100).toFixed(1)}%)`);
}
const overall = totalHit / rows.length;
const advPct = advTotal === 0 ? 1 : advHit / advTotal;
console.log(`\nOVERALL:     ${totalHit}/${rows.length}  (${(overall * 100).toFixed(1)}%)`);
console.log(`ADVERSARIAL: ${advHit}/${advTotal}  (${(advPct * 100).toFixed(1)}%)`);

const gateOverall = 0.85;
const gateAdv = 0.7;
const overallPass = overall >= gateOverall;
const advPass = advPct >= gateAdv;
console.log(`\nGates: overall ≥ ${gateOverall * 100}% (${overallPass ? "✓" : "✗"}), adversarial ≥ ${gateAdv * 100}% (${advPass ? "✓" : "✗"})`);

process.exit(overallPass && advPass ? 0 : 1);
