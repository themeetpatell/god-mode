---
name: meeting-insights
description: Use for meeting transcript analysis, MoMs, decision logs, behavioral pattern surfacing, follow-up generation, and turning conversation into accountability. Separates decisions from discussion, surfaces missed commitments, and produces a follow-up message a reasonable person would actually send.
---

# Meeting Insights

The meeting just ended. Someone has to turn 60 minutes of voice into action. This skill does that without inventing decisions that weren't made.

## When to use

- Transcript dropped in (Fathom, Otter, Granola, Zoom AI Companion, raw)
- Notes from a 1:1, all-hands, board meeting, customer call, hiring debrief
- Voice notes / WhatsApp dumps the user wants converted to MoM
- Cross-meeting synthesis ("what did we actually agree across these 4 calls")

## When NOT to use

- The user wants to *write* what should have been said (use `internal-comms`)
- The user wants therapy or coaching analysis (route to a different skill / refer out)

## The protocol

### Phase 1 — Parse the input

If transcript: identify speakers, timestamps, and the meeting type (1:1 / all-hands / customer / board).
If notes: identify the author and the date.
If voice notes: transcribe mentally, then proceed.

### Phase 2 — Separate the four streams

Walk the transcript ONCE, tagging every utterance as one of:

| Stream | Definition | Example |
|---|---|---|
| **Decision** | Someone committed to a course of action | "We'll ship V2 in March." |
| **Action** | Someone took an item with owner + deadline (explicit or inferable) | "Sarah, you'll send the deck by EOD Friday." |
| **Discussion** | Opinions exchanged, no commitment | "I think we should consider hiring earlier." |
| **Risk/Blocker** | Surfaced obstacle, unresolved | "We can't ship without the legal sign-off." |

If you can't tag it, it doesn't go in the MoM.

### Phase 3 — Identify what's MISSING

- Decision needed but not made? Flag it.
- Action with no owner? Flag it.
- Action with no deadline? Flag it.
- Discussion that opened a topic but didn't close it? Flag it.
- Risk raised but not assigned? Flag it.

This is the most valuable part of the skill. The transcript shows what was said; the gap analysis shows what should have been.

### Phase 4 — Produce the artifacts

Three artifacts, always:

**Artifact 1 — MoM (the record):**

```
═══ MEETING NOTES ═══
Date: <date>  Type: <1:1 / team / board / customer>  Duration: <minutes>
Attendees: <names>

SUMMARY (3-5 sentences):
<what this meeting was for and what changed because of it>

DECISIONS:
1. <decision> — owner: <name>
2. <decision>

ACTIONS:
| ID | Action | Owner | Due | Status |
|---|---|---|---|---|
| A1 | <action> | <name> | <date> | open |
| A2 | <action> | <name> | <date> | open |

RISKS / BLOCKERS:
- <risk> — surfaced by <name>, assigned to: <name or UNASSIGNED>

GAPS IDENTIFIED:
- <decision needed but not made>
- <action without owner>
- <topic opened but not closed>

OPEN QUESTIONS:
- <unresolved questions for next meeting>
```

**Artifact 2 — Follow-up message (the accountability):**

A Slack/email/WhatsApp message the meeting owner can send within 60 minutes of the meeting ending:

```
Subject: <meeting name> — decisions + actions
Body:
Thanks all. Quick recap so nothing falls through.

Decided:
• <decision 1>
• <decision 2>

Actions (please confirm or push back by EOD):
• <name>: <action> by <date>
• <name>: <action> by <date>

Open:
• <unresolved item> — let's close in <next meeting / async>

— <sender>
```

**Artifact 3 — The "you should know about this" note (the leverage):**

Pattern surfacing. Run only if the user explicitly asks or if the transcript shows clear patterns:

- Same person repeatedly takes actions but doesn't ship → flag
- Same topic raised across 3+ meetings without resolution → escalate
- Decision quietly reversed without acknowledgment → name it
- High-stakes decision made with one person dissenting → preserve the dissent on record

Be honest. This is the artifact that earns the skill its keep.

## Anti-patterns

- ❌ Inventing decisions that weren't made
- ❌ Assigning actions to people who weren't in the meeting
- ❌ Compressing 4 distinct topics into one "we discussed strategy" bullet
- ❌ Generic "next steps" with no owner or date
- ❌ Surfacing behavior patterns without evidence from the transcript
- ❌ Treating jokes or hypotheticals as decisions
- ❌ Hiding the unresolved stuff to make the meeting look productive

## Worked example

Input (5-line snippet from a 45-min product meeting):

> Mike (CEO): "We should kill the legacy dashboard."
> Sarah (Eng): "I've been saying that for 3 months."
> Mike: "OK so what's the timeline?"
> Sarah: "End of quarter? But I need someone on migration comms."
> Priya (CS): "I can help with comms if eng owns the technical part."

Output:

```
DECISIONS:
1. Kill the legacy dashboard. Target: end of Q2.

ACTIONS:
| A1 | Own the technical migration of dashboard users | Sarah | EOQ (June 30) | open |
| A2 | Own customer migration comms | Priya | EOQ (June 30) | open |

GAPS IDENTIFIED:
- "End of quarter" stated without specific date — set EOQ = June 30 unless objected
- Mike committed the decision but didn't assign a check-in cadence
- No success criteria — what counts as "killed"? Recommend defining: <X% of users migrated, <5% support tickets/week>

OPEN QUESTIONS:
- Who informs the sales team that the dashboard is being deprecated?
- Are there contracts that promise dashboard access through 2027? (Legal check needed before public comms)
```

That's the difference between "minutes" and "insights."

## Routing

- **Haiku**: pure transcript-to-bullets conversion when no inference is needed
- **Sonnet**: default for MoM + follow-up + gap identification
- **Opus**: only when behavior-pattern surfacing has legal or HR implications

## Verification protocol

The `verifier` (class: ops) will:
1. Check every action has owner + deadline.
2. Check decisions are separated from discussion.
3. Spot-check that no decision was invented (each must be traceable to a transcript line).
4. Confirm the follow-up message is sendable as-is.

Fail if actions lack owners or decisions weren't actually made in the transcript.

## Cost discipline

A 60-minute transcript is ~9,000 words. Don't quote half of it back. The MoM should be <500 words. The follow-up <150 words. Compression is the value.
