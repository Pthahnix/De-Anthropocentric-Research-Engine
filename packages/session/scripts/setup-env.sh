#!/usr/bin/env bash
# setup-env.sh — Configure API credentials for cc user
# Usage: bash setup-env.sh <BASE_URL> <AUTH_TOKEN> [MODEL]
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Usage: setup-env.sh <ANTHROPIC_BASE_URL> <ANTHROPIC_AUTH_TOKEN> [ANTHROPIC_MODEL]"
  exit 1
fi

BASE_URL="$1"
AUTH_TOKEN="$2"
MODEL="${3:-}"

echo "[setup-env] Configuring API credentials for cc user..."

# Remove old entries if re-running
sed -i '/^export ANTHROPIC_BASE_URL=/d' /home/cc/.bashrc
sed -i '/^export ANTHROPIC_AUTH_TOKEN=/d' /home/cc/.bashrc
sed -i '/^export ANTHROPIC_MODEL=/d' /home/cc/.bashrc

# Append new values
cat >> /home/cc/.bashrc <<ENVEOF
export ANTHROPIC_BASE_URL="$BASE_URL"
export ANTHROPIC_AUTH_TOKEN="$AUTH_TOKEN"
ENVEOF

if [ -n "$MODEL" ]; then
  echo "export ANTHROPIC_MODEL=\"$MODEL\"" >> /home/cc/.bashrc
fi

echo "[setup-env] Done"
