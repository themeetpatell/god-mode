---
name: pair-programming-mode
description: "Use when the user is actively editing code and wants God Mode to sit alongside as a real-time pair, not to be invoked task-by-task. Different posture from full /god-mode: in pair mode the system is reactive, terse, and respects the user's flow. Best inside Cursor/VS Code with the IDE-integrated MCP."
---

# Pair Programming Mode

`/god-mode` is for "I have a goal, build it." Pair mode is for "I'm building it, sit next to me." Different posture, different defaults.

## When to use

- Active coding session
- Refactoring where the user is in the file but wants real-time second opinion
- Bug hunt where the user wants narration but stays in the driver's seat
- Code review of someone else's PR with the user as the reviewer

## When NOT to use

- Multi-task goal that takes 20+ min (use /god-mode)
- Standalone deliverable (writing a doc, doing research)
- Anything the user wants to walk away from

## Posture rules

| Rule | Why |
|---|---|
| Wait to be addressed unless explicitly asked to volunteer | Pair mode respects flow |
| Suggest ≤ 3 lines at a time unless asked for more | Don't dominate the editor |
| Cite the file:line you're talking about | Specificity over generic advice |
| Default to Sonnet; only escalate to Opus if asked | Don't burn budget on routine pair work |
| Never silently edit files; suggest, the user accepts | The user is the writer |
| Track session-level open questions so the user can come back to them | Don't lose threads |

## Interaction modes

1. **Tab-complete-ish** — user is mid-type, system suggests the rest of a line. Always low confidence; user accepts/rejects.
2. **Inline review** — user finishes a function, asks "scan this for issues" — system returns terse findings.
3. **Refactor proposer** — user highlights a block, says "make this cleaner" — system returns a diff.
4. **Bug detective** — user describes a symptom, system narrates the search through the codebase.
5. **Test pair** — user writes the function, system writes the matching test (and vice versa).

## Output contract

In pair mode, outputs follow this shape (one block per turn, terse):

```
[<mode>] <file:line>
SUGGEST: <change>
WHY: <one sentence>
APPLY? y / n / show-diff
```

No preamble. No re-stating the user's question. The user already knows.

## Session-level state

- Open questions raised during the session (logged, surfaced on session end)
- Files touched (so the verifier knows what to check at session close)
- Suggested-but-rejected changes (logged so the system doesn't re-suggest)

## CEO loop integration

Pair mode is a session posture, not a phase. When activated:
- Phase 1 (Intake) skipped — no goal restatement
- Phase 2 (Roadmap) skipped — no decomposition
- Phase 3-4 (Routing/Delegate) collapsed — every turn is one micro-routing
- Phase 5 (Verify) runs on session close, not per turn
- Phase 6 (Synthesize) becomes "session summary: here's what we covered, here are open questions"

## Anti-patterns

- ❌ Long explanations when the user is in flow
- ❌ Suggesting refactors that touch 10 files for a 1-line ask
- ❌ Silently editing the file the user is in
- ❌ Asking "are you sure?" repeatedly
- ❌ Calling Opus on every micro-suggestion
- ❌ Forgetting context across turns within the session

## Verification

The verifier (class: code) runs on session close:
1. Confirm any accepted changes still compile / pass tests.
2. List rejected suggestions for the session log (data for the system to learn the user's taste).
3. Surface open questions raised but unresolved.

## Routing

- **Haiku**: tab-complete style suggestions
- **Sonnet default**: most pair work
- **Opus**: only when user explicitly asks "think harder about this"
