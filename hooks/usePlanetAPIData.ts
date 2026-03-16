/**
 * usePlanetAPIData Hook
 * Fetches and manages planet API data with loading states
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { PlanetData } from "@/data/planet-types";
import { MergedPlanetData } from "@/services/planet-api-types";
import { fetchWithCache } from "@/services/fetch-with-fallback";
import { mergePlanetData, createLoadingState } from "@/utils/data-merger";

interface UsePlanetAPIDataReturn {
  mergedData: MergedPlanetData;
  isLoading: boolean;
  error: boolean;
  refetch: () => void;
}

/**
 * Hook to fetch and manage planet API data
 * @param planetName - Name of the planet to fetch data for
 * @param localData - Local planet data to use as base/fallback
 * @returns Object with merged data, loading state, error state, and refetch function
 */
export function usePlanetAPIData(
  planetName: string | null,
  localData: PlanetData | null
): UsePlanetAPIDataReturn {
  const requestIdRef = useRef(0);
  const isMountedRef = useRef(true);

  const [mergedData, setMergedData] = useState<MergedPlanetData>(() => {
    if (!localData) {
      return {} as MergedPlanetData;
    }
    return mergePlanetData(null, localData);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Invalidate in-flight requests to prevent stale updates after unmount.
      requestIdRef.current += 1;
    };
  }, []);

  const fetchData = useCallback(async () => {
    if (!planetName || !localData) {
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(false);
    setMergedData(createLoadingState(localData));

    try {
      const data = await fetchWithCache(planetName, localData);
      if (!isMountedRef.current || requestId !== requestIdRef.current) {
        return;
      }
      setMergedData(data);
      setError(data.apiError || false);
    } catch (err) {
      if (!isMountedRef.current || requestId !== requestIdRef.current) {
        return;
      }
      console.error("Failed to fetch planet data:", err);
      setMergedData(mergePlanetData(null, localData));
      setError(true);
    } finally {
      if (isMountedRef.current && requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [planetName, localData]);

  // Fetch data when planet changes
  useEffect(() => {
    if (planetName && localData) {
      fetchData();
    }
  }, [planetName, localData, fetchData]);

  // Reset state when localData changes
  useEffect(() => {
    if (localData) {
      setMergedData(mergePlanetData(null, localData));
    }
  }, [localData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    mergedData,
    isLoading,
    error,
    refetch,
  };
}
