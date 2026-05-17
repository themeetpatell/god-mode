# Changelog

All notable changes to the `themeetpatel` God Mode plugin.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.1] — 2026-05-17 — Launch release

The launch-ready release. Includes everything in v1.3.0 plus the production-quality additions from the v1.4 exploration. The remaining v1.4 work (scaffolds, specs, future surfaces) is in the repo as **preview-in-place** — see `LAUNCH-PROFILE.md` for which files are production vs preview.

### Added (production-quality)

**Cognition:**
- `agents/self-critic.md` — finds plan blind spots before delegation
- `skills/belief-register/` + `scripts/beliefs.js` — explicit belief tracking with revision history
- `skills/tree-of-thought/` — N-branch exploration for high-stakes decisions
- `scripts/counterfactual-cost.js` — was this Opus call economically justified
- `scripts/calibrated-confidence.js` — replaces "high/medium/low" with actual probability per task class

**Memory v2:**
- `skills/episodic-memory/` + `scripts/episodes.js` — semantic recall over session traces
- `skills/procedural-memory/` — pattern detection across episodes → skill induction candidates
- `skills/memory-decay/` — forgetting curves so memory doesn't accumulate stale state
- `scripts/memory-diff.js` — "what changed while I was away" digest

**Trust:**
- `skills/provenance-chain/` — inline source attribution per claim
- `skills/bias-detector/` — loaded language, missing perspective, single-source synthesis flags
- `scripts/pii-redact.js` — 12-pattern PII + secrets redactor (strict mode for stricter contexts)
- `scripts/hallucination-scorer.js` — heuristic risk scoring vs cited sources
- `scripts/reversibility-scorer.js` — 0-10 scoring with undo procedures

**Cost intelligence:**
- `scripts/cost-preflight.js` — pre-flight roadmap cost estimator with confidence bands + budget gate
- `skills/budget-caps/` + `scripts/budgets.js` — per-session/project/month caps with graceful degradation
- `skills/semantic-cache/` — match new goals to past successful deliverables (TTL-aware)
- `skills/speculative-execution/` — start likely-next-task in shadow (read-only only)

**Action (working scripts):**
- `scripts/sandbox-run.js` — code execution sandbox (JS/TS/Python/Bash) with timeout + cleanup
- `scripts/long-task.js` — durable background task primitive with start/status/result/cancel/gc
- `scripts/watchers.js` — watcher config CLI (cron-based watchers work today via system cron)

**Collaboration:**
- `skills/hitl-checkpoint/` — knowledge-level pause points
- `skills/async-handoff/` — async knowledge transfer + decision rationale chain
- `skills/pair-programming-mode/` — alternative posture for in-flow coding sessions

**Learning:**
- `skills/few-shot-from-past/` — retrieve + inject similar past examples into worker briefs
- `scripts/anti-pattern-lib.js` — anti-pattern library CLI
- `scripts/reflection-journal.js` — day/week/month/quarter digest

**Reflection automation:**
- `skills/daily-standup-auto/`, `skills/weekly-retro/`, `skills/quarterly-okr-check/`
- `skills/skill-rot-detection/`, `skills/decision-review/`

**High-impact primitives:**
- `skills/why-now-detector/`, `skills/negative-space-scanner/`, `skills/dread-index/`
- `skills/time-to-regret/`, `skills/argument-strength-scorer/`

### Added (preview-in-place, marked with `preview: true` in frontmatter)

**Scaffolds** (work as scaffolds today; production wiring lands v1.4-v1.5):
- `skills/computer-use-loop/` (needs runtime computer-use API)
- `skills/external-actions/` (per-connector adapters land v1.4-v1.5)
- `skills/cross-vendor-router/` (OpenAI/Google/Ollama adapters land v1.4)
- `skills/team-memory/` (sync mechanism lands v1.5-v1.6)
- `skills/vision-roadmap/`, `skills/code-as-image/`, `skills/voice-intake/`, `skills/screen-state-aware/`, `skills/meeting-recording-pipeline/` (depend on runtime modal APIs)
- `skills/watchers-triggers/` (cron-based works; daemon for file/webhook/metric triggers v1.5)

