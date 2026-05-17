---
name: argument-strength-scorer
description: After any deliverable that makes a recommendation, scores its own argument 1-10 on "would a smart skeptic be convinced?" Forces the system to be honest about how strong its own case actually is. Surfaces weak arguments BEFORE the user sends them to skeptics.
---

# Argument Strength Scorer

The system is too easy on itself. This skill makes it grade its own work the way a skeptical reviewer would.

## When to use

- After any strategy / decision / recommendation deliverable
- Before sending external-facing arguments (investor, customer, board)
- Before locking in a tree-of-thought decision
- When the user is about to act on the system's recommendation

## When NOT to use

- Factual reporting (there's no argument to score)
- Code (the code either works or doesn't — different bar)
- Pure summary of someone else's argument

## The 10-axis scoring

For each axis, score 0-10. Total is weighted-mean.

| Axis | Weight | High-score signal |
|---|---|---|
| **Evidence quality** | 0.15 | A-tier sources, recent, primary |
| **Evidence quantity** | 0.10 | Enough sample/coverage, not 1-off |
| **Logical coherence** | 0.15 | Conclusion follows from premises without leaps |
| **Counter-argument addressed** | 0.15 | Strongest opposing view named + refuted |
| **Falsifiability** | 0.10 | What would prove this wrong is stated |
| **Specificity** | 0.10 | Concrete numbers/names/dates, not abstractions |
| **Source independence** | 0.05 | Multiple unrelated sources, not echo chamber |
| **Recency** | 0.05 | Sources match topic's pace of change |
| **Author bias acknowledged** | 0.10 | Where the writer has skin in the game is named |
| **Cost-of-being-wrong acknowledged** | 0.05 | Asymmetric outcomes named |

## Output contract

```
═══ ARGUMENT STRENGTH SCORE ═══
Deliverable: <name>
Argument: <one sentence restatement>

PER-AXIS SCORES:
  Evidence quality:               7/10  (mostly A/B-tier sources, 1 weak)
  Evidence quantity:              6/10  (3 sources; would want 5+ for this stakes)
  Logical coherence:              9/10  (clean chain from data to conclusion)
  Counter-argument addressed:     4/10  (opposing view named in one line, not refuted)
  Falsifiability:                 8/10  ("wrong if our SMB conversion stays flat in 30d")
  Specificity:                    9/10  (5 specific numbers, 2 named customers)
  Source independence:            5/10  (2 of 3 sources are Anthropic-published)
  Recency:                        9/10  (all 2026 sources for a 2026 topic)
  Author bias acknowledged:       3/10  ("we have a stake here" not stated)
  Cost-of-being-wrong:            7/10  (loss scenario named, magnitude vague)

WEIGHTED MEAN: 6.7 / 10  →  MODERATELY STRONG

CRITIQUE A SKEPTIC WOULD MAKE:
"Your counter-argument is named in one sentence and not engaged with. Your sources are 2/3 Anthropic-published — a skeptic would call that an echo chamber on this topic. And you don't disclose that the writer (you) benefits from this conclusion."

RECOMMENDED IMPROVEMENTS (ranked):
1. Add a real refutation of the counter-argument (15 min, lifts score to ~7.4)
2. Find one independent source supporting the claim (30 min, lifts source-independence)
3. Add a 2-sentence "where I'm biased here" disclosure (5 min, lifts author-bias)

DO YOU WANT TO:
A. Ship as-is (acceptable for low-stakes audience)
B. Spend 20 min on the top 2 improvements
C. Spend 60 min on all three
```

## Anti-patterns

- ❌ Always scoring 8+ (defensive grading)
- ❌ Scoring without naming what would lift each axis
- ❌ Ignoring author bias because "the writer is the system"
- ❌ Pretending counter-arguments don't exist
- ❌ Skipping this skill on weak arguments because the result will be uncomfortable

## The 6/10 floor

Recommendations with weighted-mean < 6.0 don't ship to external audiences without explicit user override. Internal use OK with a "weak argument flag." Public/investor/board use requires improvement first.

## Integration

- Runs after the negative-space-scanner
- Output feeds into the exec summary line "ARGUMENT STRENGTH: <score>"
- If score < 6, the synthesizer flags the deliverable for revision

## Verification

The verifier (class: strategy + content) will:
1. Confirm all 10 axes were scored.
2. Confirm low scores have improvement actions.
3. Confirm score < 6 was surfaced to the user, not buried.

## Routing

- **Sonnet** for the per-axis scoring (judgment-heavy)
- **Opus** when the argument is investor / board / regulatory
- **Haiku** only for the formatting of the report
