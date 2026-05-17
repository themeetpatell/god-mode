---
name: verification
description: Use after any worker reports "done" to prove the deliverable actually meets its acceptance criteria. Runs per-task-class verification (code, research, content, strategy, roadmap, integration, data, security, ops, comms) and returns a binary pass/fail with evidence. Convert claims into measurements. The flagship primitive that separates God Mode from optimistic agent systems.
---

# Verification

The most important skill in God Mode after the router. Every other AI agent framework lets the worker grade its own homework. This skill is how we don't.

## When to use

- After any roadmap task that produced a deliverable (code, doc, decision, content)
- Before the CEO writes the executive summary
- Whenever a worker returns `STATUS: done` with claims that aren't trivially observable
- On reverse-handoff (when a user pastes a brief from another tool and says "did this actually ship?")

## When NOT to use

- The deliverable is a single one-line answer with no claim to verify ("what is 2+2")
- The worker explicitly returned `STATUS: partial` or `STATUS: blocked` with no claimed completion
- Token-budget emergency where the user accepts unverified output (rare; always offer the option)

## The protocol

### 1. Classify the task

Pick one of: `code | research | content | strategy | roadmap | integration | data | security | ops | comms`. If multiple apply, run multiple protocols.

### 2. Extract claims from the worker output

A claim is anything stated as true that isn't a tautology. Examples:
- "All 12 tests pass" → claim
- "I implemented the feature" → claim
- "This handles the race condition" → claim
- "Here is a list of options" → not a claim

### 3. Pick a verification method per claim

| Claim type | Verification method |
|---|---|
| "Tests pass" | Run the test command, parse exit code, sample failures |
| "File X is updated" | Read the file, diff against the prior version |
| "Source Y says Z" | WebFetch the source, grep for the claim |
| "This will scale to N" | Demand a load-test plan or a back-of-envelope; flag if absent |
| "This is secure" | Map to OWASP top 10 / threat-model the flow |
| "Content matches voice" | Run anti-pattern detector + specificity counter |
| "Decision is correct" | Check for rejected alternatives + falsifiability |
| "Roadmap is complete" | Walk the DAG, count atomic tasks per phase |

### 4. Score and return

Use the output contract in `agents/verifier.md` exactly. Three verdicts:

- **pass** — all claims verified with evidence, no critical or major defects
- **conditional pass** — minor defects with safe fixes listed; the user can ship or fix first
- **fail** — at least one critical defect or one unverifiable critical claim

## Anti-patterns

- ❌ "Looks good to me." Verification is evidence-based, not vibes-based.
- ❌ Verifying with the same model that produced the work (defeats the point). Verifier is a different prompt and ideally a different model.
- ❌ Spending more verification tokens than production tokens. The protocol must be cheaper than the work.
- ❌ Hiding failures behind "minor issues" — escalate, don't soften.
- ❌ Re-implementing instead of flagging. Verifier flags; fixer fixes.

## Per-class verification templates

### Code

```bash
# Adjust per stack — these are anchors, not contracts.
npm test --silent 2>&1 | tail -50 || echo "FAIL: tests"
npx tsc --noEmit 2>&1 | tail -20 || echo "FAIL: types"
git diff --stat HEAD~1 HEAD
grep -rn "TODO\|FIXME\|console.log\|XXX\|HACK" --include="*.ts" .
```

If a stack-specific verifier is available (eslint, ruff, mypy, vitest, jest, pytest, cargo test), prefer it.

### Research

For each top-line claim:
1. Find the cited source.
2. WebFetch it.
3. Search the page for terms that confirm the claim.
4. Score the source (primary > academic > vendor > blog > social).
5. If the citation is missing or doesn't support the claim, mark as `CLAIM UNSUPPORTED`.

### Content (founder voice)

Anti-pattern detector:
- "in a world where" / "in today's fast-paced" / "let's dive into" — AI throat-clearing
- "it's not just X, it's Y" — contrast template
- "transform" / "unlock" / "leverage" / "navigate" used in passing — generic verbs
- Em-dash sentences with no specific noun on either side

Specificity counter: count distinct numbers, named people, named companies, dated events, dollar amounts, place names. Reject if < 2.

### Strategy / decision doc

Check the first 3 lines for an explicit decision. If none, fail.
Check for "Alternatives considered" with at least 2 entries. If missing, conditional pass.
Check for a falsifiability test ("we'll know this is wrong if…"). If missing, conditional pass.

### Roadmap

Walk every task. For each:
- Has a routing label? Y/N
- Has a `needs:` line? Y/N
- Has a token estimate? Y/N
- Has a "done" condition? Y/N

If any phase has < 2 or > 5 tasks, flag as "scope drift."
If any task is named in vague verbs ("build it", "do X"), flag as "non-atomic."

### Integration / MCP

- Idempotency stated? Y/N
- Retry semantics stated? Y/N
- Failure modes listed? Count.
- Auth model explicit? Y/N
- Secrets handled via env (not inline)? Y/N

### Data / KPI

For each metric:
- Numerator + denominator defined? Y/N
- Source of truth named? Y/N
- Cadence stated? Y/N
- Owner named? Y/N

For each chart/dashboard:
- Sums match across views? Y/N
- Percentages don't exceed 100? Y/N

### Security

Use a 5-line checklist:
1. Auth path mapped end-to-end
2. Least-privilege defaults stated
3. Secret storage verified (no inline)
4. Input validation present at boundaries
5. Audit trail / logging accounted for

### Ops / comms

- Every action has owner + deadline.
- Decision is separated from discussion.
- Tone matches audience (board ≠ team ≠ customer).
- Escalation path stated if relevant.

## Output

Always use the contract from `agents/verifier.md`. Never improvise the shape — downstream parsers depend on it.

## Routing

- **Haiku**: pattern-match-only verifications (file exists, field present, count matches).
- **Sonnet**: default. Voice checks, source verification, code verification, decision checks.
- **Opus**: only for verifications where the *judgement itself* is hard — e.g., "is this race condition actually possible given these locking semantics."

## Cost discipline

Verification should cost ~10-20% of the production task's tokens. If it's costing more, simplify the protocol or batch verifications across multiple tasks.

## Integration with the CEO loop

The CEO calls verification as **Phase 6: Verify** after Phase 4 (Delegation) and before Phase 5 (Synthesis). The synthesizer receives both the worker output AND the verification verdict. If verification failed, the synthesizer surfaces the failure in the exec summary instead of claiming success.
