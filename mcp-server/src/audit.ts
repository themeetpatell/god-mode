import { appendFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { createHash } from "node:crypto";

const HOME = process.env.THEMEETPATEL_HOME || join(homedir(), ".themeetpatel");
const AUDIT_LOG = join(HOME, "audit.jsonl");

export type AuditEvent = {
  ts: string;
  session_id: string;
  tool: string;
  input_hash: string;
  status: "ok" | "denied" | "error" | "approved" | "rate_limited";
  ms: number;
  reason?: string;
};

export async function ensureAuditDir() {
  if (!existsSync(HOME)) await mkdir(HOME, { recursive: true });
}

export function hashInput(input: unknown): string {
  return createHash("sha256").update(JSON.stringify(input)).digest("hex").slice(0, 16);
}

export async function audit(event: Omit<AuditEvent, "ts">): Promise<void> {
  await ensureAuditDir();
  const row: AuditEvent = { ts: new Date().toISOString(), ...event };
  await appendFile(AUDIT_LOG, JSON.stringify(row) + "\n");
}

/**
 * Simple session-scoped tool budget.
 * Prevents runaway loops where the same tool gets called 100x in one session.
 */
const budgets = new Map<string, Map<string, number>>();

export const DEFAULT_BUDGETS: Record<string, number> = {
  route_task: 200,
  create_roadmap: 20,
  save_session: 50,
  load_session: 50,
  list_sessions: 50,
  update_task_status: 200,
  recommend_specialist: 200,
  create_handoff: 20,
  worker_brief: 200
};

export function checkBudget(sessionId: string, tool: string): { allowed: boolean; remaining: number; limit: number } {
  const sessionBudgets = budgets.get(sessionId) || new Map<string, number>();
  const used = sessionBudgets.get(tool) || 0;
  const limit = DEFAULT_BUDGETS[tool] ?? 100;
  const remaining = limit - used;
  return { allowed: remaining > 0, remaining, limit };
}

export function recordUse(sessionId: string, tool: string): void {
  if (!budgets.has(sessionId)) budgets.set(sessionId, new Map());
  const sessionBudgets = budgets.get(sessionId)!;
  sessionBudgets.set(tool, (sessionBudgets.get(tool) || 0) + 1);
}

/**
 * Approval gates for mutating tools.
 * In v1.3 this is a placeholder hook; clients implement actual interactive approval.
 */
export const APPROVAL_REQUIRED: Set<string> = new Set([
  // Tools that mutate user state. Currently advisory — clients should prompt before executing.
  // "save_session", "update_task_status" — disabled by default because they're benign local writes
]);

export function requiresApproval(tool: string): boolean {
  return APPROVAL_REQUIRED.has(tool);
}
