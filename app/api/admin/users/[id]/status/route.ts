import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { updateAccountStatus } from "@/server/auth-workflows";
import { requirePermission } from "@/server/rbac";
import { accountStatusUpdateSchema } from "@/server/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requirePermission("settings:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const [{ id }, body] = await Promise.all([params, request.json()]);
    const parsed = accountStatusUpdateSchema.parse(body);
    const user = await updateAccountStatus({ userId: id, actorId: actor.id, ...parsed });
    return NextResponse.json({ user: { id: user.id, email: user.email, role: user.role, accountStatus: user.accountStatus, isActive: user.isActive } });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Invalid account status payload.", details: error.flatten() }, { status: 400 });
    return NextResponse.json({ error: "Could not update account status." }, { status: 500 });
  }
}
