import { useCallback, useEffect, useState } from "react";
import { type AdminSessionRecord } from "./admin-user";

export function useAdminSessions() {
  const [sessions, setSessions] = useState<AdminSessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/sessions", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load active sessions.");
      }

      const data = (await response.json()) as {
        sessions?: AdminSessionRecord[];
      };
      setSessions(data.sessions ?? []);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load active sessions."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    sessions,
    loading,
    error,
    refresh,
    setSessions,
  };
}
