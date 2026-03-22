import { useCallback, useEffect, useState } from "react";
import {
  type NotificationJob,
  type NotificationQueueHealth,
  type NotificationSummary,
  type NotificationWebhookEvent,
} from "./notification-job";

const EMPTY_SUMMARY: NotificationSummary = {
  queued: 0,
  sent: 0,
  failed: 0,
};

const EMPTY_HEALTH: NotificationQueueHealth = {
  deliveryMode: "console",
  providerReady: true,
  providerConfigError: null,
  webhookConfigError: null,
  dueNow: 0,
  scheduledRetries: 0,
  deadLetters: 0,
  oldestDueCreatedAt: null,
  oldestFailureAt: null,
  lockActive: false,
  lastDispatchCompletedAt: null,
  lastDispatchAttemptAt: null,
  lastDispatchProcessedCount: null,
  lastWebhookReceivedAt: null,
};

export function useNotificationJobs() {
  const [jobs, setJobs] = useState<NotificationJob[]>([]);
  const [summary, setSummary] = useState<NotificationSummary>(EMPTY_SUMMARY);
  const [health, setHealth] = useState<NotificationQueueHealth>(EMPTY_HEALTH);
  const [webhookEvents, setWebhookEvents] = useState<NotificationWebhookEvent[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/notifications", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load notification queue.");
      }

      const data = (await response.json()) as {
        jobs?: NotificationJob[];
        summary?: NotificationSummary;
        health?: NotificationQueueHealth;
        webhookEvents?: NotificationWebhookEvent[];
      };

      setJobs(data.jobs ?? []);
      setSummary(data.summary ?? EMPTY_SUMMARY);
      setHealth(data.health ?? EMPTY_HEALTH);
      setWebhookEvents(data.webhookEvents ?? []);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load notification queue."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    jobs,
    summary,
    health,
    webhookEvents,
    loading,
    error,
    refresh,
    setJobs,
    setSummary,
    setHealth,
  };
}
