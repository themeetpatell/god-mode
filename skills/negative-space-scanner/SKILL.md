---
name: negative-space-scanner
description: After a deliverable, surfaces what was NOT done that probably should have been. The thing every report omits. Cross-references the deliverable against past similar deliverables (episodic memory) + the skill's standard output contract to find missing sections, missing edge cases, missing follow-ups.
---

# Negative Space Scanner

The verifier checks what's there. This skill checks what's missing.

## When to use

- After any deliverable, before sending to the user
- After the synthesizer's final output
- Before publishing public-facing work
- Before an irreversible decision is acted on

## When NOT to use

- Drafts the user explicitly marked "minimum viable" (don't over-engineer)
- Conversational responses
- Speed-critical responses

## How it works

For each deliverable, compare against:

1. **Standard output contract** for the skill that produced it (every skill defines one in its frontmatter / SKILL.md)
2. **Past successful deliverables** of the same class (via episodic memory)
3. **Common omissions library** by class (e.g., code without tests, research without "what would make this wrong", strategy without "what won't we do")

Generate a list: what's typically present that's absent here.

## Output contract

```
═══ NEGATIVE SPACE SCAN ═══
Deliverable: <name>  Class: <code|research|content|strategy|...>
Reference: standard contract + N similar past deliverables

WHAT'S TYPICALLY PRESENT BUT MISSING HERE:
✗ Test plan section (present in 12/14 past code deliverables of this size)
✗ "What would make this wrong" section (standard for research deliverables)
✗ Rollback plan (standard for any production-touching code)

WHAT'S PRESENT BUT WEAKER THAN USUAL:
⚠ Source diversity: 3 sources cited (median is 7 for similar deliverables)
⚠ Specificity: 2 numbers in the brief (median is 6 for strategy briefs)

WHAT'S MISSING THAT'S NOT IN ANY CONTRACT BUT YOU OFTEN INCLUDE:
○ Cost estimate (you've included it 8 of last 12 times for this client)
○ Risk register (you tend to add this for board-facing strategy)

VERDICT:
  - ship with explicit "minimum viable" note   OR
  - add the X most-missed items before sending
  - your call

SUGGESTED ADDITIONS (ranked by impact):
1. <addition> — ~5 min to add — covers 3 of the omissions above
2. <addition> — ~15 min — covers 1 high-impact gap
3. <addition> — ~30 min — covers 2 nice-to-haves
```

## Anti-patterns

- ❌ Demanding every standard section even on minimum-viable drafts
- ❌ Flagging absence of sections the user explicitly excluded
- ❌ Over-weighting "your past behavior" without considering this might be a deliberately different deliverable
- ❌ Becoming a checklist instead of a thinking aid

## Verification

The verifier (class: ops) will:
1. Confirm at least one of the listed omissions actually applies to the deliverable.
2. Confirm flags are evidence-based (cited contract / past episodes).
3. Confirm flags don't repeat what the verifier (regular) already caught.

## Routing

- **Haiku** for the contract-vs-deliverable diff (mechanical)
- **Sonnet** for the judgment of which omissions matter for THIS instance
