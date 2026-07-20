# playwright-tests

Playwright end-to-end test suite, optionally reporting live results to the QA Console dashboard.

## Setup

```bash
npm install
npx playwright install --with-deps
```

## Run

```bash
npx playwright test          # headless
npx playwright test --ui     # interactive UI mode
npx playwright show-report   # view the last HTML report
```

## Live reporting to QA Console

Copy `.env.example` to `.env` and fill in your dashboard's project details:

```bash
cp .env.example .env
```

```
QA_CONSOLE_URL=https://your-qa-console-deployment.example.com
QA_CONSOLE_API_KEY=...
QA_CONSOLE_PROJECT_ID=...
```

With all three set, `playwright.config.ts` adds `qa-console-playwright-reporter` to the reporter list automatically, and test runs show up live on the dashboard. Without them, tests just run with the standard `html`/`list` reporters.

Tag a test title with `@CASE-CODE` (e.g. `test('logs in @TC-101', ...)`) to link results to a QA Console test case.
