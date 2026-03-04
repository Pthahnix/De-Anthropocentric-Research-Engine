// ── Supervisor HTTP Server ───────────────────────────────────────────
// Express server implementing the Supervisor API.

import express, { type Request, type Response } from "express";
import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync, createReadStream, readdirSync } from "node:fs";
import { join } from "node:path";
import { ProcessManager } from "./process.js";
import { loadState, saveState, loadReport, clearState } from "./state.js";
import type { TaskPayload, TaskStatus, Feedback, HealthInfo } from "./types.js";

const PORT = 8080;
const INBOX_DIR = "/workspace/inbox";
const OUTBOX_DIR = "/workspace/outbox";
const EXPERIMENT_DIR = "/workspace/experiment";
const WORKSPACE_DIR = "/workspace";

const ALLOWED_TOOLS = ["Bash", "Write", "Edit", "Read", "Glob", "Grep"];

const app = express();
app.use(express.json({ limit: "10mb" }));

const pm = new ProcessManager();
const startTime = Date.now();

let currentTask: TaskStatus | null = loadState();
let feedbackCounter = 0;

// ── Helpers ──────────────────────────────────────────────────────────

function ensureDirs(): void {
  for (const dir of [INBOX_DIR, OUTBOX_DIR, EXPERIMENT_DIR]) {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  }
}

function updateTask(patch: Partial<TaskStatus>): void {
  if (!currentTask) return;
  Object.assign(currentTask, patch, { updatedAt: new Date().toISOString() });
  saveState(currentTask);
}

// ── Event Handlers ───────────────────────────────────────────────────

pm.on("report", (filePath: string) => {
  console.log(`[supervisor] Report detected: ${filePath}`);
  updateTask({ status: "awaiting_approval", progress: `Report: ${filePath}` });
});

pm.on("exit", (code: number | null) => {
  console.log(`[supervisor] CC exited with code ${code}`);
  if (currentTask && currentTask.status !== "aborted") {
    if (code === 0 && currentTask.status === "awaiting_approval") {
      // Normal checkpoint exit — keep awaiting_approval
    } else if (code === 0) {
      updateTask({ status: "completed" });
    } else {
      updateTask({ status: "failed", error: `CC exited with code ${code}` });
    }
  }
});

pm.on("error", (err: Error) => {
  console.error(`[supervisor] CC error: ${err.message}`);
  updateTask({ status: "failed", error: err.message });
});

// ── Routes ───────────────────────────────────────────────────────────

app.get("/health", (_req: Request, res: Response) => {
  const info: HealthInfo = {
    status: "ok",
    uptime: Math.floor((Date.now() - startTime) / 1000),
    ccProcess: pm.processStatus,
  };
  res.json(info);
});

