import { defineConfig, devices, type ReporterDescription } from '@playwright/test';
import { liveViewLaunchOptions } from 'qa-console-playwright-reporter/live-view-watcher';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * QA Console reporting is opt-in: only enabled once QA_CONSOLE_URL, QA_CONSOLE_API_KEY
 * and QA_CONSOLE_PROJECT_ID are set (see .env.example), so this project still runs
 * standalone without a dashboard configured.
 */
const qaConsoleConfigured = !!(process.env.QA_CONSOLE_URL && process.env.QA_CONSOLE_API_KEY && process.env.QA_CONSOLE_PROJECT_ID);

const reporters: ReporterDescription[] = [['html'], ['list']];
if (qaConsoleConfigured) {
  reporters.push([
    'qa-console-playwright-reporter',
    {
      baseUrl: process.env.QA_CONSOLE_URL,
      apiKey: process.env.QA_CONSOLE_API_KEY,
      projectId: Number(process.env.QA_CONSOLE_PROJECT_ID),
      environment: process.env.CI ? 'ci' : 'dev',
    },
  ]);
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: reporters,
  /**
   * Streams a live view of the currently-running test to the QA Console dashboard — no test
   * file changes needed. Polls the Chromium debugging port opened below (`use.launchOptions`)
   * for a screenshot every ~1s; no ffmpeg or other external binary involved. Requires
   * `workers: 1` (already the case on CI, above); no-ops otherwise. Same opt-in condition as
   * the reporter.
   */
  // Playwright resolves this string itself (same as the bare 'qa-console-playwright-reporter'
  // reporter name above) — no require.resolve() needed, and require.resolve() actively breaks
  // in ESM-mode projects ("require is not defined in ES module scope") since it depends on the
  // CJS `require` global existing, which isn't true just because this file happens to be CJS.
  globalSetup: qaConsoleConfigured ? 'qa-console-playwright-reporter/live-view-watcher' : undefined,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Record video for every test — uploaded to the QA Console dashboard when reporting. */
    video: 'on',

    /* Opens a debugging port the live-view watcher above polls for screenshots. Only added
       under CI (workers: 1, above) — with more than one worker, multiple Chromium processes
       would race to bind the SAME fixed port simultaneously, and the losers don't degrade
       gracefully: their browser launch hangs and times out, breaking those tests entirely.
       liveViewLaunchOptions() defaults to enabled: !!process.env.CI for exactly this reason —
       see the qa-console-playwright-reporter README before changing that default yourself. */
    launchOptions: qaConsoleConfigured ? liveViewLaunchOptions() : undefined,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
