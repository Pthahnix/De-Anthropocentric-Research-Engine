#!/usr/bin/env bash
# install-cc.sh — Install Claude Code CLI for cc user
# Usage: bash install-cc.sh
# Requires: cc user exists, Node.js installed
set -euo pipefail

# Check if already installed
if su - cc -c 'command -v claude' &>/dev/null; then
  echo "[install-cc] Claude Code already installed: $(su - cc -c 'claude --version')"
  exit 0
fi

echo "[install-cc] Installing Claude Code CLI..."
su - cc -c 'curl -fsSL https://claude.ai/install.sh | bash'

# Ensure PATH includes .local/bin
if ! su - cc -c 'grep -q ".local/bin" ~/.bashrc'; then
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> /home/cc/.bashrc
fi

# Skip onboarding wizard
mkdir -p /home/cc/.claude
touch /home/cc/.claude/.onboarding-complete
chown -R cc:cc /home/cc/.claude

echo "[install-cc] Done: $(su - cc -c 'claude --version')"
