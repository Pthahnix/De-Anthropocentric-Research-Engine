// ── State Manager ────────────────────────────────────────────────────
// Persist task state to disk for crash recovery.

import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from "node:fs";
import type { TaskStatus, Report } from "./types.js";

const STATE_DIR = "/workspace/supervisor";
const STATE_FILE = `${STATE_DIR}/state.json`;

function ensureDir(): void {
  if (!existsSync(STATE_DIR)) {
    mkdirSync(STATE_DIR, { recursive: true });
  }
}

export function loadState(): TaskStatus | null {
  try {
    const raw = readFileSync(STATE_FILE, "utf-8");
    return JSON.parse(raw) as TaskStatus;
  } catch {
    return null;
  }
}

export function saveState(status: TaskStatus): void {
  ensureDir();
  writeFileSync(STATE_FILE, JSON.stringify(status, null, 2));
}

export function clearState(): void {
  try {
    unlinkSync(STATE_FILE);
  } catch {
    // file doesn't exist, that's fine
  }
}

export function loadReport(phase: string): Report | null {
  try {
    const reportPath = `/workspace/outbox/report_${phase}.json`;
    const raw = readFileSync(reportPath, "utf-8");
    return JSON.parse(raw) as Report;
  } catch {
    return null;
  }
}
