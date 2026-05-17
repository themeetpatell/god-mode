#!/usr/bin/env node
/**
 * themeetpatel · log-routing.js
 *
 * PostToolUse hook for the Task tool. Writes TWO logs:
 *
 *  1) ~/.themeetpatel/routing.log
 *     Append-only tab-separated lines for backwards-compat with the session-summary script.
 *
 *  2) ~/.themeetpatel/ledger.jsonl
 *     Append-only JSON lines, one per Task call, with the schema route-learn / ledger.js consume.
 *
 * Quiet by default. Set THEMEETPATEL_VERBOSE=1 to also print to stderr.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

try {
  const home = process.env.THEMEETPATEL_HOME || path.join(os.homedir(), '.themeetpatel');
  if (!fs.existsSync(home)) fs.mkdirSync(home, { recursive: true });

  let raw = '';
  process.stdin.on('data', (chunk) => (raw += chunk));
  process.stdin.on('end', () => {
    try {
      const payload = raw ? JSON.parse(raw) : {};
      const subagent = payload?.tool_input?.subagent_type || 'unknown';
      const promptIn = payload?.tool_input?.prompt || payload?.tool_input?.description || '';
      const ts = new Date().toISOString();

      // 1) routing.log (legacy + session-summary)
      fs.appendFileSync(path.join(home, 'routing.log'), `${ts}\t${subagent}\n`);

      // 2) ledger.jsonl (structured, for ledger.js + route-learn.js)
      const sessionId = process.env.CLAUDE_SESSION_ID
        || process.env.CLAUDE_PROJECT_DIR
        || 'unknown-session';
      const taskId = `T-${crypto.randomBytes(4).toString('hex')}`;

      // Map subagent_type → model. The CEO chooses subagent based on routing,
      // so subagent type is a proxy for the routed model.
      const modelMap = {
        'haiku-specialist': 'haiku-4.5',
        'synthesizer':      'haiku-4.5',
        'sonnet-engineer':  'sonnet-4.6',
        'verifier':         'sonnet-4.6',
        'opus-architect':   'opus-4.7',
        'god-mode-ceo':     'opus-4.7'
      };
      // Specialist agents inherit from their frontmatter — default to sonnet
      const routed_model = modelMap[subagent] || 'sonnet-4.6';

      // Tokens/cost aren't visible in the hook payload; downstream usage telemetry
      // (or the user manually) fills these in later. We write what we know now and
      // ledger.js handles undefined fields gracefully.
      const row = {
        ts,
        session_id: sessionId,
        task_id: taskId,
        task_text: typeof promptIn === 'string' ? promptIn.slice(0, 200) : '',
        subagent_type: subagent,
        routed_model,
        actual_model: routed_model,
        // The fields below are placeholders the user/post-processor can update
        input_tokens: null,
        output_tokens: null,
        cost_usd: null,
        outcome: 'unknown',
        verifier_verdict: 'skipped',
        patterns_hit: []
      };
      fs.appendFileSync(path.join(home, 'ledger.jsonl'), JSON.stringify(row) + '\n');

      if (process.env.THEMEETPATEL_VERBOSE === '1') {
        process.stderr.write(`[themeetpatel] logged route → ${subagent}\n`);
      }
    } catch (e) {
      // Hooks must never crash the session — swallow.
    }
  });
} catch (e) {
  // Silent fail.
}
