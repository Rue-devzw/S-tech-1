import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createManagedUser, listManagedUsers } from "@/server/auth-workflows";
import { requirePermission } from "@/server/rbac";

export async function GET() {
  const actor = await requirePermission("users:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    return NextResponse.json(await listManagedUsers());
  } catch {
    return NextResponse.json({ error: "Could not load users." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const actor = await requirePermission("users:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const user = await createManagedUser(await request.json(), actor.id);
    return NextResponse.json(
      { user: { id: user.id, name: user.name, email: user.email, role: user.role, accountStatus: user.accountStatus, isActive: user.isActive } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Invalid user details.", details: error.flatten() }, { status: 400 });
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create user." }, { status: 400 });
  }
}
