# Example 07 — Multi-tenant CRM data model

**Goal:** `Design the data model for a multi-tenant CRM with row-level security and audit trails`

## Expected roadmap

```
GOAL: Postgres data model for multi-tenant CRM with RLS, audit, soft delete, time travel.
ASSUMPTIONS: Single-region first; row-level multi-tenancy (not schema-per-tenant); 5K tenants max year 1.

Phase 1: Decisions                     [sequential]
  T1.1  Tenancy strategy choice          → Opus   | est: 1200
  T1.2  RLS approach                     → Opus   | est: 800   | needs: T1.1
  T1.3  Audit + soft-delete pattern      → Opus   | est: 800   | needs: T1.1

Phase 2: Model                         [parallel]
  T2.1  Core entities (Contact, Deal, Org) → Sonnet | est: 1500
  T2.2  Lookup + tag tables                → Sonnet | est: 600
  T2.3  Index strategy                     → Sonnet | est: 600

Phase 3: Migration + tests             [sequential]
  T3.1  Migration scripts                  → Sonnet | est: 1500  | needs: T2.*
  T3.2  RLS policy tests                   → Sonnet | est: 1000  | needs: T3.1

EST. TOTAL OUTPUT TOKENS: ~8000
```

## What gets shipped

- Decision doc (per `opus-architect` contract) with chosen tenancy + 2 rejected alternatives + falsifiability
- SQL migration files (up + down)
- RLS policies as SQL with policy tests
- Audit trigger implementation
- Sample queries showing tenant isolation under load

## Verifier checks

- Decision is stated in first 2 lines
- ≥2 alternatives rejected with reasons
- Falsifiability test stated
- Every migration has a down version
- RLS policies have at least one test per policy
