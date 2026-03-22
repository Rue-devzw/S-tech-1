import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ensureAdminRequest } from "../_utils";
import {
  getNotificationJobs,
  getNotificationQueueHealth,
  getNotificationSummary,
  getNotificationWebhookEvents,
  requeueFailedNotificationJobs,
  runNotificationDispatchCycle,
} from "@/lib/server/data-store";

const notificationActionSchema = z
  .object({
    action: z.enum(["dispatch_due", "requeue_failed"]).default("dispatch_due"),
  })
  .default({
    action: "dispatch_due",
  });

export async function GET(request: NextRequest) {
  const { response } = await ensureAdminRequest(request, ["owner"]);
  if (response) {
    return response;
  }

  const [jobs, summary, health, webhookEvents] = await Promise.all([
    getNotificationJobs(20),
    getNotificationSummary(),
    getNotificationQueueHealth(),
    getNotificationWebhookEvents(10),
  ]);

  return NextResponse.json({ jobs, summary, health, webhookEvents });
}

export async function POST(request: NextRequest) {
  const auth = await ensureAdminRequest(request, ["owner"]);
  if (auth.response) {
    return auth.response;
  }

  const payload = await request.json().catch(() => null);
  const parsed = notificationActionSchema.safeParse(payload ?? {});

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid notification action." },
      { status: 400 }
    );
  }

  const cycle =
    parsed.data.action === "requeue_failed"
      ? null
      : await runNotificationDispatchCycle({
          limit: 20,
          actor: auth.session.user.username,
        });
  const processed =
    parsed.data.action === "requeue_failed"
      ? await requeueFailedNotificationJobs(20, auth.session.user.username)
      : (cycle?.processed ?? []);
  const [jobs, summary, health, webhookEvents] = await Promise.all([
    getNotificationJobs(20),
    getNotificationSummary(),
    getNotificationQueueHealth(),
    getNotificationWebhookEvents(10),
  ]);

  if (cycle?.blockedReason) {
    return NextResponse.json(
      {
        error: cycle.blockedReason,
        action: parsed.data.action,
        processed,
        jobs,
        summary,
        health,
        webhookEvents,
        blockedReason: cycle.blockedReason,
      },
      { status: 409 }
    );
  }

  return NextResponse.json({
    action: parsed.data.action,
    processed,
    jobs,
    summary,
    health,
    webhookEvents,
    blockedReason:
      parsed.data.action === "requeue_failed" ? null : cycle?.blockedReason ?? null,
  });
}
