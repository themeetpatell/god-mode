# Pack Marketplace (v1.5 — buildable)

The v1.3 doc `docs/PACK-MARKETPLACE.md` was a vision sketch. This is the concrete buildable spec for v1.5.

## Architecture

```
Marketplace = (Registry) + (Pack-server) + (Discovery UI)

Registry:        Hosted JSON manifest of all known packs (with version, author, signature, install count)
Pack-server:     Static-ish file server that serves pack tarballs (CDN-backed)
Discovery UI:    Web search/browse + in-CLI search via `god-mode pack search`
```

## Manifest format (registry-level)

A central `registry.json` published by the marketplace operator:

```json
{
  "version": "registry-1",
  "updated_at": "ISO",
  "packs": [
    {
      "name": "pack-founder-uae",
      "latest_version": "0.3.0",
      "versions": [
        { "version": "0.3.0", "tarball_url": "https://cdn.themeetpatel.dev/packs/pack-founder-uae-0.3.0.tgz", "sha256": "...", "signed_by": "themeetpatel:ed25519-pubkey-hex", "published_at": "ISO" },
        { "version": "0.2.0", "tarball_url": "...", "...": "..." }
      ],
      "description": "...",
      "icp": "...",
      "author": { "name": "Meet Patel", "url": "https://github.com/themeetpatel" },
      "license": "MIT",
      "compliance": ["uae-pdpl"],
      "install_count": 1247,
      "depends_on": ["core@>=1.3.0 <2.0.0"]
    }
  ]
}
```

## CLI flow

```bash
# Search the registry
god-mode pack search "uae"
god-mode pack search "growth ops"

# View pack details
god-mode pack info pack-founder-uae

# Install latest from registry
god-mode pack install pack-founder-uae

# Install specific version
god-mode pack install pack-founder-uae@0.2.0

# Update
god-mode pack update pack-founder-uae

# List installed
god-mode pack list

# Uninstall
god-mode pack uninstall pack-founder-uae

# Verify signature of installed pack
god-mode pack verify pack-founder-uae
```

## Publishing flow

```bash
# Sign + publish (author side)
cd packs/pack-founder-uae
god-mode pack publish --key ~/.themeetpatel/keys/publish.ed25519
# → uploads tarball to CDN, updates registry manifest, prints install command
```

## Trust model

Three levels:

| Level | Description |
|---|---|
| **Verified author** | Author identity confirmed (GitHub OAuth + domain attestation) |
| **Signed pack** | Pack manifest signed with author's published pubkey |
| **Reviewed** | Maintained by the core team or a community member; passed a review checklist |

Unsigned packs install with a warning. Unverified-author packs install with a stronger warning. Reviewed packs get a green badge in the discovery UI.

## Registry self-host

Anyone can run their own registry. The CLI accepts a `--registry <url>` flag. Useful for:
- Enterprise private registries
- Forks of the official registry
- Air-gapped environments

## Discovery UI (web)

A simple Next.js site at themeetpatel.dev/marketplace:
- Browse by category (founder, growth, AI-builder, ops, vertical-specific)
- Search by keyword + ICP
- Filter by license, compliance, signed status
- One-click install commands
- Author profiles
- Install counts + review counts

## Anti-patterns

- ❌ Closed registry that locks out community contributions
- ❌ "Verified" status that becomes pay-to-play
- ❌ Install metrics that can be gamed
- ❌ Registry without redundancy / mirroring
- ❌ Centralized auth that becomes a single point of failure

## Build effort (v1.5)

| Item | Effort |
|---|---|
| Registry manifest schema + Postgres-backed store | 2-3 days |
| Pack-server (S3 + CloudFront) | 1 day |
| `god-mode pack` CLI commands | 3-4 days |
| Signing + verification | 2-3 days |
| Web discovery UI (Next.js) | 5-7 days |
| Author auth (GitHub OAuth) | 1-2 days |
| Migration docs from v1.4 local-only | 1 day |

Total: ~3-4 weeks of one engineer's time. Doable.

## What v1.4 ships

- This spec (the artifact)
- The signing keypair format
- Tarball format for packs

## What v1.5 ships

- Working registry + pack-server
- CLI commands above
- Discovery UI MVP

## What v1.6 ships

- Monetization (paid packs)
- Review/rating system
- Author dashboards
