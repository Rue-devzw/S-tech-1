import { useCallback, useEffect, useState } from "react";
import { type AuditEvent } from "./audit";

export function useAuditEvents() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/audit", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load audit history.");
      }

      const data = (await response.json()) as { events?: AuditEvent[] };
      setEvents(data.events ?? []);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load audit history."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    events,
    loading,
    error,
    refresh,
    setEvents,
  };
}
