/**
 * Data Merger Utility
 * Merges API data with local planet data
 */

import { PlanetData } from "@/data/planet-types";
import {
  APIResponse,
  MergedPlanetData,
  isValidMass,
} from "@/services/planet-api-types";
import {
  formatMass,
  formatTemperature,
  formatOrbitalPeriod,
  formatRotationPeriod,
  formatMoonCount,
  formatGravity,
  formatDensity,
} from "./data-formatters";

/**
 * Safely extract a nested field from an object
 * @param obj - Source object
 * @param path - Dot-separated path to field
 * @param defaultValue - Default value if field not found
 */
export function safeExtractField<T>(
  obj: unknown,
  path: string,
  defaultValue: T
): T {
  try {
    const keys = path.split(".");
    let value: unknown = obj;

    for (const key of keys) {
      if (value === null || value === undefined) {
        return defaultValue;
      }
      value = (value as Record<string, unknown>)[key];
    }

    return value !== undefined && value !== null ? (value as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Merge API data with local planet data
 * API data takes priority, local data fills gaps
 * @param apiData - Data from API (may be null if fetch failed)
 * @param localData - Complete local planet data
 * @returns Merged data object with formatted values
 */
export function mergePlanetData(
  apiData: APIResponse | null,
  localData: PlanetData
): MergedPlanetData {
  const merged: MergedPlanetData = {
    ...localData,
    isLoadingAPIData: false,
    apiError: apiData === null,
  };

  if (!apiData) {
    // No API data, use local data only
    return merged;
  }

  // Merge mass data
  if (apiData.mass && isValidMass(apiData.mass)) {
    merged.apiMass = formatMass(
      apiData.mass.massValue,
      apiData.mass.massExponent
    );
  }

  // Merge temperature data
  if (apiData.avgTemp !== undefined && apiData.avgTemp !== null) {
    merged.apiTemperature = formatTemperature(apiData.avgTemp);
  }

  // Merge orbital period
  if (apiData.sideralOrbit !== undefined && apiData.sideralOrbit !== null) {
    merged.apiOrbitalPeriod = formatOrbitalPeriod(apiData.sideralOrbit);
  }

  // Merge rotation period
  if (
    apiData.sideralRotation !== undefined &&
    apiData.sideralRotation !== null
  ) {
    merged.apiRotationPeriod = formatRotationPeriod(apiData.sideralRotation);
  }

  // Merge moon count
  merged.apiMoonCount = formatMoonCount(apiData.moons);

  // Merge gravity
  if (apiData.gravity !== undefined && apiData.gravity !== null) {
    merged.apiGravity = formatGravity(apiData.gravity);
  }

  // Merge density
  if (apiData.density !== undefined && apiData.density !== null) {
    merged.apiDensity = formatDensity(apiData.density);
  }

  return merged;
}

/**
 * Create initial merged data with loading state
 * @param localData - Local planet data
 * @returns Merged data with loading flag set
 */
export function createLoadingState(localData: PlanetData): MergedPlanetData {
  return {
    ...localData,
    isLoadingAPIData: true,
    apiError: false,
  };
}
