---
name: why-now-detector
description: Use during Phase 1 (Intake) to ask the user the question they didn't think to answer — "what changed this week that made this goal urgent?" The answer reshapes the roadmap. Most goals have an unspoken trigger; surfacing it produces sharper plans.
---

# Why-Now Detector

A goal without a trigger is a wishlist. A goal with a known trigger has a deadline, a constraint, and a clarity that improves everything downstream.

## When to use

- Phase 1 (Intake) of any non-trivial goal
- When the user's goal is vague ("clean up our pricing")
- When the goal is recurring ("update the deck again")
- When the goal has been stated before but never executed

## When NOT to use

- Truly trivial single-step asks
- Goals with an obvious trigger named in the prompt ("we have a board meeting Tuesday")
- Pair-programming mode (interrupts flow)

## The question

```
Before we build the roadmap, one quick question:

What changed this week (or recently) that made this the goal NOW vs last month?

Options:
A. A deadline came into view (when?)
B. Something broke / went wrong (what?)
C. Customer / investor / team pressure (who?)
D. New information changed my mind (what?)
E. Nothing changed — this has been on the list and I'm finally doing it
F. (something else — tell me)
```

The answer reshapes the roadmap. Examples:

- "Board meeting Friday" → roadmap optimizes for slide-ready output, polish over depth
- "Customer churn last week" → roadmap prioritizes root cause, not redesign
- "Investor asked about it" → output is a brief for forwarding, not internal use
- "Finally getting to it" → no urgency, deeper exploration allowed

## What the answer changes

| Trigger | Roadmap shifts |
|---|---|
| Hard deadline | Phase count reduces; parallel execution preferred; cuts deferred-to-later |
| Failure trigger | Root-cause phase before any build phase; verifier extra strict |
| External pressure | Output formatted for forwarding; tone aware of audience |
| New info | Belief register write before roadmap; tree-of-thought if conflicting |
| No trigger | Standard roadmap; can spend extra time on quality |

## Logging

The trigger gets written to the episode's metadata. Over time, the user sees patterns: "you say 'finally getting to it' more for hiring than anything else" — actionable insight.

## Anti-patterns

- ❌ Asking why-now on every micro-task (only on real goals)
- ❌ Pretending the trigger doesn't matter
- ❌ Inserting why-now where the user has clearly signaled urgency
- ❌ Treating "no trigger" as a problem (it's a valid answer)

## Verification

The verifier (class: ops) will:
1. Confirm trigger was captured for non-trivial goals.
2. Confirm trigger influenced at least one roadmap decision (phase shape, model routing, output format).

## Routing

- **Haiku** — the question + response capture is mechanical
