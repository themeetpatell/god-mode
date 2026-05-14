#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { routeTask, estimateSavings } from "./router.js";
import { buildHandoffBrief, buildWorkerBrief, CEO_PROMPT, ROUTING_MATRIX, SPECIALIST_REGISTRY, SKILL_REGISTRY, recommendSpecialist } from "./prompts.js";
import { listSessions, loadSession, saveSession, slugify, updateTask } from "./state.js";
const server = new McpServer({
    name: "themeetpatel-god-mode",
    version: "1.0.0"
});
server.registerTool("route_task", {
    title: "Route task to the right model",
    description: "Deterministically choose Haiku/Sonnet/Opus for a task using complexity, stakes, and task type.",
    inputSchema: {
        task: z.string().min(1),
        taskType: z.string().optional(),
        complexity: z.enum(["low", "medium", "high", "critical"]).optional(),
        stakes: z.enum(["low", "medium", "high", "critical"]).optional(),
        requiresCode: z.boolean().optional(),
        requiresArchitecture: z.boolean().optional(),
        requiresSecurity: z.boolean().optional(),
        requiresResearch: z.boolean().optional(),
        contextTokens: z.number().int().nonnegative().optional(),
        outputTokens: z.number().int().nonnegative().optional()
    }
}, async (input) => {
    const decision = routeTask(input);
    return { content: [{ type: "text", text: JSON.stringify(decision, null, 2) }] };
});
server.registerTool("create_roadmap", {
    title: "Create a routed roadmap",
    description: "Turn a goal into a practical phased roadmap with routing decisions and cost-savings estimate.",
    inputSchema: {
        goal: z.string().min(1),
        constraints: z.string().optional(),
        maxTasks: z.number().int().min(3).max(20).default(10),
        save: z.boolean().default(true)
    }
}, async ({ goal, constraints, maxTasks, save }) => {
    const phaseTemplates = [
        { phase: "Scope & Decisions", items: ["Clarify goal, assumptions, constraints", "Identify success criteria and risky decisions"] },
        { phase: "Build / Research / Produce", items: ["Execute core deliverable", "Create supporting assets or implementation details"] },
        { phase: "Verify & Package", items: ["Run quality check against success criteria", "Package final handoff with next actions"] }
    ];
    const rawTasks = phaseTemplates.flatMap((p, pi) => p.items.map((title, ii) => ({
        id: `T${pi + 1}.${ii + 1}`,
        title,
        status: "pending",
        dependsOn: pi === 0 ? [] : [`T${pi}.${ii + 1}`].filter(Boolean)
    }))).slice(0, maxTasks);
    const decisions = rawTasks.map((t) => routeTask({ task: `${goal}: ${t.title}`, complexity: t.id.startsWith("T1") ? "high" : "medium", stakes: t.id === "T1.2" ? "high" : "medium" }));
    const tasks = rawTasks.map((t, i) => ({ ...t, model: decisions[i].model }));
    const savings = estimateSavings(decisions);
    const roadmap = { goal, constraints: constraints ?? null, tasks, savings };
    let saved = null;
    if (save) {
        const id = `${slugify(goal)}-${Date.now().toString(36)}`;
        saved = await saveSession({ id, title: goal.slice(0, 80), goal, assumptions: constraints ? [constraints] : [], decisions: [], tasks, artifacts: [] });
    }
    return { content: [{ type: "text", text: JSON.stringify({ roadmap, session: saved && { id: saved.id, path: `~/.themeetpatel/sessions/${saved.id}.json` } }, null, 2) }] };
});
server.registerTool("save_session", {
    title: "Save God Mode session",
    description: "Persist a roadmap/session so it can be resumed from any MCP-compatible client.",
    inputSchema: {
        id: z.string().optional(),
        title: z.string(),
        goal: z.string(),
        assumptions: z.array(z.string()).default([]),
        decisions: z.array(z.string()).default([]),
        tasks: z.array(z.object({ id: z.string(), title: z.string(), model: z.string().optional(), status: z.enum(["pending", "in_progress", "done", "blocked", "cancelled"]), dependsOn: z.array(z.string()).optional(), output: z.string().optional(), notes: z.string().optional() })).default([]),
        artifacts: z.array(z.string()).default([])
    }
}, async (input) => {
    const state = await saveSession({ ...input, id: input.id ?? `${slugify(input.title)}-${Date.now().toString(36)}` });
    return { content: [{ type: "text", text: JSON.stringify({ saved: true, id: state.id, path: `~/.themeetpatel/sessions/${state.id}.json` }, null, 2) }] };
});
server.registerTool("load_session", {
    title: "Load God Mode session",
    description: "Load a saved roadmap/session by ID.",
    inputSchema: { id: z.string() }
}, async ({ id }) => ({ content: [{ type: "text", text: JSON.stringify(await loadSession(id), null, 2) }] }));
server.registerTool("list_sessions", {
    title: "List God Mode sessions",
    description: "List recent saved God Mode sessions.",
    inputSchema: {}
}, async () => ({ content: [{ type: "text", text: JSON.stringify(await listSessions(), null, 2) }] }));
server.registerTool("update_task_status", {
    title: "Update roadmap task status",
    description: "Update one task inside a saved session.",
    inputSchema: {
        sessionId: z.string(),
        taskId: z.string(),
        status: z.enum(["pending", "in_progress", "done", "blocked", "cancelled"]),
        output: z.string().optional(),
        notes: z.string().optional()
    }
}, async ({ sessionId, taskId, ...patch }) => ({ content: [{ type: "text", text: JSON.stringify(await updateTask(sessionId, taskId, patch), null, 2) }] }));
server.registerTool("recommend_specialist", {
    title: "Recommend God Mode specialist",
    description: "Choose the best specialist agent for a task after model routing.",
    inputSchema: { task: z.string().min(1) }
}, async ({ task }) => {
    const route = routeTask({ task });
    const specialist = recommendSpecialist(task);
    return { content: [{ type: "text", text: JSON.stringify({ task, model: route.model, specialist: specialist.agent, rationale: specialist.rationale, modelRationale: route.rationale }, null, 2) }] };
});
server.registerTool("create_handoff", {
    title: "Create portable handoff brief",
    description: "Generate a copy-paste brief to continue work in another client.",
    inputSchema: {
        goal: z.string(),
        destination: z.string().optional(),
        roadmap: z.string().optional(),
        decisions: z.string().optional(),
        nextTask: z.string().optional()
    }
}, async (input) => ({ content: [{ type: "text", text: buildHandoffBrief(input) }] }));
server.registerTool("worker_brief", {
    title: "Create worker brief",
    description: "Package a single routed task into a minimal-context worker prompt.",
    inputSchema: {
        task: z.string(),
        model: z.string(),
        inputs: z.string().optional(),
        outputSpec: z.string().optional(),
        constraints: z.string().optional()
    }
}, async (input) => ({ content: [{ type: "text", text: buildWorkerBrief(input) }] }));
server.registerResource("routing_matrix", "themeetpatel://routing-matrix", {
    title: "God Mode Routing Matrix",
    description: "Canonical routing rules for Haiku/Sonnet/Opus.",
    mimeType: "text/plain"
}, async (uri) => ({ contents: [{ uri: uri.href, text: ROUTING_MATRIX }] }));
server.registerResource("ceo_prompt", "themeetpatel://prompts/ceo", {
    title: "God Mode CEO Prompt",
    description: "Core operating prompt for the CEO orchestrator.",
    mimeType: "text/plain"
}, async (uri) => ({ contents: [{ uri: uri.href, text: CEO_PROMPT }] }));
server.registerResource("specialist_registry", "themeetpatel://specialists", {
    title: "God Mode Specialist Registry",
    description: "List of specialist agents and when to use each.",
    mimeType: "text/plain"
}, async (uri) => ({ contents: [{ uri: uri.href, text: SPECIALIST_REGISTRY }] }));
server.registerResource("skill_registry", "themeetpatel://skills", {
    title: "God Mode Skill Registry",
    description: "List of production skills and workflow triggers.",
    mimeType: "text/plain"
}, async (uri) => ({ contents: [{ uri: uri.href, text: SKILL_REGISTRY }] }));
server.registerPrompt("activate_god_mode", {
    title: "Activate God Mode",
    description: "Start a God Mode execution session for any goal.",
    argsSchema: { goal: z.string(), constraints: z.string().optional() }
}, ({ goal, constraints }) => ({ messages: [{ role: "user", content: { type: "text", text: `${CEO_PROMPT}

GOAL:
${goal}

CONSTRAINTS:
${constraints ?? "Proceed with reasonable assumptions."}

First create a routed roadmap. Then execute the first unblocked task.` } }] }));
server.registerPrompt("choose_specialist", {
    title: "Choose Specialist",
    description: "Pick the right model, specialist agent, and skill for a task.",
    argsSchema: { task: z.string() }
}, ({ task }) => {
    const route = routeTask({ task });
    const specialist = recommendSpecialist(task);
    return { messages: [{ role: "user", content: { type: "text", text: `TASK:
${task}

ROUTING:
${JSON.stringify(route, null, 2)}

SPECIALIST:
${specialist.agent} — ${specialist.rationale}

Use the relevant skill workflow from the registry when needed. Produce an execution-ready brief.` } }] };
});
server.registerPrompt("handoff_brief", {
    title: "Create Handoff Brief",
    description: "Generate a portable God Mode handoff brief.",
    argsSchema: { goal: z.string(), destination: z.string().optional() }
}, ({ goal, destination }) => ({ messages: [{ role: "user", content: { type: "text", text: buildHandoffBrief({ goal, destination }) } }] }));
const transport = new StdioServerTransport();
await server.connect(transport);