app.post("/task", (req: Request, res: Response) => {
  if (currentTask && ["initializing", "running", "awaiting_approval"].includes(currentTask.status)) {
    res.status(409).json({ error: "A task is already active" });
    return;
  }

  const payload = req.body as TaskPayload;
  if (!payload.experimentPlan) {
    res.status(400).json({ error: "experimentPlan is required" });
    return;
  }

  const taskId = randomUUID();
  const taskPath = join(INBOX_DIR, `task_${taskId}.md`);

  // Write task file for CC to read
  writeFileSync(taskPath, payload.experimentPlan);

  // Set up model env vars if provided
  if (payload.modelConfig) {
    const mc = payload.modelConfig;
    if (mc.apiKey) process.env.ANTHROPIC_API_KEY = mc.apiKey;
    if (mc.baseUrl) process.env.ANTHROPIC_BASE_URL = mc.baseUrl;
  }

  // Set custom env vars
  if (payload.envConfig) {
    for (const [k, v] of Object.entries(payload.envConfig)) {
      process.env[k] = v;
    }
  }

  currentTask = {
    taskId,
    phase: "init",
    status: "initializing",
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveState(currentTask);

  // Spawn CC
  try {
    pm.spawnCC(taskPath, ALLOWED_TOOLS);
    updateTask({ status: "running", phase: "executing" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    updateTask({ status: "failed", error: msg });
    res.status(500).json({ error: msg });
    return;
  }

  res.status(201).json({ taskId });
});

app.get("/task/:id/status", (req: Request, res: Response) => {
  if (!currentTask || currentTask.taskId !== req.params.id) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(currentTask);
});

app.get("/task/:id/report", (req: Request, res: Response) => {
  if (!currentTask || currentTask.taskId !== req.params.id) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  // Find the latest report file in outbox
  const phase = currentTask.phase || "unknown";
  const report = loadReport(phase);

  if (!report) {
    // Try to find any report file
    const files = existsSync(OUTBOX_DIR)
      ? readdirSync(OUTBOX_DIR).filter(f => f.startsWith("report_") && f.endsWith(".json"))
      : [];

    if (files.length === 0) {
      res.status(404).json({ error: "No report available yet" });
      return;
    }

    // Return the most recent report
    const latest = files.sort().pop()!;
    try {
      const raw = readFileSync(join(OUTBOX_DIR, latest), "utf-8");
      res.json(JSON.parse(raw));
    } catch {
      res.status(500).json({ error: "Failed to read report" });
    }
    return;
  }

  res.json(report);
});

app.post("/task/:id/feedback", (req: Request, res: Response) => {
  if (!currentTask || currentTask.taskId !== req.params.id) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  if (currentTask.status !== "awaiting_approval") {
    res.status(409).json({ error: `Task is ${currentTask.status}, not awaiting_approval` });
    return;
  }

  const feedback = req.body as Feedback;
  if (!feedback.action || !["continue", "revise", "abort"].includes(feedback.action)) {
    res.status(400).json({ error: "action must be continue, revise, or abort" });
    return;
  }

  if (feedback.action === "abort") {
    pm.killCC();
    updateTask({ status: "aborted" });
    res.json({ status: "aborted" });
    return;
  }

  // Write feedback file for CC to read on resume
  feedbackCounter++;
  const fbPath = join(INBOX_DIR, `feedback_${feedbackCounter}.md`);
  const fbContent = feedback.action === "revise"
    ? `REVISE: ${feedback.message || "Please revise the current phase."}`
    : `CONTINUE: ${feedback.message || "Proceed to the next phase."}`;
  writeFileSync(fbPath, fbContent);

  // Resume CC with feedback
  const sessionId = pm.sessionId;
  if (!sessionId) {
    updateTask({ status: "failed", error: "No CC session to resume" });
    res.status(500).json({ error: "No CC session to resume" });
    return;
  }

  try {
    pm.resumeCC(sessionId, fbPath, ALLOWED_TOOLS);
    updateTask({ status: "running" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    updateTask({ status: "failed", error: msg });
    res.status(500).json({ error: msg });
    return;
  }

  res.json({ status: "resumed", action: feedback.action });
});

app.get("/task/:id/files/*path", (req: Request, res: Response) => {
  if (!currentTask || currentTask.taskId !== req.params.id) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  // Extract file path from named wildcard
  const filePath = req.params.path as string;
  if (!filePath) {
    res.status(400).json({ error: "File path required" });
    return;
  }

  const fullPath = join(WORKSPACE_DIR, filePath);

  // Prevent directory traversal
  if (!fullPath.startsWith(WORKSPACE_DIR)) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  if (!existsSync(fullPath)) {
    res.status(404).json({ error: "File not found" });
    return;
  }

  const stream = createReadStream(fullPath);
  stream.on("error", () => {
    res.status(500).json({ error: "Failed to read file" });
  });
  stream.pipe(res);
});

app.post("/task/:id/abort", (req: Request, res: Response) => {
  if (!currentTask || currentTask.taskId !== req.params.id) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  pm.killCC();
  updateTask({ status: "aborted" });
  res.json({ status: "aborted" });
});

// ── Startup ──────────────────────────────────────────────────────────

ensureDirs();

// Crash recovery: if we have a saved state that was running, mark as failed
if (currentTask && ["running", "initializing"].includes(currentTask.status)) {
  console.log(`[supervisor] Recovering from crash. Previous task ${currentTask.taskId} was ${currentTask.status}`);
  updateTask({ status: "failed", error: "Supervisor restarted unexpectedly" });
}

app.listen(PORT, () => {
  console.log(`[supervisor] Listening on port ${PORT}`);
  console.log(`[supervisor] Workspace: ${WORKSPACE_DIR}`);
  if (currentTask) {
    console.log(`[supervisor] Recovered task: ${currentTask.taskId} (${currentTask.status})`);
  }
});
