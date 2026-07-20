import { eq } from "drizzle-orm";
import { db } from "../../db";
import { automationBuilds, projects } from "../../db/schema";

type Project = typeof projects.$inferSelect;
type AutomationBuild = typeof automationBuilds.$inferSelect;

/** Looks up a project and confirms the given API key belongs to it. Returns null on any mismatch. */
export async function getProjectIfKeyValid(projectId: number, apiKey: string | null): Promise<Project | null> {
  if (!apiKey) return null;
  const project = await db.query.projects.findFirst({ where: eq(projects.id, projectId) });
  if (!project || !project.apiKey || project.apiKey !== apiKey) return null;
  return project;
}

/** Same as getProjectIfKeyValid, but resolves the project via a build ID (for routes keyed on build_id). */
export async function getBuildIfKeyValid(
  buildId: number,
  apiKey: string | null,
): Promise<{ build: AutomationBuild; project: Project } | null> {
  if (!apiKey) return null;
  const build = await db.query.automationBuilds.findFirst({ where: eq(automationBuilds.id, buildId) });
  if (!build) return null;
  const project = await getProjectIfKeyValid(build.projectId, apiKey);
  if (!project) return null;
  return { build, project };
}
