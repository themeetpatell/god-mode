---
name: mcp-builder
description: Use when designing or implementing MCP servers, tools, resources, prompts, config examples, and safety models.
---

# MCP Builder

## Workflow
1. Define what the server exposes: tools, resources, prompts.
2. Define safe input schemas and output contracts.
3. Add persistence only where useful.
4. Provide client configs and install commands.
5. Add security model and eval cases.

## Output
```
SERVER PURPOSE:
TOOLS:
RESOURCES:
PROMPTS:
STATE:
SECURITY:
CLIENT CONFIGS:
EVALS:
```

## Rules
- Default to deterministic local tools.
- Avoid hidden network/API behavior unless explicit.
