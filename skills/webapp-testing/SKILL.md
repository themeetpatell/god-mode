---
name: webapp-testing
description: Use for frontend/browser QA, Playwright test plans, conversion flow validation, responsive/device matrix testing, accessibility checks, performance baselines, visual regression, and pre-release verification of any web application. Produces a release verdict with reproducible test artifacts.
---

# Webapp Testing

The job isn't "did I click around for 10 minutes." It's: every critical flow works, on every supported device, under every state the user can land in. Then prove it.

## When to use

- Pre-release QA on a web app
- Conversion flow validation (signup → activation → first value)
- Visual regression after a design system change
- Cross-browser / cross-device verification
- Accessibility audit
- Performance baseline / regression

## When NOT to use

- API-only testing (use TDD with supertest/equivalent)
- Native mobile apps (out of scope)
- Backend integration tests without UI (TDD)

## The protocol

### Phase 1 — Identify critical flows

A critical flow is anything that:
- Touches money (signup, checkout, billing, refund, subscription change)
- Touches account state (signup, login, password reset, MFA, delete)
- Touches data integrity (any user-initiated write that's hard to undo)
- Is the top 3 conversion paths by traffic
- Was broken in any of the last 3 incidents

Number these. Anything not in this list is P2/P3 testing.

### Phase 2 — Build the test matrix

For each flow, cross-multiply against:

| Axis | Values |
|---|---|
| Device | iPhone 14, Pixel 7, iPad, Desktop 1440, Desktop 1920 |
| Browser | Chrome (latest), Safari (latest), Firefox (latest), Edge (latest) |
| Network | 4G throttled, fast 3G, offline-then-online |
| Auth state | unauth, auth as user, auth as admin |
| Data state | empty, has-1, has-many, has-max |

You do not need every cell. Pick the cells where bugs hide. Defaults:
- Mobile iOS Safari + Desktop Chrome at minimum, every flow
- Add Edge for any enterprise customer
- Add slow network for any flow that fetches >1 large asset

### Phase 3 — UI state coverage

Every screen in a flow must be tested in these states:

| State | What it looks like |
|---|---|
| **Loading** | Skeleton or spinner, no flash of empty content |
| **Empty** | First-time user, no data |
| **Has-data** | Typical state |
| **Has-many** | Pagination kicked in, sort works |
| **Error** | Server 500, network failure, validation error |
| **Permission denied** | User lacks role for this view |
| **Offline → online** | State recovers correctly |
| **Slow** | Action takes > 3s, UX doesn't lie about progress |

Missing any of these for a critical screen = test gap.

### Phase 4 — Bug capture (every bug, this shape)

```
BUG B<N>: <one-line title>
Severity: blocker | major | minor | cosmetic
Device: <device + browser + viewport>
Auth: <unauth / user / admin>
Steps to reproduce:
  1. <step>
  2. <step>
  3. <step>
Expected: <what>
Actual: <what>
Screenshot: <path>
Network HAR (if applicable): <path>
Console errors: <pasted>
First seen in: <build / commit>
Workaround: <if any>
```

No screenshot = no bug. The screenshot is the evidence.

### Phase 5 — The deliverable

```
═══ WEBAPP TEST REPORT ═══
App: <name>  Build: <sha>  Date: <date>  Tester: <person/agent>

RELEASE VERDICT: ship | conditional ship | block
SUMMARY (3 sentences): <state of the build>

CRITICAL FLOWS TESTED:
| Flow | Devices | States covered | Pass / Fail |
| Signup → first value | iPhone, Desktop | 8/8 | ✓ |
| Checkout | iPhone, Desktop, iPad | 6/8 | ⚠ 2 issues |
| Password reset | iPhone, Desktop | 5/8 | ✗ 3 issues |

BUGS FOUND:
P0 (blocker, n=<>):
  - B1 ...
P1 (major, n=<>):
  - B2 ...
P2 (minor, n=<>):
  - B3 ...
P3 (cosmetic, n=<>):
  - B4 ...

UI STATE COVERAGE:
| Flow | Loading | Empty | Has-data | Has-many | Error | Perm denied |
| Signup | ✓ | n/a | ✓ | n/a | ✓ | n/a |
| Checkout | ✓ | ✓ | ✓ | ⚠ | ⚠ | ✗ |

PERFORMANCE BASELINE:
- LCP (mobile, throttled 4G): <ms>
- INP (mobile): <ms>
- CLS: <score>

ACCESSIBILITY:
- Keyboard-only navigation: pass / fail per flow
- Screen reader spot-check (VoiceOver): pass / fail
- Color contrast violations: <count>

AUTOMATION PLAN:
Tests added to Playwright:
- <file>: <count> specs covering <flows>

Tests recommended but not added:
- <flow> — reason it's hard to automate, manual ownership

RECOMMENDED BLOCK / CONDITIONAL:
- B1 must fix before ship
- B2 ship behind feature flag with kill switch
- B3+ ship and patch in next deploy
```

## Anti-patterns

- ❌ "I tested it" with no matrix, no states, no screenshots
- ❌ Reporting bugs without exact reproduction steps
- ❌ Testing only on the dev's laptop (Safari + Mac is not the whole world)
- ❌ Skipping the error states ("happy path works, ship it")
- ❌ Confusing "no console errors" with "it works"
- ❌ Treating a flaky test as "intermittent" without root-causing
- ❌ Visual regression on dynamic content without masks (timestamps, random IDs)
- ❌ Login tests that hit the real auth provider in CI

## Playwright snippet library

### Auth + protected route
```ts
import { test, expect } from '@playwright/test';

test.use({ storageState: 'tests/.auth/user.json' });

test('user can view dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
```

### Critical state coverage
```ts
test.describe('checkout', () => {
  test('loading state shows skeleton, not flash', async ({ page }) => {
    await page.route('**/api/cart', route => setTimeout(() => route.continue(), 1500));
    await page.goto('/checkout');
    await expect(page.getByTestId('cart-skeleton')).toBeVisible();
  });

  test('empty cart redirects with message', async ({ page }) => {
    await page.route('**/api/cart', r => r.fulfill({ json: { items: [] } }));
    await page.goto('/checkout');
    await expect(page).toHaveURL('/cart?empty=true');
  });

  test('server error shows retry, not white screen', async ({ page }) => {
    await page.route('**/api/cart', r => r.fulfill({ status: 500 }));
    await page.goto('/checkout');
    await expect(page.getByText(/something went wrong/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /retry/i })).toBeVisible();
  });
});
```

### Slow network
```ts
test.use({
  launchOptions: { args: ['--enable-network-throttling'] }
});

await context.route('**/*', async route => {
  await new Promise(r => setTimeout(r, 200));
  await route.continue();
});
```

### Visual regression with mask
```ts
await expect(page).toHaveScreenshot('checkout.png', {
  mask: [page.locator('[data-test="timestamp"]'), page.locator('[data-test="user-avatar"]')],
  maxDiffPixelRatio: 0.01,
});
```

## Accessibility quick scan

For any flow, run mentally or with axe-core:
- Every interactive element keyboard-reachable
- Focus visible on tab
- Heading hierarchy (`h1` → `h2`, no skips)
- Form labels associated (`label[for]` or `aria-labelledby`)
- Color contrast ≥ 4.5:1 for body text
- No content-only-via-color (status, error)
- Screen reader announces dynamic changes (`aria-live`)

## Performance baseline

For any flow:
- LCP (Largest Contentful Paint) target: ≤ 2.5s on throttled 4G
- INP (Interaction to Next Paint) target: ≤ 200ms p95
- CLS (Cumulative Layout Shift) target: ≤ 0.1
- Total blocking time: ≤ 200ms

If a baseline doesn't exist, record one now. Future regressions need a number to compare against.

## Routing

- **Haiku**: generating the test matrix table, formatting bug reports
- **Sonnet**: default for writing Playwright specs, doing the actual testing pass
- **Opus**: only when the release verdict has high consequence (revenue feature, security flow)

## Verification protocol

The `verifier` (class: code) will:
1. Run the Playwright suite added in this work and report pass/fail.
2. Confirm critical flows have automation (or explicit manual-only justification).
3. Confirm bug reports have screenshots / steps / device.
4. Sanity-check the release verdict against bug severity.

Fail if "ship" verdict has open P0 bugs, or if critical flows have no automation.

## Time budgets

- Smoke test pre-release: 30-60 min
- Full regression: half day
- New feature E2E coverage: 2-4 hrs per critical flow
- Visual regression baseline: 1 hr per app, then maintained
