---
name: memory
description: Use to read, update, and curate the persistent memory layer at ~/.themeetpatel/memory/. Memory is the "what the CEO already knows about this user" — stack preferences, ICP, voice rules, past decisions, hire status. Session N is better than session 1 because of this. Read it on every session intake; write to it sparingly with explicit justification.
---

# Memory

The system is a stranger every session if it has no memory. With memory, the third session is better than the first because the CEO already knows the user's stack, voice, ICP, and constraints.

## When to use

- **Read**: on every God Mode session intake (Phase 1) so the CEO doesn't ask things it already knows
- **Write**: when the user states a new durable fact ("we're now on Postgres 16", "our pricing is $499/mo", "Fatima is our Head of Sales")
- **Refresh**: when a fact contradicts memory (the user updated something)
- **Prune**: monthly, removing stale facts

## When NOT to use

- Transient session state — that goes in `~/.themeetpatel/sessions/<id>.json`, not memory
- Secret values (API keys, passwords) — never to memory
- High-cardinality data (lists of customers, transactions) — different store
- Things the user hasn't explicitly said they want remembered

## Memory file structure

```
~/.themeetpatel/memory/
  default.json                    ← global, applies to all sessions
  <project-or-user-slug>.json     ← per-project overrides (optional)
```

## Memory schema

```json
{
  "version": 1,
  "updated_at": "ISO",
  "facts": {
    "stack": {
      "frontend": "Next.js 14, App Router",
      "backend": "Node + tRPC",
      "db": "Postgres 16 on Supabase",
      "deploy": "Vercel",
      "ci": "GitHub Actions",
      "monitoring": "Sentry + Better Stack"
    },
    "company": {
      "name": "<company>",
      "stage": "early revenue",
      "headcount": "<n>",
      "geography": "UAE primary, India secondary",
      "icp": "B2B finance ops at UAE SMBs (10-50 employees)",
      "current_arr": "<range, optional>",
      "pricing": {
        "smb": "AED 499/mo",
        "midmarket": "AED 1499/mo"
      }
    },
    "founder": {
      "name": "<name>",
      "linkedin": "<handle>",
      "voice_rules": [
        "No contrast templates",
        "Specifics over abstractions",
        "Operator-to-operator tone",
        "No em-dash sentences without a specific noun on both sides"
      ],
      "publishes_on": ["LinkedIn", "Newsletter"],
      "no_post_days": ["Friday afternoon"]
    },
    "team": [
      { "name": "<name>", "role": "<role>", "scope": "<one line>" }
    ],
    "decisions_locked_in": [
      { "date": "ISO", "decision": "<one sentence>", "rationale": "<one line>" }
    ],
    "preferences": {
      "default_model_for_writing": "sonnet",
      "default_model_for_decisions": "opus",
      "verbose": false,
      "ship_over_perfect": true
    },
    "do_not": [
      "Suggest LinkedIn campaigns on Friday",
      "Recommend tools without checking integration with Supabase first",
      "Use stock-photo testimonials in landing page designs"
    ]
  },
  "open_threads": [
    { "id": "thread-<n>", "topic": "<>", "status": "<>", "last_touched": "ISO" }
  ]
}
```

## Read protocol (Phase 1 of every session)

```
On session intake, before asking the user any clarifying questions, the CEO:
1. Reads ~/.themeetpatel/memory/default.json (and project-slug.json if applicable)
2. Folds facts into the goal restatement
3. Skips clarifying questions for anything memory already answers
4. Surfaces in one line if memory contradicts the user's current ask
```

Example. User says: "I want to write a LinkedIn post about our pricing change."

Without memory, CEO asks: "What's your tone? Audience? Current pricing? Past posts on this?"

With memory, CEO says: "Got it. Pricing change for SMB AED 499 → AED <new>. Using your founder voice (operator-to-operator, no contrast templates). Drafting now."

## Write protocol

A new memory fact requires:
- **User explicitly states it as durable** ("we just hired Fatima as Head of Sales — remember that")
- OR **the CEO infers it durably from a decision** ("decided to standardize on Postgres" — adds to stack)
- AND **the fact survives a 30-day relevance test** (no "trying X this week" facts; only "we use X")

Don't write to memory just because the user mentioned something. Mention ≠ commitment.

When writing:
1. Read the current memory file
2. Apply a minimal patch (only the new fact, not a rewrite)
3. Update `updated_at`
4. Save back to the same path

## Refresh protocol

When the user contradicts memory (e.g., "we moved off Postgres to Planetscale"), the CEO:
1. Confirms in one line ("Updating: stack.db from Postgres → Planetscale")
2. Writes the update
3. Removes any obsolete decisions that contradicted

## Prune protocol (monthly, or when requested)

- Remove team members no longer at the company
- Remove decisions that have been superseded
- Remove "open threads" that have been resolved or abandoned for >90 days
- Remove preferences the user has changed

## Output contract (when this skill is invoked)

```
═══ MEMORY OPERATION ═══
Operation: <read | write | refresh | prune>
File: <path>

CURRENT MEMORY (relevant slice):
<JSON excerpt>

CHANGES (if write/refresh/prune):
- <field>: <before> → <after>
- <field>: removed

JUSTIFICATION (if write):
<why this is a durable fact and not a passing mention>

UPDATED FILE WRITTEN: <path>
```

## Anti-patterns

- ❌ Memorizing transient state ("we're currently looking at vendor X")
- ❌ Memorizing PII without consent (other team members' info, customer details)
- ❌ Memorizing API keys, passwords, tokens — ever
- ❌ Overwriting the whole file on a small change (use minimal patch)
- ❌ Treating memory as a journal (it's a reference, not a log)
- ❌ Asking the user "should I remember this?" every turn (silent ambient writes when criteria met)
- ❌ Reading memory and not folding it into the goal (defeats the point)
- ❌ Forgetting to update memory when the user explicitly contradicts it

## Security + privacy

- Memory lives only on the user's local machine (`~/.themeetpatel/memory/`)
- No cloud sync by default (a future Supabase pack will be optional)
- The user can `rm -rf ~/.themeetpatel/memory/` at any time without breaking the system
- Memory files are gitignored by default in any repo

## Routing

- **Haiku** for the read/parse/write
- **Sonnet** for the justification when writing a non-trivial fact

## Verification

The verifier (class: ops) will:
1. Confirm a write operation has a justification.
2. Confirm a new fact is consistent (no contradiction with existing facts).
3. Confirm sensitive data (anything matching secret patterns) is rejected.
4. Confirm the file is valid JSON and conforms to schema.

Fail if writing a contradiction without removing the old fact, or if rejected-pattern content is written.
