// ── Supervisor Types ─────────────────────────────────────────────────
// Self-contained types for the Supervisor system (runs on pod, separate from Neocortica)

export type Status =
  | "initializing"
  | "running"
  | "awaiting_approval"
  | "completed"
  | "failed"
  | "aborted";

export type FeedbackAction = "continue" | "revise" | "abort";

export interface TaskPayload {
  experimentPlan: string;
  checkpoints: string[];
  envConfig: Record<string, string>;
  modelConfig: {
    provider: string;
    model: string;
    apiKey: string;
    baseUrl?: string;
  };
  skills?: string[];
}

export interface TaskStatus {
  taskId: string;
  phase: string;
  status: Status;
  progress?: string;
  error?: string;
  startedAt: string;
  updatedAt: string;
}

export interface Report {
  phase: string;
  summary: string;
  details: string;
  files: string[];
  metrics?: Record<string, unknown>;
}

export interface Feedback {
  action: FeedbackAction;
  message?: string;
}

export interface HealthInfo {
  status: "ok";
  uptime: number;
  ccProcess: "idle" | "running" | "exited";
}
