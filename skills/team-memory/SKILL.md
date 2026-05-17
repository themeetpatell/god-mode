---
name: team-memory
description: Multi-user / team-shared memory layer. Multiple humans (founders, exec team, agency partners) see the same shared facts/beliefs/episodes with RBAC. Critical for "company-level God Mode" instead of "one person's God Mode." Scaffold in v1.4 — production sync mechanics land alongside enterprise features in v1.6.
preview: true
preview_reason: "Schema + RBAC spec shipped. Real sync mechanism (team server) lands in v1.5-v1.6."
---

> ⚠ **PREVIEW** — Spec + RBAC schema only; file-based sync via Dropbox/iCloud works today, hosted sync lands v1.5+. See [LAUNCH-PROFILE.md](../../LAUNCH-PROFILE.md).


# Team Memory

The single-user assumption of v1.3 breaks the moment a team uses the system. This skill defines the shared-memory layer + role-based access.

## Use cases

- 3-founder team where all three want shared context
- Agency client where the agency principal + the client both touch the memory
- Investor + portfolio company where the investor needs read-only access
- Multi-team enterprise where each team owns a memory slice

## Architecture

```
~/.themeetpatel/
  memory/
    default.json              ← personal (user-only)
    team-<slug>.json          ← team-shared (multi-user)
  team-config.json            ← team membership + roles
```

`team-config.json`:

```json
{
  "team_slug": "finanshels-leadership",
  "members": [
    { "user_id": "meet@finanshels.com", "role": "owner" },
    { "user_id": "founder2@finanshels.com", "role": "admin" },
    { "user_id": "advisor@x.com", "role": "reader" }
  ],
  "scopes": {
    "owner": ["read", "write", "revise", "delete", "manage"],
    "admin": ["read", "write", "revise"],
    "writer": ["read", "write"],
    "reader": ["read"]
  }
}
```

## Sync model (v1.4 scaffold → v1.6 production)

v1.4 (now): file-based sync via a shared filesystem (e.g., Dropbox, Google Drive, iCloud Drive) or via the team's own git repo. The system reads/writes `team-<slug>.json` like any local file; the underlying sync is the user's responsibility.

v1.5: optional peer-to-peer sync via a tiny relay server you self-host.

v1.6: managed sync (with optional encryption-at-rest, audit log, conflict resolution UI) — paid tier or self-hosted server.

## Conflict resolution (v1.4)

The team-memory file uses last-writer-wins per top-level key, with a per-key updated_at timestamp. When two writes conflict:
- Same key, same value (different timestamps) → keep latest
- Same key, different values → flag conflict, surface to user on next session start
- New keys from either side → merge

Conflicts logged to `~/.themeetpatel/team-memory-conflicts.jsonl`.

## CEO read protocol

Phase 1 (Intake):
1. Read personal `memory/default.json`
2. Read team `memory/team-<slug>.json` if the user is in any team
3. Personal facts override team facts (your preference wins for you)
4. Team-level beliefs / company stack / company decisions surface in the goal restatement

## Write protocol

Writes default to personal memory. To write to team memory, the user must:
- Be a member with `write` scope
- Explicitly invoke "team memory" intent ("remember this for the team: …")
- Or the CEO infers team-level relevance ("this is a stack decision, write to team-finanshels-leadership")

## RBAC enforcement

The system refuses writes when role lacks scope. Audit log captures attempts.

## Anti-patterns

- ❌ Auto-writing personal context to team memory ("I think X" ≠ "the team thinks X")
- ❌ Storing PII about individual team members in shared memory
- ❌ Storing competitive secrets or M&A discussions in shared memory without explicit pin
- ❌ Letting `reader` role members trigger writes (RBAC must enforce)

## Output contract

```
═══ TEAM MEMORY OPERATION ═══
Team: <slug>
Operation: <read | write | revise | resolve-conflict>

ROLE CHECK: <user_id> has <role>, scope <ok|denied>

READ:
  Personal facts loaded: <n>
  Team facts loaded: <n>
  Personal overrides: <list of keys>

WRITE:
  Target: personal | team-<slug>
  Field: <key>
  Reason: <why team scope>

CONFLICTS DETECTED: <if any, with resolution choice>

LOGGED TO: ~/.themeetpatel/team-memory-audit.jsonl
```

## Verification

The verifier (class: ops) will:
1. Confirm RBAC was checked before any write.
2. Confirm PII / secret patterns are rejected for team-shared.
3. Confirm conflicts are logged, not silently overwritten.
4. Confirm personal memory keys don't accidentally leak into team file.
