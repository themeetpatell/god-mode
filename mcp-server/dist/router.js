const HAIKU_PATTERNS = [
    "classify", "categorize", "summarize", "summary", "format", "convert", "list", "extract", "lint", "status", "changelog", "commit message", "rename"
];
const OPUS_PATTERNS = [
    "architecture", "system design", "security", "threat", "hard debugging", "race condition", "distributed", "concurrent", "concurrency", "latency spike", "performance puzzle", "migration plan", "data model", "multi-step", "critical", "compliance", "financial risk", "root cause"
];
const SONNET_PATTERNS = [
    "code", "refactor", "test", "docs", "readme", "research", "analysis", "debug", "implement", "api", "component", "workflow"
];
function includesAny(text, patterns) {
    const t = text.toLowerCase();
    return patterns.some((p) => t.includes(p));
}
export function routeTask(input) {
    const joined = `${input.taskType ?? ""} ${input.task}`.toLowerCase();
    const complexity = input.complexity ?? "medium";
    const stakes = input.stakes ?? "medium";
    const needsOpus = input.requiresArchitecture ||
        input.requiresSecurity ||
        complexity === "critical" ||
        stakes === "critical" ||
        stakes === "high" && (complexity === "high" || input.requiresArchitecture) ||
        includesAny(joined, OPUS_PATTERNS);
    if (needsOpus) {
        return {
            model: "opus-4.7",
            confidence: 0.88,
            rationale: "High-consequence reasoning or architecture/security tradeoffs. Token premium is cheaper than rework.",
            costRatio: 15,
            executionMode: "deep",
            contextStrategy: ["Pass decision constraints, relevant files, failure modes, and acceptance criteria only.", "Ask for explicit tradeoffs and irreversible-risk notes."],
            escalationRule: "Escalate to human when the decision depends on missing business/legal/security context."
        };
    }
    const mechanicalHaikuTask = includesAny(joined, HAIKU_PATTERNS) &&
        !input.requiresCode &&
        !input.requiresResearch &&
        !input.requiresArchitecture &&
        !input.requiresSecurity &&
        !includesAny(joined, OPUS_PATTERNS) &&
        (input.outputTokens ?? 500) <= 900;
    const canUseHaiku = mechanicalHaikuTask &&
        stakes !== "high" &&
        complexity !== "high";
    if (canUseHaiku) {
        return {
            model: "haiku-4.5",
            confidence: 0.84,
            rationale: "Mechanical or low-reasoning task. Use the fast lane to protect budget and speed.",
            costRatio: 1,
            executionMode: "fast",
            contextStrategy: ["Pass the exact snippet or file list, not the session history.", "Request terse structured output."],
            escalationRule: "Escalate to Sonnet if the task requires inference, decisions, or >50 lines of code."
        };
    }
    if (includesAny(joined, SONNET_PATTERNS) || input.requiresCode || input.requiresResearch || complexity === "medium" || complexity === "high") {
        return {
            model: "sonnet-4.6",
            confidence: 0.82,
            rationale: "Best default for production work: coding, research, refactoring, docs, and normal analysis.",
            costRatio: 5,
            executionMode: "balanced",
            contextStrategy: ["Pass relevant files plus spec, constraints, and acceptance checks.", "Keep output tied to deployable changes."],
            escalationRule: "Escalate to Opus if architecture, security, or multi-constraint risk appears."
        };
    }
    return {
        model: "sonnet-4.6",
        confidence: 0.72,
        rationale: "Safe default when the task is not purely mechanical and not obviously high-risk.",
        costRatio: 5,
        executionMode: "balanced",
        contextStrategy: ["Pass minimal relevant context.", "Ask for concrete output and verification steps."],
        escalationRule: "Downgrade to Haiku for mechanical formatting; upgrade to Opus for costly decisions."
    };
}
export function estimateSavings(decisions) {
    const opusOnly = decisions.length * 15;
    const routed = decisions.reduce((sum, d) => sum + d.costRatio, 0);
    const savings = opusOnly === 0 ? 0 : Math.round(((opusOnly - routed) / opusOnly) * 100);
    return { opusOnlyCostUnits: opusOnly, routedCostUnits: routed, estimatedSavingsPercent: savings };
}
