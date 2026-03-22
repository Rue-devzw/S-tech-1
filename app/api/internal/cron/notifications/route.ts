import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getDeploymentEnvironment,
  getInternalCronSecret,
  getNotificationRunnerBatchSize,
} from "@/lib/env";
import {
  assessNotificationHealth,
  logNotificationEvent,
  sendNotificationAlert,
} from "@/lib/server/notification-observability";
import {
  getNotificationQueueHealth,
  runNotificationDispatchCycle,
} from "@/lib/server/data-store";

const runnerRequestSchema = z.object({
  limit: z.number().int().positive().max(100).optional(),
});

function isAuthorized(request: NextRequest) {
  const secret = getInternalCronSecret();
  if (!secret) {
    return {
      ok: false,
      reason: "missing_secret",
    } as const;
  }

  const bearer = request.headers.get("authorization");
  const headerSecret = request.headers.get("x-cron-secret");
  const token = bearer?.startsWith("Bearer ")
    ? bearer.slice("Bearer ".length)
    : headerSecret;

  if (!token) {
    return {
      ok: false,
      reason: "missing_token",
    } as const;
  }

  const expected = Buffer.from(secret);
  const actual = Buffer.from(token);
  if (expected.length !== actual.length) {
    return {
      ok: false,
      reason: "invalid_token",
    } as const;
  }

  return {
    ok: timingSafeEqual(expected, actual),
    reason: "invalid_token",
  } as const;
}

export async function POST(request: NextRequest) {
  const auth = isAuthorized(request);
  if (!auth.ok) {
    const status = auth.reason === "missing_secret" ? 503 : 401;
    return NextResponse.json(
      {
        error:
          auth.reason === "missing_secret"
            ? "INTERNAL_CRON_SECRET is not configured."
            : "Unauthorized cron request.",
      },
      { status }
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = runnerRequestSchema.safeParse(payload ?? {});

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid notification runner payload." },
      { status: 400 }
    );
  }

  const runnerId = `cron-${Date.now()}`;
  const limit = parsed.data.limit ?? getNotificationRunnerBatchSize();

  logNotificationEvent("info", "notification.runner_started", {
    runnerId,
    limit,
  });

  try {
    const result = await runNotificationDispatchCycle({
      limit,
      actor: "system:cron",
      owner: runnerId,
    });
    const assessment = result.health
      ? assessNotificationHealth(result.health)
      : null;
    const status =
      result.blockedReason && result.dueBefore > 0
        ? 503
        : result.acquired
          ? 200
          : 409;

    if (result.blockedReason && result.dueBefore > 0) {
      logNotificationEvent("error", "notification.runner_blocked", {
        runnerId,
        limit,
        blockedReason: result.blockedReason,
        dueBefore: result.dueBefore,
        dueAfter: result.dueAfter,
        status: assessment?.status ?? "blocked",
        reasons: assessment?.reasons ?? [result.blockedReason],
      });

      await sendNotificationAlert({
        event: "notification.runner_blocked",
        level: "error",
        message: `Notification runner ${runnerId} blocked: ${result.blockedReason}`,
        payload: {
          runnerId,
          limit,
          dueBefore: result.dueBefore,
          dueAfter: result.dueAfter,
          status: assessment?.status ?? "blocked",
          reasons: assessment?.reasons ?? [result.blockedReason],
        },
      });
    } else if (!result.acquired) {
      logNotificationEvent("warn", "notification.runner_skipped", {
        runnerId,
        limit,
        dueBefore: result.dueBefore,
        dueAfter: result.dueAfter,
        status: assessment?.status ?? "degraded",
        reasons: assessment?.reasons ?? [],
      });
    } else {
      logNotificationEvent(
        assessment?.status === "ok" ? "info" : "warn",
        "notification.runner_completed",
        {
          runnerId,
          limit,
          processedCount: result.processed.length,
          dueBefore: result.dueBefore,
          dueAfter: result.dueAfter,
          status: assessment?.status ?? "ok",
          reasons: assessment?.reasons ?? [],
        }
      );
    }

    return NextResponse.json(
      {
        ok: status === 200,
        runnerId,
        acquired: result.acquired,
        blockedReason: result.blockedReason ?? null,
        processedCount: result.processed.length,
        dueBefore: result.dueBefore,
        dueAfter: result.dueAfter,
        summary: result.summary,
        health: result.health ?? null,
        status: assessment?.status ?? null,
        reasons: assessment?.reasons ?? [],
        thresholds: assessment?.thresholds ?? null,
        processed: result.processed,
      },
      { status }
    );
  } catch (caughtError) {
    const message =
      caughtError instanceof Error
        ? caughtError.message
        : "Notification runner failed unexpectedly.";

    logNotificationEvent("error", "notification.runner_failed", {
      runnerId,
      limit,
      error: message,
    });

    await sendNotificationAlert({
      event: "notification.runner_failed",
      level: "error",
      message: `Notification runner ${runnerId} failed: ${message}`,
      payload: {
        runnerId,
        limit,
      },
    });

    return NextResponse.json(
      { error: "Notification runner failed.", runnerId },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const auth = isAuthorized(request);
  if (!auth.ok) {
    const status = auth.reason === "missing_secret" ? 503 : 401;
    return NextResponse.json(
      {
        error:
          auth.reason === "missing_secret"
            ? "INTERNAL_CRON_SECRET is not configured."
            : "Unauthorized cron request.",
      },
      { status }
    );
  }

  const health = await getNotificationQueueHealth();
  const assessment = assessNotificationHealth(health);
  const status =
    assessment.status === "blocked"
      ? 503
      : assessment.status === "degraded"
        ? 207
        : 200;

  logNotificationEvent(
    assessment.status === "ok" ? "info" : "warn",
    "notification.health_checked",
    {
      status: assessment.status,
      reasons: assessment.reasons,
      dueNow: health.dueNow,
      deadLetters: health.deadLetters,
      lockActive: health.lockActive,
    }
  );

  return NextResponse.json(
    {
      ok: status === 200,
      environment: getDeploymentEnvironment(),
      health,
      status: assessment.status,
      reasons: assessment.reasons,
      thresholds: assessment.thresholds,
    },
    { status }
  );
}
