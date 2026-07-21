# qa-console-playwright-reporter

A Playwright reporter that streams live test results to a QA Console dashboard as tests run — no waiting for the run to finish to see progress.

## Install

```bash
npm install --save-dev qa-console-playwright-reporter
```

## Usage

On the QA Console dashboard, open your project's page — the setup panel there shows the exact `baseUrl`, `apiKey`, and `projectId` for that project (also copyable as a ready-to-paste `.env` block). Each project has its own key, so a leaked key only exposes that one project.

Add it to your `playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  reporter: [
    ["list"],
    [
      "qa-console-playwright-reporter",
      {
        baseUrl: process.env.QA_CONSOLE_URL!, // e.g. https://qa-console.yourcompany.com
        apiKey: process.env.QA_CONSOLE_API_KEY!, // from your project's setup panel on the dashboard
        projectId: Number(process.env.QA_CONSOLE_PROJECT_ID),
        environment: process.env.CI ? "ci" : "dev",
      },
    ],
  ],
});
```

Every test reports twice: once as `RUNNING` when it starts (so the dashboard's live view shows it in progress), and once with the final result (`PASSED` / `FAILED` / `SKIPPED`) when it ends. The final report includes console output (`console.log`/`console.error` from the test) and a step timeline — wrap meaningful actions in `test.step('...', async () => { ... })` to populate it. Once the whole run finishes, the build itself is marked `passed` or `failed` on the dashboard — it no longer stays stuck on `running`.

If your `playwright.config.ts` has `use: { video: 'on' }` (or `'retain-on-failure'`), the recorded video is automatically uploaded and attached to the test's final report — no extra config needed on the reporter's side.

## Options

| Option        | Required | Description                                                                             |
| ------------- | -------- | ----------------------------------------------------------------------------------------- |
| `baseUrl`     | yes      | Base URL of your QA Console deployment.                                                   |
| `apiKey`      | yes      | This project's API key, from its setup panel on the dashboard.                            |
| `projectId`   | yes      | Numeric project ID, also shown on the setup panel.                                        |
| `environment` | no       | Label attached to the build (e.g. `staging`, `production`). Defaults to `"dev"`.           |
| `sessionId`   | no       | Groups multiple Playwright processes into one build. See "Sharded / parallel CI" below.   |

If the dashboard is unreachable when the run starts, the reporter logs a warning and disables itself for that run — it never fails your test suite.

## Linking results to test cases

Tag a test title with `@CASE-CODE` to map its result to a QA Console test case, e.g.:

```ts
test("user can log in @TC-101", async ({ page }) => {
  /* ... */
});
```

Coverage stats on the dashboard are computed from these tags. Untagged tests report with case code `N/A`.

## Live view

While a test is running, the dashboard can show a live, low-fps view of the browser instead of just a "running" spinner — useful for headless CI runs where there's otherwise no way to see what a test is doing. This is entirely config-level — no test files to change, and no external binaries (no `ffmpeg`, nothing to install beyond `npm install`). Add two things to `playwright.config.ts`:

```ts
import { liveViewLaunchOptions } from "qa-console-playwright-reporter/live-view-watcher";

export default defineConfig({
  // A bare string, same as reporter names — Playwright resolves it internally. Don't wrap this
  // in require.resolve(): that breaks with "require is not defined in ES module scope" in any
  // project whose playwright.config.ts is loaded as ESM (e.g. uses import.meta.url).
  globalSetup: process.env.CI ? "qa-console-playwright-reporter/live-view-watcher" : undefined,
  use: {
    // Opens Chrome's own debugging port; the watcher polls it for screenshots. Defaults to
    // enabled only under CI and port 9223+ — pass { port, enabled } to override either.
    launchOptions: liveViewLaunchOptions(),
  },
  // ...
});
```

The watcher polls that port every ~1s via Chrome's own DevTools protocol (`Page.captureScreenshot`) and forwards the JPEG to the dashboard — nothing but plain HTTP and WebSocket, so it behaves identically on any CI image that can run `npm install`.

**Safe with any worker count, not just `workers: 1`.** `liveViewLaunchOptions()` offsets the port by `process.env.TEST_PARALLEL_INDEX` — Playwright guarantees workers running at the same time get a different `parallelIndex` (`0..workers-1`), so each concurrent Chromium process gets its own port instead of racing to bind the same one. (A single fixed port doesn't degrade gracefully under contention: the losing process's browser launch hangs and times out, failing that test outright — not just skipping live view — so this matters even if you're fairly sure you're only running one worker.) With several workers simultaneously busy, the watcher shows one of them at a time (rotating which one each tick) rather than all at once, since the dashboard currently stores one live frame per build.

**The watcher needs real environment variables, separately from your reporter config.** It runs as a separate process (`globalSetup`) with no visibility into whatever you passed as options to the `qa-console-playwright-reporter` entry in your `reporter` array — even if those are hardcoded there, `QA_CONSOLE_URL` / `QA_CONSOLE_API_KEY` / `QA_CONSOLE_PROJECT_ID` must also be set as actual environment variables in the environment running `playwright test`, or the watcher logs a warning and does nothing.

It reads the same `QA_CONSOLE_URL` / `QA_CONSOLE_API_KEY` / `QA_CONSOLE_PROJECT_ID` (and `QA_CONSOLE_SESSION_ID`) environment variables the reporter's config already uses. Set `QA_CONSOLE_LIVE_VIEW=false` to disable it without removing the `globalSetup` line.

## Sharded / parallel CI

Each Playwright process normally starts its own build. To have multiple shards (e.g. CI matrix jobs) report into a single build, set the same session ID across them before invoking `playwright test`:

```bash
export QA_CONSOLE_SESSION_ID="$GITHUB_RUN_ID"
```

## Development

```bash
npm install
npm run build      # bundle to dist/ via tsup
npm run typecheck
```
