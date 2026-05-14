#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
npm install
npm run build
mkdir -p "$HOME/.themeetpatel/sessions"
echo "Built themeetpatel MCP server. Add $(pwd)/dist/index.js to your MCP client config."
