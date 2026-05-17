---
name: claude-api-patterns
description: Use when building on the Claude API — tool use, prompt caching, streaming, batch, structured outputs, vision, files, multi-turn agent loops. Opinionated patterns that ship, with snippets for each, derived from production usage of Anthropic's API.
---

# Claude API Patterns

The Claude API surface is broad. This skill picks the few patterns that matter for shipping production AI features, with copy-able snippets.

## When to use

- New Claude-powered feature design
- Tool-use agent loop implementation
- Streaming UX with proper stop reasons
- Prompt-caching to cut costs on long contexts
- Batch jobs (data processing, evals)
- Structured outputs (JSON, function-calling parity)
- Vision tasks
- File uploads + retrieval

## Model picking inside your app

Same logic as God Mode's router. For your application:

| Use case | Model |
|---|---|
| Classification, summarization, short Q&A, format conversion | `claude-haiku-4-5` |
| Production features: writing, code, research, default | `claude-sonnet-4-6` |
| High-stakes reasoning: architecture, security, hard decisions | `claude-opus-4-6` |

Read this plugin's `skills/model-router/SKILL.md` for the routing matrix.

## Pattern 1 — Tool use (the agent loop)

```ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const tools = [
  {
    name: "search_db",
    description: "Search the customer database for users matching a query.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Natural language search query" },
        limit: { type: "integer", minimum: 1, maximum: 100, default: 10 }
      },
      required: ["query"]
    }
  }
];

async function agentLoop(userMessage: string) {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage }
  ];

  for (let step = 0; step < 10; step++) {  // hard cap on steps
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      tools,
      messages
    });

    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason !== "tool_use") {
      return response;  // model is done
    }

    // Run every tool_use block
    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      const result = await runTool(block.name, block.input);
      toolResults.push({
        type: "tool_result",
        tool_use_id: block.id,
        content: JSON.stringify(result),
        is_error: !!result.error
      });
    }

    messages.push({ role: "user", content: toolResults });
  }

  throw new Error("Agent loop exceeded max steps");
}
```

Key rules:
- **Cap the loop.** Always have a max-steps and break out.
- **Pass `tool_results` back as a user-role message.**
- **Set `is_error: true`** when the tool fails; the model handles errors better when flagged.
- **Don't summarize the conversation in the loop** — the model needs the raw history to reason about the next tool call.

## Pattern 2 — Prompt caching (cut cost up to 90% on long contexts)

When you pass the same large block (system prompt, doc context) on every request, cache it.

```ts
const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: longSystemPrompt,  // e.g., 20K tokens of instructions
      cache_control: { type: "ephemeral" }
    }
  ],
  messages: [{ role: "user", content: userMessage }]
});

// On the next call within ~5 min, the system block is served from cache
// at ~10% the input cost.
```

You can also cache message content:

```ts
messages: [
  {
    role: "user",
    content: [
      { type: "text", text: largeDocumentContext, cache_control: { type: "ephemeral" } },
      { type: "text", text: actualQuestion }
    ]
  }
]
```

Cache TTL: ~5 minutes. Plan request patterns around that window.

## Pattern 3 — Streaming with stop-reason handling

For UX where text appears as it's generated:

```ts
const stream = client.messages.stream({
  model: "claude-sonnet-4-6",
  max_tokens: 4096,
  messages: [{ role: "user", content: prompt }]
});

stream.on("text", (text) => {
  process.stdout.write(text);
});

stream.on("message", (message) => {
  if (message.stop_reason === "end_turn") {
    // normal completion
  } else if (message.stop_reason === "max_tokens") {
    // continue the conversation if needed
  } else if (message.stop_reason === "tool_use") {
    // run tools, then resume
  } else if (message.stop_reason === "stop_sequence") {
    // matched user-defined stop
  }
});

const final = await stream.finalMessage();
```

Don't ship streaming UIs without handling `max_tokens` — users will see truncated output and assume your product is broken.

## Pattern 4 — Batch API (for big jobs)

When you have 10K+ independent prompts to run:

