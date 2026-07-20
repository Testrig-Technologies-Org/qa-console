export interface QAConsoleReporterOptions {
  /** Base URL of your QA Console dashboard deployment, e.g. "https://qa-console.yourcompany.com" */
  baseUrl: string;
  /** API key issued by QA Console — must match the dashboard's AUTOMATION_API_KEY */
  apiKey: string;
  /** Numeric project ID as shown in the QA Console dashboard */
  projectId: number;
  /** Environment label attached to the build, e.g. "staging" | "production". Defaults to "dev". */
  environment?: string;
  /**
   * Shared identifier used to group multiple Playwright processes (e.g. sharded CI jobs)
   * into a single build on the dashboard. Falls back to the QA_CONSOLE_SESSION_ID env var,
   * then to a new build per process.
   */
  sessionId?: string;
}
