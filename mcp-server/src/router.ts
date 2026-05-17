import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

export type ModelName = "haiku-4.5" | "sonnet-4.6" | "opus-4.7";

export type RouteInput = {
  task: string;
  taskType?: string;
  complexity?: "low" | "medium" | "high" | "critical";
  stakes?: "low" | "medium" | "high" | "critical";
  requiresCode?: boolean;
  requiresArchitecture?: boolean;
  requiresSecurity?: boolean;
  requiresResearch?: boolean;
  contextTokens?: number;
  outputTokens?: number;
};

export type RouteDecision = {
  model: ModelName;
  confidence: number;
  rationale: string;
  costRatio: 1 | 5 | 15;
  executionMode: "fast" | "balanced" | "deep";
  contextStrategy: string[];
  escalationRule: string;
};

// Patterns are scored with weights, not bingo-style first-match.
// Each pattern contributes to a per-model score; highest score wins,
// with stakes/complexity/architecture overrides on top.
type WeightedPattern = { pattern: string; weight: number };

const HAIKU_PATTERNS: WeightedPattern[] = [
  { pattern: "classify", weight: 1.0 },
  { pattern: "categorize", weight: 1.0 },
  { pattern: "summarize", weight: 0.9 },
  { pattern: "summary", weight: 0.7 },
  { pattern: "format", weight: 0.9 },
  { pattern: "convert", weight: 0.9 },
  { pattern: "list ", weight: 0.8 },
  { pattern: "extract", weight: 0.9 },
  { pattern: "lint", weight: 1.0 },
  { pattern: "status update", weight: 1.0 },
  { pattern: "changelog", weight: 0.8 },
  { pattern: "commit message", weight: 1.0 },
  { pattern: "rename", weight: 0.8 },
  { pattern: "tagline", weight: 0.9 },
  { pattern: "one-line", weight: 0.7 },
  { pattern: "subject line", weight: 0.8 }
];

const OPUS_PATTERNS: WeightedPattern[] = [
  { pattern: "architecture", weight: 1.0 },
  { pattern: "architect ", weight: 1.0 },
  { pattern: "system design", weight: 1.0 },
  { pattern: "diagnose", weight: 1.0 },
  { pattern: "tradeoff analysis", weight: 1.2 },
  { pattern: "chunking strategy", weight: 1.0 },
  { pattern: "multi-region", weight: 1.0 },
  { pattern: "security review", weight: 1.0 },
  { pattern: "security vulnerab", weight: 1.0 },
  { pattern: "threat model", weight: 1.0 },
  { pattern: "race condition", weight: 1.0 },
  { pattern: "distributed", weight: 0.7 },
  { pattern: "concurrency", weight: 0.9 },
  { pattern: "deadlock", weight: 1.0 },
  { pattern: "latency spike", weight: 1.0 },
  { pattern: "performance puzzle", weight: 1.0 },
  { pattern: "migration plan", weight: 1.0 },
  { pattern: "zero-downtime", weight: 1.0 },
  { pattern: "data model", weight: 1.0 },
  { pattern: "compliance", weight: 1.0 },
  { pattern: "gdpr", weight: 1.0 },
  { pattern: "financial risk", weight: 1.0 },
  { pattern: "root cause", weight: 1.0 },
  { pattern: "irreversible", weight: 1.0 },
  { pattern: "decide pricing", weight: 1.0 },
  { pattern: "decide whether", weight: 1.3 },
  { pattern: "pick the right", weight: 1.0 },
  { pattern: "choose between", weight: 1.0 },
  { pattern: "tradeoff", weight: 0.9 },
  { pattern: "data retention policy", weight: 1.0 },
  { pattern: "pii leak", weight: 1.0 },
  { pattern: "90-day gtm", weight: 1.0 },
  { pattern: "cut from the mvp", weight: 1.0 },
  { pattern: "which 3 features to cut", weight: 1.2 },
  { pattern: "pricing model", weight: 0.9 }
];

