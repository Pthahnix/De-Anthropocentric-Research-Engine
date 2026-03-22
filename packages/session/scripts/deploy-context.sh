#!/usr/bin/env bash
# deploy-context.sh — Git clone repo + deploy memory to CC path
# Usage: bash deploy-context.sh <REPO_URL> [WORKSPACE_DIR]
# Requires: cc user exists, git installed
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: deploy-context.sh <REPO_URL> [WORKSPACE_DIR]"
  exit 1
fi

REPO_URL="$1"
WORKSPACE_DIR="${2:-/workspace}"

# Extract repo name from URL (e.g., https://github.com/user/repo.git → repo)
REPO_NAME=$(basename "$REPO_URL" .git)
REPO_DIR="$WORKSPACE_DIR/$REPO_NAME"

# Clone repo as cc user
if [ -d "$REPO_DIR" ]; then
  echo "[deploy-context] Repo already cloned at $REPO_DIR, pulling latest..."
  su - cc -c "cd '$REPO_DIR' && git pull"
else
  echo "[deploy-context] Cloning $REPO_URL..."
  su - cc -c "cd '$WORKSPACE_DIR' && git clone '$REPO_URL'"
fi

# Compute project hash: replace non-alphanumeric chars with '-'
# CC uses the absolute workspace path to compute the hash
# e.g., /workspace/neocortica → -workspace-neocortica
PROJECT_HASH=$(echo "$REPO_DIR" | sed 's/[^a-zA-Z0-9]/-/g')
MEMORY_TARGET="/home/cc/.claude/projects/$PROJECT_HASH/memory"

echo "[deploy-context] Project hash: $PROJECT_HASH"

# Create CC project directory
mkdir -p "$MEMORY_TARGET"

# Deploy memory files if they exist (exclude .gitkeep and other dotfiles)
MEMORY_FILES=$(find "$REPO_DIR/memory" -maxdepth 1 -type f ! -name '.*' 2>/dev/null)
if [ -n "$MEMORY_FILES" ]; then
  echo "[deploy-context] Deploying memory files..."
  echo "$MEMORY_FILES" | xargs -I{} cp {} "$MEMORY_TARGET/"
  echo "[deploy-context] Deployed $(echo "$MEMORY_FILES" | wc -l) memory file(s)"
else
  echo "[deploy-context] No memory files to deploy"
fi

chown -R cc:cc "/home/cc/.claude/projects/$PROJECT_HASH"

echo "[deploy-context] Done: repo at $REPO_DIR, memory at $MEMORY_TARGET"
