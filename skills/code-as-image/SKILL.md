---
name: code-as-image
description: Use when the user drops a screenshot of code (from Slack/WhatsApp/StackOverflow/a colleague) and wants it analyzed/fixed/explained/refactored. Extracts the code via vision, validates by re-rendering, then routes to the appropriate code skill (debug, refactor, explain). Where 30% of real code questions actually live.
preview: true
preview_reason: "Requires vision-capable runtime (Claude Sonnet/Opus have it; some other runtimes don't)."
---

> ⚠ **PREVIEW** — Works in vision-capable runtimes (Claude Sonnet/Opus); scaffold elsewhere. See [LAUNCH-PROFILE.md](../../LAUNCH-PROFILE.md).


# Code as Image

People paste screenshots of code into chat all day. This skill closes the gap from "I see a problem" to "here's the fix" without making the user transcribe.

## When to use

- Screenshot of an error message + code
- WhatsApp screenshot from a colleague asking for help
- Slack snippet someone wants debugged
- Code from a screen-share frozen as an image
- Code from a slide deck the user wants to extend

## When NOT to use

- The code is already pasted as text (skip this skill, go direct)
- The image is too low-res to OCR reliably (ask user for the text)
- The image is a UI screenshot, not code (use vision-roadmap instead)

## The protocol

### Step 1 — OCR-via-vision

Pass the image to Claude with the prompt: "Extract every line of code in this image exactly as written. Preserve indentation and line breaks. If anything is illegible, mark it `// [UNREADABLE]`."

Output: text version of the code.

### Step 2 — Validate the extraction

Detect the language (from syntax, file extension visible, error hints) then try a syntactic parse:
- JS/TS: try parsing via a JS AST parser or `node --check`
- Python: try `python -m py_compile`
- Go: `gofmt -l`
- If extraction is broken (unbalanced brackets, mid-line cut-offs), flag and ask the user to confirm

### Step 3 — Classify the user's intent

What do they want?
- **Debug**: there's an error visible or implied → run `root-cause-tracing` skill
- **Explain**: "what does this do" → run a code-read pattern
- **Refactor**: "make this better" → run `test-driven-development`-style refactor
- **Extend**: "add X to this" → route to `sonnet-engineer`
- **Port**: "convert to language Y" → run a translation pass with verification

### Step 4 — Execute through the right skill

The code-as-image skill is glue — once extracted and classified, the actual work happens via existing skills.

## Output contract

```
═══ CODE-AS-IMAGE ═══
Image: <path or "pasted">  Detected language: <lang>  Lines extracted: <n>

EXTRACTION CONFIDENCE: <high / medium / low>
EXTRACTED CODE:
```<lang>
<code>
```

EXTRACTION ISSUES (if any):
- <line>: <issue>

INTENT CLASSIFIED AS: <debug / explain / refactor / extend / port>
ROUTED TO: <skill>

[<skill output below>]
```

## Anti-patterns

- ❌ Guessing at unreadable code (mark it, ask the user)
- ❌ Acting on extracted code without flagging extraction confidence
- ❌ Skipping language detection (intent depends on it)
- ❌ Trying to OCR very small / very low-res images (decline)
- ❌ Assuming the user wants debug when they want explain

## Runtime requirement

Requires Claude API with vision. In non-vision runtimes, falls back to "paste the code as text."

## Verification

The verifier (class: code) will:
1. Confirm extracted code parses in the detected language (or flag UNREADABLE markers).
2. Confirm intent was classified, not assumed.
3. Confirm the routed downstream skill ran with its own verifier.

## Routing

- **Sonnet** for extraction + classification (vision-heavy)
- **Haiku** for trivial cleanups (whitespace, line numbering removal)
- Downstream skills route on their own
