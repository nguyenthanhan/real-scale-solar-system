/**
 * Astronomy calculation utilities for Date Mode simulation
 * Uses astronomy-engine library for accurate planetary position calculations
 */

import * as AE from "astronomy-engine";
import {
  SECONDS_PER_DAY,
  FULL_CIRCLE_RADIANS,
} from "@/utils/physics-constants";

// J2000 epoch: January 1, 2000, 12:00 TT (Terrestrial Time)
const J2000_EPOCH = new Date("2000-01-01T12:00:00Z");
const MILLISECONDS_PER_DAY = SECONDS_PER_DAY * 1000;

// Accurate date range for Astronomy Engine calculations
const MIN_ACCURATE_YEAR = 1700;
const MAX_ACCURATE_YEAR = 2300;

/**
 * Validate that a date is a valid Date object
 * @param date - Date to validate
 * @returns True if date is a valid Date instance
 */
function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Create a default position object for error fallback cases
 * @param planetName - Name of the planet
 * @returns Default PlanetPosition with zero values and J2000 epoch date
 */
function createDefaultPosition(planetName: string): PlanetPosition {
  return {
    planetName,
    longitudeDegrees: 0,
    rotationRadians: 0,
    date: J2000_EPOCH.toISOString(),
  };
}

/**
 * Map planet names to Astronomy Engine Body enum
 */
export const PLANET_BODY_MAP: Record<string, AE.Body> = {
  Mercury: AE.Body.Mercury,
  Venus: AE.Body.Venus,
  Earth: AE.Body.Earth,
  Mars: AE.Body.Mars,
  Jupiter: AE.Body.Jupiter,
  Saturn: AE.Body.Saturn,
  Uranus: AE.Body.Uranus,
  Neptune: AE.Body.Neptune,
};

/**
 * Calculate days since J2000 epoch
 * @param date - Target date
 * @returns Number of days since J2000 epoch (can be negative for dates before J2000)
 */
export function calculateDaysSinceJ2000(date: Date): number {
  if (!isValidDate(date)) {
    console.error("Invalid date provided to calculateDaysSinceJ2000");
    return 0;
  }

  const millisecondsDiff = date.getTime() - J2000_EPOCH.getTime();
  return millisecondsDiff / MILLISECONDS_PER_DAY;
}

/**
 * Convert days since J2000 back to a Date object
 * @param days - Days since J2000 epoch
 * @returns Date object
 */
export function daysToDate(days: number): Date {
  const milliseconds = days * MILLISECONDS_PER_DAY;
  return new Date(J2000_EPOCH.getTime() + milliseconds);
}

/**
 * Calculate ecliptic longitude for a planet at a specific date
 * @param planetName - Name of the planet (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune)
 * @param date - Target date
 * @returns Ecliptic longitude in degrees (0-360)
 */
export function calculateEclipticLongitude(
  planetName: string,
  date: Date
): number {
  const body = PLANET_BODY_MAP[planetName];

  if (!body) {
    console.error(`Unknown planet: ${planetName}`);
    return 0;
  }

  if (!isValidDate(date)) {
    console.error(`Invalid date provided for ${planetName}`);
    return 0;
  }

  try {
    // Create AstroTime object from Date (correct API usage)
    const time = AE.MakeTime(date);
    const longitude = AE.EclipticLongitude(body, time);

    // Validate result
    if (!Number.isFinite(longitude)) {
      console.error(`Invalid longitude calculated for ${planetName}`);
      return 0;
    }

    return longitude;
  } catch (error) {
    console.error(`Failed to calculate longitude for ${planetName}:`, error);
    return 0;
  }
}

/**
 * Convert ecliptic longitude to Three.js Y-axis rotation
 * @param longitudeDegrees - Ecliptic longitude in degrees (0-360)
 * @returns Rotation in radians for Three.js
 */
export function convertLongitudeToRotation(longitudeDegrees: number): number {
  if (!Number.isFinite(longitudeDegrees)) {
    console.error("Invalid longitude provided to convertLongitudeToRotation");
    return 0;
  }

  // Convert degrees to radians (360° = 2π radians)
  return (longitudeDegrees / 360) * FULL_CIRCLE_RADIANS;
}

/**
 * Planet position data structure
 */
export interface PlanetPosition {
  planetName: string;
  longitudeDegrees: number;
  rotationRadians: number;
  date: string;
}

/**
 * Get complete planet position data for a specific date
 * @param planetName - Name of the planet
 * @param date - Target date
 * @returns Object with longitude and rotation values
 */
