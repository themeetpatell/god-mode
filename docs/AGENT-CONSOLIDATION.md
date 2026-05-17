# Agent consolidation plan (v1.3 → v1.5 deprecation)

The v1.1 expansion gave us 17 specialist agents (now 23 with v1.2 + v1.3 additions). Many overlap behaviorally with each other or with skills. This doc maps the overlaps and the planned consolidation path.

## Why consolidate

When the CEO has to pick between 23 agents that 50% of the time would produce structurally identical output, two things happen:
1. The CEO routes inconsistently across sessions (low determinism).
2. Users learn the system slower because "which agent does X" has too many right answers.

The fix is fewer, sharper agents — each with a behavior that genuinely doesn't overlap with another. The bar: if you can swap agent A for agent B on a representative task and get a roughly equivalent deliverable, one of them shouldn't exist.

## Current agent roster (v1.3)

**Core orchestration (6) — keep all**
- `god-mode-ceo` · `haiku-specialist` · `sonnet-engineer` · `opus-architect` · `synthesizer` · `verifier` · `context-curator`

**Specialists (17)**
- `product-strategist`
- `growth-architect`
- `research-analyst`
- `codebase-auditor`
- `security-officer`
- `qa-tester`
- `devops-release-manager`
- `data-analyst`
- `content-strategist`
- `sales-copywriter`
- `ux-conversion-designer`
- `integration-architect`
- `prompt-systems-engineer`
- `chief-of-staff-ops`
- `finance-ops-analyst`
- (+ pack agents installed separately)

## Overlap map

| Agent A | Agent B | Overlap | Verdict |
|---|---|---|---|
| `growth-architect` | skill `growth-engine` | ~90% — agent and skill say the same things | **Merge skill INTO agent's behavior; deprecate skill in v1.5** |
| `codebase-auditor` | skill `codebase-audit` | ~85% | **Merge skill INTO agent; deprecate skill** |
| `security-officer` | skill `security-review` | ~80% | **Merge** |
| `ux-conversion-designer` | skill `ui-ux-conversion` | ~85% | **Merge** |
| `research-analyst` | skill `deep-research` | ~75% | Keep both — agent is a behavior, skill is a recurring workflow |
| `content-strategist` | `sales-copywriter` | ~60% (both produce distribution text) | **Consolidate into `writer` agent with mode flag** |
| `content-strategist` | skill `founder-content` | ~70% | Skill stays, agent stays — agent invokes skill |
| `chief-of-staff-ops` | skill `internal-comms` | ~50% — different concerns | Keep both |
| `data-analyst` | skill `data-analysis` | ~80% | **Merge** |
| `qa-tester` | skill `webapp-testing` | ~75% | **Merge** |
| `devops-release-manager` | skill `git-worktree-release` | ~40% | Keep both (different scopes) |
| `integration-architect` | skill `mcp-builder` | ~50% | Keep both (skill is a subset workflow) |
| `prompt-systems-engineer` | skill `prompt-engineering` | ~70% | **Merge** |
| `prompt-systems-engineer` | skill `skill-creator` | ~60% | Keep skill (specific output: a new skill file) |
| `product-strategist` | `growth-architect` | ~40% (overlap on roadmap + GTM-product alignment) | Keep both, sharpen handoff |
| `finance-ops-analyst` | `chief-of-staff-ops` | ~30% (overlap on scorecards) | Keep both |

## The 5 specific consolidations for v1.5

These are the ones we'll actually do.

### Consolidation 1: Merge skill `growth-engine` → agent `growth-architect`

- The agent's output contract already contains everything the skill prescribes
- Skill becomes a "see also" reference in the agent
- Move the channel-benchmark table into `pack-growth-ops/skills/channel-benchmark-library` (already there)
- **v1.4**: skill marked deprecated, both still work
- **v1.5**: skill removed; agent contract is canonical

### Consolidation 2: Merge skill `codebase-audit` → agent `codebase-auditor`

- Same overlap reasoning
- **v1.4**: deprecation notice
- **v1.5**: skill removed

### Consolidation 3: Merge skill `security-review` → agent `security-officer`

- Same
- **v1.4**: deprecation notice
- **v1.5**: skill removed

### Consolidation 4: Merge skill `ui-ux-conversion` → agent `ux-conversion-designer`

- Same
- **v1.4**: deprecation notice
- **v1.5**: skill removed

### Consolidation 5: Collapse `content-strategist` + `sales-copywriter` → `writer` (with mode flag)

- One agent, two modes: `mode: "content"` for founder/distribution writing, `mode: "sales"` for outreach/copy
- Reduces "which one do I call" ambiguity
- **v1.4**: both old agents marked deprecated, both still work
- **v1.5**: removed; CEO routes to `writer` with appropriate mode

## What's NOT being consolidated (and why)

- **All 6 core orchestration agents** stay — each has a genuinely different job
- **`product-strategist` + `growth-architect`** — they overlap on GTM-product alignment but the core scope of each is different (product decisions vs growth-system design). The fix is sharper handoff prompts, not consolidation.
- **`finance-ops-analyst` + `chief-of-staff-ops`** — finance has specific compliance/billing surface that doesn't fit cleanly under ops
- **`data-analyst`** stays despite skill overlap because it's the agent the CEO routes to; the skill workflow is what the agent uses
- **`integration-architect`** stays — its scope is broader than just MCP

## Deprecation policy

For v1.5 consolidations:

1. **v1.4** (next release): skill file gets a `DEPRECATED:` header on line 1, plus a redirect note pointing to the agent. Skill still loads and works.
2. **v1.4 + 90 days**: CHANGELOG warns users.
3. **v1.5**: skill removed. Agent's output contract is canonical. README and registry are updated.

This is a 6-month deprecation window minimum.

## Backward compatibility

Existing user prompts that reference deprecated skills will still work in v1.4 (with a warning). In v1.5, prompts referencing removed skills will trigger a one-line "renamed to X" hint from the CEO and route to the replacement.

## Tracking

| Item | Status | Target |
|---|---|---|
| Deprecation notices in skill files | not yet | v1.4 |
| CHANGELOG warnings | not yet | v1.4 |
| Agent output contracts updated to subsume skill workflows | not yet | v1.4 |
| Skill removal | not yet | v1.5 |
| README/registry update | not yet | v1.5 |
| Migration guide for users | not yet | v1.4 |

## Why not do all of this now

Two reasons:
1. **Users have prompts in production that reference current skill names.** Breaking those without warning is hostile.
2. **v1.3 is already a large release.** Stacking a behavioral consolidation on top would mean two coupled migrations.

v1.4 is the bridge. v1.5 is the consolidation.
