#!/usr/bin/env bash
# create-cc-user.sh — Create cc user with SSH keys and workspace ownership
# Usage: bash create-cc-user.sh
# Idempotent: skips if cc user already exists
set -euo pipefail

if id cc &>/dev/null; then
  echo "[create-cc-user] User 'cc' already exists, skipping"
  exit 0
fi

echo "[create-cc-user] Creating user 'cc'..."
useradd -m -s /bin/bash cc
usermod -aG sudo cc

# Copy SSH authorized_keys from root
echo "[create-cc-user] Configuring SSH keys..."
mkdir -p /home/cc/.ssh
cp /root/.ssh/authorized_keys /home/cc/.ssh/
chown -R cc:cc /home/cc/.ssh
chmod 700 /home/cc/.ssh
chmod 600 /home/cc/.ssh/authorized_keys

# Give cc ownership of workspace
if [ -d /workspace ]; then
  echo "[create-cc-user] Setting /workspace ownership..."
  chown cc:cc /workspace
fi

echo "[create-cc-user] Done: user 'cc' created"