**Surfaces** (scaffold servers; real backend wiring v1.4-v1.5):
- `surfaces/slack-bot/`, `surfaces/browser-extension/`, `surfaces/webhook-ingress/`
- `surfaces/mobile/SPEC.md`, `surfaces/hosted-saas/SPEC.md` (specs)

**Architecture docs** (for v1.4+ versions):
- `docs/A2A-PROTOCOL.md`, `docs/ENTERPRISE.md`, `docs/COMPLIANCE-MODES.md`
- `docs/FEDERATED-LEARNING.md`, `docs/MARKETPLACE-V1.5.md`, `docs/PACK-MONETIZATION.md`
- `docs/PUBLIC-SESSION-SHARING.md`, `docs/OPEN-API.md`
- `packs/pack-org-private/` (template)

### Added (launch infrastructure)

- `LAUNCH-PROFILE.md` — single source of truth for production vs preview scope
- `launch/embed-widget.html` — embeddable widget demo

### Changed

- `mcp-server/src/prompts.ts` — SPECIALIST_REGISTRY adds self-critic; SKILL_REGISTRY adds production v1.3.1 skills and clearly marks the preview section
- `.claude-plugin/plugin.json` — version 1.3.0 → 1.3.1, description rewritten, keywords expanded
- All preview skills marked with `preview: true` in frontmatter + visible banner at top
- README install verify line reflects accurate counts (23 agents, 60 skills [28 production + 32 preview], 4 commands)

### Migration

No breaking changes. v1.3.1 is purely additive over v1.3.0. Preview skills are clearly labeled; CEO loop only invokes them when the runtime exposes the required APIs.

### Why not v1.4

v1.4 ships next month (4-6 weeks out) once the preview scaffolds are wired to real backends. Holding the v1.4 banner until then prevents the trust hit of "I invoked X and got a scaffold response." See `LAUNCH-PROFILE.md` for the v1.3.1 → v1.4 → v1.5 → v1.6 sequence.

## [Unreleased — v1.4 preview track]

The 13-layer expansion described in v1.4 is in this repo as preview. When the preview scaffolds are wired to real backends, this section becomes the v1.4.0 release entry.

Tracking targets (4-6 weeks out for v1.4 production):
- Cross-vendor router (Anthropic + OpenAI working)
- Slack bot wired to real CEO loop
- Webhook ingress wired to real CEO loop
- Computer-use loop (with Claude Code computer-use MCP)
- Vision-roadmap / voice-intake / code-as-image production wiring

See `LAUNCH-PROFILE.md` for the full path and `docs/` for the architecture specs.

## [Earlier 1.4 exploration notes — preserved for traceability]

The biggest single release exploration. v1.4 closes the gap between "good plugin" and "operating system for AI-native work" by shipping primitives across every capability layer identified in the inventor-mode audit.

### Added — by layer

**L1 Cognition:** `agents/self-critic.md`, `scripts/counterfactual-cost.js`, `skills/belief-register/SKILL.md` + `scripts/beliefs.js`, `skills/tree-of-thought/SKILL.md`, `scripts/calibrated-confidence.js`.

**L2 Action:** `skills/computer-use-loop/SKILL.md`, `scripts/sandbox-run.js`, `scripts/long-task.js`, `skills/watchers-triggers/SKILL.md` + `scripts/watchers.js`, `skills/external-actions/SKILL.md`.

**L3 Memory v2:** `skills/episodic-memory/SKILL.md` + `scripts/episodes.js`, `skills/procedural-memory/SKILL.md`, `skills/memory-decay/SKILL.md`, `skills/team-memory/SKILL.md`, `scripts/memory-diff.js`.

