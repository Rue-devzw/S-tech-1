import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ensureAdminRequest } from "../_utils";
import { getNotificationDeliveryConfigError } from "@/lib/env";
import { type PlatformSettings } from "@/lib/platform-settings";
import {
  getPlatformSettings,
  listAdminUsers,
  updatePlatformSettings,
} from "@/lib/server/data-store";

const generalSettingsSchema = z.object({
  siteName: z.string().min(1),
  siteTagline: z.string().min(1),
  contactEmail: z.string().email(),
  supportPhone: z.string().min(1),
  address: z.string().min(1),
});

const notificationSettingsSchema = z.object({
  emailOnNewInquiry: z.boolean(),
  emailOnNewSale: z.boolean(),
  weeklyReport: z.boolean(),
  systemAlerts: z.boolean(),
  adminNotificationEmail: z.string().email(),
  autoDispatchInquiryEmails: z.boolean(),
  deliveryMode: z.enum(["console", "resend", "disabled"]),
});

const securitySettingsSchema = z.object({
  twoFactorAuth: z.boolean(),
  sessionTimeout: z
    .string()
    .regex(/^\d+$/, "Session timeout must be a whole number of minutes."),
  requireStrongPasswords: z.boolean(),
});

const updateSettingsSchema = z.discriminatedUnion("section", [
  z.object({
    section: z.literal("general"),
    value: generalSettingsSchema,
  }),
  z.object({
    section: z.literal("notifications"),
    value: notificationSettingsSchema,
  }),
  z.object({
    section: z.literal("security"),
    value: securitySettingsSchema,
  }),
]);

export async function GET(request: NextRequest) {
  const { response } = await ensureAdminRequest(request, ["owner"]);
  if (response) {
    return response;
  }

  const settings = await getPlatformSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  const { response } = await ensureAdminRequest(request, ["owner"]);
  if (response) {
    return response;
  }

  const payload = await request.json().catch(() => null);
  const parsed = updateSettingsSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid settings payload." },
      { status: 400 }
    );
  }

  if (
    parsed.data.section === "security" &&
    (Number.parseInt(parsed.data.value.sessionTimeout, 10) < 5 ||
      Number.parseInt(parsed.data.value.sessionTimeout, 10) > 60 * 24)
  ) {
    return NextResponse.json(
      {
        error:
          "Session timeout must be between 5 minutes and 1440 minutes.",
      },
      { status: 400 }
    );
  }

  if (parsed.data.section === "security" && parsed.data.value.twoFactorAuth) {
    const users = await listAdminUsers();
    const missingMfa = users.filter(
      (user) => user.status === "active" && !user.mfaEnabled
    );

    if (missingMfa.length > 0) {
      return NextResponse.json(
        {
          error:
            "Every active admin must enroll in MFA before global 2FA can be required.",
        },
        { status: 400 }
      );
    }
  }

  if (parsed.data.section === "notifications") {
    const configError = getNotificationDeliveryConfigError(
      parsed.data.value.deliveryMode
    );

    if (configError) {
      return NextResponse.json({ error: configError }, { status: 400 });
    }
  }

  const settings = await updatePlatformSettings(
    parsed.data.section as keyof PlatformSettings,
    parsed.data.value
  );

  return NextResponse.json({ settings });
}
