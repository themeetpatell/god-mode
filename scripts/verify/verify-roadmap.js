#!/usr/bin/env node
/**
 * themeetpatel · verify-roadmap.js
 *
 * Runs the verifier protocol for class: roadmap.
 *
 * Input: a roadmap text block (stdin or --file), in the God Mode format:
 *
 *   GOAL: ...
 *   Phase 1: <name>            [parallel|sequential]
 *     T1.1  <task>                  → MODEL  | est: <tokens>
 *     T1.2  <task>                  → MODEL  | est: <tokens>
 *   Phase 2: ...
 *   DEPENDENCIES: ...
 *   EST. TOTAL TOKENS: ...
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

// Parse phases and tasks
const phases = [];
let current = null;
for (const line of lines) {
  const phaseMatch = line.match(/^Phase\s+(\d+):\s*(.+?)\s*(\[(parallel|sequential)\])?\s*$/i);
  if (phaseMatch) {
    current = { num: parseInt(phaseMatch[1], 10), name: phaseMatch[2].trim(), mode: phaseMatch[4] || 'unspecified', tasks: [] };
    phases.push(current);
    continue;
  }
  const taskMatch = line.match(/^\s*T(\d+)\.(\d+)\s+(.+?)\s*(→\s*(\w+))?\s*(\|\s*est:\s*([^\s|]+))?\s*(\|\s*needs:\s*(.+))?\s*$/i);
  if (taskMatch && current) {
    current.tasks.push({
      id: `T${taskMatch[1]}.${taskMatch[2]}`,
      title: taskMatch[3].trim(),
      model: taskMatch[5] || null,
      est: taskMatch[7] || null,
      needs: taskMatch[9] ? taskMatch[9].split(',').map((s) => s.trim()) : []
    });
  }
}

if (phases.length === 0) {
  defects.push({ severity: 'critical', what: 'no phases parsed', where: 'roadmap' });
} else {
  evidence.push({ source: 'parse', observation: `${phases.length} phases, ${phases.reduce((a, p) => a + p.tasks.length, 0)} tasks` });
}

// Atomicity check: every phase 2-5 tasks
for (const p of phases) {
  if (p.tasks.length < 2) defects.push({ severity: 'minor', what: `Phase ${p.num} has only ${p.tasks.length} task(s) — under-decomposed`, where: p.name });
  if (p.tasks.length > 5) defects.push({ severity: 'minor', what: `Phase ${p.num} has ${p.tasks.length} tasks — over-decomposed`, where: p.name });
}

// Every task has a model
const allTasks = phases.flatMap((p) => p.tasks);
const noModel = allTasks.filter((t) => !t.model);
if (noModel.length > 0) {
  defects.push({ severity: 'major', what: `${noModel.length} task(s) lack a routing label`, where: noModel.map((t) => t.id).join(', ') });
}

// Every task has an estimate
const noEst = allTasks.filter((t) => !t.est);
if (noEst.length > 0) {
  defects.push({ severity: 'minor', what: `${noEst.length} task(s) lack a token estimate`, where: noEst.map((t) => t.id).join(', ') });
}

// DAG: no cyclic dependencies
const taskIds = new Set(allTasks.map((t) => t.id));
const phantomDeps = [];
for (const t of allTasks) {
  for (const dep of t.needs) {
    if (dep === '—' || dep === '-' || dep === '') continue;
    if (!dep.includes('*') && !taskIds.has(dep)) phantomDeps.push({ task: t.id, dep });
  }
}
if (phantomDeps.length > 0) {
  defects.push({ severity: 'major', what: `${phantomDeps.length} dependencies reference non-existent tasks`, where: phantomDeps.map((p) => `${p.task} → ${p.dep}`).join(', ') });
}

// Cycle detection (kahn's algo)
const indegree = new Map(allTasks.map((t) => [t.id, 0]));
const graph = new Map(allTasks.map((t) => [t.id, []]));
for (const t of allTasks) {
  for (const dep of t.needs) {
    if (taskIds.has(dep)) {
      indegree.set(t.id, indegree.get(t.id) + 1);
      graph.get(dep).push(t.id);
    }
  }
}
const queue = [...indegree.entries()].filter(([, d]) => d === 0).map(([id]) => id);
let visited = 0;
while (queue.length > 0) {
  const id = queue.shift();
  visited += 1;
  for (const next of graph.get(id) || []) {
    indegree.set(next, indegree.get(next) - 1);
    if (indegree.get(next) === 0) queue.push(next);
  }
}
if (visited !== allTasks.length) {
  defects.push({ severity: 'critical', what: 'dependency cycle detected', where: 'roadmap DAG' });
}

// Total token estimate present?
if (!/EST\.?\s*TOTAL\s*(OUTPUT\s*)?TOKENS/i.test(text)) {
  defects.push({ severity: 'minor', what: 'no total token estimate', where: 'footer' });
}

// Goal present?
if (!/^GOAL:/im.test(text)) {
  defects.push({ severity: 'major', what: 'no GOAL line', where: 'header' });
}

const criticals = defects.filter((d) => d.severity === 'critical').length;
const majors = defects.filter((d) => d.severity === 'major').length;
const verdict = criticals > 0 ? 'fail' : (majors > 0 ? 'conditional pass' : 'pass');

const result = {
  verdict,
  task_class: 'roadmap',
  phases: phases.length,
  tasks: allTasks.length,
  defects,
  evidence,
  re_verify_command: 'node scripts/verify/verify-roadmap.js --file <path>',
  confidence: 'high'
};

console.log(JSON.stringify(result, null, 2));
process.exit(verdict === 'fail' ? 1 : 0);
