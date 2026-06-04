import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { canLogin, createSession, verifyPassword } from "@/server/auth";
import { audit } from "@/server/audit";
import { prisma } from "@/server/db";
import { loginSchema } from "@/server/validation";
import { dashboardPathForRole } from "@/server/rbac";
import { rateLimit } from "@/server/security";

function requestMeta(request: NextRequest) {
  return {
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: request.headers.get("user-agent")
  };
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, "auth:login", 10, 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait and try again." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  try {
    const parsed = loginSchema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { email: parsed.email.toLowerCase() } });

    if (!user || !(await verifyPassword(parsed.password, user.passwordHash))) {
      await audit("LOGIN_FAILED", "User", user?.id, user?.id, { email: parsed.email });
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (!canLogin(user)) {
      await audit("LOGIN_BLOCKED", "User", user.id, user.id, { accountStatus: user.accountStatus });
      return NextResponse.json({ error: "Account is not active. Contact an administrator." }, { status: 403 });
    }

    await createSession(user, requestMeta(request));
    await audit("LOGIN_SUCCEEDED", "User", user.id, user.id);
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, accountStatus: user.accountStatus },
      redirectTo: dashboardPathForRole(user.role)
    });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Invalid login payload." }, { status: 400 });
    console.error(error);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
