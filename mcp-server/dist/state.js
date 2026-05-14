import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
const baseDir = process.env.THEMEETPATEL_HOME || join(homedir(), ".themeetpatel");
const sessionsDir = join(baseDir, "sessions");
export async function ensureStore() {
    await mkdir(sessionsDir, { recursive: true });
}
export function sessionPath(id) {
    return join(sessionsDir, `${id}.json`);
}
export function slugify(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 64) || "session";
}
export async function saveSession(input) {
    await ensureStore();
    const now = new Date().toISOString();
    const state = {
        createdAt: input.createdAt ?? now,
        updatedAt: now,
        ...input,
    };
    await writeFile(sessionPath(state.id), JSON.stringify(state, null, 2));
    return state;
}
export async function loadSession(id) {
    await ensureStore();
    const path = sessionPath(id);
    if (!existsSync(path))
        throw new Error(`Session not found: ${id}`);
    return JSON.parse(await readFile(path, "utf8"));
}
export async function listSessions() {
    await ensureStore();
    const files = (await readdir(sessionsDir)).filter((f) => f.endsWith(".json"));
    const states = await Promise.all(files.map(async (file) => JSON.parse(await readFile(join(sessionsDir, file), "utf8"))));
    return states.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map((s) => ({ id: s.id, title: s.title, goal: s.goal, updatedAt: s.updatedAt, done: s.tasks.filter(t => t.status === "done").length, total: s.tasks.length }));
}
export async function updateTask(sessionId, taskId, patch) {
    const state = await loadSession(sessionId);
    const idx = state.tasks.findIndex((t) => t.id === taskId);
    if (idx === -1)
        throw new Error(`Task not found: ${taskId}`);
    state.tasks[idx] = { ...state.tasks[idx], ...patch };
    state.updatedAt = new Date().toISOString();
    await writeFile(sessionPath(state.id), JSON.stringify(state, null, 2));
    return state.tasks[idx];
}
