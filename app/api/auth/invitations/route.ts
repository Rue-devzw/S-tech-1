import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createInvitation } from "@/server/auth-workflows";
import { requirePermission } from "@/server/rbac";
import { rateLimit } from "@/server/security";
import { invitationSchema } from "@/server/validation";

export async function POST(request: Request) {
  const actor = await requirePermission("users:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const limited = rateLimit(request, "auth:invitation-create", 20, 60 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many invitations created from this network. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  try {
    const parsed = invitationSchema.parse(await request.json());
    const result = await createInvitation({ ...parsed, actorId: actor.id });
    return NextResponse.json({
      invitationId: result.invitation.id,
      email: result.invitation.email,
      role: result.invitation.role,
      expiresAt: result.invitation.expiresAt
    }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Invalid invitation payload.", details: error.flatten() }, { status: 400 });
    console.error(error);
    return NextResponse.json({ error: "Could not create invitation." }, { status: 500 });
  }
}