**L4 Collaboration:** `skills/cross-vendor-router/SKILL.md`, `docs/A2A-PROTOCOL.md`, `skills/hitl-checkpoint/SKILL.md`, `skills/pair-programming-mode/SKILL.md`, `skills/async-handoff/SKILL.md`.

**L5 Learning:** `docs/FEDERATED-LEARNING.md`, `skills/few-shot-from-past/SKILL.md`, `scripts/anti-pattern-lib.js`, `scripts/reflection-journal.js`.

**L6 Trust:** `skills/provenance-chain/SKILL.md`, `scripts/pii-redact.js` (12 pattern classes + strict mode), `scripts/hallucination-scorer.js`, `skills/bias-detector/SKILL.md`, `scripts/reversibility-scorer.js`.

**L7 Sensory:** `skills/vision-roadmap/SKILL.md`, `skills/voice-intake/SKILL.md`, `skills/meeting-recording-pipeline/SKILL.md`, `skills/screen-state-aware/SKILL.md`, `skills/code-as-image/SKILL.md`.

**L8 Cost intelligence:** `scripts/cost-preflight.js` (with budget gate), `skills/budget-caps/SKILL.md` + `scripts/budgets.js`, `skills/semantic-cache/SKILL.md`, `skills/speculative-execution/SKILL.md`.

**L9 Enterprise:** `docs/ENTERPRISE.md`, `docs/COMPLIANCE-MODES.md`, `packs/pack-org-private/` template.

**L10 Interop surfaces:** `surfaces/slack-bot/` (full app-manifest + server + .env), `surfaces/browser-extension/` (manifest v3 + sidepanel + background), `surfaces/webhook-ingress/server.js` (REST API), `surfaces/mobile/SPEC.md`, `surfaces/hosted-saas/SPEC.md`.

**L11 Reflection:** `skills/daily-standup-auto/SKILL.md`, `skills/weekly-retro/SKILL.md`, `skills/quarterly-okr-check/SKILL.md`, `skills/skill-rot-detection/SKILL.md`, `skills/decision-review/SKILL.md`.

**L12 Distribution:** `docs/MARKETPLACE-V1.5.md`, `docs/PACK-MONETIZATION.md`, `launch/embed-widget.html`, `docs/PUBLIC-SESSION-SHARING.md`, `docs/OPEN-API.md`.

**L13 Specific primitives:** `skills/why-now-detector/SKILL.md`, `skills/negative-space-scanner/SKILL.md`, `skills/dread-index/SKILL.md`, `skills/time-to-regret/SKILL.md`, `skills/argument-strength-scorer/SKILL.md`.

### Changed

- `mcp-server/src/prompts.ts` — SPECIALIST_REGISTRY and SKILL_REGISTRY expanded with v1.4 entries
- `.claude-plugin/plugin.json` — version 1.3.0 → 1.4.0, description rewritten, keywords expanded

### Scope notes (production vs scaffold)

**Production-quality** (working code + tested logic): all cognition scripts, trust scripts, cost scripts, memory scripts, long-task + sandbox-run, anti-pattern lib + reflection journal, docs.

**Scaffold** (interface + logic; real backend wiring lands v1.5+): computer-use loop (needs runtime API), external-actions (needs per-connector adapters), Slack bot / browser ext / webhook ingress (scaffolds connect to real CEO loop in v1.5), mobile + hosted SaaS (specs only), A2A + federated learning (specs + reserved fields), marketplace + monetization + public sharing (specs for v1.5/v1.6).

### Migration

No breaking changes. v1.4 is purely additive — all v1.3 paths, scripts, agents, and skills continue to work. New v1.4 components coexist with existing.

## [1.3.0] — 2026-05-17

### Added — the full systemic leap

