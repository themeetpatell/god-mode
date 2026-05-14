export const CEO_PROMPT = `You are themeetpatel God Mode: an AI Chief of Staff and Product CEO.

Operating rules:
1. Convert one messy goal into a roadmap.
2. Route each task to Haiku/Sonnet/Opus based on cost, risk, and complexity.
3. Keep context minimal.
4. Execute with operator-grade output.
5. End with shipped artifacts, decisions, risks, and next actions.

Never worship process. Ship the deliverable.`;

export const ROUTING_MATRIX = `Haiku 4.5: classify, summarize, extract, format, lint, status, cheap scaffolding.
Sonnet 4.6: production code, docs, research, refactor, tests, normal analysis.
Opus 4.7: architecture, hard debugging, security, compliance, irreversible decisions, multi-constraint reasoning.
Default: Sonnet. Upgrade when wrong is expensive. Downgrade when mechanical.`;

export function buildWorkerBrief(args: { task: string; model: string; inputs?: string; outputSpec?: string; constraints?: string }) {
  return `TASK: ${args.task}
ROUTING: ${args.model}
INPUTS:
${args.inputs ?? "Use only the context provided by the caller."}

OUTPUT SPEC:
${args.outputSpec ?? "Return a structured, concise, production-ready answer."}

CONSTRAINTS:
${args.constraints ?? "No filler. State uncertainty. Escalate if the task exceeds the selected model."}`;
}

export function buildHandoffBrief(args: { goal: string; destination?: string; roadmap?: string; decisions?: string; nextTask?: string }) {
  const depthNote = args.destination && !/claude/i.test(args.destination)
    ? "Note: If this client cannot switch Anthropic models, treat Haiku/Sonnet/Opus as depth labels: fast / balanced / deep."
    : "";
  return `═══ THEMEETPATEL · GOD MODE HANDOFF BRIEF ═══

YOU ARE: The AI Product CEO from the themeetpatel God Mode system.

COMMANDMENTS:
1. Right model for the job.
2. Smallest viable context.
3. Ship the goal, not the process.

ORIGINAL GOAL:
${args.goal}

DESTINATION:
${args.destination ?? "Any MCP-compatible client"}

${depthNote}

DECISIONS LOCKED IN:
${args.decisions ?? "- None yet"}

ROADMAP STATUS:
${args.roadmap ?? "- Build or load the roadmap first"}

NEXT TASK:
${args.nextTask ?? "Create/validate roadmap, route tasks, then execute the first unblocked task."}

OUTPUT FORMAT:
- Executive summary
- Shipped artifacts
- Decisions made
- Risks/blockers
- Next actions

═══ END BRIEF ═══`;
}


export const SPECIALIST_REGISTRY = `# God Mode Specialist Registry

Model = cost/depth. Agent = domain behavior. Skill = repeatable workflow.

## Core orchestration
- god-mode-ceo — roadmap, routing, delegation, synthesis
- haiku-specialist — summaries, extraction, formatting, status
- sonnet-engineer — production code, docs, normal analysis
- opus-architect — architecture, hard debugging, security-risk decisions
- synthesizer — merge worker outputs into final deliverable

## Strategy and growth
- product-strategist — PRDs, MVP, roadmap, monetization, product bets
- growth-architect — GTM, demand engine, lifecycle, partnerships, funnels
- ux-conversion-designer — landing pages, onboarding flows, conversion UX

## Engineering and systems
- codebase-auditor — repo audit, technical debt, production readiness
- qa-tester — test plans, E2E/browser QA, release verdicts
- devops-release-manager — CI/CD, deployment, rollback, monitoring
- integration-architect — APIs, MCP, webhooks, auth, data sync
- prompt-systems-engineer — prompts, skills, evals, token optimization

## Risk, data, ops, revenue
- security-officer — auth, permissions, secrets, threat models
- research-analyst — source-backed research and competitor analysis
- data-analyst — KPIs, dashboards, scorecards, funnel metrics
- content-strategist — founder-led content and narrative systems
- sales-copywriter — outreach, sales copy, objection handling
- chief-of-staff-ops — EOS, SOPs, scorecards, internal comms
- finance-ops-analyst — billing, pricing, unit economics, controls
`;

export const SKILL_REGISTRY = `# God Mode Skill Registry

## Build and engineering
- codebase-audit
- test-driven-development
- webapp-testing
- security-review
- root-cause-tracing
- mcp-builder
- git-worktree-release

## Research, data, and strategy
- deep-research
- data-analysis
- growth-engine
- seo-aeo-geo
- ui-ux-conversion

## Revenue and communication
- founder-content
- partnerships-outreach
- internal-comms
- meeting-insights

## Prompt operating system
- prompt-engineering
- skill-creator
- cost-ledger
- god-mode
- model-router
- roadmap-builder
- handoff
`;

export function recommendSpecialist(task: string) {
  const t = task.toLowerCase();
  const rules: Array<[string[], string, string]> = [
    [["prd", "roadmap", "mvp", "product", "monetization", "pricing"], "product-strategist", "Product/roadmap/monetization task."],
    [["growth", "gtm", "funnel", "campaign", "demand", "partner", "referral"], "growth-architect", "Growth system or GTM task."],
    [["research", "competitor", "market", "sources", "vendor", "landscape"], "research-analyst", "Source-backed research task."],
    [["audit repo", "codebase", "technical debt", "performance", "architecture review"], "codebase-auditor", "CTO-grade codebase audit task."],
    [["security", "auth", "permission", "secrets", "threat", "pii", "webhook verification"], "security-officer", "Security-sensitive task."],
    [["test", "qa", "playwright", "e2e", "regression", "release verdict"], "qa-tester", "QA or release validation task."],
    [["deploy", "ci/cd", "rollback", "environment", "monitoring", "release"], "devops-release-manager", "Deployment/release task."],
    [["kpi", "dashboard", "scorecard", "csv", "spreadsheet", "metrics"], "data-analyst", "Data/KPI task."],
    [["linkedin", "newsletter", "content", "founder", "thought leadership"], "content-strategist", "Founder/content task."],
    [["outreach", "dm", "email sequence", "whatsapp", "copy", "objection"], "sales-copywriter", "Sales copy/outreach task."],
    [["ux", "landing page", "website", "conversion", "onboarding"], "ux-conversion-designer", "UX/conversion task."],
    [["api", "mcp", "webhook", "integration", "sync", "auth flow"], "integration-architect", "Integration architecture task."],
    [["prompt", "skill", "agent", "eval", "guardrail"], "prompt-systems-engineer", "Prompt/agent system task."],
    [["eos", "rock", "scorecard", "sop", "internal comms", "meeting"], "chief-of-staff-ops", "Operating cadence/task ownership task."],
    [["billing", "finance", "unit economics", "accounts receivable", "pricing"], "finance-ops-analyst", "Finance operations task."]
  ];
  for (const [patterns, agent, rationale] of rules) {
    if (patterns.some((p) => t.includes(p))) return { agent, rationale };
  }
  return { agent: "sonnet-engineer", rationale: "Safe default specialist for general production work." };
}
