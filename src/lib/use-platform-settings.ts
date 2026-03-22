import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_PLATFORM_SETTINGS,
  type PlatformSettings,
} from "./platform-settings";

export function usePlatformSettings() {
  const [settings, setSettings] = useState<PlatformSettings>(
    DEFAULT_PLATFORM_SETTINGS
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/settings", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load platform settings.");
      }

      const data = (await response.json()) as { settings?: PlatformSettings };
      setSettings(data.settings ?? DEFAULT_PLATFORM_SETTINGS);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load platform settings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    settings,
    loading,
    error,
    refresh,
    setSettings,
  };
}