export function getPlanetPosition(planetName: string, date: Date): PlanetPosition {
  // Validate date before using it
  if (!isValidDate(date)) {
    console.error(`Invalid date provided to getPlanetPosition for ${planetName}`);
    return createDefaultPosition(planetName);
  }

  const longitude = calculateEclipticLongitude(planetName, date);
  const rotation = convertLongitudeToRotation(longitude);

  return {
    planetName,
    longitudeDegrees: longitude,
    rotationRadians: rotation,
    date: date.toISOString(),
  };
}

/**
 * Get positions for all planets at a specific date
 * @param date - Target date
 * @returns Array of planet position data
 */
export function getAllPlanetPositions(date: Date): PlanetPosition[] {
  const planetNames = Object.keys(PLANET_BODY_MAP);
  return planetNames.map((name) => getPlanetPosition(name, date));
}

/**
 * Validate that a date is within the accurate range for Astronomy Engine
 * @param date - Date to validate
 * @returns True if date is within 1700-2300 range
 */
export function isDateInAccurateRange(date: Date): boolean {
  if (!isValidDate(date)) {
    return false;
  }

  const year = date.getFullYear();
  return year >= MIN_ACCURATE_YEAR && year <= MAX_ACCURATE_YEAR;
}

/**
 * Validate a date for use in astronomy calculations
 * @param date - Date to validate
 * @returns Object with valid flag and optional error message
 */
export function validateDate(date: Date): { valid: boolean; error?: string } {
  if (!isValidDate(date)) {
    return { valid: false, error: "Invalid date format" };
  }

  const year = date.getFullYear();

  if (year < MIN_ACCURATE_YEAR) {
    return {
      valid: false,
      error: `Date must be after ${MIN_ACCURATE_YEAR}`,
    };
  }

  if (year > MAX_ACCURATE_YEAR) {
    return {
      valid: false,
      error: `Date must be before ${MAX_ACCURATE_YEAR}`,
    };
  }

  return { valid: true };
}

/**
 * Get supported planet names
 * @returns Array of supported planet names
 */
export function getSupportedPlanets(): string[] {
  return Object.keys(PLANET_BODY_MAP);
}

// ============================================
// Caching for performance optimization
// ============================================

/**
 * Cache for ecliptic longitude calculations
 * Key format: "planetName-YYYY-MM-DD"
 */
const longitudeCache = new Map<string, number>();

/**
 * Maximum cache size to prevent memory issues
 */
const MAX_CACHE_SIZE = 1000;

/**
 * Generate cache key for a planet and date
 */
function getCacheKey(planetName: string, date: Date): string {
  return `${planetName}-${date.toISOString().split("T")[0]}`;
}

/**
 * Get cached ecliptic longitude or calculate and cache it
 * @param planetName - Name of the planet
 * @param date - Target date
 * @returns Ecliptic longitude in degrees
 */
export function getCachedEclipticLongitude(
  planetName: string,
  date: Date
): number {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error(`Invalid date provided to getCachedEclipticLongitude for ${planetName}`);
    return 0;
  }

  const key = getCacheKey(planetName, date);

  if (longitudeCache.has(key)) {
    return longitudeCache.get(key)!;
  }

  const longitude = calculateEclipticLongitude(planetName, date);

  // Manage cache size
  if (longitudeCache.size >= MAX_CACHE_SIZE) {
    // Remove oldest entries (first 100)
    const keysToDelete = Array.from(longitudeCache.keys()).slice(0, 100);
    keysToDelete.forEach((k) => longitudeCache.delete(k));
  }

  longitudeCache.set(key, longitude);
  return longitude;
}

/**
 * Clear the longitude cache
 * Call this when switching modes or when memory needs to be freed
 */
export function clearLongitudeCache(): void {
  longitudeCache.clear();
}

/**
 * Get current cache size (for debugging/monitoring)
 */
export function getCacheSize(): number {
  return longitudeCache.size;
}

/**
 * Get cached planet position data for a specific date
 * Uses caching for better performance
 * @param planetName - Name of the planet
 * @param date - Target date
 * @returns Object with longitude and rotation values
 */
export function getCachedPlanetPosition(planetName: string, date: Date): PlanetPosition {
  // Validate date before using it
  if (!isValidDate(date)) {
    console.error(`Invalid date provided to getCachedPlanetPosition for ${planetName}`);
    return createDefaultPosition(planetName);
  }

  const longitude = getCachedEclipticLongitude(planetName, date);
  const rotation = convertLongitudeToRotation(longitude);

  return {
    planetName,
    longitudeDegrees: longitude,
    rotationRadians: rotation,
    date: date.toISOString(),
  };
}
