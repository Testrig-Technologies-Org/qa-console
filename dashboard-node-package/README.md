# qa-console-playwright-reporter

A Playwright reporter that streams live test results to a [QA Console](../dashboard) dashboard as tests run — no waiting for the run to finish to see progress.

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

Every test reports twice: once as `RUNNING` when it starts (so the dashboard's live view shows it in progress), and once with the final result (`PASSED` / `FAILED` / `SKIPPED`) when it ends.

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
