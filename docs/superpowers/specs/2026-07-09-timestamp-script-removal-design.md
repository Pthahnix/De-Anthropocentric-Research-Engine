# Timestamp Script Removal — Design

Date: 2026-07-09
Status: design-complete, awaiting implementation-plan pass

## Problem

Two context-management SOP skills get the current time by shelling out to a
one-line Python helper:

```python
#!/usr/bin/env python3
from datetime import datetime
print(datetime.now().strftime("%Y-%m-%d-%H-%M"))
```

This helper (`scripts/timestamp.py`) exists twice, byte-identical, one copy per
skill. It wraps a single `strftime` call that the shell's own `date` builtin
already produces. The Python process, the file, and the `scripts/` directory it
lives in are pure overhead.

## Goal

Replace the `timestamp.py` call with the equivalent inline Bash command in each
skill's `SKILL.md`, then delete the now-dead scripts and their empty
directories.

`date +%Y-%m-%d-%H-%M` emits `2026-07-09-14-30` — identical format, identical
local-timezone semantics to `datetime.now().strftime(...)` — with no Python
process and no file to maintain.

### Why this is safe (shell portability)

`%Y %m %d %H %M` are POSIX strftime specifiers. In any POSIX shell (Linux GNU
`date`, macOS/BSD `date`, Git Bash, WSL) the output is identical. Both consumers
of this command are **DARE-exec context-management SOP skills run by Claude
Code**, which execute either in CC's own Bash tool (Git Bash → GNU coreutils on
this machine) or in a Linux exec sandbox. Both are POSIX. The only shells that
would choke — `cmd.exe`, PowerShell — are never in the execution path for these
skills, so no portability caveat is needed in the skill text.

## Scope (locked)

In:

1. Edit the call site in `skills/context-init/SKILL.md`.
2. Edit the call site in `skills/context-checkpoint/SKILL.md`.
3. Delete `skills/context-init/scripts/timestamp.py`.
4. Delete `skills/context-checkpoint/scripts/timestamp.py`.
5. Delete the two now-empty `scripts/` directories.

Out:

- The four other repo hits for the word "timestamp"
  (`ara-from-context`, `context-exploring`, `dynamic-tracking`,
  `checkpoint-and-recover`) are prose uses of the English word, not script
  calls. Untouched.
- `figures/skill_graph.html` contains a generated `references` node for
  `context-management/timestamp.py`. It is a Phase-1 self-analysis snapshot
  artifact; it regenerates only when self-analysis is re-run. Left stale by
  deliberate choice — not regenerated in this task.

## The two edits

### `skills/context-init/SKILL.md`

Step 1 "Get Timestamp" currently reads:

> Run the timestamp script to get the current time:
>
> ````
> ```bash
> python scripts/timestamp.py
> ```
> ````
>
> Output format: `yyyy-mm-dd-hh-mm` (e.g., `2026-05-16-14-30`)

Change the fenced command to:

```bash
date +%Y-%m-%d-%H-%M
```

The prose lead-in and the output-format line are already correct and stay as-is
(the lead-in "Run the timestamp script" may be softened to "Get the current
time" — cosmetic, at implementer discretion). Step 4 mentions updating the "Last
Updated timestamp" but issues no separate script call; no change there.

### `skills/context-checkpoint/SKILL.md`

Line 88 currently reads:

> - Update the Last Updated timestamp (call `scripts/timestamp.py` for current time)

Change to:

> - Update the Last Updated timestamp (run `date +%Y-%m-%d-%H-%M` for current time)

## Architecture note

This edits two skills whose architecture is marked IMMUTABLE in the project's
hard constraints. This task is authorized directly by the user and is a
**call-mechanism swap only** — no layer change, no edge change, no frontmatter
change, no re-leveling. The 4-layer invariant (campaign→strategy→tactic→sop) is
untouched. The privacy red line is not implicated (no log paths anywhere near
this change).

## Verification

1. `grep -rn "timestamp.py" skills` returns no call-site hits (the stale
   `skill_graph.html` reference is out of scope and expected to remain).
2. `grep -rn "date +%Y-%m-%d-%H-%M" skills` shows exactly the two new call sites.
3. Both `scripts/` directories are gone; no other files were living in them
   (confirmed pre-deletion: each held only `timestamp.py`).
4. Each edited `SKILL.md` still passes markdownlint (fenced code blocks intact).
