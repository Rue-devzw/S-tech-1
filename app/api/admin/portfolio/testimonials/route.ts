import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { listAdminTestimonials, upsertTestimonial } from "@/server/services/portfolio-module";

export async function GET() {
  const actor = await requirePermission("content:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const testimonials = await listAdminTestimonials();
  return NextResponse.json({ testimonials });
}

export async function POST(request: Request) {
  const actor = await requirePermission("content:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const testimonial = await upsertTestimonial(await request.json(), actor.id);
    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not save testimonial.");
  }
}
