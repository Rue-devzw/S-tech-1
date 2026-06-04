import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requestPasswordReset } from "@/server/auth-workflows";
import { rateLimit } from "@/server/security";
import { passwordResetRequestSchema } from "@/server/validation";

export async function POST(request: Request) {
  const limited = rateLimit(request, "auth:password-reset-request", 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many password reset requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  try {
    const parsed = passwordResetRequestSchema.parse(await request.json());
    await requestPasswordReset(parsed.email);
    return NextResponse.json({
      ok: true,
      message: "If the account exists, password reset instructions will be sent."
    });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Invalid password reset payload." }, { status: 400 });
    return NextResponse.json({ error: "Could not request password reset." }, { status: 500 });
  }
}
