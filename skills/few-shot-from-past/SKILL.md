---
name: few-shot-from-past
description: Use during Phase 1 (Intake) and Phase 4 (Delegate) to retrieve and inject 2-3 examples from past episodes most similar to the current task. Sharpens worker output without retraining and gives the CEO concrete prior art. Backed by episodic-memory's search.
---

# Few-Shot from Past

The system knows what worked before. Use it.

## When to use

- During Phase 1, fold prior similar episodes into goal framing
- During Phase 4 (per-worker brief), inject the closest 2-3 past examples
- When a user explicitly says "do this like we did last time"
- When the CEO is uncertain about a workflow and wants to anchor on a successful run

## When NOT to use

- First session in a domain (no past to draw from)
- Goal that's genuinely novel (forcing few-shot from unrelated past would mislead)
- Tasks where prior output would constrain creativity (brand work, fresh strategy)

## The retrieval

```js
// pseudocode used by the CEO + context-curator
const examples = episodicMemory.search(currentGoal, { top: 3, minScore: 0.6 });
const usable = examples
  .filter(e => e.verifier_verdicts has any 'pass')   // only learn from passes
  .map(e => extractKeyArtifact(e));
```

If fewer than 2 examples meet the score threshold, no few-shot — better to start fresh than to anchor on weak match.

## What gets injected into the worker brief

For each selected example:

```
PRIOR EXAMPLE E<n> (similarity: 0.74, ep-abc, 2026-04-12)
GOAL THEN: <one sentence>
DELIVERABLE EXCERPT: <100-300 tokens of the best part>
WHAT WORKED: <one line from the verifier verdict>
WHAT TO MIRROR: <specific element to carry over>
WHAT TO CHANGE: <what's different this time>
```

This is more than "here's an old example" — it's a curated lesson + a delta from the new goal.

## CEO integration

Phase 1 example:
> "Working on this. I found 2 past episodes (ep-abc, ep-def) where you did something similar. Both succeeded. I'll mirror their structure unless you want a different approach."

Phase 4 example:
> "Worker T2.1 (write the hero section): I'm giving you example ep-abc's hero section as a reference for tone + length. Mirror the structure, change the specifics for the new product."

## Anti-patterns

- ❌ Injecting more than 3 examples (the worker drowns)
- ❌ Injecting failed examples without explicit "what NOT to do" framing
- ❌ Forcing few-shot on a genuinely new task
- ❌ Mirroring the example so closely that the new output is a copy
- ❌ Stale examples (>1 year old for fast-moving domains)

## Verification

The verifier (class: ops) will:
1. Confirm examples used were tagged with verifier pass.
2. Confirm the worker output isn't a near-duplicate of the example.
3. Confirm the "WHAT TO CHANGE" delta is real.

## Routing

- **Haiku** for the retrieval + example extraction
- The actual worker keeps its normal routing — few-shot is an input enhancement, not a re-routing
