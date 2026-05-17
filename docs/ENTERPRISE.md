# Enterprise spec (v1.5+ target)

How God Mode scales from one founder to a 100-person company without losing the discipline.

## Five enterprise primitives

### 1. Multi-user / teams

```
~/.themeetpatel/ (per user)
    ↕ (sync via team server or self-hosted)
~/.themeetpatel-org/ (shared per team)
    ├ memory/team-<slug>.json     (see team-memory skill)
    ├ beliefs-shared.jsonl
    ├ episodes/                   (shared, RBAC-scoped)
    ├ sessions/                   (handoff-ready)
    ├ ledger.jsonl                (org-wide cost rollup)
    └ team-config.json
```

Sync model: a thin self-hostable team server (Node + Postgres) that brokers state. v1.5 ships the server reference impl. v1.6 adds the managed-hosting option.

### 2. RBAC

Roles, scopes, enforcement:

```json
{
  "roles": {
    "owner":  ["read:*", "write:*", "admin:*"],
    "admin":  ["read:*", "write:*", "manage:users"],
    "writer": ["read:*", "write:memory", "write:beliefs", "write:sessions"],
    "reader": ["read:*"]
  }
}
```

Every server-side operation checks the requesting user's scope before acting. Denials get a typed error + audit log entry.

### 3. Compliance modes

Org config sets a compliance profile:

| Mode | What it tightens |
|---|---|
| `none` | Default. No extra constraints. |
| `gdpr` | EU residency, 30-day retention default, right-to-delete on demand, DPA available |
| `hipaa` | US residency, BAA required, audit log retention 7y, PHI redaction strict |
| `pci` | Card-number redaction, audit log 1y, no card data in memory/ledger |
| `uae-pdpl` | UAE residency, consent tracking, data-subject access |
| `soc2-type-ii` | All audit + access logs SOC2-compliant, quarterly attestation export |

Modes compose ("gdpr + soc2-type-ii"). The strictest rule wins per concern.

### 4. Data residency

Where state physically lives is configurable per org:

```json
{
  "residency": {
    "memory": "eu-west-1",
    "ledger": "eu-west-1",
    "audit": "eu-west-1",
    "embeddings": "on-prem"
  }
}
```

The team server is deployed per region. State doesn't cross regions without explicit user action (export → import).

### 5. SSO + audit-grade logs

SSO via SAML 2.0 or OIDC. Audit log captures:
- Every tool call (already in v1.3)
- Every memory/belief write
- Every team-config change
- Every connector add/remove
- Every external action
- Every cap/budget adjustment

Audit format conforms to SIEM-importable JSON (CEF + JSON variants). Quarterly attestation export bundles all audit events for the period + integrity hash.

## The migration path (v1.3 → v1.5)

| Today (v1.3) | v1.4 | v1.5 |
|---|---|---|
| Single-user files in ~/.themeetpatel/ | Add team-config.json (single-user with team metadata) | Team server + multi-user sync |
| No RBAC | RBAC schema in team-config | RBAC enforced server-side |
| No compliance flags | Compliance mode config (advisory) | Compliance mode enforced |
| Local-only data | Optional encrypted sync (self-host) | Managed hosting option |
| Personal audit log | Personal audit log + team rollup | Enterprise audit + SIEM export |

## Pricing tiers (target, when we have a hosted version)

- **Free**: single-user, local-only, MIT plugin
- **Team**: up to 10 users, self-hosted team server free, managed hosting $X/user/mo
- **Enterprise**: SSO, compliance modes, data residency, audit-grade logs, SLA, $Y/user/mo + setup

The free tier is permanent. The paid tiers fund the maintenance + hosting.

## What v1.4 ships

- This doc (the spec)
- team-config.json schema
- compliance-mode config schema
- audit-log SIEM export prep

## What v1.5 ships

- Team server reference implementation
- RBAC enforcement
- Multi-user sync
- Compliance-mode runtime enforcement

## What v1.6 ships

- Managed hosting
- SOC2 attestation prep
- Data-residency runtime
- Enterprise SSO

## Why this matters even pre-enterprise

Even single-user users benefit because:
- Audit log catches errors retroactively
- Compliance modes are usable for personal sensitive work (medical, financial)
- Residency control is a privacy feature for individuals too
- The framework for these features is what makes them honest (not bolted on)
