# Example 04 — OAuth refactor with TDD

**Goal:** `Refactor my auth module to use OAuth (Google), write tests, ship in a branch`

## Expected roadmap

```
GOAL: Replace password auth with Google OAuth; preserve sessions; full test coverage; ship in branch oauth-migration.
ASSUMPTIONS: Existing session middleware stays; only login/signup flows change.

Phase 1: Spec & decisions              [sequential]
  T1.1  Write acceptance criteria          → Sonnet | est: 600
  T1.2  Decide session strategy            → Opus   | est: 600   | needs: T1.1
  T1.3  Test plan                          → Sonnet | est: 800   | needs: T1.1

Phase 2: Branch & failing tests        [sequential]
  T2.1  Worktree + branch                  → Haiku  | est: 200
  T2.2  Write failing tests                → Sonnet | est: 1500  | needs: T2.1, T1.3

Phase 3: Implement to green            [sequential]
  T3.1  Google OAuth integration           → Sonnet | est: 1800  | needs: T2.2
  T3.2  Session bridge                     → Sonnet | est: 1200  | needs: T3.1
  T3.3  Migration tests + regression       → Sonnet | est: 1000  | needs: T3.2

Phase 4: Ship                          [sequential]
  T4.1  Changelog + PR                     → Haiku  | est: 400   | needs: T3.3
  T4.2  Rollback plan                      → Sonnet | est: 400   | needs: T4.1

EST. TOTAL OUTPUT TOKENS: ~8500
```

## What gets shipped

- Branch `oauth-migration` with commits per slice
- Failing tests written before implementation (real TDD)
- All tests green at end
- Changelog entry
- Rollback plan that names a specific revert + verify command
- PR-ready description

## Verifier checks

- Test command actually run; exit code captured
- Coverage on changed files
- No `it.skip` / `xit` introduced
- Rollback plan includes commands + reversibility note
- Migration is reversible OR explicitly noted as one-way
