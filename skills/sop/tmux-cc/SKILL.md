---
name: Tmux CC Remote Execution
description: Launch Claude Code on a remote server via SSH + tmux for autonomous overnight task execution
type: sop
layer: sop
agent: orchestration
tools: [ssh, tmux, claude-code]
input: host (SSH target), user (SSH user), project_dir (remote project path), task_prompt (what CC should do), session_name (tmux session name, default "cc")
output: Running tmux session with CC autonomously executing the task
---

# Tmux CC Remote Execution SOP

## Layer Rules
- **Agent**: CC orchestration (SSH commands to remote server)
- **Called by**: User directly, when they want CC to run autonomously on a remote server
- **Purpose**: Set up and launch a Claude Code session inside tmux on a remote machine so it survives local disconnects (overnight runs, long training, etc.)

## Prerequisites Checklist

Before launching, verify these on the remote server:

1. **SSH access**: `ssh {user}@{host}` works without password prompt (key-based auth)
2. **tmux installed**: `ssh {user}@{host} "which tmux"`
3. **Claude Code installed**: `ssh {user}@{host} "~/.local/bin/claude --version"`
4. **Proxy running** (if needed): `ssh {user}@{host} "curl -s -x http://127.0.0.1:7890 https://www.google.com -o /dev/null -w '%{http_code}'"`
5. **Environment variables set in ~/.bashrc**: `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_MODEL`, `http_proxy`, `https_proxy`
6. **Project cloned**: `ssh {user}@{host} "ls {project_dir}"`
7. **Project-level configs in place**:
   - `{project_dir}/.mcp.json` — MCP server configs (Linux paths, `npx` not `npx.cmd`)
   - `{project_dir}/.claude/settings.local.json` — `bypassPermissions` enabled
   - `{project_dir}/.claude/commands/` — custom SOPs if needed
8. **Global CC config**: `~/.claude/settings.json` with `bypassPermissions` and MCP servers
9. **Git configured**: `git config --global user.name` and PAT-based URL rewriting

## Procedure

### Phase 1: Verify Remote Readiness

```bash
# Run all prerequisite checks in one shot
ssh {user}@{host} "
  echo '=== tmux ===' && which tmux &&
  echo '=== claude ===' && ~/.local/bin/claude --version &&
  echo '=== proxy ===' && curl -s -x http://127.0.0.1:7890 https://www.google.com -o /dev/null -w '%{http_code}' &&
  echo '=== project ===' && ls {project_dir}/
"
```

If any check fails, fix it before proceeding. Do NOT skip.

### Phase 2: Create tmux Session

```bash
# Kill existing session with same name (if any)
ssh {user}@{host} "tmux kill-session -t {session_name} 2>/dev/null; tmux new-session -d -s {session_name} -c {project_dir} && echo 'tmux session {session_name} created'"
```

### Phase 3: Launch Claude Code

```bash
ssh {user}@{host} "tmux send-keys -t {session_name} 'source ~/.bashrc && cd {project_dir} && claude --dangerously-skip-permissions' Enter"
```

Wait for CC to start up (trust prompt + MCP server selection):

```bash
sleep 10
ssh {user}@{host} "tmux capture-pane -t {session_name} -p | tail -20"
```

### Phase 4: Handle Interactive Prompts

CC will show two prompts on first launch in a new directory:

1. **"Is this a project you trust?"** → Send Enter (default is "Yes")
```bash
ssh {user}@{host} "tmux send-keys -t {session_name} Enter"
```

2. **"MCP servers found, select to enable"** → Send Enter (default is all selected)
```bash
sleep 5
ssh {user}@{host} "tmux send-keys -t {session_name} Enter"
```

Wait and verify CC is at the input prompt (`❯`):
```bash
sleep 10
ssh {user}@{host} "tmux capture-pane -t {session_name} -p | tail -15"
```

### Phase 5: Send Task Prompt

