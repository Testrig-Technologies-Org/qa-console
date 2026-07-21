import type { QAConsoleReporterOptions } from "./types";

export interface CreateBuildParams {
  environment: string;
  sessionId?: string;
}

export interface CreateBuildResult {
  buildId: number;
  projectId: number;
  organizationId: string;
}

export interface ReportResultParams {
  build_id: number;
  spec_file: string;
  test_entry: Record<string, unknown>;
  unique_test_key?: string;
}

export interface LiveFrameParams {
  sessionId?: string;
}

export class QAConsoleClient {
  private readonly baseUrl: string;
  private readonly options: QAConsoleReporterOptions;

  constructor(options: QAConsoleReporterOptions) {
    this.options = options;
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
  }

  async createBuild({ environment, sessionId }: CreateBuildParams): Promise<CreateBuildResult> {
    const data = await this.post("/api/automation/build", {
      project_id: this.options.projectId,
      environment,
      type: "playwright",
      session_id: sessionId,
    });

    if (!data.buildId) {
      throw new Error("QA Console did not return a buildId");
    }

    return {
      buildId: Number(data.buildId),
      projectId: data.projectId,
      organizationId: data.organizationId,
    };
  }

  async reportResult(params: ReportResultParams): Promise<void> {
    await this.post("/api/automation/result", params);
  }

  async completeBuild(buildId: number, status: "passed" | "failed"): Promise<void> {
    await this.request("/api/automation/build", "PATCH", { build_id: buildId, status });
  }

  // Returns whether the server actually stored the frame. The route responds 200 with
  // { skipped: true } (not an error) when it can't find a matching RUNNING build for this
  // project right now — a genuinely different case from a network/auth failure, and one the
  // caller needs to be able to tell apart from a real success instead of both looking identical.
  async postLiveFrame(params: LiveFrameParams & { frameBase64: string }): Promise<{ skipped: boolean }> {
    const data = await this.post("/api/automation/live-frame", {
      project_id: this.options.projectId,
      session_id: params.sessionId,
      frame_base64: params.frameBase64,
    });
    return { skipped: !!data?.skipped };
  }

  async deleteLiveFrame(params: LiveFrameParams): Promise<void> {
    await this.request("/api/automation/live-frame", "DELETE", {
      project_id: this.options.projectId,
      session_id: params.sessionId,
    });
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, contentType: string): Promise<string> {
    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(fileBuffer)], { type: contentType }), fileName);

    const res = await fetch(`${this.baseUrl}/api/automation/upload?project_id=${this.options.projectId}`, {
      method: "POST",
      headers: { "x-api-key": this.options.apiKey },
      body: form,
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok || !data.videoUrl) {
      throw new Error(`QA Console upload failed (${res.status}): ${data.error ?? text}`);
    }

    return data.videoUrl as string;
  }

  private post(path: string, body: unknown): Promise<any> {
    return this.request(path, "POST", body);
  }

  private async request(path: string, method: string, body: unknown): Promise<any> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.options.apiKey,
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
      throw new Error(`QA Console request to ${path} failed (${res.status}): ${data.error ?? text}`);
    }

    return data;
  }
}
