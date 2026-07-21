import WebSocket from "ws";
import type { FullConfig } from "@playwright/test";
import { QAConsoleClient } from "./client";

// A "live" feel for a QA dashboard doesn't need more than about 1 frame/sec.
const POLL_INTERVAL_MS = 1200;
const CDP_TIMEOUT_MS = 3000;
const DEFAULT_PORT = 9223;

interface LiveViewConfig {
  client: QAConsoleClient;
  sessionId?: string;
}

function getConfig(): LiveViewConfig | null {
  const baseUrl = process.env.QA_CONSOLE_URL;
  const apiKey = process.env.QA_CONSOLE_API_KEY;
  const projectId = process.env.QA_CONSOLE_PROJECT_ID;
  const enabled = process.env.QA_CONSOLE_LIVE_VIEW !== "false";

  if (!enabled || !baseUrl || !apiKey || !projectId) return null;

  return {
    client: new QAConsoleClient({ baseUrl, apiKey, projectId: Number(projectId) }),
    sessionId: process.env.QA_CONSOLE_SESSION_ID,
  };
}

function getPort(): number {
  return Number(process.env.QA_CONSOLE_LIVE_VIEW_PORT) || DEFAULT_PORT;
}

/**
 * Convenience for playwright.config.ts's `use.launchOptions`: returns the debugging-port arg the
 * watcher needs, but ONLY when `enabled` is true (defaults to `!!process.env.CI`, matching the
 * common `workers: process.env.CI ? 1 : undefined` pattern) — otherwise `undefined`, so
 * Playwright adds nothing.
 *
 * This gate matters more than it looks: with more than one worker, several Chromium processes
 * launch in parallel and would all race to bind the *same fixed port*. Unlike a normal port
 * conflict, the losing processes don't degrade gracefully — their browser launch hangs and
 * eventually times out, failing those tests outright. The watcher's own `workers > 1` check in
 * `globalSetup` below can't prevent this on its own, since by the time it runs the browsers have
 * already been launched with this argument — the gating has to happen here, at the argument's
 * source. Prefer this helper over hand-writing the condition in your config.
 */
export function liveViewLaunchOptions(options?: { port?: number; enabled?: boolean }): { args: string[] } | undefined {
  const enabled = options?.enabled ?? !!process.env.CI;
  if (!enabled) return undefined;

  const port = options?.port ?? getPort();
  return { args: [`--remote-debugging-port=${port}`] };
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

/**
 * Playwright globalSetup: polls the Chromium debugging port for a screenshot of whatever page
 * is currently active and forwards it to the QA Console dashboard — no test file changes, no
 * external binaries. Requires two things in playwright.config.ts: this as `globalSetup`, and
 * `liveViewLaunchOptions()` (above) as `use.launchOptions` (see README) — the latter is what
 * actually keeps `workers > 1` runs safe, this check here is a second, independent guard so a
 * misconfigured launchOptions can't make the watcher show frames from the wrong worker.
 */
export default async function globalSetup(config: FullConfig): Promise<() => Promise<void>> {
  const liveConfig = getConfig();
  if (!liveConfig) return async () => {};

  if (config.workers > 1) {
    console.warn(
      `[qa-console-live-view] Skipping — requires "workers: 1" so only one Chromium instance owns the debugging port at a time; this run is configured for ${config.workers} workers.`,
    );
    return async () => {};
  }

  const port = getPort();
  let stopped = false;

  const loop = (async () => {
    while (!stopped) {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      if (stopped) break;

      try {
        const target = await findPageTarget(port);
        if (!target?.webSocketDebuggerUrl) continue;

        const frame = await captureFrame(target.webSocketDebuggerUrl);
        if (!frame) continue;

        await liveConfig.client.postLiveFrame({ sessionId: liveConfig.sessionId, frameBase64: frame }).catch(() => {});
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
