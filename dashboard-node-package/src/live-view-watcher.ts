import WebSocket from "ws";
import type { FullConfig } from "@playwright/test";
import { QAConsoleClient } from "./client";

const POLL_INTERVAL_MS = 50;
const CDP_TIMEOUT_MS = 3000;
const DEFAULT_BASE_PORT = 9223;

interface LiveViewConfig {
  client: QAConsoleClient;
  sessionId?: string;
}

function getConfig(): LiveViewConfig | null {
  const baseUrl = process.env.QA_CONSOLE_URL;
  const apiKey = process.env.QA_CONSOLE_API_KEY;
  const projectId = process.env.QA_CONSOLE_PROJECT_ID;
  const enabled = process.env.QA_CONSOLE_LIVE_VIEW !== "false";

  if (!enabled) {
    console.log("[qa-console-live-view] Disabled via QA_CONSOLE_LIVE_VIEW=false.");
    return null;
  }
  if (!baseUrl || !apiKey || !projectId) {
    console.warn(
      "[qa-console-live-view] Skipping — QA_CONSOLE_URL / QA_CONSOLE_API_KEY / QA_CONSOLE_PROJECT_ID must all be set as real environment variables (not just passed as reporter options — the watcher runs as a separate process with no visibility into your playwright.config.ts values).",
    );
    return null;
  }

  return {
    client: new QAConsoleClient({ baseUrl, apiKey, projectId: Number(projectId) }),
    sessionId: process.env.QA_CONSOLE_SESSION_ID,
  };
}

function getBasePort(): number {
  return Number(process.env.QA_CONSOLE_LIVE_VIEW_PORT) || DEFAULT_BASE_PORT;
}

/**
 * Convenience for playwright.config.ts's `use.launchOptions`: returns the debugging-port arg the
 * watcher needs, but ONLY when `enabled` is true (defaults to `!!process.env.CI`) — otherwise
 * `undefined`, so Playwright adds nothing.
 *
 * The port is offset by `process.env.TEST_PARALLEL_INDEX` — Playwright guarantees workers
 * running at the same time have a different `parallelIndex` (0..workers-1), so each concurrent
 * Chromium process gets its own port instead of racing to bind the same one. A fixed single port
 * only worked when exactly one worker could ever be active; with N workers running in parallel
 * (`workers` above N > 1 for real, not just N > 1 in some other project's unrelated config), the
 * losing processes wouldn't degrade gracefully — their browser launch would hang and time out,
 * failing those tests outright. This is safe regardless of your actual worker count.
 */
export function liveViewLaunchOptions(options?: { port?: number; enabled?: boolean }): { args: string[] } | undefined {
  const enabled = options?.enabled ?? !!process.env.CI;
  if (!enabled) return undefined;

  const basePort = options?.port ?? getBasePort();
  const parallelIndex = Number(process.env.TEST_PARALLEL_INDEX ?? 0);
  return { args: [`--remote-debugging-port=${basePort + parallelIndex}`] };
}

interface CdpTarget {
  type: string;
  webSocketDebuggerUrl?: string;
}

/**
 * Chrome's own DevTools HTTP endpoint (opened by `--remote-debugging-port`, set in
 * playwright.config.ts's launchOptions) lists active targets — no ffmpeg, no video file, no
 * native binary of any kind, just plain HTTP + WebSocket, so this works identically on any CI
 * image that can run `npm install`.
 */
async function findPageTarget(port: number): Promise<CdpTarget | null> {
  try {
    const res = await fetch(`http://127.0.0.1:${port}/json/list`, { signal: AbortSignal.timeout(1000) });
    if (!res.ok) return null;
    const targets = (await res.json()) as CdpTarget[];
    return targets.find((t) => t.type === "page" && t.webSocketDebuggerUrl) ?? null;
  } catch {
    return null; // debug port not up yet (before the first test) or momentarily unreachable — normal
  }
}

/**
 * One-shot: open a CDP session for this target, grab a single screenshot, close. Deliberately
 * poll-based rather than a persistent Page.startScreencast stream — pages get created and
 * destroyed every test (default test isolation), so a fresh short-lived connection per tick is
 * far simpler than tracking target lifecycle and reconnecting a long-lived stream.
 */
function captureFrame(wsUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value: string | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      ws.terminate();
      resolve(value);
    };

    const ws = new WebSocket(wsUrl, { handshakeTimeout: CDP_TIMEOUT_MS });
    const timer = setTimeout(() => finish(null), CDP_TIMEOUT_MS);

    ws.on("open", () => {
      ws.send(JSON.stringify({ id: 1, method: "Page.captureScreenshot", params: { format: "jpeg", quality: 40 } }));
    });
    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.id === 1) finish(msg.result?.data ?? null);
      } catch {
        finish(null);
      }
    });
    ws.on("error", () => finish(null));
  });
}

