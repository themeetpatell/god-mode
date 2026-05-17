# Public session sharing (opt-in)

The best practices spread when sessions are share-able. This doc specs how that works without leaking private context.

## Why share

- Other users learn from "here's a session that worked"
- Pack authors get feedback on what their pack enables in practice
- The community builds a library of canonical examples by domain
- New users see "look, this is what this thing actually does" before installing

## What's in a shareable session

A snapshot containing:
- Goal (verbatim)
- Roadmap (the routed plan)
- Per-task outputs (the artifacts) — PII-redacted
- Verifier verdicts
- Final exec summary
- Cost + time
- Skills/agents/packs invoked
- Tags

What's NOT included:
- Memory facts (private user state)
- Beliefs (private)
- Connector data (auth, account info)
- Original conversation context beyond the goal
- Other users' contributions (if team-shared)

## Sharing flow

```bash
# Author side
god-mode session export ep-abc --redact-pii --strip-internal
  → produces a self-contained JSON ready to publish

god-mode session publish ep-abc.json --title "How I shipped a Next.js landing in 18 min"
  → uploads to community gallery (with author identity), returns share URL

# Reader side
god-mode session import https://themeetpatel.dev/gallery/sess-xyz
  → reads the shared session
  → optionally replays the roadmap on their own goal (with substitutions)
```

## Replay mode

A shared session can be "replayed" — the receiver runs the same roadmap structure with their own input. Useful for:
- "Run this customer-call-followup template on my last call"
- "Re-do this codebase audit on my repo"
- "Use this content carousel structure for my launch"

The replay swaps the original goal/inputs for the receiver's. Roadmap structure, routing, and skill invocations carry over.

## Privacy guardrails

Before publishing, the tool runs:
1. PII redaction (using `scripts/pii-redact.js --strict`)
2. Connector data scrub (remove account IDs, file paths under home)
3. Secret detection (refuses to publish if ANY secret pattern found)
4. Memory/belief reference scrub (no internal IDs that would leak structure)
5. Author confirmation prompt with a final preview

If anything fails the scrub, publishing refuses.

## License on shared sessions

Default: CC BY-SA 4.0 (sharable, attributable, modifications must share-alike).
Author can pick CC0 (public domain) or proprietary on publish.

## Gallery layout (themeetpatel.dev/gallery)

- Filter by domain / pack / skill
- Sort by likes / recency / cost-efficiency / verifier pass rate
- Per-session: full transcript + replay button + author profile
- Search by goal keyword

## Anti-patterns

- ❌ Auto-sharing (always explicit author opt-in)
- ❌ Sharing without redaction
- ❌ Allowing "fake" sessions (must be real recorded sessions, not constructed examples)
- ❌ Gallery that becomes spam (require email verification for publishers)
- ❌ Replay that doesn't disclose attribution to the original author

## What v1.4 ships

- This spec
- Export format schema
- Redaction pass integrated with `pii-redact.js` (already exists)

## What v1.5 ships

- `god-mode session export/publish/import` CLI
- Hosted gallery at themeetpatel.dev/gallery
- Replay command

## What v1.6 ships

- Likes / reviews / comments on shared sessions
- Author profiles + reputation
- "Featured this week" curation
