---
name: test-driven-development
description: Use before implementing features, fixing bugs, or refactoring when acceptance criteria, regression safety, or correctness matters. Converts a requirement into testable acceptance criteria, writes failing tests first, drives implementation to green, and adds regression coverage. Output is reviewable by a tech lead, not vibes-only TDD theater.
---

# Test-Driven Development

The point of TDD here isn't ideology. It's that you can't ship verified work if you don't know what "done" looks like. Tests are the contract.

## When to use

- New feature with a real spec
- Bug fix (write a failing test that reproduces the bug, then fix)
- Refactor (lock current behavior in tests first)
- API change (contract tests first)
- Anywhere "the verifier will run the tests" is part of the spec

## When NOT to use

- Throwaway scripts / one-off data munging
- Exploratory spikes where the design is genuinely unknown (use a spike, then come back)
- UI polish / CSS tweaks (use webapp-testing for visual checks)

## The protocol

### Phase 1 — Acceptance criteria (the hardest step)

Convert the user's ask into testable statements. Each criterion must be:

- **Observable** — you can see whether it's true without reading the implementation
- **Binary** — pass or fail, no "kinda works"
- **Bounded** — has explicit edges (empty, max, error)

Format:

```
ACCEPTANCE CRITERIA
===================
AC1. <observable behavior>
  Given <state>
  When <action>
  Then <observable result>

AC2. ...

EDGE CASES:
- Empty input → <expected>
- Max input → <expected>
- Null / missing → <expected>
- Unauthorized → <expected>
- Concurrent action → <expected>

NON-GOALS (explicitly out of scope):
- <thing> (deferred to <future>)
```

If the user can't agree to these criteria, stop. The spec isn't ready.

### Phase 2 — Write the test plan

Before any test code, list what you'll test in plain English:

```
TEST PLAN
=========
Happy path:
  T1. <test name> — covers AC1 happy
  T2. <test name> — covers AC2 happy

Edge / error paths:
  T3. <test name> — empty input
  T4. <test name> — unauthorized
  T5. <test name> — concurrent

Regression (bug fix only):
  T6. <test name> — reproduces the bug
  T7. <test name> — adjacent bug class

Out of scope (this iteration):
  - <thing>
```

Test naming convention: `<unit>_<scenario>_<expected>`. Examples:
- `createUser_withDuplicateEmail_returns409`
- `processPayment_whenStripeReturns402_marksOrderFailed`

### Phase 3 — Write failing tests first

The test runs, it fails, the failure message is helpful, the error names the missing thing. Then and only then write the implementation.

For UI, the test plan covers these states minimum: **loading, empty, error, success**, plus permission-denied if auth is involved.

### Phase 4 — Implement minimally

The smallest code that turns red → green. No premature abstraction. Each test passing is a commit.

### Phase 5 — Refactor with green

With all tests green, clean up. Tests stay green throughout. If a refactor breaks a test, you broke behavior — revert or update the test with justification.

### Phase 6 — Regression armor

Before declaring done:

- Did you add a test for the bug class, not just this specific bug? (e.g., not `payment-fails-on-amount-7654`, but `payment-fails-when-amount-has-decimals`)
- Did you add coverage on the un-asked-for failure modes that this change enables? (e.g., feature adds a new state — added a test for transitions out of that state?)

### Phase 7 — Verification commands

Always end the deliverable with the commands a human can run:

```
VERIFICATION
============
$ <test command> --filter "<this feature>"
Expected: <N> tests pass, <N> tests added

$ <coverage command>
Expected: coverage on <files> ≥ <baseline>

$ <integration command>
Expected: <observable behavior>
```

## The deliverable shape

```
═══ TDD BRIEF ═══
Feature/Fix: <name>
Spec ref: <link or "inline below">

ACCEPTANCE CRITERIA: <as above>

TEST PLAN: <as above>

TESTS ADDED:
- <file>: T1, T2, T3, ...

IMPLEMENTATION PLAN:
1. <step>
2. <step>
3. <step>

FILES CHANGED:
- <file> — <what changed>

VERIFICATION COMMANDS:
$ <command>
expected: <result>

REGRESSION RISKS:
- <area that might break>
- <area that might break>

STATUS: done | partial | blocked
```