**Skills (14 stub rewrites + 2 new):**
- Rewrote every stub-tier skill from "filing cabinet" templates into operational protocols with examples, anti-patterns, worked cases, and verifier protocols. Affected: `deep-research`, `meeting-insights`, `data-analysis`, `founder-content`, `internal-comms`, `codebase-audit`, `test-driven-development`, `webapp-testing`, `mcp-builder`, `git-worktree-release`, `growth-engine`, `seo-aeo-geo`, `ui-ux-conversion`, `partnerships-outreach`.
- New skill: `context-curator` — computes minimum viable context per worker before delegation. Enforces commandment #2.
- New skill: `memory` — read/write/refresh/prune protocol for `~/.themeetpatel/memory/`.
- Rewrote `cost-ledger` as a real ledger backed by `~/.themeetpatel/ledger.jsonl` and the new `scripts/ledger.js` CLI.

**Agents:**
- New agent: `context-curator` (Haiku) — paired with the skill, called by CEO between routing and delegation.

**Domain Packs (populated):**
- `pack-founder-uae` v0.2: `uae-gtm-strategist`, `pro-services-navigator`, `whatsapp-sales-script`, `community-distribution-playbook`.
- `pack-ai-builder` v0.2: `mcp-server-architect`, `eval-harness-designer`, `claude-api-patterns`.
- `pack-growth-ops` v0.2: `funnel-diagnostics-lead`, `channel-benchmark-library`.
- Pack-aware installer: `scripts/install-pack.sh` with `--list`, `--installed`, `--uninstall`.
- `docs/PACK-INSTALL.md` and `docs/PACK-MARKETPLACE.md` (v1.5 vision).

**Verifier scripts (per-class, runnable):**
- `scripts/verify/verify-code.js` — runs tests, type checks, lint, scans for smells/secrets.
- `scripts/verify/verify-content.js` — anti-pattern detector + lived-specificity counter.
- `scripts/verify/verify-roadmap.js` — DAG walker, atomicity check, dependency validator.
- `scripts/verify/verify-research.js` — citation density, source-tier classifier, required-section check.

**Cost ledger + telemetry:**
- `scripts/ledger.js` — CLI for cost report, savings, waste, verifier health.
- `scripts/log-routing.js` rewritten to write structured `ledger.jsonl` rows (in addition to legacy routing.log).
- `scripts/skill-telemetry.js` — record + report which skills get loaded.

**Routing eval expansion:**
- `evals/routing-eval.jsonl` grown from 64 to 104+ cases including 41 adversarial.
- Router patterns added: `architect `, `diagnose`, `tradeoff analysis`, `chunking strategy`, `multi-region`, `explain why`, `which 3 features to cut`, `pricing model`.
- Final accuracy on the expanded set: **100% overall, 100% adversarial.**

**Memory layer:**
- `~/.themeetpatel/memory/default.json` schema + `scripts/memory-init.js` bootstrap.
- CEO Phase 1 reads memory before clarifying questions.

**MCP server hardening:**
- `mcp-server/src/audit.ts` — per-tool audit log to `~/.themeetpatel/audit.jsonl`.
- Per-session tool budgets enforced (e.g., 200 calls/session for `route_task`).
- Approval-gate framework (`requiresApproval`) ready for v1.4 mutating tools.
- All MCP tools wrapped in `guarded()` for consistent error + audit handling.
- `mcp-server/docs/security-model.md` rewritten with v1.3 hardening + roadmap.

**Distribution kit:**
- `launch/dashboard.html` — visual session dashboard (screenshot-ready).
- `launch/landing.html` — themeetpatel.dev marketing page.
- `launch/screenshot-kit.md` — exact shotlist for marketplace / LinkedIn.
- `scripts/github-init.sh` — guided GitHub publish prep.
- `.github/workflows/ci.yml` — CI gating routing eval + verifier smoke tests.

**Documentation:**
- `docs/AGENT-CONSOLIDATION.md` — v1.5 deprecation plan for redundant skill/agent pairs.
- `examples/` — 10 worked example goals with expected roadmaps.

### Changed
- CEO loop now has 7 phases (was 6 in v1.2, was 5 in v1.0): Intake reads memory; Phase 4 calls context-curator; Phase 5 calls verifier; Phase 6 synthesizes; Phase 7 recovery.
- Synthesizer exec summary expanded to 6 lines including `VERIFIED:`.
- `mcp-server/src/prompts.ts` SPECIALIST_REGISTRY and SKILL_REGISTRY updated for v1.3 additions.
- Plugin description expanded to reflect v1.3 capabilities.

