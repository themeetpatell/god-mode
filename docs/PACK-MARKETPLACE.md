# Pack marketplace (v1.5 vision)

A future "Pack Marketplace" lets contributors publish Domain Packs that anyone can install on top of the God Mode core. This doc is the spec we're building toward and the rules contributors should know now.

## Why a marketplace

The flat plugin model (one author, one fixed bundle) doesn't scale once the operator universe diverges. A growth-ops person and an AI-builder don't want the same agents installed. A founder in UAE shipping to NRI segments and a founder in Berlin shipping to enterprise are doing different work.

Marketplace = lots of packs, install what fits, swap in/out as your role changes.

## Architecture (v1.5 target)

| Layer | Role |
|---|---|
| **Core** | God Mode orchestration (CEO, router, roadmap, verifier, synthesizer, handoff, context-curator, memory) |
| **Pack registry** | A discoverable list of packs (initially in this repo's `packs/`, eventually a hosted index) |
| **Pack installer** | `scripts/install-pack.sh` (today) → first-class `/pack install <name>` in Claude Code (v1.5) |
| **Pack manifest** | `packs/<name>/pack.json` with version + deps + ICP |
| **Pack signing** | Optional but recommended — manifests signed by author key |
| **Pack telemetry** | Opt-in usage counts so authors know what's actually getting installed |

## What can be in a pack

- **Agents** — domain-specialized agents
- **Skills** — narrow recurring workflows
- **Commands** — slash commands
- **Prompts** — reusable LLM prompts
- **Seed memory** — initial facts for the memory layer
- **Eval cases** — pack-specific routing-eval rows

What's NOT in a pack:
- Core orchestration changes (those live in core)
- New router-pattern weights (those live in `~/.themeetpatel/router-weights.json` after learning)
- Anything that conflicts with another pack's namespaces

## Naming

Pack names must:
- Start with `pack-`
- Use kebab-case
- Be globally unique in the registry
- Describe the role, not the brand (`pack-uae-founder` good, `pack-meetpatel` bad)

Agent names within a pack must not collide with core agent names or other pack agent names. The installer warns on collision and the most-recently-installed wins (with audit log).

## Pack tiers

| Tier | Description |
|---|---|
| **Core packs** | Maintained by the God Mode core team. Stable, eval-gated, security-reviewed. |
| **Community packs** | Maintained by contributors. Listed in registry with author attestation. |
| **Local packs** | Authored privately for one team/company. Never published. |

## Quality bar for inclusion in registry

A pack ships to the registry only if:

1. **Manifest valid** — `pack.json` parseable, version present, ICP one sentence
2. **README present** — describes ICP, what it adds, install one-liner, status
3. **At least 1 agent or 1 skill** — empty packs don't ship
4. **Every agent has YAML frontmatter** with `name`, `description`, `tools`, `model`
5. **Every skill is a folder** with `SKILL.md` + valid frontmatter
6. **No conflicts with core or other registry packs** at install time
7. **`dependsOn: ["core"]`** explicit
8. **License**: MIT or compatible
9. **Author identity**: real name + verifiable handle (GitHub + LinkedIn)
10. **No external network calls without disclosure** — packs that hit third-party APIs must document them in pack.json

## Contributor flow (v1.5 target)

```bash
# 1. Author your pack
mkdir packs/pack-mything
# ... add pack.json, agents/, skills/

# 2. Local install + test
./scripts/install-pack.sh pack-mything

# 3. Run the pack-specific eval
node scripts/route-accuracy.js --eval packs/pack-mything/evals/

# 4. Open PR with: manifest + README + at least 1 worked example
```

## Pack discovery (v1.5 target)

From inside Claude Code or any God Mode runtime:

```
/pack search <keyword>
/pack list
/pack install <name>
/pack uninstall <name>
/pack info <name>
```

For now (v1.3), use `./scripts/install-pack.sh --list` and `./scripts/install-pack.sh <name>`.

## Pack telemetry (opt-in, v1.5)

When a user installs a pack, an opt-in event records:
- pack name + version
- install timestamp
- anonymized session count of how often the pack's agents/skills get triggered

The data goes nowhere by default. If the user opts in, anonymized counts ship to a hosted endpoint that pack authors can query. The point is to let authors deprecate dead skills.

## Manifest signing (v1.5)

To prevent supply-chain attacks, signed manifests:

```json
{
  "name": "pack-mything",
  "version": "0.3.0",
  "...": "...",
  "signature": {
    "method": "ed25519",
    "public_key": "...",
    "signed_at": "ISO",
    "sig": "..."
  }
}
```

The installer verifies the signature against a registry-of-known-authors before installing. Unsigned packs install with a warning.

## Anti-patterns (what we'll reject from the registry)

- ❌ Packs that overlap heavily with core (replace, don't extend)
- ❌ Packs that ship secrets / API keys
- ❌ Packs that override another pack's agents silently
- ❌ Packs whose agents prompt-inject into the CEO's behavior
- ❌ Packs that scrape user data or telemetry
- ❌ Packs whose only purpose is to drive traffic to a vendor

## What you can contribute today (v1.3)

While the marketplace is just `packs/` in this repo:

1. Fork the repo
2. Add `packs/pack-yourname/` following the structure of `pack-founder-uae`
3. Test install: `./scripts/install-pack.sh pack-yourname`
4. PR with manifest, README, at least 1 worked example, at least 1 routing-eval case

See `CONTRIBUTING.md` for the bar.

## Versioning

Packs follow semver:
- Major: breaks pack consumers (agent renamed, skill removed)
- Minor: new agents/skills
- Patch: fixes within existing files

Core ships at a separate cadence. Packs declare a compatibility range:

```json
{ "dependsOn": ["core@>=1.3.0 <2.0.0"] }
```

## Why we're not shipping the marketplace in v1.3

- Pack-aware installer just landed (v1.3)
- Signing infrastructure is non-trivial and not yet built
- Discovery UX requires Claude Code plugin spec support that isn't there yet
- We want the first 5 packs to ship in `packs/` so we learn what conventions actually matter

v1.5 is the marketplace. v1.4 hardens the local pack experience and adds deprecation tooling.
