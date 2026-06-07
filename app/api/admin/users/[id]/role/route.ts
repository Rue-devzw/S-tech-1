import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { updateManagedUserRole } from "@/server/auth-workflows";
import { requirePermission } from "@/server/rbac";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requirePermission("users:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const [{ id }, body] = await Promise.all([params, request.json()]);
    const user = await updateManagedUserRole(id, body, actor.id);
    return NextResponse.json({ user: { id: user.id, email: user.email, role: user.role, accountStatus: user.accountStatus, isActive: user.isActive } });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Invalid role details.", details: error.flatten() }, { status: 400 });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not update user role." }, { status: 400 });
  }
}
