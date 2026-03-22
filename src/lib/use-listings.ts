import { useCallback, useEffect, useState } from "react";
import { type Listing, LISTINGS as defaultListings } from "./mock-data";

export function useListings() {
  const [listings, setListings] = useState<Listing[]>(defaultListings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/listings", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load listings.");
      }

      const data = (await response.json()) as { listings?: Listing[] };
      setListings(data.listings ?? defaultListings);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load listings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    listings,
    loading,
    error,
    refresh,
    setListings,
  };
}
