# Launch profile — v1.3.1 (production) vs v1.4 (preview-in-repo)

This repo intentionally contains BOTH the production v1.3.1 release AND the v1.4 preview work. This doc tells you which is which.

> **TL;DR:** Use anything in the **Production** column today. Try anything in the **Preview** column knowing the underlying integration may be scaffolded. Look for `preview: true` in a skill's frontmatter for a quick signal.

## Production (ships in v1.3.1)

### Core orchestration
- `agents/god-mode-ceo.md` — CEO orchestrator with 7-phase loop (intake → roadmap → routing → delegate → verify → synthesize → recover)
- `agents/haiku-specialist.md` / `agents/sonnet-engineer.md` / `agents/opus-architect.md` — model-tier workers
- `agents/synthesizer.md` — merge worker outputs
- `agents/verifier.md` — per-task-class evidence-based verification (flagship)
- `agents/context-curator.md` — minimum viable context per worker
- `agents/self-critic.md` — plan blind-spot finder (added in 1.3.1, production)

### Specialist agents (15)
- product-strategist, growth-architect, research-analyst, codebase-auditor, security-officer, qa-tester, devops-release-manager, integration-architect, prompt-systems-engineer, data-analyst, content-strategist, sales-copywriter, ux-conversion-designer, chief-of-staff-ops, finance-ops-analyst

### Production skills (28)
**Core orchestration:** god-mode, model-router, roadmap-builder, handoff, verification, context-curator, memory

**Engineering:** codebase-audit, test-driven-development, webapp-testing, security-review, root-cause-tracing, mcp-builder, git-worktree-release

**Research / strategy:** deep-research, data-analysis, growth-engine, seo-aeo-geo, ui-ux-conversion, partnerships-outreach

**Communication:** founder-content, internal-comms, meeting-insights

**Prompt operating system:** prompt-engineering, skill-creator, cost-ledger

**v1.3.1 additions (production-quality, working code):**
- `belief-register` + `scripts/beliefs.js`
- `tree-of-thought`
- `episodic-memory` + `scripts/episodes.js`
- `memory-decay`
- `hitl-checkpoint`
- `async-handoff`
- `provenance-chain`
- `bias-detector`
- `semantic-cache`
- `speculative-execution`
- `budget-caps` + `scripts/budgets.js`
- `daily-standup-auto` + `scripts/reflection-journal.js`
- `weekly-retro`
- `quarterly-okr-check`
- `skill-rot-detection`
- `decision-review`
- `why-now-detector`
- `negative-space-scanner`
- `dread-index`
- `time-to-regret`
- `argument-strength-scorer`
- `few-shot-from-past`
- `procedural-memory`
- `pair-programming-mode`

### Production scripts (28)
- `scripts/ledger.js` — cost report CLI
- `scripts/log-routing.js` — hook (writes ledger.jsonl + routing.log)
- `scripts/session-summary.js` — hook (end-of-session report)
- `scripts/route-learn.js` — learn router weights from ledger
- `scripts/route-accuracy.js` — stratified eval runner
- `scripts/install-pack.sh` — Domain Pack installer
- `scripts/memory-init.js` — bootstrap memory layer
- `scripts/skill-telemetry.js` — skill load tracking
- `scripts/beliefs.js` — belief register CLI
- `scripts/counterfactual-cost.js` — counterfactual cost analysis
- `scripts/calibrated-confidence.js` — pass-rate calibration
- `scripts/episodes.js` — episodic memory CLI
- `scripts/memory-diff.js` — "what changed while I was away"
- `scripts/sandbox-run.js` — code execution sandbox
- `scripts/long-task.js` — durable background tasks
- `scripts/watchers.js` — watcher config CLI
- `scripts/pii-redact.js` — PII + secrets redactor (12 patterns + strict mode)
- `scripts/hallucination-scorer.js` — claim-vs-source heuristic
- `scripts/reversibility-scorer.js` — irreversibility risk scoring
- `scripts/cost-preflight.js` — pre-flight cost estimator
- `scripts/budgets.js` — budget cap CLI
- `scripts/anti-pattern-lib.js` — anti-pattern library CLI
- `scripts/reflection-journal.js` — day/week/month/quarter digest
- `scripts/github-init.sh` — repo publish prep
- `scripts/verify/verify-code.js`
- `scripts/verify/verify-content.js`
- `scripts/verify/verify-roadmap.js`
- `scripts/verify/verify-research.js`

### Production infrastructure
- MCP server (`mcp-server/`) — routing engine, session persistence, audit log, per-session budgets, prompt resources
- Eval harness — 104 stratified cases, 41 adversarial, 100%/100% accuracy
- CI workflow (`.github/workflows/ci.yml`)
- 3 Domain Packs (founder-uae, ai-builder, growth-ops) with v0.2 contents
- 4 commands (`/god-mode`, `/roadmap`, `/handoff`, `/status`)
- 4 portable variants (Cowork, claude.ai, ChatGPT, universal)
- 10 worked examples in `examples/`
- Launch kit (README marketing, demo script, LinkedIn post, dashboard, landing page)

