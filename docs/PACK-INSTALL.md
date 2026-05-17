# Pack installation

Domain Packs install on top of the core God Mode plugin to localize the CEO's behavior for a specific operator role.

## Quick start

```bash
cd /path/to/themeetpatel
./scripts/install-pack.sh --list
./scripts/install-pack.sh pack-founder-uae
```

Then restart Claude Code (or your MCP client) so the CEO picks up the new agents and skills.

## How install works

`install-pack.sh`:
1. Validates the pack's `pack.json` and resolves dependencies
2. Mirrors `packs/<pack>/agents/*.md` into the root `agents/` directory
3. Mirrors `packs/<pack>/skills/*/` into the root `skills/` directory
4. Copies any `packs/<pack>/commands/*.md` into the root `commands/` directory
5. Records the install in `~/.themeetpatel/installed-packs.json`

The reason for mirroring (instead of running packs from their own folder) is that Claude Code's plugin spec expects all agents under `agents/` and skills under `skills/`. The mirror gives us pack semantics without needing a fork of the plugin runtime.

In v1.4 we'll move to a pack-native loader and remove the mirror step.

## Listing & uninstalling

```bash
./scripts/install-pack.sh --installed              # what's installed
./scripts/install-pack.sh --uninstall pack-name    # remove a pack
```

Uninstall removes the mirrored files and updates the registry. Your own modifications to those files will be removed too — if you've forked an agent, save it elsewhere first.

## Available packs (v1.3)

| Pack | ICP | Status |
|---|---|---|
| `pack-founder-uae` | B2B founder selling to UAE/GCC SMBs or NRI segments | v0.2 — 2 agents, 2 skills |
| `pack-ai-builder` | Engineer building on Claude/OpenAI/MCP | v0.2 — 2 agents, 1 skill |
| `pack-growth-ops` | Founder/growth lead running B2B funnel + lifecycle | v0.2 — 1 agent, 1 skill |
| `pack-investor-ops` | Investor running portfolio diligence / memos | not yet shipped |
| `pack-ceo-rhythms` | CEO running EOS / V/TO / L10 / scorecards | not yet shipped |
| `pack-content-system` | Founder running founder-led content engine | not yet shipped |

## Authoring a new pack

1. Create `packs/<pack-name>/pack.json` with `name`, `version`, `description`, `dependsOn: ["core"]`, `icp`.
2. Add `agents/`, `skills/`, optional `commands/`.
3. Every agent has YAML frontmatter (`name`, `description`, `tools`, `model`).
4. Every skill is a folder containing `SKILL.md` with YAML frontmatter (`name`, `description`).
5. Test install on a clean repo: `./scripts/install-pack.sh <pack-name>` then verify counts.
6. Open a PR — see `CONTRIBUTING.md` for the bar.

## Idempotency and re-installs

`install-pack.sh` is idempotent. Re-running on an already-installed pack overwrites the files (useful for development). The registry is updated to reflect the latest install timestamp.

## What happens to root `agents/` and `skills/`?

In v1.3 (now), packs mirror into the root directories. The root files are the source of truth Claude Code reads from. If a pack and a root file conflict (same filename), the pack overwrites — install is destructive in that sense.

In v1.4, the loader will read from `packs/` directly and the mirror step will be removed. Backward-compat: a thin symlink layer will keep existing flat-layout installs working.

## Troubleshooting

**"Pack not found"** — confirm the pack directory exists in `packs/`. Check the spelling.

**Agents not showing up after install** — restart Claude Code. Plugin discovery only runs at startup.

**`jq not found` warning** — install `jq` for atomic registry updates. The script will still work without it but with a less-safe registry write.

**Conflict between two packs** — packs shouldn't define the same agent/skill name. If they do, the most recently installed wins. Refactor one to use a different name.
