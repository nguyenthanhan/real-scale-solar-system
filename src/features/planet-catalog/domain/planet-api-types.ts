/**
 * Types for Solar System OpenData API
 * API: https://api.le-systeme-solaire.net/rest/bodies/
 */

import { PlanetData } from "@/data/planet-types";

/**
 * Moon data from API response
 */
export interface APIMoon {
  moon: string;
  rel: string;
}

/**
 * Mass data structure from API
 */
export interface APIMass {
  massValue: number;
  massExponent: number;
}

/**
 * Volume data structure from API
 */
export interface APIVolume {
  volValue: number;
  volExponent: number;
}

/**
 * Complete API response for a celestial body
 */
export interface APIResponse {
  id: string;
  name: string;
  englishName: string;
  isPlanet: boolean;
  moons: APIMoon[] | null;
  semimajorAxis: number;
  perihelion: number;
  aphelion: number;
  eccentricity: number;
  inclination: number;
  mass: APIMass | null;
  vol: APIVolume | null;
  density: number;
  gravity: number;
  escape: number;
  meanRadius: number;
  equaRadius: number;
  polarRadius: number;
  flattening: number;
  dimension: string;
  sideralOrbit: number; // Orbital period in days
  sideralRotation: number; // Rotation period in hours
  aroundPlanet: { planet: string; rel: string } | null;
  discoveredBy: string;
  discoveryDate: string;
  alternativeName: string;
  axialTilt: number;
  avgTemp: number; // Temperature in Kelvin
  mainAnomaly: number;
  argPeriapsis: number;
  longAscNode: number;
}

/**
 * Merged planet data combining local and API data
 */
export interface MergedPlanetData extends PlanetData {
  // Formatted API data fields
  apiMass?: string;
  apiTemperature?: string;
  apiOrbitalPeriod?: string;
  apiRotationPeriod?: string;
  apiMoonCount?: string;
  apiGravity?: string;
  apiDensity?: string;
  // Loading and error states
  isLoadingAPIData?: boolean;
  apiError?: boolean;
}

/**
 * Type guard to validate API response structure
 */
export function isValidAPIResponse(data: unknown): data is APIResponse {
  if (!data || typeof data !== "object") {
    return false;
  }

  const response = data as Record<string, unknown>;

  // Check required string fields
  if (typeof response.name !== "string") {
    return false;
  }

  if (typeof response.englishName !== "string") {
    return false;
  }

  // Check boolean field
  if (typeof response.isPlanet !== "boolean") {
    return false;
  }

  return true;
}

/**
 * Type guard to validate mass structure
 */
export function isValidMass(mass: unknown): mass is APIMass {
  if (!mass || typeof mass !== "object") {
    return false;
  }

  const m = mass as Record<string, unknown>;
  return (
    typeof m.massValue === "number" &&
    typeof m.massExponent === "number" &&
    Number.isFinite(m.massValue) &&
    Number.isFinite(m.massExponent)
  );
}