## Preview (in repo for visibility — NOT yet production)

These are real files you can read, but the underlying integration is scaffold-quality. They tell the v1.4+ story but shouldn't be invoked in production workflows yet.

### Preview skills (depend on runtime APIs the host may not expose)
| Skill | What it needs to be production |
|---|---|
| `skills/computer-use-loop/` | Host runtime computer-use primitives |
| `skills/external-actions/` | Per-connector adapters (slack, gmail, notion, linear, github) |
| `skills/cross-vendor-router/` | Working adapters + calibration data per vendor |
| `skills/team-memory/` | Sync mechanism (team server in v1.5) |
| `skills/vision-roadmap/` | Vision-capable runtime (Claude Sonnet/Opus have it; others vary) |
| `skills/voice-intake/` | Audio-to-text in the runtime |
| `skills/meeting-recording-pipeline/` | Combines voice-intake + external-actions; both must work |
| `skills/screen-state-aware/` | Host runtime screen access API |
| `skills/code-as-image/` | Vision runtime |
| `skills/watchers-triggers/` | Cron OR daemon to actually fire them |

### Preview surfaces (scaffolds; real backend in v1.5+)
- `surfaces/slack-bot/` — server scaffold, needs real CEO loop wiring
- `surfaces/browser-extension/` — manifest + UI, needs real backend
- `surfaces/webhook-ingress/` — REST scaffold, returns stub responses
- `surfaces/mobile/SPEC.md` — spec only, no implementation
- `surfaces/hosted-saas/SPEC.md` — spec only, no implementation

### Preview docs (architecture for future versions)
- `docs/A2A-PROTOCOL.md` — agent-to-agent spec for v1.5+
- `docs/ENTERPRISE.md` — multi-user / RBAC / compliance for v1.5+
- `docs/COMPLIANCE-MODES.md` — GDPR/HIPAA/PCI/PDPL/SOC2 modes spec
- `docs/FEDERATED-LEARNING.md` — privacy-preserving cross-user router learning
- `docs/MARKETPLACE-V1.5.md` — concrete pack-marketplace architecture for v1.5
- `docs/PACK-MONETIZATION.md` — paid-pack model for v1.6
- `docs/PUBLIC-SESSION-SHARING.md` — shareable sessions + replay
- `docs/OPEN-API.md` — full REST contract for v1.5
- `packs/pack-org-private/` — template for org-private packs (rename + edit)

### How to spot preview at a glance
Skills marked preview have `preview: true` in their YAML frontmatter (added by the launch fix). Surfaces and docs have a `> ⚠ PREVIEW — not yet production-wired` banner at the top.

## Why ship v1.3.1 first (and v1.4 next month)

Two reasons:

1. **Trust.** A first-time user who runs `/voice-intake` expecting it to work and gets a scaffold response is a trust hit. Better to ship what genuinely works, build the audience, then layer on the v1.4 capabilities once they're production-wired.
2. **Signal.** Real user feedback on v1.3.1 will dictate which v1.4 layers to prioritize for production. Shipping all 13 layers at once means we wire up things nobody asked for and skip things that get demanded.

## Path from v1.3.1 → v1.4 production

| Layer | Effort to production | Realistic ship date |
|---|---|---|
| Working scripts already in v1.3.1 | DONE | now |
| Cross-vendor router (Anthropic + OpenAI working) | 1 week | v1.4 |
| Slack bot wired to real CEO loop | 1 week | v1.4 |
| Webhook ingress wired to real CEO loop | 3 days | v1.4 |
| Computer-use loop (with claude-code computer-use MCP) | 1 week | v1.4 |
| External-actions: 5 real connectors (slack, gmail, notion, linear, github) | 2-3 weeks | v1.5 |
| Vision-roadmap / voice-intake / code-as-image (assuming vision/audio in runtime) | 1 week each | v1.4 / v1.5 |
| Team memory + multi-user sync | 2-3 weeks | v1.5 |
| Marketplace + signing | 3-4 weeks | v1.5 |
| Mobile / hosted SaaS | 6-8 weeks each | v1.6+ |
| A2A / federated learning | 6-8 weeks each | v2.0 |

Realistic v1.4 launch: 4-6 weeks after v1.3.1, focused on the cross-vendor router + Slack bot + webhook ingress + computer-use + vision-roadmap (high-value, low-effort).

## What this doc is not

- Not an apology for shipping preview files — they're useful to read and steer toward
- Not a soft launch label — v1.3.1 IS the launch
- Not a permanent state — v1.4 ships next, then v1.5, etc.

Use v1.3.1 with confidence today.
