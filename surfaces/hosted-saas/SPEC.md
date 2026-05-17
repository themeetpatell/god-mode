# God Mode hosted (SaaS) — spec

For users who'll never `npm install`. Same brain, web UI, subscription.

## ICP

- Non-developer founders who want the discipline but won't install a plugin
- Operations leads at SMBs
- Consultants who want to brand-white-label God Mode to their clients
- Teams that want managed sync without running infrastructure

## What hosted offers vs free local

| Feature | Local (free) | Hosted ($/mo) |
|---|---|---|
| CEO + verifier + router | ✓ | ✓ |
| Memory + beliefs + episodes | local files | managed, cross-device sync |
| Skills + packs | install via CLI | one-click install from web UI |
| Cost ledger | local | dashboard with charts |
| Webhook ingress | self-host | hosted endpoint included |
| Audit log | local | enterprise SIEM export |
| Team / RBAC | self-host | managed |
| Compliance | self-host | SOC2 / GDPR ready |
| Multi-device | self-host sync | seamless |
| Slack / mobile / browser | self-host servers | included |

## Pricing (target)

- **Free local**: forever free, MIT plugin
- **Solo**: $19/mo — hosted, single user, all packs
- **Team**: $49/user/mo — multi-user, RBAC, audit basic
- **Enterprise**: $X/user/mo — SOC2, residency, SSO, dedicated support, custom packs

## Architecture (target)

```
[Web UI / Mobile / Slack / Browser ext]
         ↕ HTTPS
[Edge: Cloudflare Workers / Vercel Edge]
         ↕
[API: Hono on Node/Bun, multi-tenant]
         ↕
[State: Postgres + S3 + Redis]
         ↕
[LLM: Anthropic, OpenAI, Google — cross-vendor router]
```

Multi-region deployment for data residency: EU, US, UAE, APAC.

## Open-core model

- **Open source**: CEO, router, verifier, skills, packs, all CLIs, MCP server — everything that runs locally
- **Closed/paid**: hosted infrastructure (multi-tenant SaaS layer, managed sync, billing, support)

This keeps the moat where it belongs (network effects from federated learning + hosted convenience for non-tech users) without locking down the tool itself.

## Build path

| Stage | Effort | Trigger |
|---|---|---|
| v1.3 (now) | shipped | Local-only, fully open source |
| v1.4 | spec only (this doc) | After 100+ GitHub stars + 5 paying intent users |
| v1.5 | Reference team server + auth | After GTM motion validated |
| v1.6 | Hosted MVP (solo tier only) | First $1K MRR signal |
| v2.0 | Team + Enterprise tiers, SOC2 | $10K MRR signal |

## What we will NOT do

- ❌ Restrict the open-source plugin to make hosted look better
- ❌ Take ownership of user data without explicit consent
- ❌ Force users into hosted by deprecating local features
- ❌ Ship a hosted MVP before the local product is genuinely loved

## Distribution math

If 100 local users / month convert to solo @ $19, that's $1.9K MRR.
If 10 team customers @ 5 users avg @ $49 = $2.45K MRR.
If 1 enterprise @ 50 users @ $99 = $5K MRR.

Realistic path to $10K MRR: ~300 solo users + 20 team accounts + 1-2 enterprise. Achievable within 6-12 months of dedicated GTM if the local product is loved.

## Why this is honest

Most open-source projects either die from neglect or sell out via VC-backed hosted services that lock down the OSS version. The path described here funds the maintenance from people who want managed infrastructure — without taking anything away from people who don't.

## What v1.4 ships

- This spec (the artifact)
- Pricing model
- Open-core boundary clarified
- API contract that the hosted version will need to match

## What v1.5 ships

- Reference team server (self-hostable, GPL or Apache)
- Auth + multi-tenancy basics
- Cost-ledger dashboard (the screenshot-worthy UI)

## What v1.6 ships

- Hosted MVP (solo tier)
- Billing integration
- Onboarding flow
