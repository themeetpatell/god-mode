---
name: procedural-memory
description: Detects recurring workflow patterns across episodes (same sequence of skills/agents used 3+ times for similar goals) and drafts new skill files as candidate automations. Skills built bottom-up from observed patterns instead of top-down from imagined ones. Backed by scripts/pattern-detect.js scanning episodic-memory.
---

# Procedural Memory

If the system has watched you decompose "launch a content piece" the same way 5 times, it should offer to package it as a skill. That's procedural memory — patterns you didn't ask for, surfaced because they're true.

## When to use

- Weekly review of past episodes to detect repeating patterns
- After any episode tagged `repeat` or where the user said "we do this all the time"
- On demand: "find me the workflow patterns from the last month"

## What counts as a pattern

A pattern is a sequence of (phase, skill_used, agent_routed) that recurs across N (default: 3) episodes for goals with similar tags or semantic embedding.

Examples that are real patterns:
- "Content piece" → research → draft → voice-check → distribution-plan, observed 5 times
- "Bug investigation" → repro → trace → fix-sketch → tests → ship, observed 4 times
- "Customer call followup" → meeting-insights → summary → CRM update → next-step email, observed 6 times

What doesn't count:
- Coincidental sequences across unrelated goals
- Patterns observed once or twice
- Patterns where the steps are too generic (every session does Intake → Roadmap)

## The detection algorithm

`scripts/pattern-detect.js` does:

1. Load all episodes from `~/.themeetpatel/episodes/`
2. Cluster by tag overlap + embedding similarity (cosine > 0.6)
3. Within each cluster, extract the phase-by-phase signature
4. Find N-gram subsequences that appear in ≥ 3 episodes within the cluster
5. Score each pattern: (frequency × cluster_size × goal_variation_within_cluster)
6. Report top patterns + suggested skill names

## CLI

```bash
node scripts/pattern-detect.js                       # last 30 days
node scripts/pattern-detect.js --since 2026-01-01
node scripts/pattern-detect.js --min-frequency 5
node scripts/pattern-detect.js --suggest             # drafts SKILL.md candidates
```

## Output contract

```
═══ PATTERN DETECTION ═══
Episodes analyzed: <n>  Period: <range>

PATTERNS DETECTED:
P1: <cluster topic>  (n=5 episodes)
  Signature: research → draft → voice-check → distribution-plan
  Goal variations: "LinkedIn launch", "newsletter announcement", "thread on roadmap"
  Suggested skill: `launch-content-piece`
  Suggested triggers: when user mentions "launch", "announce", "publish"

P2: <cluster topic>  (n=4 episodes)
  ...

NEW SKILL DRAFTS:
- skills/launch-content-piece/SKILL.md  (draft, awaiting your edit)
- skills/customer-call-followup/SKILL.md (draft)

REVIEW: open the draft files, edit, and commit.
```

## Anti-patterns

- ❌ Suggesting a new skill for a 1- or 2-instance pattern (false positives)
- ❌ Suggesting skills that overlap with existing skills (check against `skills/`)
- ❌ Drafting skills with no example
- ❌ Auto-committing drafts without user review (the system suggests, the user accepts)

## Integration

When run weekly via a watcher, this skill surfaces the new patterns in the user's Monday brief:

```
"3 patterns detected last week. Want me to draft skill files for the top one?"
```

User says yes → drafts go to `skills/_drafts/` for review.

## Verification

The verifier (class: ops) will:
1. Confirm each detected pattern has ≥ N episodes backing it.
2. Confirm suggested skill names don't collide with existing skills.
3. Confirm drafts go to `_drafts/`, not directly to `skills/`.
