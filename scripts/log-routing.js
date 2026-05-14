#!/usr/bin/env node
/**
 * themeetpatel · log-routing.js
 *
 * PostToolUse hook for the Task tool. Appends a single-line routing log entry
 * to .themeetpatel/routing.log inside the current project, so the CEO can
 * produce accurate /status reports.
 *
 * Quiet by default. Set THEMEETPATEL_VERBOSE=1 to also print to stderr.
 */

const fs = require('fs');
const path = require('path');

try {
  const cwd = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const logDir = path.join(cwd, '.themeetpatel');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  // Claude Code passes hook input on stdin as JSON
  let raw = '';
  process.stdin.on('data', (chunk) => (raw += chunk));
  process.stdin.on('end', () => {
    try {
      const payload = raw ? JSON.parse(raw) : {};
      const subagent = payload?.tool_input?.subagent_type || 'unknown';
      const ts = new Date().toISOString();
      const line = `${ts}\t${subagent}\n`;
      fs.appendFileSync(path.join(logDir, 'routing.log'), line);
      if (process.env.THEMEETPATEL_VERBOSE === '1') {
        process.stderr.write(`[themeetpatel] routed → ${subagent}\n`);
      }
    } catch (e) {
      // Hooks must never crash the session — swallow.
    }
  });
} catch (e) {
  // Silent fail.
}
