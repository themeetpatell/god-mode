# Example 10 — Cut MVP scope to ship in 4 weeks

**Goal:** `Cut my MVP scope to ship in 4 weeks. Here's the current spec: <paste or upload>`

## Expected roadmap

```
GOAL: Reduce MVP to a shippable-in-4-weeks scope; preserve the minimum that proves the value hypothesis.
ASSUMPTIONS: User can name the value hypothesis in one sentence; reversible cuts preferred.

Phase 1: Sharpen                       [sequential]
  T1.1  Surface the value hypothesis     → Opus   | est: 600
  T1.2  List every spec'd feature        → Haiku  | est: 400   | needs: T1.1
  T1.3  Score each feature vs hypothesis → Opus   | est: 1200  | needs: T1.2

Phase 2: Cut                           [sequential]
  T2.1  Recommend cuts (with rationale)  → Opus   | est: 1500  | needs: T1.3
  T2.2  Map dependencies cuts unblock    → Sonnet | est: 800   | needs: T2.1

Phase 3: Plan the 4-week build         [sequential]
  T3.1  Week-by-week roadmap             → Sonnet | est: 1200  | needs: T2.*
  T3.2  Kill criteria + reversibility    → Opus   | est: 600   | needs: T3.1

EST. TOTAL OUTPUT TOKENS: ~6300
```

## What gets shipped

- One-sentence value hypothesis you can defend
- Scored feature list (each scored against the hypothesis)
- Specific cuts with rationale (not "consider cutting X")
- Dependencies the cuts unblock (the real prize)
- 4-week roadmap with weekly milestones
- Kill criteria per week (what would tell you to stop)
- Reversibility note per cut (which decisions can be reopened)

## Verifier checks

- Decision (the cuts) stated in first 2 lines of recommendation
- ≥2 rejected alternatives shown
- Falsifiability test for the hypothesis
- Roadmap has 2-5 atomic tasks per week
- Every cut has reversibility marked
