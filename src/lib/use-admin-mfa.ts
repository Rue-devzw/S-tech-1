import { useCallback, useEffect, useState } from "react";
import { type AdminMfaStatus } from "./admin-user";

const DEFAULT_STATUS: AdminMfaStatus = {
  enabled: false,
  pending: false,
  enabledAt: null,
  recoveryCodesRemaining: 0,
};

export function useAdminMfa() {
  const [status, setStatus] = useState<AdminMfaStatus>(DEFAULT_STATUS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/mfa", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load MFA status.");
      }

      const data = (await response.json()) as { status?: AdminMfaStatus };
      setStatus(data.status ?? DEFAULT_STATUS);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load MFA status."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    status,
    loading,
    error,
    refresh,
    setStatus,
  };
}
