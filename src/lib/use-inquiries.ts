import { useCallback, useEffect, useState } from "react";
import { type Inquiry } from "./mock-data";

export function useInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/inquiries", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load inquiries.");
      }

      const data = (await response.json()) as { inquiries?: Inquiry[] };
      setInquiries(data.inquiries ?? []);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load inquiries."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    inquiries,
    loading,
    error,
    refresh,
    setInquiries,
  };
}
