---
name: meeting-recording-pipeline
description: "End-to-end pipeline for meeting recordings: ingest audio/video, transcribe with speaker diarization, run meeting-insights skill, write follow-ups, file actions in CRM/Linear/Asana (with approval), update episodic memory. Closes the loop from \"we had a call\" to \"actions distributed and tracked\" without manual relay."
preview: true
preview_reason: "Pipeline orchestration shipped. Depends on voice-intake + external-actions; both currently preview."
---

> ⚠ **PREVIEW** — Composite skill; depends on voice-intake + external-actions, both preview. See [LAUNCH-PROFILE.md](../../LAUNCH-PROFILE.md).


# Meeting Recording Pipeline

The end state: a customer call ends, the user uploads the recording, 4 minutes later the right people have the right follow-ups in their inbox and the CRM is updated. No human relay.

## When to use

- Customer discovery / demo / closing call
- 1:1 with a direct report
- Board meeting (with explicit consent + retention rules)
- Hiring debrief (panel synthesis)
- Internal strategy session
- Vendor call you'll need to refer back to

## When NOT to use

- Casual conversations (don't surveillance your team)
- Anything without explicit consent from all participants
- Calls covered by NDAs that restrict transcription

## The pipeline

```
[user uploads recording]
        ↓
[1] Transcribe + diarize → text with speaker labels + timestamps
        ↓
[2] meeting-insights skill → MoM, decisions, actions, gaps
        ↓
[3] Detect intent class → customer / 1:1 / board / hiring / strategy / vendor
        ↓
[4] Per-class deliverable composition:
      - Customer: follow-up email draft + CRM update + next-step
      - 1:1: shared notes draft + manager + report copies
      - Board: minutes + decision log + IR-ready summary
      - Hiring: panel synthesis + scorecard update + decision
      - Strategy: decision doc + belief writes + roadmap if action items
      - Vendor: contract/quote summary + procurement next step
        ↓
[5] Approval gate → user reviews artifacts before any external write
        ↓
[6] Approved external actions execute (via external-actions skill)
        ↓
[7] Episode written → original audio + transcript + outputs filed
        ↓
[8] Summary delivered to user (5-line shape)
```

## Per-class output specs

Each meeting type triggers the right downstream skills:

| Class | Skills chained |
|---|---|
| Customer | meeting-insights → sales-copywriter (follow-up) → external-actions (CRM + email) |
| 1:1 | meeting-insights → chief-of-staff-ops (notes format) → external-actions (Notion/doc) |
| Board | meeting-insights → internal-comms (board summary) → external-actions (board portal) |
| Hiring | meeting-insights → chief-of-staff-ops (scorecard) → external-actions (ATS) |
| Strategy | meeting-insights → belief-register → roadmap-builder (if action items) |
| Vendor | meeting-insights → finance-ops-analyst (contract summary) → external-actions (procurement) |

## Consent + privacy

- Recording must include explicit verbal consent at start ("recording this call OK?")
- If consent is unclear, the skill refuses transcription and asks the user to confirm
- For customer calls, the follow-up email mentions a transcript is available on request
- Recording + transcript stored locally only by default; sync to cloud requires opt-in

## Anti-patterns

- ❌ Auto-sending follow-ups without user review
- ❌ Inventing commitments not in the transcript
- ❌ Transcribing calls without consent
- ❌ Storing PII from third parties without their explicit permission
- ❌ Pushing CRM updates without a sanity check (CRMs are sticky; bad data lives forever)

## Per-class verifier integration

- Customer class → verifier (content) on the follow-up email, verifier (data) on the CRM update fields
- 1:1 class → verifier (ops) on the action items
- Board class → verifier (comms) on the summary

If any verifier fails, the approval gate surfaces the failure before external writes.

## Routing

- Transcription: external (Whisper, AssemblyAI, etc.)
- meeting-insights: Sonnet
- Composition of per-class deliverables: Sonnet
- Strategic decision detection: Opus

## Verification

The pipeline as a whole verifies:
1. Consent recorded in transcript.
2. All action items have owners (or marked UNOWNED).
3. CRM update fields match what was said (not invented).
4. Follow-up email passes the founder-content + sales-copywriter verifier.
5. Episode written and linkable from the user's timeline.

Fail closed: any verifier failure blocks external writes.
