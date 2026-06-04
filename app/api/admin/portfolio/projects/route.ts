import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { listAdminPortfolioProjects, upsertPortfolioProject } from "@/server/services/portfolio-module";

export async function GET() {
  const actor = await requirePermission("content:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const projects = await listAdminPortfolioProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const actor = await requirePermission("content:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const project = await upsertPortfolioProject(await request.json(), actor.id);
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not save portfolio project.");
  }
}
