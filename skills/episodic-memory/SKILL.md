---
name: episodic-memory
description: "Use to record and retrieve sessions semantically. Different from key-value memory (facts the user states): episodic memory holds full session traces — goal, decisions, artifacts, verifier outcomes — vector-indexed for \"what did we decide about X back in March\" recall. Backed by ~/.themeetpatel/episodes/ + a naive embedding index that upgrades to a real vector DB in v1.5."
---

# Episodic Memory

Memory v1.3 stores user-stated facts. Episodic memory stores what *happened* in sessions. Together they let session N actually feel like the system has been with you the whole time.

## When to write

- At the end of any God Mode session that produced a deliverable
- After any decision reached via tree-of-thought
- After any verifier verdict (pass/conditional/fail)
- After any belief register write

The synthesizer's exec summary becomes the canonical episode header.

## When to read

- Phase 1 (Intake) of every new session — retrieve top-3 episodes semantically related to the new goal
- When the user asks "what did we decide about X" / "when did we last work on Y"
- When the self-critic agent looks for prior plan patterns to avoid
- When the few-shot-from-past skill needs example outputs

## Episode schema

`~/.themeetpatel/episodes/<id>.json`:

```json
{
  "id": "ep-<short>",
  "session_id": "<from ledger>",
  "ts_start": "ISO",
  "ts_end": "ISO",
  "goal": "<one sentence>",
  "phases": [
    { "phase": 1, "name": "Intake", "summary": "<>", "model_used": "opus" },
    { "phase": 2, "name": "Roadmap", "summary": "<>" }
  ],
  "decisions_made": [ { "id": "d-<>", "statement": "<>", "rationale": "<>" } ],
  "beliefs_written": ["b-001", "b-002"],
  "artifacts": ["path/to/file", "..."],
  "verifier_verdicts": { "T1.1": "pass", "T2.1": "conditional", ... },
  "cost_estimate_usd": 0.41,
  "tags": ["landing-page", "next.js", "vercel"],
  "embedding_v1": [0.12, -0.34, ...]
}
```

## Retrieval

```bash
node scripts/episodes.js search "Postgres migration"
node scripts/episodes.js show ep-abc
node scripts/episodes.js timeline --tag landing-page
```

Semantic search returns top-N episodes ranked by cosine similarity on the goal embedding, optionally filtered by tags + date range.

## Naive embedding (v1.4)

v1.4 ships with a deterministic hash-based pseudo-embedding so retrieval works without an external embedding API. The hash buckets goal text into 128 dimensions. It's not semantically rich; it's keyword-overlap-as-vector.

v1.5 upgrades to real embeddings via configurable provider (Anthropic, OpenAI, Cohere, local Ollama). When the real embedding model is configured, episodes get re-embedded lazily on next access.

## CEO Phase 1 integration

```
Phase 1 (Intake):
  1. Read memory/default.json
  2. Read active beliefs
  3. Query episodic memory: similar past sessions
  4. Fold all three into goal restatement
```

Example: user says "Build a landing page for our new product." Episodic memory surfaces ep-abc from 6 weeks ago ("Built a landing page for our pricing tier — used Next.js + Tailwind + Vercel"). CEO says: "I'll mirror the structure from ep-abc unless you want a different approach this time."

That's session N being better than session 1.

## Privacy

- Episodes live only on the user's local machine
- Goal + artifact paths stored; full artifact contents are not duplicated (referenced by path)
- Embeddings can be regenerated; deletion of an episode deletes everything
- A user-issued `episodes.js clear --since <date>` is permanent

## Anti-patterns

- ❌ Storing full session transcripts (use references)
- ❌ Embedding PII into the text used for embedding
- ❌ Retrieving > 5 episodes per intake (cognitive overload defeats purpose)
- ❌ Letting episodes accumulate without a cap (set TTL or count cap)

## Verification

The verifier (class: ops) will:
1. Confirm every new episode references the session it came from.
2. Confirm artifact paths exist (or are flagged as deleted).
3. Confirm embedding is present and has the expected dimensionality.
4. Confirm episodes can be retrieved back by goal keyword.
