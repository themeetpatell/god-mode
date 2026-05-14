# God Mode for claude.ai (Projects)

claude.ai lets you create **Projects** with custom instructions that apply to every chat in that project. This is the cleanest way to use God Mode in the chat UI.

## Setup

1. Open claude.ai → **Projects** (left sidebar) → **Create project**
2. Name it: `God Mode` (or `themeetpatel`)
3. Open the project → **Custom instructions** → paste the contents of `portable/universal-system-prompt.md` (between the `## SYSTEM PROMPT` and `## END SYSTEM PROMPT` markers)
4. Save

## Activation

Start any chat inside the God Mode project. Then:

```
Activate God Mode. Goal: <your goal>
```

## What works well in claude.ai

- **Research + synthesis** with the built-in web search and "Search past chats" tools
- **Document/PDF analysis** — upload files into the project, then say "Activate God Mode. Goal: analyze these and produce a report with recommendations."
- **Iterative drafting** — content, decks, articles. The CEO breaks it into outline → draft → polish phases, each at the right depth.
- **Code planning** without the runtime — you get the roadmap and code, then run/test it yourself.

## Caveats

- Single model per chat. Routing labels guide style, not actual Haiku/Sonnet/Opus swaps. The Pro plan defaults to Sonnet 4.6; Max plans give you Opus 4.7.
- No subagents. The CEO does the work itself within one context, styled per task by the routing label.
- For full multi-model subagent execution, use the Claude Code plugin.

## Tip: pair with custom styles

If you've configured a writing style in claude.ai, God Mode composes nicely with it. The style controls *voice*, God Mode controls *process*.