```bash
ssh {user}@{host} "tmux send-keys -t {session_name} '{task_prompt}' Enter"
```

**Important**: If the prompt is long (>200 chars), tmux may show `[Pasted text #1]` and wait for a second Enter:
```bash
sleep 3
ssh {user}@{host} "tmux capture-pane -t {session_name} -p | tail -5"
# If you see "[Pasted text #1]" without CC processing, send another Enter:
ssh {user}@{host} "tmux send-keys -t {session_name} Enter"
```

### Phase 6: Verify Execution Started

```bash
sleep 15
ssh {user}@{host} "tmux capture-pane -t {session_name} -p | tail -30"
```

Look for signs CC is working:
- `● Reading...` or `● I'll start by...` — CC is processing
- Task list with `◻` checkboxes — CC created task tracking
- `✻ Thinking...` or `✽ Flummoxing...` — CC is actively working

If you see the `❯` prompt with no activity, the prompt may not have been sent. Resend.

## Monitoring (After Detach)

### Quick peek (without attaching)
```bash
ssh {user}@{host} "tmux capture-pane -t {session_name} -p | tail -30"
```

### Full attach (interactive)
```bash
ssh {user}@{host}
tmux attach -t {session_name}
# Watch CC work in real-time
# Detach: press Ctrl+B, then D (NOT simultaneously — Ctrl+B first, release, then D)
```

### Check if session is still alive
```bash
ssh {user}@{host} "tmux ls"
```

### Check git progress (how many commits CC has made)
```bash
ssh {user}@{host} "cd {project_dir} && git log --oneline -20"
```

## Error Recovery

### CC crashed or session died
```bash
# Check if tmux session exists
ssh {user}@{host} "tmux ls"
# If gone, restart from Phase 2
```

### CC is stuck (no progress for >10 min)
```bash
# Attach and check
ssh {user}@{host} "tmux attach -t {session_name}"
# If stuck on a permission prompt, press 'y' or Enter
# If truly stuck, press Ctrl+C to interrupt, then give a new prompt
```

### Proxy died (mihomo crashed)
```bash
ssh {user}@{host} "curl -s http://127.0.0.1:9090/ || echo 'PROXY_DOWN'"
# If down, restart mihomo:
ssh {user}@{host} "nohup ~/mihomo/mihomo -d ~/.config/mihomo > /tmp/mihomo.log 2>&1 &"
```

## Example: LD2G Phase 1 Execution

```bash
# Full example with concrete values
HOST="10.11.219.245"
USER="pthahnix"
PROJECT="/home/pthahnix/LD2G"
SESSION="ld2g"
TASK="Read the implementation plan at docs/superpowers/plans/2025-04-25-ld2g-phase1-plan.md. Use the superpowers executing-plans skill to execute ALL 10 tasks in order. You have full autonomy — make all decisions yourself, install dependencies, write code, run tests, commit after each task. Do NOT stop to ask questions. Push completed work to the remote."

ssh ${USER}@${HOST} "tmux kill-session -t ${SESSION} 2>/dev/null; tmux new-session -d -s ${SESSION} -c ${PROJECT}"
ssh ${USER}@${HOST} "tmux send-keys -t ${SESSION} 'source ~/.bashrc && cd ${PROJECT} && claude --dangerously-skip-permissions' Enter"
sleep 12
ssh ${USER}@${HOST} "tmux send-keys -t ${SESSION} Enter"  # trust folder
sleep 8
ssh ${USER}@${HOST} "tmux send-keys -t ${SESSION} Enter"  # MCP servers
sleep 10
ssh ${USER}@${HOST} "tmux send-keys -t ${SESSION} '${TASK}' Enter"
sleep 5
ssh ${USER}@${HOST} "tmux send-keys -t ${SESSION} Enter"  # confirm paste
sleep 15
ssh ${USER}@${HOST} "tmux capture-pane -t ${SESSION} -p | tail -30"
```
