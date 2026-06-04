import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { listAdminBlogPosts, upsertBlogPost } from "@/server/services/blog-module";

export async function GET() {
  const actor = await requirePermission("content:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const posts = await listAdminBlogPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const actor = await requirePermission("content:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const post = await upsertBlogPost(await request.json(), actor.id);
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not save blog post.");
  }
}
