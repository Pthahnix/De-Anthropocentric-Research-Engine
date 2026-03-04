// ── Process Manager ──────────────────────────────────────────────────
// Manage Claude Code child process lifecycle on the pod.

import { spawn, type ChildProcess } from "node:child_process";
import { watch, type FSWatcher, existsSync, mkdirSync, readdirSync } from "node:fs";
import { EventEmitter } from "node:events";

const OUTBOX_DIR = "/workspace/outbox";
const INBOX_DIR = "/workspace/inbox";
const EXPERIMENT_DIR = "/workspace/experiment";

export interface CCEvents {
  report: (filePath: string) => void;
  exit: (code: number | null, signal: string | null) => void;
  error: (err: Error) => void;
}

export class ProcessManager extends EventEmitter {
  private proc: ChildProcess | null = null;
  private watcher: FSWatcher | null = null;
  private _sessionId: string | null = null;
  private stdout = "";
  private stderr = "";

  get sessionId(): string | null {
    return this._sessionId;
  }

  get isRunning(): boolean {
    return this.proc !== null && this.proc.exitCode === null;
  }

  get processStatus(): "idle" | "running" | "exited" {
    if (!this.proc) return "idle";
    return this.proc.exitCode === null ? "running" : "exited";
  }

  /** Spawn CC for initial task execution. */
  spawnCC(taskPath: string, allowedTools: string[]): void {
    if (this.isRunning) {
      throw new Error("CC process already running");
    }

    this.ensureDirs();
    const tools = allowedTools.join(",");

    this.proc = spawn("claude", [
      "-p", `$(cat ${taskPath})`,
      "--output-format", "json",
      "--allowedTools", tools,
    ], {
      cwd: EXPERIMENT_DIR,
      shell: true,
      env: { ...process.env },
      stdio: ["pipe", "pipe", "pipe"],
    });

    this.attachHandlers();
    this.watchOutbox();
  }

  /** Resume CC after a checkpoint with feedback. */
  resumeCC(sessionId: string, feedbackPath: string, allowedTools: string[]): void {
    if (this.isRunning) {
      throw new Error("CC process already running");
    }

    const tools = allowedTools.join(",");

    this.proc = spawn("claude", [
      "--resume", sessionId,
      "-p", `$(cat ${feedbackPath})`,
      "--output-format", "json",
      "--allowedTools", tools,
    ], {
      cwd: EXPERIMENT_DIR,
      shell: true,
      env: { ...process.env },
      stdio: ["pipe", "pipe", "pipe"],
    });

    this.attachHandlers();
    this.watchOutbox();
  }

  /** Kill the CC process. */
  killCC(): void {
    if (this.proc && this.proc.exitCode === null) {
      this.proc.kill("SIGTERM");
      // Force kill after 10s if still alive
      setTimeout(() => {
        if (this.proc && this.proc.exitCode === null) {
          this.proc.kill("SIGKILL");
        }
      }, 10_000);
    }
    this.stopWatcher();
  }

  /** Get captured stdout. */
  getStdout(): string {
    return this.stdout;
  }

  /** Get captured stderr. */
  getStderr(): string {
    return this.stderr;
  }

  private attachHandlers(): void {
    if (!this.proc) return;

    this.stdout = "";
    this.stderr = "";

    this.proc.stdout?.on("data", (chunk: Buffer) => {
      const text = chunk.toString();
      this.stdout += text;
      this.tryExtractSessionId(text);
    });

    this.proc.stderr?.on("data", (chunk: Buffer) => {
      this.stderr += chunk.toString();
    });

    this.proc.on("exit", (code, signal) => {
      this.emit("exit", code, signal);
      this.stopWatcher();
    });

    this.proc.on("error", (err) => {
      this.emit("error", err);
      this.stopWatcher();
    });
  }

  private tryExtractSessionId(text: string): void {
    // CC with --output-format json outputs session info
    try {
      const parsed = JSON.parse(text);
      if (parsed.session_id) {
        this._sessionId = parsed.session_id;
      }
    } catch {
      // Not JSON or partial output, ignore
    }
  }

  private watchOutbox(): void {
    this.stopWatcher();
    if (!existsSync(OUTBOX_DIR)) {
      mkdirSync(OUTBOX_DIR, { recursive: true });
    }

    const seen = new Set(readdirSync(OUTBOX_DIR));

    this.watcher = watch(OUTBOX_DIR, (event, filename) => {
      if (event === "rename" && filename && !seen.has(filename)) {
        seen.add(filename);
        if (filename.startsWith("report_") && filename.endsWith(".json")) {
          this.emit("report", `${OUTBOX_DIR}/${filename}`);
        }
      }
    });
  }

  private stopWatcher(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }

  private ensureDirs(): void {
    for (const dir of [INBOX_DIR, OUTBOX_DIR, EXPERIMENT_DIR]) {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    }
  }
}
