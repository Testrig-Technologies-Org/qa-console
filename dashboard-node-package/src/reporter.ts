import { readFile } from "node:fs/promises";
import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from "@playwright/test/reporter";
import { QAConsoleClient } from "./client";
import type { QAConsoleReporterOptions } from "./types";
import { extractCaseCodes, mapStatus, normalizeStdio, summarizeSteps, toSpecFile } from "./utils";

export class QAConsoleReporter implements Reporter {
  private readonly client: QAConsoleClient;
  private readonly environment: string;
  private readonly sessionId: string | undefined;
  private buildId: number | null = null;
  private disabled = false;
  private readonly pending: Promise<void>[] = [];
  // Resolves once onBegin's build creation has settled (success or failure). Tests can
  // start and finish before that async call returns, so every report waits on this
  // first instead of racing buildId — otherwise fast tests silently get dropped.
  private readonly buildReady: Promise<void>;
  private resolveBuildReady!: () => void;

  constructor(options: QAConsoleReporterOptions) {
    if (!options?.baseUrl) throw new Error('[qa-console-reporter] "baseUrl" is required');
    if (!options?.apiKey) throw new Error('[qa-console-reporter] "apiKey" is required');
    if (!options?.projectId) throw new Error('[qa-console-reporter] "projectId" is required');

    this.environment = options.environment ?? "dev";
    // options.sessionId wins when both are set, since it's explicit per-reporter config;
    // the env var is the documented fallback for CI setups that only export it once.
    this.sessionId = options.sessionId ?? process.env.QA_CONSOLE_SESSION_ID;
    this.client = new QAConsoleClient(options);
    this.buildReady = new Promise((resolve) => {
      this.resolveBuildReady = resolve;
    });
  }

  async onBegin(_config: FullConfig, _suite: Suite): Promise<void> {
    try {
      const { buildId } = await this.client.createBuild({ environment: this.environment, sessionId: this.sessionId });
      this.buildId = buildId;
      console.log(`[qa-console-reporter] Reporting live to QA Console — build #${buildId}`);
    } catch (error) {
      this.disabled = true;
      console.warn(`[qa-console-reporter] Disabled for this run — could not create build: ${(error as Error).message}`);
    } finally {
      this.resolveBuildReady();
    }
  }

  onTestBegin(test: TestCase): void {
    this.send(test, undefined, false);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.send(test, result, true);
  }

  async onEnd(result: FullResult): Promise<void> {
    // Wait for every fire-and-forget test report to actually land before marking the
    // build complete, otherwise the final status can race ahead of in-flight results.
    await Promise.all(this.pending);

    if (this.disabled || !this.buildId) return;

    const status = result.status === "passed" ? "passed" : "failed";
    try {
      await this.client.completeBuild(this.buildId, status);
      console.log(`[qa-console-reporter] Finished reporting build #${this.buildId} (${status})`);
    } catch (error) {
      console.warn(`[qa-console-reporter] Failed to mark build #${this.buildId} complete: ${(error as Error).message}`);
    }
  }

  private send(test: TestCase, result: TestResult | undefined, isFinal: boolean): void {
    const promise = this.buildReady.then(() => this.sendNow(test, result, isFinal));
    this.pending.push(promise);
  }

  private async sendNow(test: TestCase, result: TestResult | undefined, isFinal: boolean): Promise<void> {
    if (this.disabled || !this.buildId) return;

    const videoUrl = isFinal ? await this.uploadVideo(test, result) : undefined;

    const retryCount = result?.retry ?? 0;
    const testEntry = {
      title: test.title,
      project: test.parent.project()?.name ?? "default",
      status: isFinal ? mapStatus(result!.status) : "RUNNING",
      is_final: isFinal,
      duration_ms: result?.duration ?? 0,
      duration_seconds: result ? (result.duration / 1000).toFixed(2) : "0",
      steps: isFinal ? summarizeSteps(result?.steps) : [],
      logs: isFinal ? normalizeStdio(result?.stdout) : [],
      stderr_logs: isFinal ? normalizeStdio(result?.stderr) : [],
      worker_id: result?.parallelIndex ?? 0,
      // The dashboard uses this to tell a genuinely long-running test apart from one whose
      // worker crashed without reporting a final result — Playwright already knows the right
      // answer per-test (accounts for testConfig.timeout, testProject.timeout, test.setTimeout,
      // test.slow, etc.), so there's no reason to guess a blanket threshold dashboard-side.
      timeout_ms: test.timeout,
      attachments: videoUrl ? { paths: { video: videoUrl } } : undefined,
      error: result?.error
        ? {
            message: result.error.message,
            stack: result.error.stack,
            location: test.location,
          }
        : undefined,
      case_codes: extractCaseCodes(test.title),
      run_number: retryCount + 1,
      retry_count: retryCount,
      is_flaky: isFinal && result?.status === "passed" && retryCount > 0,
    };

    await this.client
      .reportResult({
        build_id: this.buildId,
        spec_file: toSpecFile(test.location.file),
        test_entry: testEntry,
      })
      .catch((error: Error) => {
        console.warn(`[qa-console-reporter] Failed to report "${test.title}": ${error.message}`);
      });
  }

  private async uploadVideo(test: TestCase, result: TestResult | undefined): Promise<string | undefined> {
    const video = result?.attachments.find((a) => a.name === "video" && a.path);
    if (!video?.path) return undefined;

    try {
      const buffer = await readFile(video.path);
      return await this.client.uploadFile(buffer, `${test.id}.webm`, video.contentType || "video/webm");
    } catch (error) {
      console.warn(`[qa-console-reporter] Failed to upload video for "${test.title}": ${(error as Error).message}`);
      return undefined;
    }
  }
}
