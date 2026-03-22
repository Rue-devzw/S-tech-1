"use client";

import { useEffect } from "react";
import { type AnalyticsEventType } from "@/lib/analytics";

export function AnalyticsTracker(props: {
  eventType: AnalyticsEventType;
  route: string;
  subject?: string | null;
  metadata?: Record<string, string | number | boolean | null>;
}) {
  useEffect(() => {
    const dedupeKey = `analytics:${props.eventType}:${props.subject ?? props.route}`;

    try {
      const lastRecordedAt = Number(sessionStorage.getItem(dedupeKey) ?? 0);
      if (Date.now() - lastRecordedAt < 15_000) {
        return;
      }

      sessionStorage.setItem(dedupeKey, Date.now().toString());
    } catch {
      // Session storage is optional; continue with best-effort tracking.
    }

    const payload = JSON.stringify({
      eventType: props.eventType,
      route: props.route,
      subject: props.subject ?? null,
      metadata: props.metadata ?? {},
    });

    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      const body = new Blob([payload], { type: "application/json" });
      if (navigator.sendBeacon("/api/analytics", body)) {
        return;
      }
    }

    void fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  }, [props.eventType, props.metadata, props.route, props.subject]);

  return null;
}
