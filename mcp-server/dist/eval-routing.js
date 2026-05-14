#!/usr/bin/env tsx
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { routeTask } from "./router.js";
const evalPath = join(process.cwd(), "..", "evals", "routing-eval.jsonl");
const raw = await readFile(evalPath, "utf8");
const rows = raw.trim().split("\n").filter(Boolean).map((line) => JSON.parse(line));
let pass = 0;
for (const row of rows) {
    const decision = routeTask({ task: row.task });
    const ok = decision.model === row.expected;
    if (ok)
        pass += 1;
    console.log(`${ok ? "✓" : "✗"} ${row.task}\n  expected: ${row.expected}\n  actual:   ${decision.model}\n  reason:   ${decision.rationale}\n`);
}
const score = Math.round((pass / rows.length) * 100);
console.log(`Routing eval score: ${pass}/${rows.length} (${score}%)`);
process.exit(score >= 80 ? 0 : 1);
