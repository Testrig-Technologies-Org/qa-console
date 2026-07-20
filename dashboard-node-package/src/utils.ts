import path from "node:path";
import type { TestStep } from "@playwright/test/reporter";

const CASE_CODE_PATTERN = /@([A-Z]{2,}-\d+)/g;

/** Pulls QA Console case codes out of a test title, e.g. `test('logs in @TC-101', ...)`. */
export function extractCaseCodes(title: string): string[] {
  const matches = [...title.matchAll(CASE_CODE_PATTERN)].map((match) => match[1]);
  return matches.length > 0 ? matches : ["N/A"];
}

export function toSpecFile(file: string): string {
  return path.relative(process.cwd(), file).split(path.sep).join("/");
}

export function mapStatus(status: string): "PASSED" | "FAILED" | "SKIPPED" {
  switch (status) {
    case "passed":
      return "PASSED";
    case "skipped":
    case "interrupted":
      return "SKIPPED";
    default:
      return "FAILED";
  }
}

export interface StepSummary {
  title: string;
  duration_ms: number;
  status: "PASSED" | "FAILED";
}

export function summarizeSteps(steps: TestStep[] = []): StepSummary[] {
  return steps
    .filter((step) => step.category === "test.step")
    .map((step) => ({
      title: step.title,
      duration_ms: Math.round(step.duration),
      status: step.error ? "FAILED" : "PASSED",
    }));
}

/** Flattens Playwright's stdout/stderr chunk arrays into clean, per-line strings for the dashboard's log terminal. */
export function normalizeStdio(chunks: Array<string | Buffer> = []): string[] {
  return chunks
    .flatMap((chunk) => chunk.toString().split("\n"))
    .map((line) => line.trimEnd())
    .filter(Boolean);
}