```ts
// Submit batch
const batch = await client.messages.batches.create({
  requests: items.map((item, i) => ({
    custom_id: `req-${i}`,
    params: {
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: item.prompt }]
    }
  }))
});

// Poll
let status;
while ((status = await client.messages.batches.retrieve(batch.id)).processing_status !== "ended") {
  await sleep(30_000);
}

// Stream results
const results = await client.messages.batches.results(batch.id);
for await (const result of results) {
  // result.custom_id, result.result.message
}
```

50% cheaper than synchronous, but up to 24h latency. Use for evals, bulk classification, data prep.

## Pattern 5 — Structured outputs

Use tool_use with a single tool whose schema IS your desired output shape:

```ts
const extractTool = {
  name: "extract_contact",
  description: "Extract contact information from text.",
  input_schema: {
    type: "object",
    properties: {
      name: { type: "string" },
      email: { type: "string", format: "email" },
      phone: { type: "string" },
      company: { type: "string" }
    },
    required: ["name", "email"]
  }
};

const response = await client.messages.create({
  model: "claude-haiku-4-5",
  max_tokens: 512,
  tools: [extractTool],
  tool_choice: { type: "tool", name: "extract_contact" },  // force this tool
  messages: [{ role: "user", content: rawText }]
});

const toolUse = response.content.find(b => b.type === "tool_use");
if (toolUse) {
  const data = toolUse.input;  // validated against schema by the model
}
```

Validate the parsed object on your end too — the model usually conforms but not always.

## Pattern 6 — Vision

```ts
const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  messages: [{
    role: "user",
    content: [
      {
        type: "image",
        source: {
          type: "base64",
          media_type: "image/png",
          data: base64Image
        }
      },
      { type: "text", text: "Extract every line item from this receipt as JSON." }
    ]
  }]
});
```

Or with a URL:
```ts
{ type: "image", source: { type: "url", url: "https://..." } }
```

## Pattern 7 — Multi-turn with files API

```ts
// Upload once
const file = await client.beta.files.upload({
  file: fs.createReadStream("./contract.pdf"),
  purpose: "user_data"
});

// Reference in messages
const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: [
      { type: "document", source: { type: "file", file_id: file.id } },
      { type: "text", text: "Summarize this contract in 5 bullets." }
    ]
  }]
});
```

Files persist; reference across turns without re-uploading.

## Errors + retries

Wrap every API call:

```ts
async function withRetry<T>(fn: () => Promise<T>, max = 3): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < max; i++) {
    try {
      return await fn();
    } catch (e: unknown) {
      lastError = e;
      if (e instanceof Anthropic.APIError) {
        // 429 (rate limit), 529 (overload) → retry with backoff
        if (e.status === 429 || e.status === 529) {
          await sleep(2 ** i * 1000);
          continue;
        }
        // 400 (bad input) → don't retry
        if (e.status >= 400 && e.status < 500) throw e;
      }
      // network → retry
      await sleep(2 ** i * 1000);
    }
  }
  throw lastError;
}
```

Use respect-the-rate-limit + exponential backoff. Don't hammer.

## Cost discipline

- Read `mcp-server/src/router.ts` of this repo for the model-pick heuristic
- Use prompt caching for any context > 2K tokens reused within 5 min
- Batch for any job > 1K items where 24h latency is OK
- Default max_tokens to the smallest viable, not the biggest possible
- Log per-call cost in a ledger (see this repo's `skills/cost-ledger`)

## Anti-patterns

- ❌ Calling Opus on everything "to be safe"
- ❌ No max-steps cap on agent loops (runaway tool-use bills)
- ❌ Ignoring `stop_reason` and assuming `end_turn`
- ❌ Streaming without handling `max_tokens` truncation
- ❌ Sending the same 10K token system prompt without caching
- ❌ Tool schemas with `additionalProperties: true`
- ❌ Forgetting to validate tool_use inputs server-side
- ❌ Putting secrets in prompts (PII, API keys)
- ❌ Logging full prompts and responses with PII (compliance violation)

## Verification

The verifier (class: integration + code) will:
1. Check every API call has retry handling
2. Check agent loops have a max-step cap
3. Check tool schemas are strict (no `additionalProperties`)
4. Check stop_reason is handled
5. Check secrets aren't inlined
6. For caching: check eligible long contexts have `cache_control` set