const SONNET_PATTERNS: WeightedPattern[] = [
  { pattern: "implement", weight: 1.0 },
  { pattern: "build", weight: 0.6 },
  { pattern: "refactor", weight: 1.0 },
  { pattern: "write tests", weight: 1.0 },
  { pattern: "write unit tests", weight: 1.0 },
  { pattern: "write a test", weight: 1.0 },
  { pattern: "playwright", weight: 0.9 },
  { pattern: "write a readme", weight: 1.0 },
  { pattern: "write a runbook", weight: 0.9 },
  { pattern: "write a prd", weight: 0.9 },
  { pattern: "write a doc", weight: 0.8 },
  { pattern: "write docs", weight: 0.9 },
  { pattern: "research", weight: 0.9 },
  { pattern: "analysis", weight: 0.5 },
  { pattern: "debug", weight: 0.8 },
  { pattern: "explain", weight: 1.0 },
  { pattern: "explain why", weight: 1.2 },
  { pattern: "api", weight: 0.5 },
  { pattern: "component", weight: 0.8 },
  { pattern: "workflow automation", weight: 0.9 },
  { pattern: "cold email", weight: 0.8 },
  { pattern: "linkedin post", weight: 0.8 },
  { pattern: "outline", weight: 0.7 },
  { pattern: "board update", weight: 0.7 },
  { pattern: "system prompt", weight: 0.8 }
];

// Load learned weight overrides if present
let LEARNED_WEIGHTS: Record<string, number> = {};
try {
  const weightsPath = join(process.env.THEMEETPATEL_HOME || join(homedir(), ".themeetpatel"), "router-weights.json");
  if (existsSync(weightsPath)) {
    const file = JSON.parse(readFileSync(weightsPath, "utf8"));
    LEARNED_WEIGHTS = file?.weights ?? {};
  }
} catch {
  // ignore — weights are optional
}

function scorePatterns(text: string, patterns: WeightedPattern[]): { score: number; hits: string[] } {
  const t = text.toLowerCase();
  let score = 0;
  const hits: string[] = [];
  for (const { pattern, weight } of patterns) {
    if (t.includes(pattern)) {
      const learned = LEARNED_WEIGHTS[pattern] ?? 1.0;
      score += weight * learned;
      hits.push(pattern);
    }
  }
  return { score, hits };
}

function includesAnyLegacy(text: string, patterns: string[]) {
  const t = text.toLowerCase();
  return patterns.some((p) => t.includes(p));
}

export type RouteDecisionExtended = RouteDecision & { patternsHit?: string[]; signalScores?: { haiku: number; sonnet: number; opus: number } };

