# pack-org-private (template)

This is a template pack for organizations to create their own private pack of agents, skills, prompts, and SOPs that never ship to the public marketplace.

## Why a template

Every org has its own:
- Compliance flows
- Internal SOPs
- Approved vendors
- Voice / brand rules
- Decision-rights matrices
- Onboarding processes

These belong in a pack — narrow, opinionated, only shared inside the org.

## Quick start

```bash
# Clone this template
cp -r packs/pack-org-private packs/pack-<your-org>

# Edit pack.json
# Add your private agents/skills

# Install for your team
./scripts/install-pack.sh pack-<your-org>

# Optional: distribute via your team's git repo
git add packs/pack-<your-org>
git commit -m "Add org-private pack"
```

## Suggested structure

```
packs/pack-<your-org>/
  pack.json
  README.md
  agents/
    <role>-decision-rights.md     ← who can approve what
    <vendor>-procurement.md       ← how we buy from this vendor
    internal-comms-style.md       ← our specific voice + escalation
  skills/
    company-sop-<process>/        ← step-by-step SOPs
    quarterly-okr-template/       ← how we plan
    customer-onboarding-checklist/
    incident-response-runbook/
  prompts/
    <recurring-template>.md
  memory/
    seed.json                     ← initial facts for new team members
```

## Pack rules for org-private

1. **Don't publish to a public marketplace.** Set `"private": true` in pack.json.
2. **Don't include secrets.** Even in private packs. Secrets live in env vars / vault.
3. **Document the maintainer.** Who in the org owns this pack?
4. **Version it.** When you change an SOP, bump the pack version.
5. **Tag compliance modes.** If the pack depends on a compliance setting, declare it.

## Distribution within the org

Three options:

1. **Shared filesystem** (Dropbox / GDrive / iCloud) — simple, no infra
2. **Internal git repo** — versioned, code-review-able
3. **Self-hosted pack server** (v1.5+) — discovery + auto-update

## Example: a finance-ops pack for Finanshels

```
packs/pack-finanshels-internal/
  agents/
    invoice-approver.md           ← matches Finanshels' approval matrix
    vat-filing-checklist.md       ← UAE FTA-specific
  skills/
    monthly-close-runbook/
    client-onboarding-flow/
    pricing-quote-builder/        ← matches Finanshels pricing tables
  memory/
    seed.json                     ← packages, pricing, ICP
```

## What v1.4 ships

- This template
- Pack.json with `"private": true` flag
- Install script that respects private flag (won't list publicly)

## What v1.5 ships

- Org-pack auto-discovery from a shared location
- Version drift warnings when a team member is on an older pack version

## What v1.6 ships

- Pack-server self-hosted for orgs that want a registry of their own
