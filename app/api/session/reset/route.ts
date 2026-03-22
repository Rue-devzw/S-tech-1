import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  requestAdminPasswordReset,
  resetAdminPassword,
} from "@/lib/server/data-store";

const requestResetSchema = z.object({
  identifier: z.string().min(1),
});

const completeResetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = requestResetSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid username or email." },
      { status: 400 }
    );
  }

  const resetLink = await requestAdminPasswordReset(parsed.data.identifier, "public");

  return NextResponse.json({
    ok: true,
    resetLink: process.env.E2E_TEST_MODE === "1" ? resetLink : undefined,
  });
}

export async function PATCH(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = completeResetSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid password reset payload." },
      { status: 400 }
    );
  }

  try {
    await resetAdminPassword(parsed.data.token, parsed.data.password, "public");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to reset your password.",
      },
      { status: 400 }
    );
  }
}
