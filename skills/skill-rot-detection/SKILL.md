---
name: skill-rot-detection
description: Surfaces skills that haven't loaded in N days as deprecation candidates. Different from agent-consolidation (which is structural); this is about actual usage. The system prunes itself instead of accumulating dead files.
---

# Skill Rot Detection

A plugin that grows forever and never sheds is a museum. This skill catches what's not being used.

## When to use

- Monthly (or quarterly) maintenance
- Before a release (don't ship dead skills)
- When new skills are proposed (check overlap with low-usage existing)
- After a pack install (catch newly-redundant local skills)

## What it reads

`~/.themeetpatel/skill-loads.jsonl` (populated by `scripts/skill-telemetry.js`)

## The decision matrix

For each skill in the registry:

| Days since last load | Verdict |
|---|---|
| < 30 days | active — keep |
| 30-60 days | quiet — review on next pass |
| 60-90 days | dormant — promote to deprecation queue |
| 90-180 days | rotting — propose deprecation in next release |
| > 180 days | dead — propose removal |

Override: any skill explicitly pinned (`pinned: true` in frontmatter — not a standard field yet, but reserved) skips decay.

## Output contract

```
═══ SKILL ROT REPORT ═══
Window: last 180 days
Skills total: <n>
Telemetry coverage: <%>  (skills with at least 1 load logged)

ACTIVE (loaded last 30d): <n>
QUIET (30-60d): <n>
DORMANT (60-90d): <n>
ROTTING (90-180d, propose deprecation): <n>
DEAD (>180d, propose removal): <n>
NEVER LOADED: <n>  (could be net-new or genuinely unused)

ROTTING — propose deprecation next release:
  - skills/<name>  (last loaded: <date>)  reason: not triggered in 4 months
  - skills/<name>  (last loaded: <date>)

DEAD — propose removal:
  - skills/<name>  (last loaded: <date>)  size: <lines>
  - skills/<name>

NEVER LOADED — investigate:
  - skills/<name>  (added: <date>, hasn't triggered)
    Possible reasons:
      • Description too narrow (progressive loading missing it)
      • Overlaps with another skill that wins
      • Net-new (give it 30 more days)

ACTIONS RECOMMENDED:
  1. Open PR removing <n> dead skills
  2. Add deprecation header to <n> rotting skills (CHANGELOG entry)
  3. Re-write description for <n> never-loaded skills (likely a trigger problem)
```

## Anti-patterns

- ❌ Removing skills without a deprecation cycle (users mid-prompt break)
- ❌ Removing pinned / explicitly-protected skills
- ❌ Removing core skills (model-router, verifier, etc.) regardless of telemetry
- ❌ Treating "never loaded" as automatically bad (some skills are insurance)
- ❌ Skipping the description-rewrite step for never-loaded (often the fix is just better triggering)

## Integration with agent-consolidation

This skill runs first; agent-consolidation reads its output. Skills marked DEAD become candidates for merge-into-agent (per the consolidation plan in docs/AGENT-CONSOLIDATION.md).

## Verification

The verifier (class: ops) will:
1. Confirm core skills are excluded from removal proposals.
2. Confirm dead-skill list has telemetry evidence.
3. Confirm never-loaded list has a "give it more time" gate for skills < 30 days old.
4. Confirm proposed actions include CHANGELOG entries for any removals.

## Routing

- **Haiku** — this is mostly aggregation + reporting