## Anti-patterns

- ❌ Writing tests after the implementation, then claiming TDD
- ❌ Tests that mirror the implementation 1:1 (testing what, not whether)
- ❌ Asserting "is not null" when you should assert the actual value
- ❌ Mocking the thing under test
- ❌ Snapshot tests for logic-heavy code (snapshots are for stable UI)
- ❌ "It compiles" as a passing condition
- ❌ Tests that depend on test order
- ❌ Tests that depend on real network / real wall clock
- ❌ Skipping the failing-test step
- ❌ Tests written for code coverage % instead of for observable behavior

## Language-specific anchors

### TypeScript / Node
- Vitest or Jest; prefer vitest for speed
- For HTTP: supertest or built-in fetch with mock server
- For React: Testing Library, not Enzyme
- Type errors count as failures; CI must run `tsc --noEmit`

### Python
- pytest, not unittest
- pytest fixtures over setUp/tearDown
- `pytest.raises` for error paths
- For HTTP: httpx + respx for mocks

### Go
- Standard `testing` package + table-driven tests
- `t.Run` for subtests
- `testify/assert` if expressive assertions needed

### E2E
- Playwright is the default. Cypress acceptable for legacy.
- One spec per critical user flow, not one per page.

## Worked example

Spec: "Users should be able to reset their password."

Bad TDD output:
> "Added a test that verifies the password reset works."

Good output:

```
ACCEPTANCE CRITERIA:
AC1. User can request a reset by submitting their email
  Given an unauthenticated user
  When they submit /password-reset with their email
  Then a reset token email is sent
  And the response is 202 (Accepted) regardless of email existence (anti-enumeration)

AC2. User can complete a reset with a valid token
  Given a token less than 60 minutes old
  When the user POSTs new password + token to /password-reset/confirm
  Then the password is hashed and stored
  And the token is invalidated
  And the user is auto-logged-in

AC3. Expired or used tokens fail closed
  Given a token over 60 minutes old or already consumed
  When the user POSTs to /password-reset/confirm
  Then response is 410 (Gone)
  And no password change occurs

EDGE CASES:
- Email not in system → still 202 (no enumeration)
- 6 reset requests in 1 hour from same email → rate limit, 429
- Token tampered (signature mismatch) → 400
- New password fails complexity → 422 with field-level error
- Concurrent reset attempts → only first succeeds, second 410

NON-GOALS:
- 2FA flow (separate spec)
- Account lockout after N failed attempts (separate spec)

TEST PLAN:
Happy:
  T1. requestReset_validEmail_returns202AndSendsEmail
  T2. confirmReset_validToken_updatesPasswordAndLogsIn
Edge:
  T3. requestReset_unknownEmail_returns202NoEmail
  T4. confirmReset_expiredToken_returns410
  T5. confirmReset_usedToken_returns410
  T6. confirmReset_weakPassword_returns422
  T7. requestReset_rateLimitExceeded_returns429
  T8. confirmReset_tamperedToken_returns400
Concurrent:
  T9. confirmReset_concurrentUse_onlyFirstSucceeds

VERIFICATION:
$ npm test -- password-reset
expected: 9 tests pass

$ npm run test:integration -- password-reset
expected: real email send via stub, all 9 pass

$ npm run lint && npm run typecheck
expected: 0 errors

REGRESSION RISKS:
- Session creation on reset complete — if it differs from login flow, session middleware may be inconsistent
- Audit log: confirm a reset event is logged with no PII leakage
```

That's TDD that ships.

## Routing

- **Haiku**: generating test name lists, formatting boilerplate
- **Sonnet**: default — writing tests, implementing, refactoring
- **Opus**: only for AC design on a high-stakes feature (money, security, irreversible state)

## Verification protocol

The `verifier` (class: code) will:
1. Run the test command and capture pass/fail counts.
2. Diff `tests/` directory — confirm tests were actually added.
3. Run typecheck / lint.
4. Compare AC list to test names — each AC has at least one test.
5. Check for skipped or commented-out tests (`it.skip`, `xit`, `@pytest.mark.skip`).

Fail if tests fail, if ACs lack test coverage, or if any tests are skipped without explicit justification.
