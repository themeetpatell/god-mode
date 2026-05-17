---
name: hitl-checkpoint
description: Human-in-the-loop checkpoint primitive. Inserts an explicit "pause for human knowledge / approval / preference" point in any multi-task roadmap. Different from external-actions approval (which is action-level). HITL checkpoints are knowledge-level — the system needs the human's judgment or preference to choose the next branch.
---

# HITL Checkpoint

There's a category of pause that isn't "approve this action" — it's "tell me what you actually want here." This skill formalizes it.

## When to use

- Roadmap branch point where the user's preference matters (e.g., "should onboarding be email-first or in-app?")
- High-stakes ambiguity where the LLM can argue both sides
- Steps that depend on info the user has but the system doesn't (e.g., "what's your actual ACV?")
- Quality-vs-speed tradeoffs the user should make

## When NOT to use

- Anything that just needs an action approval (use `external-actions` instead)
- Anything that's a genuine LLM decision (use Opus + tree-of-thought)
- Anything inserted out of excessive caution (don't be a chatbot asking for confirmation every step)

## Checkpoint format

```
═══ CHECKPOINT C<n> — <topic> ═══

CONTEXT (3-5 lines):
<what we've done, why we're pausing here>

THE QUESTION:
<one specific question>

OPTIONS (pick one):
  A. <option>  → next phase if picked: <T2.1, T2.2, ...>
  B. <option>  → next phase if picked: <T2.3, T2.4>
  C. <option>  → next phase if picked: <T2.5>

YOUR DEFAULT (if you don't respond in 15 min):
  Will proceed with: <A | B | C>
  Why: <one sentence>

YOU CAN ALSO:
- Override the question entirely with new constraints
- Add a custom option (D)
- Skip the rest of the roadmap

REPLY WITH: A | B | C | D: <custom> | skip
```

## Checkpoint rules

| Rule | Why |
|---|---|
| ≤ 1 checkpoint per phase | More than that, the user is doing the planning |
| Checkpoint has a default → roadmap can proceed if user is away | Async safety |
| Default must be the most-likely-right choice, not "do nothing" | Don't punish user for not being at keyboard |
| Checkpoints are logged so the system learns user preferences over time | Build personalization data |
| User can mark a checkpoint as "this is my standing preference, don't ask again" | Reduce friction with use |

## Standing preferences

After 3+ instances of the user choosing the same option for a recurring checkpoint, the CEO offers:

```
"I notice you've picked email-first for onboarding 4 times. Should I make that your default and skip this checkpoint?"
```

If user says yes, the preference goes into `memory/default.json` under `facts.preferences.<topic>` and future checkpoints route to the saved choice automatically (with a one-line "using your saved preference" note).

## Integration

- CEO inserts checkpoints during Phase 2 (Roadmap) when planning surfaces ambiguity
- Self-critic flags missing checkpoints ("T2.1 assumes email-first onboarding; was that confirmed?")
- Verifier checks that checkpoint responses were captured before the dependent task ran

## Anti-patterns

- ❌ Checkpoints with > 4 options (cognitive overload — sharpen the question)
- ❌ "Are you sure?" checkpoints (don't infantilize)
- ❌ Open-ended free-form questions (the system can't act on prose)
- ❌ Checkpoints with no default (forces synchronous response, kills async value)
- ❌ Checkpoints whose default is "wait forever"

## Verification

The verifier (class: ops) will:
1. Confirm every checkpoint has 2-4 named options.
2. Confirm a default is set with one-line rationale.
3. Confirm logged user choices update standing preferences after N repeats.

## Routing

- **Sonnet** for designing the checkpoint (the question + options needs to be sharp)
- **Haiku** for the standard-form formatting once content is decided
