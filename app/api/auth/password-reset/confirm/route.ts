import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { confirmPasswordReset } from "@/server/auth-workflows";
import { rateLimit } from "@/server/security";
import { passwordResetConfirmSchema } from "@/server/validation";

export async function POST(request: Request) {
  const limited = rateLimit(request, "auth:password-reset-confirm", 10, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many password reset attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  try {
    const parsed = passwordResetConfirmSchema.parse(await request.json());
    await confirmPasswordReset(parsed);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Invalid password reset payload.", details: error.flatten() }, { status: 400 });
    return NextResponse.json({ error: "Could not reset password. Please request a new reset link and try again." }, { status: 400 });
  }
}
