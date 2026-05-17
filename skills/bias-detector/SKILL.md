---
name: bias-detector
description: Use on strategy, content, and decision deliverables to flag loaded language, missing perspectives, single-source synthesis, and unstated framing assumptions. Different from content's anti-pattern detector (which targets AI-tells); this targets framing bias in reasoning and writing.
---

# Bias Detector

The point isn't to demand neutral writing — operators have opinions. The point is to flag when an opinion is being presented as if it were a fact, when one perspective is missing entirely, or when a single source is doing all the work.

## When to use

- Strategy documents (especially ones that influence hiring, firing, fundraising)
- Content that names competitors or third parties
- Decision docs where the writer is also the decider
- Internal comms with HR/legal sensitivity
- Investor or board materials

## Six bias categories

| Category | What it looks like | Example flag |
|---|---|---|
| **Loaded language** | Words that smuggle judgment | "Our 'innovative' approach beats their 'outdated' system" |
| **Missing perspective** | Decision presented without acknowledging the opposing view | "We should sunset X" without naming who depends on X |
| **Single-source synthesis** | A claim built on one source treated as the field consensus | "Pinecone is the standard" (cited only by Pinecone) |
| **Unstated framing** | Frame chosen without naming the choice | "Our churn problem" (assumes the cause is churn, not e.g., wrong-fit acquisition) |
| **Survivorship-only data** | Numbers that exclude failures | "All our users love it" (excluding the ones who churned) |
| **Sample bias** | Generalizing from a non-representative subset | "Our customers want X" (when "customers" = 3 friends in the same vertical) |

## Output contract

```
═══ BIAS SCAN ═══
File: <path>
Word count: <n>

CATEGORIES FOUND:
[loaded-language] line 14: "innovative" describing your product, "outdated" describing competitor
  → suggestion: name the specific capability difference, not the value judgment

[missing-perspective] section "Why we should pivot": no mention of what we'd lose
  → suggestion: add a 1-paragraph "what we'd give up" before the recommendation

[single-source] claim "Vector DBs are 5x faster than traditional search" — cited only Pinecone's blog
  → suggestion: corroborate with independent benchmark or weaken claim to "vendor-claimed"

OVERALL:
  Total flags: <n>
  Severity: low | medium | high
  Recommendation: ship | revise

RECOMMENDED REWRITES (specific):
  1. <quote from text> → <suggested replacement>
  2. ...
```

## Anti-patterns

- ❌ Flagging every opinion as bias (the operator is allowed to have a view)
- ❌ Demanding "balanced" rewrites that drain the writing of voice
- ❌ Flagging adjectives without context
- ❌ Suggesting passive voice as a fix (it's worse)
- ❌ Running bias scan on creative or persuasive copy where framing IS the point

## When to skip flagging

Some content WANTS framing. Sales copy, founder essays, founder content. The skill checks the deliverable's intent (from the goal) and downgrades flags for explicitly-persuasive work — surfacing them as "FYI: this is persuasive content; framing flag noted but not blocking."

## Routing

- **Sonnet default** — judgment + writing
- **Opus** only when the deliverable is high-stakes (board / public) and the writer wants thorough review

## Verification

The verifier (class: content + strategy) will:
1. Confirm flags include specific quotes from the text.
2. Confirm suggestions are concrete rewrites, not generic ("be more balanced").
3. Confirm persuasive content isn't drained of voice.
4. Confirm the scan honored the deliverable's stated intent.
