#!/usr/bin/env node
/**
 * themeetpatel · memory-init.js
 *
 * Initializes ~/.themeetpatel/memory/default.json with a starter schema.
 * Idempotent — won't overwrite if the file exists.
 *
 * Usage:
 *   node scripts/memory-init.js
 *   THEMEETPATEL_HOME=/custom/path node scripts/memory-init.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = process.env.THEMEETPATEL_HOME || path.join(os.homedir(), '.themeetpatel');
const MEMORY_DIR = path.join(HOME, 'memory');
const DEFAULT_FILE = path.join(MEMORY_DIR, 'default.json');

const SEED = {
  version: 1,
  updated_at: new Date().toISOString(),
  facts: {
    stack: {},
    company: {},
    founder: {
      voice_rules: [
        "No contrast templates (\"it's not just X, it's Y\")",
        "Specifics over abstractions",
        "Operator-to-operator tone",
        "Anti-AI-pattern detector enabled"
      ]
    },
    team: [],
    decisions_locked_in: [],
    preferences: {
      default_model_for_writing: "sonnet",
      default_model_for_decisions: "opus",
      ship_over_perfect: true
    },
    do_not: []
  },
  open_threads: []
};

if (!fs.existsSync(MEMORY_DIR)) fs.mkdirSync(MEMORY_DIR, { recursive: true });

if (fs.existsSync(DEFAULT_FILE)) {
  console.log(`Memory already initialized at ${DEFAULT_FILE}. Not overwriting.`);
  process.exit(0);
}

fs.writeFileSync(DEFAULT_FILE, JSON.stringify(SEED, null, 2));
console.log(`Initialized memory at ${DEFAULT_FILE}`);
console.log('Edit it directly, or let God Mode populate facts as you work.');
