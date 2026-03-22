#!/usr/bin/env bash
# install-node.sh — Detect + install Node.js 22 (and git if missing)
# Usage: bash install-node.sh
# Idempotent: skips if Node.js v22+ already present
set -euo pipefail

# Check Node.js
if command -v node &>/dev/null; then
  NODE_MAJOR=$(node -v | sed 's/^v//' | cut -d. -f1)
  if [ "$NODE_MAJOR" -ge 22 ]; then
    echo "[install-node] Node.js $(node -v) already installed, skipping"
    exit 0
  fi
  echo "[install-node] Node.js $(node -v) found but < v22, upgrading..."
fi

# Install Node.js 22
echo "[install-node] Installing Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

# Install git if missing
if ! command -v git &>/dev/null; then
  echo "[install-node] Installing git..."
  apt-get install -y git
fi

echo "[install-node] Done: node $(node -v), npm $(npm -v)"
