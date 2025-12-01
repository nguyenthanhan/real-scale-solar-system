/**
 * usePlanetAPIData Hook
 * Fetches and manages planet API data with loading states
 */

import { useState, useEffect, useCallback } from "react";
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
  const [mergedData, setMergedData] = useState<MergedPlanetData>(() => {
    if (!localData) {
      return {} as MergedPlanetData;
    }
    return mergePlanetData(null, localData);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    if (!planetName || !localData) {
      return;
    }

    setIsLoading(true);
    setError(false);
    setMergedData(createLoadingState(localData));

    try {
      const data = await fetchWithCache(planetName, localData);
      setMergedData(data);
      setError(data.apiError || false);
    } catch (err) {
      console.error("Failed to fetch planet data:", err);
      setMergedData(mergePlanetData(null, localData));
      setError(true);
    } finally {
      setIsLoading(false);
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
