// ── Transport Interface ──────────────────────────────────────────────
// Abstract transport layer for local CC ↔ Supervisor communication.
// Current: HTTP. Future: Redis, RabbitMQ, etc.

import type { TaskPayload, TaskStatus, Report, Feedback, HealthInfo } from "./types.js";

export interface ITransport {
  /** Submit a new experiment task. Returns taskId. */
  sendTask(task: TaskPayload): Promise<string>;

  /** Send feedback for a paused task. */
  sendFeedback(taskId: string, feedback: Feedback): Promise<void>;

  /** Get current status of a task. */
  getStatus(taskId: string): Promise<TaskStatus>;

  /** Get the latest report for a task. */
  getReport(taskId: string): Promise<Report>;

  /** Download a file from the pod workspace. */
  getFiles(taskId: string, filePath: string): Promise<Buffer>;

  /** Check supervisor health. */
  health(): Promise<HealthInfo>;
}
