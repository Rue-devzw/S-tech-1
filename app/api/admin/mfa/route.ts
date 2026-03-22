import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ensureAdminRequest } from "../_utils";
import { getPlatformSettings } from "@/lib/server/data-store";
import {
  beginAdminMfaEnrollment,
  confirmAdminMfaEnrollment,
  disableAdminMfa,
  getAdminMfaStatus,
  listAdminUsers,
} from "@/lib/server/data-store";

const updateMfaSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("start_enrollment"),
  }),
  z.object({
    action: z.literal("confirm_enrollment"),
    code: z.string().min(6),
  }),
  z.object({
    action: z.literal("disable"),
    userId: z.string().min(1).optional(),
  }),
]);

export async function GET(request: NextRequest) {
  const auth = await ensureAdminRequest(request);
  if (auth.response) {
    return auth.response;
  }

  const status = await getAdminMfaStatus(auth.session.user.id);
  return NextResponse.json({ status });
}

export async function POST(request: NextRequest) {
  const auth = await ensureAdminRequest(request);
  if (auth.response) {
    return auth.response;
  }

  const payload = await request.json().catch(() => null);
  const parsed = updateMfaSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid MFA payload." },
      { status: 400 }
    );
  }

  if (parsed.data.action === "start_enrollment") {
    const enrollment = await beginAdminMfaEnrollment(
      auth.session.user.id,
      auth.session.user.username
    );

    return NextResponse.json({ enrollment });
  }

  if (parsed.data.action === "confirm_enrollment") {
    try {
      const status = await confirmAdminMfaEnrollment(
        auth.session.user.id,
        parsed.data.code,
        auth.session.user.username
      );

      return NextResponse.json({ status });
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Unable to confirm MFA enrollment.",
        },
        { status: 400 }
      );
    }
  }

  const targetUserId = parsed.data.userId ?? auth.session.user.id;
  if (
    targetUserId !== auth.session.user.id &&
    auth.session.user.role !== "owner"
  ) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const settings = await getPlatformSettings();
  if (settings.security.twoFactorAuth) {
    const users = await listAdminUsers();
    const targetUser = users.find((user) => user.id === targetUserId);

    if (targetUser?.status === "active") {
      return NextResponse.json(
        {
          error:
            "Disable the global 2FA requirement before removing MFA from an active admin.",
        },
        { status: 400 }
      );
    }
  }

  const disabled = await disableAdminMfa(
    targetUserId,
    auth.session.user.username
  );

  if (!disabled) {
    return NextResponse.json({ error: "MFA enrollment not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
