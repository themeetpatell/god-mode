# Example 01 — Next.js landing page

**Goal:** `Build a Next.js landing page with email signup, dark theme, ship a Vercel-ready repo`

## Expected roadmap

```
GOAL: Build a Next.js 14 (App Router) landing page with email signup, dark theme, Vercel-ready.
ASSUMPTIONS: Tailwind for styling; SendGrid for email capture; no auth.

Phase 1: Scope & decisions             [parallel]
  T1.1  Decide framework + design system   → Opus   | est: 800
  T1.2  Draft hero copy variants (3)       → Haiku  | est: 200

Phase 2: Build                         [sequential]
  T2.1  Scaffold Next.js + Tailwind        → Sonnet | est: 1500   | needs: T1.1
  T2.2  Hero + features + FAQ sections     → Sonnet | est: 2400   | needs: T2.1, T1.2
  T2.3  Email signup form + API route      → Sonnet | est: 1500   | needs: T2.2
  T2.4  Playwright tests for signup        → Sonnet | est: 1100   | needs: T2.3

Phase 3: Polish & ship                 [parallel]
  T3.1  SEO meta + JSON-LD schema          → Haiku  | est: 400
  T3.2  Vercel deploy + smoke test         → Sonnet | est: 600

DEPENDENCIES: T2.* sequential; T3.* parallel after T2.4
EST. TOTAL OUTPUT TOKENS: ~8500
EST. WALL TIME: ~12-20 min
```

## Verified output

After execution:
- 8 files written to your repo
- 1 API route handler
- 4 Playwright tests
- Vercel-ready (no manual config beyond env vars)
- 6-line exec summary with `VERIFIED:` per task

## What skills get triggered

- `god-mode` (entry)
- `roadmap-builder`
- `model-router`
- `context-curator`
- `test-driven-development`
- `ui-ux-conversion`
- `webapp-testing`
- `seo-aeo-geo` (light, just for the meta + schema)
- `git-worktree-release` (if you ask for branch + PR)
- `verification`

## What you'd ask the CEO to do differently

- "Use Vercel KV instead of an external email service" — adds a Phase 1 decision task
- "I want a multi-language landing page (English + Arabic)" — adds RTL + i18n work to Phase 2
- "Don't ship, just generate the files" — drops T3.2