export function routeTask(input: RouteInput): RouteDecisionExtended {
  const joined = `${input.taskType ?? ""} ${input.task}`.toLowerCase();
  const complexity = input.complexity ?? "medium";
  const stakes = input.stakes ?? "medium";

  // Score every model from pattern signals
  const haiku = scorePatterns(joined, HAIKU_PATTERNS);
  const sonnet = scorePatterns(joined, SONNET_PATTERNS);
  const opus = scorePatterns(joined, OPUS_PATTERNS);

  // Hard overrides — explicit signals trump scoring
  const hardOpus =
    input.requiresArchitecture === true ||
    input.requiresSecurity === true ||
    complexity === "critical" ||
    stakes === "critical" ||
    (stakes === "high" && complexity === "high");

  if (hardOpus) {
    return {
      model: "opus-4.7",
      confidence: 0.92,
      rationale: "Explicit high-consequence flag (architecture/security/critical/high+high). Token premium is cheaper than rework.",
      costRatio: 15,
      executionMode: "deep",
      contextStrategy: ["Pass decision constraints, relevant files, failure modes, and acceptance criteria only.", "Ask for explicit tradeoffs and irreversible-risk notes."],
      escalationRule: "Escalate to human when the decision depends on missing business/legal/security context.",
      patternsHit: opus.hits,
      signalScores: { haiku: haiku.score, sonnet: sonnet.score, opus: opus.score }
    };
  }

  // Opus wins when its signal is meaningful AND clearly beats both others.
  // Threshold tuned via routing-eval.jsonl (target: ≥85% Opus accuracy, ≥80% adversarial).
  const opusDominant = (opus.score >= 0.9) && opus.score > haiku.score + 0.2 && opus.score > sonnet.score + 0.2;
  if (opusDominant) {
    return {
      model: "opus-4.7",
      confidence: Math.min(0.95, 0.7 + Math.min(0.25, opus.score / 5)),
      rationale: `Opus signals dominate (score ${opus.score.toFixed(2)} vs sonnet ${sonnet.score.toFixed(2)} / haiku ${haiku.score.toFixed(2)}). Patterns: ${opus.hits.join(", ") || "(none)"}.`,
      costRatio: 15,
      executionMode: "deep",
      contextStrategy: ["Pass decision constraints, relevant files, failure modes, and acceptance criteria only.", "Ask for explicit tradeoffs and irreversible-risk notes."],
      escalationRule: "Escalate to human when the decision depends on missing business/legal/security context.",
      patternsHit: opus.hits,
      signalScores: { haiku: haiku.score, sonnet: sonnet.score, opus: opus.score }
    };
  }

  // Sonnet wins for production work or when it edges Haiku
  const sonnetDominant = sonnet.score >= haiku.score && sonnet.score >= 0.5;
  const requiresCodeOrResearch = input.requiresCode === true || input.requiresResearch === true;

  if (requiresCodeOrResearch || sonnetDominant || complexity === "high") {
    return {
      model: "sonnet-4.6",
      confidence: Math.min(0.9, 0.65 + Math.min(0.25, sonnet.score / 5)),
      rationale: `Default production lane. sonnet score ${sonnet.score.toFixed(2)}, haiku ${haiku.score.toFixed(2)}, opus ${opus.score.toFixed(2)}.`,
      costRatio: 5,
      executionMode: "balanced",
      contextStrategy: ["Pass relevant files plus spec, constraints, and acceptance checks.", "Keep output tied to deployable changes."],
      escalationRule: "Escalate to Opus if architecture, security, or multi-constraint risk appears.",
      patternsHit: sonnet.hits,
      signalScores: { haiku: haiku.score, sonnet: sonnet.score, opus: opus.score }
    };
  }

  // Haiku — only when its score is meaningful and no risk signal exists
  const mechanicalOnly = haiku.score >= 0.7 &&
    !input.requiresCode &&
    !input.requiresResearch &&
    !input.requiresArchitecture &&
    !input.requiresSecurity &&
    stakes !== "high" &&
    complexity !== "high" &&
    (input.outputTokens ?? 500) <= 900;

  if (mechanicalOnly) {
    return {
      model: "haiku-4.5",
      confidence: Math.min(0.92, 0.7 + Math.min(0.22, haiku.score / 5)),
      rationale: `Mechanical/low-reasoning. haiku score ${haiku.score.toFixed(2)}. Patterns: ${haiku.hits.join(", ")}.`,
      costRatio: 1,
      executionMode: "fast",
      contextStrategy: ["Pass the exact snippet or file list, not the session history.", "Request terse structured output."],
      escalationRule: "Escalate to Sonnet if the task requires inference, decisions, or >50 lines of code.",
      patternsHit: haiku.hits,
      signalScores: { haiku: haiku.score, sonnet: sonnet.score, opus: opus.score }
    };
  }

  // Safe default
  return {
    model: "sonnet-4.6",
    confidence: 0.72,
    rationale: "Safe default. No strong signal in any direction; routing to the workhorse.",
    costRatio: 5,
    executionMode: "balanced",
    contextStrategy: ["Pass minimal relevant context.", "Ask for concrete output and verification steps."],
    escalationRule: "Downgrade to Haiku for mechanical formatting; upgrade to Opus for costly decisions.",
    patternsHit: [],
    signalScores: { haiku: haiku.score, sonnet: sonnet.score, opus: opus.score }
  };
}

// Backward-compat shim for any caller still using includesAny
export const includesAny = includesAnyLegacy;

export function estimateSavings(decisions: RouteDecision[]) {
  const opusOnly = decisions.length * 15;
  const routed = decisions.reduce((sum, d) => sum + d.costRatio, 0);
  const savings = opusOnly === 0 ? 0 : Math.round(((opusOnly - routed) / opusOnly) * 100);
  return { opusOnlyCostUnits: opusOnly, routedCostUnits: routed, estimatedSavingsPercent: savings };
}
