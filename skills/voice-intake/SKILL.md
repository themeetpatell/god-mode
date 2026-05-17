---
name: voice-intake
description: Use when the user uploads a voice note (m4a, mp3, wav, ogg) of brainstorm/strategy/feedback/customer-call and wants it converted to structured output — roadmap, decisions log, action items, follow-up draft. Founder voice notes are 90% of where real goals live; this is the bridge from spoken thought to operating plan.
preview: true
preview_reason: "Classification + structuring logic shipped. Audio transcription depends on the runtime (Whisper/AssemblyAI/native). Returns scaffold if not available."
---

> ⚠ **PREVIEW** — Classification + intent routing are production; audio transcription requires runtime support. See [LAUNCH-PROFILE.md](../../LAUNCH-PROFILE.md).


# Voice Intake

Founders think aloud. Most of that thinking never makes it to a keyboard. This skill turns voice into structured operating artifacts.

## When to use

- Voice memo dropped in by the user
- WhatsApp / Telegram voice note forwarded
- Recorded brainstorm or shower-thought
- Customer call recording (with their consent)
- Post-meeting voice debrief

## When NOT to use

- Live transcription during a call (different workflow, use a real-time service)
- Music or non-speech audio
- Anything > 30 min (chunk and process per-chunk first)

## The protocol

### Step 1 — Transcribe

Requires the runtime to have audio-to-text capability (Whisper, AssemblyAI, Anthropic when vision-audio lands, etc). If not available, skill returns "scaffold mode" asking user to paste transcript.

Transcription preserves:
- Speaker labels if multi-voice
- Timestamps every ~15s
- Filler words removed (but tone notes kept: [emphatic], [unsure])

### Step 2 — Classify intent

Voice notes fall into 6 categories. Detect which:

| Type | Signals | Output |
|---|---|---|
| Brainstorm | exploratory tone, "what if", "we could" | Decisions log + ideas backlog |
| Strategy lock-in | declarative, "we're going to", "decided" | Decision doc + belief register write |
| Customer call debrief | "they said", "their pain is", "the deal feels" | CRM update + follow-up draft + next-step |
| Feedback for someone | "tell X that", "remind me to mention" | Drafted message |
| Goal statement | "I want to build", "we need to ship" | Full God Mode roadmap |
| Mixed | combinations | Multiple outputs, sectioned |

### Step 3 — Produce the deliverables

Output exactly what the intent maps to. Don't impose a roadmap on a brainstorm.

For **brainstorm**:
```
═══ VOICE INTAKE: BRAINSTORM ═══
Recorded: <ts>  Duration: <mm:ss>  Speakers: <n>

CORE IDEAS (raw, not yet decided):
- <idea>
- <idea>

DECISIONS TENTATIVELY REACHED:
- <decision> — confidence: <h/m/l based on tone>

UNRESOLVED THREADS (likely to come back to):
- <thread>

ACTION ITEMS (if any clearly stated):
- <action> — owner: <name> — due: <date if mentioned>

SUGGESTED NEXT STEP:
- Convert to roadmap? (you said "I want to build…")
- Save as journal? (no clear next action)
- Schedule a follow-up brainstorm?
```

For **strategy lock-in**:
```
═══ VOICE INTAKE: DECISION ═══
DECISION: <one sentence — direct quote where possible>
RATIONALE (from voice): <2 sentences>
ALTERNATIVES MENTIONED: <list>
CONFIDENCE: <high/medium/low based on tone>

WRITE TO BELIEF REGISTER? yes/no recommendation
NEXT ACTION: <if implied>
```

For **customer call**:
```
═══ VOICE INTAKE: CUSTOMER CALL ═══
Customer: <name if stated>  Call date: <ts>

THEIR STATED PAIN: <quote>
THEIR BUYING TRIGGER: <if mentioned>
OBJECTIONS RAISED: <list>
COMMITMENTS MADE (theirs and yours): <list>

FOLLOW-UP DRAFT (sales-copywriter skill chained):
<the actual message>

CRM UPDATE:
- Stage: <suggested>
- Notes: <summary>
- Next step: <action + date>

ARTIFACTS:
- recording: <path>
- transcript: <path>
```

### Step 4 — Save to episodic memory

The original audio + transcript + structured output all get filed as an episode. Future sessions can recall it.

## Anti-patterns

- ❌ Forcing every voice note into a roadmap (some are journals)
- ❌ Inventing decisions that weren't actually decided (the tentative-vs-locked distinction matters)
- ❌ Storing customer call recordings without explicit consent
- ❌ Treating filler ("um", "like") as semantic content
- ❌ Losing tone signals (a hedged decision is different from a confident one)

## Verification

The verifier (class: content + ops) will:
1. Confirm decisions tagged "tentative" weren't promoted to certainty.
2. Confirm customer-call outputs include consent confirmation.
3. Confirm action items have owner + date if stated, blank if not (no inventing).
4. Confirm the original audio + transcript are filed for audit.

## Routing

- Transcription: external runtime tool
- Classification + structuring: **Sonnet**
- High-stakes decisions (customer commitments, strategic locks): **Opus**
