# Session Return — Pull Results + Cleanup SOP

Retrieves experiment outputs from a remote pod via git pull, then cleans up. Triggered manually by user after experiment completes.

This skill handles cleanup after session-teleport. Behavior depends on the pod type used during teleport.

## Prerequisites
- Pod/server is running with experiment outputs committed and pushed
- Local repo is on the same branch used during session-teleport Phase 3
- Know the pod type used during teleport: **RunPod** or **Remote**

## Phase 1: Pull Results

1. Pull experiment outputs pushed by pod CC:
   ```bash
   git pull
   ```
2. Review what was pulled — expect structured outputs in directories like:
   - `checkpoints/` — intermediate experiment state
   - `results/` — final experiment data
   - `reports/` — analysis and summaries

   (Exact structure defined by experiment-output.md convention in the main project)

## Phase 2: Digest

1. Read the pulled experiment outputs
2. Update local MEMORY based on findings — what worked, what didn't, key results
3. This is done by the local CC naturally as part of the research workflow
   - No automated MEMORY sync from pod — avoids conflicts with parallel pods

## Phase 3: Cleanup

Cleanup behavior depends on the pod type used during session-teleport.

### RunPod

1. Stop the pod:
   ```
   RunPod MCP: stop-pod(podId)
   ```
2. Delete the pod:
   ```
   RunPod MCP: delete-pod(podId)
   ```
3. Confirm cleanup to user
   - If cleanup fails, provide manual instructions:
     ```
     Manual cleanup needed:
       1. Go to https://www.runpod.io/console/pods
       2. Find pod <podId>
       3. Stop and delete it
     ```

### Remote

NO cleanup action. Inform user:

> Remote server cleanup is your responsibility. Stop CC manually on the remote machine if needed.

The remote server is not managed by Neocortica — it existed before session-teleport and will continue to exist after. Do not attempt to shut down or modify the remote machine.

## Golden Rule

- **RunPod**: Always clean up. GPU time costs money.
- **Remote**: Your server, your management.
