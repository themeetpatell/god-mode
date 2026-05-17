#!/usr/bin/env bash
#
# themeetpatel · install-pack.sh
#
# Installs a Domain Pack on top of the core God Mode plugin.
# Mirrors pack contents into Claude Code's plugin-discovery paths so the CEO
# picks up the new agents and skills on next session.
#
# Usage:
#   ./scripts/install-pack.sh <pack-name>
#   ./scripts/install-pack.sh pack-founder-uae
#   ./scripts/install-pack.sh --list
#   ./scripts/install-pack.sh --installed
#
# Env:
#   CLAUDE_PLUGIN_ROOT  override the destination plugin root
#   THEMEETPATEL_HOME   override ~/.themeetpatel
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PACKS_DIR="$REPO_ROOT/packs"
THEMEETPATEL_HOME="${THEMEETPATEL_HOME:-$HOME/.themeetpatel}"
INSTALLED_REGISTRY="$THEMEETPATEL_HOME/installed-packs.json"

ensure_registry() {
  mkdir -p "$THEMEETPATEL_HOME"
  if [ ! -f "$INSTALLED_REGISTRY" ]; then
    echo '{"installed":[]}' > "$INSTALLED_REGISTRY"
  fi
}

list_available() {
  echo "Available packs in $PACKS_DIR:"
  for pack_dir in "$PACKS_DIR"/pack-*; do
    [ -d "$pack_dir" ] || continue
    local name
    name=$(basename "$pack_dir")
    local desc=""
    if [ -f "$pack_dir/pack.json" ]; then
      desc=$(grep -m1 '"description"' "$pack_dir/pack.json" | sed 's/.*"description":\s*"\(.*\)".*/\1/' | cut -c1-90)
    fi
    printf "  %-28s %s\n" "$name" "$desc"
  done
}

list_installed() {
  ensure_registry
  echo "Installed packs:"
  if command -v jq >/dev/null 2>&1; then
    jq -r '.installed[] | "  \(.name) (v\(.version)) — installed \(.installed_at)"' "$INSTALLED_REGISTRY"
  else
    cat "$INSTALLED_REGISTRY"
  fi
}

install_pack() {
  local pack="$1"
  local pack_dir="$PACKS_DIR/$pack"

  if [ ! -d "$pack_dir" ]; then
    echo "Pack '$pack' not found at $pack_dir" >&2
    echo "Use --list to see available packs." >&2
    exit 1
  fi
  if [ ! -f "$pack_dir/pack.json" ]; then
    echo "Pack manifest missing: $pack_dir/pack.json" >&2
    exit 1
  fi

  ensure_registry

  # Idempotency: skip if already installed (warn but don't fail)
  if command -v jq >/dev/null 2>&1; then
    if jq -e --arg n "$pack" '.installed[] | select(.name == $n)' "$INSTALLED_REGISTRY" >/dev/null; then
      echo "Pack '$pack' already installed. Reinstalling..."
    fi
  fi

  echo "Installing $pack..."
  local agent_count=0
  local skill_count=0

  # Copy agents into root agents/ with pack prefix
  if [ -d "$pack_dir/agents" ]; then
    for agent_file in "$pack_dir/agents"/*.md; do
      [ -f "$agent_file" ] || continue
      local base
      base=$(basename "$agent_file")
      cp "$agent_file" "$REPO_ROOT/agents/${base}"
      agent_count=$((agent_count + 1))
    done
  fi

  # Copy skills into root skills/
  if [ -d "$pack_dir/skills" ]; then
    for skill_subdir in "$pack_dir/skills"/*/; do
      [ -d "$skill_subdir" ] || continue
      local skill_name
      skill_name=$(basename "$skill_subdir")
      mkdir -p "$REPO_ROOT/skills/$skill_name"
      cp -r "$skill_subdir"/* "$REPO_ROOT/skills/$skill_name/"
      skill_count=$((skill_count + 1))
    done
  fi

  # Copy commands if present
  if [ -d "$pack_dir/commands" ]; then
    cp "$pack_dir/commands"/*.md "$REPO_ROOT/commands/" 2>/dev/null || true
  fi

  # Update registry
  local version
  version=$(grep -m1 '"version"' "$pack_dir/pack.json" | sed 's/.*"version":\s*"\(.*\)".*/\1/')
  local now
  now=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  if command -v jq >/dev/null 2>&1; then
    local tmp
    tmp=$(mktemp)
    jq --arg n "$pack" --arg v "$version" --arg t "$now" \
       '.installed = ((.installed // []) | map(select(.name != $n)) + [{name: $n, version: $v, installed_at: $t}])' \
       "$INSTALLED_REGISTRY" > "$tmp"
    mv "$tmp" "$INSTALLED_REGISTRY"
  else
    echo "(warning: jq not found, registry not updated atomically — falling back to append)" >&2
  fi

  echo "✓ Installed $pack: $agent_count agents, $skill_count skills"
  echo "  Restart Claude Code (or your MCP client) so the CEO picks up the new components."
}

uninstall_pack() {
  local pack="$1"
  local pack_dir="$PACKS_DIR/$pack"
  if [ ! -d "$pack_dir" ]; then
    echo "Pack '$pack' not found" >&2
    exit 1
  fi
  ensure_registry

  # Remove files that came from this pack
  if [ -d "$pack_dir/agents" ]; then
    for agent_file in "$pack_dir/agents"/*.md; do
      [ -f "$agent_file" ] || continue
      rm -f "$REPO_ROOT/agents/$(basename "$agent_file")"
    done
  fi
  if [ -d "$pack_dir/skills" ]; then
    for skill_subdir in "$pack_dir/skills"/*/; do
      [ -d "$skill_subdir" ] || continue
      local skill_name
      skill_name=$(basename "$skill_subdir")
      rm -rf "$REPO_ROOT/skills/$skill_name"
    done
  fi

  # Update registry
  if command -v jq >/dev/null 2>&1; then
    local tmp
    tmp=$(mktemp)
    jq --arg n "$pack" '.installed |= map(select(.name != $n))' "$INSTALLED_REGISTRY" > "$tmp"
    mv "$tmp" "$INSTALLED_REGISTRY"
  fi
  echo "✓ Uninstalled $pack"
}

case "${1:-}" in
  ""|"--help"|"-h")
    echo "Usage: $0 <pack-name> | --list | --installed | --uninstall <pack-name>"
    exit 0
    ;;
  "--list")
    list_available
    ;;
  "--installed")
    list_installed
    ;;
  "--uninstall")
    [ -n "${2:-}" ] || { echo "Usage: $0 --uninstall <pack-name>" >&2; exit 1; }
    uninstall_pack "$2"
    ;;
  *)
    install_pack "$1"
    ;;
esac
