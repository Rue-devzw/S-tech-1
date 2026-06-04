import { NextResponse } from "next/server";
import { currentUser } from "@/server/auth";
import { permissionsByRole } from "@/server/rbac";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });

  return NextResponse.json({
    user,
    permissions: permissionsByRole[user.role]
  });
}
