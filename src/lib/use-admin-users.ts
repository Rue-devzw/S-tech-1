import { useCallback, useEffect, useState } from "react";
import { type AdminUser } from "./admin-user";

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/users", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load team members.");
      }

      const data = (await response.json()) as { users?: AdminUser[] };
      setUsers(data.users ?? []);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load team members."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    users,
    loading,
    error,
    refresh,
    setUsers,
  };
}
