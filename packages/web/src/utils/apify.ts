const APIFY_BASE = "https://api.apify.com/v2";

export interface ActorRunResult {
  id: string;
  status: string;
  defaultDatasetId: string;
}

export type ProgressCallback = (info: { message: string }) => void | Promise<void>;

/** Start an Apify actor run. */
export async function runActor(
  actorId: string,
  input: Record<string, any>,
  token: string,
  onProgress?: ProgressCallback,
): Promise<ActorRunResult> {
  onProgress?.({ message: `Starting actor ${actorId}` });

  const res = await fetch(`${APIFY_BASE}/acts/${actorId}/runs`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error(`Apify runActor failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json() as { data: ActorRunResult };
  return json.data;
}

/** Poll an actor run until it completes. */
export async function waitForRun(
  runId: string,
  token: string,
  onProgress?: ProgressCallback,
  pollInterval = 3000,
  timeout = 120000,
): Promise<ActorRunResult> {
  const start = Date.now();

  while (true) {
    const res = await fetch(`${APIFY_BASE}/actor-runs/${runId}`, {
      headers: { "Authorization": `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error(`Apify waitForRun failed: ${res.status} ${res.statusText}`);
    }

    const json = await res.json() as { data: ActorRunResult };
    const { status } = json.data;

    if (status === "SUCCEEDED") return json.data;
    if (status === "FAILED" || status === "ABORTED" || status === "TIMED-OUT") {
      throw new Error(`Apify run ${runId} ${status}`);
    }

    if (Date.now() - start > timeout) {
      throw new Error(`Apify run ${runId} timeout after ${timeout}ms`);
    }

    onProgress?.({ message: `Waiting for run ${runId}: ${status}` });
    await new Promise((r) => setTimeout(r, pollInterval));
  }
}

/** Get dataset items from a completed run. */
export async function getDatasetItems(
  datasetId: string,
  token: string,
): Promise<any[]> {
  const res = await fetch(`${APIFY_BASE}/datasets/${datasetId}/items`, {
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Apify getDatasetItems failed: ${res.status} ${res.statusText}`);
  }

  return await res.json() as any[];
}

/** Injectable client interface for testing. */
export interface ApifyClient {
  runActor(actorId: string, input: Record<string, any>, token: string, onProgress?: ProgressCallback): Promise<ActorRunResult>;
  waitForRun(runId: string, token: string, onProgress?: ProgressCallback, pollInterval?: number, timeout?: number): Promise<ActorRunResult>;
  getDatasetItems(datasetId: string, token: string): Promise<any[]>;
}

/** Default client using the real Apify REST API. */
export const defaultApifyClient: ApifyClient = {
  runActor,
  waitForRun,
  getDatasetItems,
};
