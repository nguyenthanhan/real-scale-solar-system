/**
 * Fetch with Fallback Wrapper
 * Fetches API data with graceful fallback to local data
 */

import { PlanetData } from "@/data/planet-types";
import { MergedPlanetData } from "./planet-api-types";
import { planetDataService } from "./planet-data-service";
import { mergePlanetData } from "@/utils/data-merger";

/**
 * Fetch planet data from API with fallback to local data
 * @param planetName - Name of the planet
 * @param localData - Local planet data to use as fallback
 * @returns Merged planet data (API + local, or just local on failure)
 */
export async function fetchWithFallback(
  planetName: string,
  localData: PlanetData
): Promise<MergedPlanetData> {
  try {
    const apiData = await planetDataService.fetchPlanetData(planetName);
    return mergePlanetData(apiData, localData);
  } catch (error) {
    // Log error but don't show to user
    console.error(
      `API fetch failed for ${planetName}, using local data:`,
      error instanceof Error ? error.message : error
    );

    // Return local data as fallback (no error shown to user)
    return mergePlanetData(null, localData);
  }
}

// Cache configuration
const CACHE_KEY = "planet-api-cache";
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

/**
 * Get cache from localStorage
 */
function getCache(): Record<
  string,
  { data: MergedPlanetData; timestamp: number }
> {
  if (typeof window === "undefined") return {};

  try {
    const cacheStr = localStorage.getItem(CACHE_KEY);
    return cacheStr ? JSON.parse(cacheStr) : {};
  } catch (error) {
    console.error("Failed to read cache from localStorage:", error);
    return {};
  }
}

/**
 * Save cache to localStorage
 */
function saveCache(
  cache: Record<string, { data: MergedPlanetData; timestamp: number }>
): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error("Failed to save cache to localStorage:", error);
  }
}

/**
 * Fetch planet data with caching (persists across page refreshes)
 * @param planetName - Name of the planet
 * @param localData - Local planet data
 * @returns Cached or fresh merged planet data
 */
export async function fetchWithCache(
  planetName: string,
  localData: PlanetData
): Promise<MergedPlanetData> {
  const cacheKey = planetName.toLowerCase();
  const cache = getCache();
  const cached = cache[cacheKey];
  const now = Date.now();

  // Return cached data if still fresh
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    console.log(`Using cached data for ${planetName}`);
    return cached.data;
  }

  // Fetch fresh data
  console.log(`Fetching fresh data for ${planetName}`);
  const data = await fetchWithFallback(planetName, localData);

  // Cache the result (only if API data was successfully fetched)
  if (!data.apiError) {
    cache[cacheKey] = { data, timestamp: now };
    saveCache(cache);
  }

  return data;
}

/**
 * Clear the entire API cache
 */
export function clearAPICache(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(CACHE_KEY);
    console.log("API cache cleared");
  } catch (error) {
    console.error("Failed to clear cache:", error);
  }
}

/**
 * Clear cache for a specific planet
 */
export function clearPlanetCache(planetName: string): void {
  if (typeof window === "undefined") return;

  try {
    const cache = getCache();
    const cacheKey = planetName.toLowerCase();
    delete cache[cacheKey];
    saveCache(cache);
    console.log(`Cache cleared for ${planetName}`);
  } catch (error) {
    console.error(`Failed to clear cache for ${planetName}:`, error);
  }
}
