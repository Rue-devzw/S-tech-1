import { useState, useEffect } from "react";
import { Listing, LISTINGS as defaultListings } from "./mock-data";

const STORAGE_KEY = "s-tech-listings";

export function useListings() {
  const [listings, setListings] = useState<Listing[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {
        // ignore parse errors
      }
    }
    return defaultListings;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
    }
  }, [listings]);

  return { listings, setListings };
}