### Fixed
- Router missed several Opus-signal patterns ("architect", "diagnose", multi-step strategic decisions). All fixed; eval gates passing.

## [1.2.0] — 2026-05-17

### Added — the verification + learning leap

- **`verifier` agent** (`agents/verifier.md`) — the new flagship primitive. Proves a worker's claimed deliverable against acceptance criteria with per-class evidence-based checks (code, research, content, strategy, roadmap, integration, data, security, ops, comms). Converts "shipped" from a claim into a measurement.
- **`verification` skill** (`skills/verification/SKILL.md`) — the workflow the verifier uses. Per-class verification protocols, anti-patterns, escalation rules, and a strict output contract that downstream tools can parse.
- **Verifier wired into CEO loop** — `god-mode-ceo.md` now runs a mandatory Phase 5 (Verify) before Phase 6 (Synthesize). The synthesizer now consumes verifier verdicts and the exec summary includes a `VERIFIED:` line.
- **Learning router** — `mcp-server/src/router.ts` rewritten from `string.includes()` keyword bingo to weighted multi-signal pattern scoring with optional learned weight overrides loaded from `~/.themeetpatel/router-weights.json`.
- **`scripts/route-learn.js`** — reads `~/.themeetpatel/ledger.jsonl`, computes per-pattern accuracy, and writes weight overrides the router picks up on next boot.
- **`scripts/route-accuracy.js`** — stratified eval runner with per-bucket scores and adversarial-failure highlighting.
- **Expanded routing eval set** — `evals/routing-eval.jsonl` grew from 5 cases to 64, including 10 adversarial cases (keyword traps). Current accuracy: 100% overall, 100% adversarial.
- **`mcp-server/src/eval-routing.ts`** — stratified, with gates: overall ≥ 85%, adversarial ≥ 70%.
- **`LICENSE`** — explicit MIT file (previously only mentioned in README).
- **`CHANGELOG.md`** — this file.
- **`CONTRIBUTING.md`** — contribution guide.

### Changed

- **Hook scripts** (`scripts/log-routing.js`, `scripts/session-summary.js`) — write to `~/.themeetpatel/routing.log` instead of `<cwd>/.themeetpatel/routing.log` so they no longer pollute every project the user runs Claude Code in.
- **`agents/god-mode-ceo.md`** — added Phase 5 (Verify), renumbered Phases 6 (Synthesis) and 7 (Recovery).
- **`agents/synthesizer.md`** — now consumes verifier verdicts; exec summary has 6 lines (added `VERIFIED:`).
- **`mcp-server/src/prompts.ts`** — added verifier to `SPECIALIST_REGISTRY` and verification to `SKILL_REGISTRY`.
- **README** — updated agent count from 20 → 21 (added `verifier`) and skill count from 23 → 24 (added `verification`).

### Fixed

- Router was order-dependent first-match bingo; now uses weighted scoring with explicit dominance thresholds.
- Adversarial keyword traps ("summarize this architecture decision", "refactor the security review module", etc.) now route correctly.
- README count mismatch with actual file count.

## [1.1.0] — earlier

- Added 15 specialist agents across product, growth, research, engineering, security, QA, DevOps, data, content, sales, UX, integrations, prompt systems, operations, and finance.
- Added 19 production-grade skills.
- Added MCP specialist resources and prompt entries for specialist selection.

## [1.0.0] — earlier

- Added full MCP server.
- Added deterministic routing engine.
- Added persistent cross-client sessions.
- Added MCP tools, resources, prompts.
- Added example configs for Claude Desktop and Cursor.

## [0.1.0] — earlier

- Initial Claude Code plugin: CEO, three worker specialists, synthesizer, router skill, roadmap builder, four commands, four portable variants.