/** One worker's outcome for a single poll tick. */
interface WorkerFrame {
  workerIndex: number;
  frame: string | null;
}

/**
 * Captures a frame from every worker that currently has an active page, in parallel — a build
 * can have several tests genuinely running at once (one per worker), each needing its own frame,
 * not one shared for the whole build (the dashboard now stores/displays a frame per worker).
 */
async function captureFrameFromEachWorker(basePort: number, workerCount: number): Promise<WorkerFrame[]> {
  return Promise.all(
    Array.from({ length: workerCount }, async (_, workerIndex): Promise<WorkerFrame> => {
      const target = await findPageTarget(basePort + workerIndex);
      if (!target?.webSocketDebuggerUrl) return { workerIndex, frame: null };
      const frame = await captureFrame(target.webSocketDebuggerUrl);
      return { workerIndex, frame };
    }),
  );
}

/**
 * Playwright globalSetup: polls each worker's Chromium debugging port for a screenshot of
 * whatever page is currently active and forwards it to the QA Console dashboard — no test file
 * changes, no external binaries. Requires two things in playwright.config.ts: this as
 * `globalSetup`, and `liveViewLaunchOptions()` (above) as `use.launchOptions` (see README).
 */
export default async function globalSetup(config: FullConfig): Promise<() => Promise<void>> {
  const liveConfig = getConfig();
  if (!liveConfig) return async () => {};

  const basePort = getBasePort();
  const workerCount = Math.max(1, config.workers);
  console.log(
    `[qa-console-live-view] Watching Chromium debugging port${workerCount > 1 ? "s" : ""} ${basePort}${workerCount > 1 ? `-${basePort + workerCount - 1}` : ""} for live frames (${workerCount} worker${workerCount > 1 ? "s" : ""}).`,
  );

  let stopped = false;
  let firstFramePosted = false;
  let loggedNoTargetYet = false;
  let loggedPostFailure = false;
  let loggedSkipped = false;
  const startedAt = Date.now();

  const postFrame = (workerIndex: number, frame: string) =>
    liveConfig.client.postLiveFrame({ sessionId: liveConfig.sessionId, workerId: workerIndex, frameBase64: frame }).then(
      ({ skipped }) => {
        if (skipped) {
          // The route responds 200 here (not an error) whenever it can't find a matching
          // RUNNING build for this project right now — most likely several builds are RUNNING
          // simultaneously for this project (no session_id to tell them apart, so it guessed the
          // most recent one) and it isn't the one actually executing, or the build already
          // finished. Frames are being sent but silently going nowhere useful either way — this
          // would otherwise look identical to genuine success.
          if (!loggedSkipped) {
            loggedSkipped = true;
            console.warn(
              "[qa-console-live-view] Dashboard has no matching RUNNING build for this project right now — frames are being posted but dropped server-side. If multiple builds can run concurrently for this project, set QA_CONSOLE_SESSION_ID so the dashboard can tell them apart.",
            );
          }
          return;
        }
        if (!firstFramePosted) {
          firstFramePosted = true;
          console.log("[qa-console-live-view] First live frame posted successfully.");
        }
      },
      (error) => {
        if (!loggedPostFailure) {
          loggedPostFailure = true;
          console.warn(`[qa-console-live-view] Failed to post live frame: ${(error as Error).message}`);
        }
      },
    );

  const loop = (async () => {
    while (!stopped) {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      if (stopped) break;

      try {
        const results = await captureFrameFromEachWorker(basePort, workerCount);
        const found = results.filter((r) => r.frame);

        if (found.length === 0) {
          // Only worth flagging if we've had a while and never found anything — a normal gap
          // between tests, or the first second or two before browsers launch, is expected.
          if (!firstFramePosted && !loggedNoTargetYet && Date.now() - startedAt > 30_000) {
            loggedNoTargetYet = true;
            console.warn(
              `[qa-console-live-view] No Chromium page found on ${basePort}-${basePort + workerCount - 1} after 30s — is liveViewLaunchOptions() actually wired into use.launchOptions?`,
            );
          }
          continue;
        }

        await Promise.all(found.map((r) => postFrame(r.workerIndex, r.frame as string)));
      } catch {
        // A bad tick should never kill the watcher loop.
      }
    }
  })();

  return async () => {
    stopped = true;
    await loop;
    await liveConfig.client.deleteLiveFrame({ sessionId: liveConfig.sessionId }).catch(() => {});
  };
}
