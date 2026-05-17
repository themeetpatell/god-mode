#!/usr/bin/env bash
#
# themeetpatel · github-init.sh
#
# Initializes the repo for public GitHub publishing:
#   - Adds a sensible .gitignore that excludes ~/.themeetpatel artifacts and dist/
#   - Stages cleanups (removes dist/ if it's tracked, etc.)
#   - Prints a guided checklist for the actual git+gh commands to run
#
# This script does NOT push, tag, or create a release — it stops short of
# anything destructive or that requires GitHub auth. You run the final commands.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$REPO_ROOT"

echo "Initializing repo for GitHub publish..."

# 1. .gitignore — careful not to overwrite if it exists with user content
if [ -f .gitignore ]; then
  echo "→ .gitignore exists; appending themeetpatel-specific rules if missing"
  GITIGNORE_NEW=$(cat <<'EOF'

# themeetpatel God Mode
mcp-server/dist/
mcp-server/node_modules/
node_modules/
.themeetpatel/
*.log
.DS_Store
.env
.env.local
.vscode/
.idea/
EOF
  )
  for line in $(echo "$GITIGNORE_NEW" | grep -v '^#' | grep -v '^$'); do
    if ! grep -qxF "$line" .gitignore 2>/dev/null; then
      echo "$line" >> .gitignore
    fi
  done
else
  cat > .gitignore <<'EOF'
# themeetpatel God Mode
mcp-server/dist/
mcp-server/node_modules/
node_modules/
.themeetpatel/
*.log
.DS_Store
.env
.env.local
.vscode/
.idea/
EOF
  echo "→ Created .gitignore"
fi

# 2. Remove dist/ from tracking if it's been committed (idempotent)
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if git ls-files --error-unmatch mcp-server/dist 2>/dev/null | head -1 >/dev/null; then
    echo "→ Removing mcp-server/dist/ from git tracking (kept on disk)"
    git rm -r --cached mcp-server/dist 2>/dev/null || true
  fi
fi

# 3. Verify counts match README
EXPECTED_AGENTS=$(grep -c "^| \`agents/" README.md 2>/dev/null || echo 0)
ACTUAL_AGENTS=$(ls agents/ 2>/dev/null | wc -l | tr -d ' ')
EXPECTED_SKILLS=$(grep -c "^| \`skills/" README.md 2>/dev/null || echo 0)
ACTUAL_SKILLS=$(ls skills/ 2>/dev/null | wc -l | tr -d ' ')

echo ""
echo "--- Counts sanity ---"
echo "Agents on disk:    $ACTUAL_AGENTS"
echo "Skills on disk:    $ACTUAL_SKILLS"
echo "Packs:             $(ls packs/ 2>/dev/null | wc -l | tr -d ' ')"
echo ""

# 4. License sanity
if [ ! -f LICENSE ]; then
  echo "⚠  LICENSE file missing — required for marketplace listings"
else
  echo "→ LICENSE present"
fi

# 5. Files that should NOT be in the repo
echo ""
echo "--- Forbidden files check ---"
for f in .env .env.local "*.pem" "*.key"; do
  found=$(git ls-files "$f" 2>/dev/null || true)
  if [ -n "$found" ]; then
    echo "⚠  $f is tracked. Remove it before publishing."
  fi
done

# 6. Print the actual git commands the user needs to run
cat <<EOF

──────────────────────────────────────────────
NEXT STEPS — run these manually:
──────────────────────────────────────────────

# Stage and commit the cleanups
git add -A
git status                                # verify what's staged
git commit -m "chore: prepare for public publish — gitignore, untrack dist"

# Create the GitHub repo (requires \`gh\` CLI installed + authenticated)
gh repo create themeetpatel/god-mode \\
  --public \\
  --source=. \\
  --description "AI operating layer with verified deliverables, learning router, and Domain Packs" \\
  --homepage "https://themeetpatel.dev" \\
  --remote=origin \\
  --push

# Tag the release
git tag -a v1.3.0 -m "v1.3.0 — verifier scripts, cost ledger, context curator, memory, packs, examples, landing"
git push origin v1.3.0

# Create a GitHub release with release notes
gh release create v1.3.0 \\
  --title "v1.3.0 — Verified, learned, portable" \\
  --notes-file CHANGELOG.md

# Once the repo is live, update plugin marketplace install URL in README + landing
# Re-test: clone fresh, install, run /god-mode "build a test landing page"

──────────────────────────────────────────────
EOF
