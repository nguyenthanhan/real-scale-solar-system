/**
 * Data Formatters for Planet API Data
 * Provides consistent formatting for all planetary data
 */

import { APIMoon } from "@/services/planet-api-types";

export const DATA_UNAVAILABLE = "Data unavailable";

/**
 * Format mass in scientific notation
 * @param massValue - Mantissa of the mass
 * @param massExponent - Exponent of the mass
 * @returns Formatted string like "5.97 × 10^24 kg"
 */
export function formatMass(
  massValue: number | undefined | null,
  massExponent: number | undefined | null
): string {
  if (
    massValue === undefined ||
    massValue === null ||
    massValue === 0 ||
    !Number.isFinite(massValue) ||
    massExponent === undefined ||
    massExponent === null ||
    !Number.isFinite(massExponent)
  ) {
    return DATA_UNAVAILABLE;
  }

  return `${massValue.toFixed(2)} × 10^${massExponent} kg`;
}

/**
 * Convert Kelvin to Celsius and format
 * @param kelvin - Temperature in Kelvin
 * @returns Formatted string like "15.0°C"
 */
export function formatTemperature(kelvin: number | undefined | null): string {
  if (kelvin === undefined || kelvin === null || !Number.isFinite(kelvin)) {
    return DATA_UNAVAILABLE;
  }

  const celsius = kelvin - 273.15;
  return `${celsius.toFixed(1)}°C`;
}

/**
 * Format orbital period in days
 * @param days - Orbital period in Earth days
 * @returns Formatted string like "365.3 days"
 */
export function formatOrbitalPeriod(days: number | undefined | null): string {
  if (days === undefined || days === null || !Number.isFinite(days)) {
    return DATA_UNAVAILABLE;
  }

  return `${days.toFixed(1)} days`;
}

/**
 * Format rotation period in appropriate units
 * @param hours - Rotation period in hours
 * @returns Formatted string like "23.9 hours" or "243.0 days"
 */
export function formatRotationPeriod(hours: number | undefined | null): string {
  if (hours === undefined || hours === null || !Number.isFinite(hours)) {
    return DATA_UNAVAILABLE;
  }

  const absHours = Math.abs(hours);

  if (absHours > 24) {
    const days = absHours / 24;
    return `${days.toFixed(2)} days`;
  }

  return `${absHours.toFixed(2)} hours`;
}

/**
 * Format moon count from moons array
 * @param moons - Array of moon objects or null
 * @returns Formatted string like "79" or "0"
 */
export function formatMoonCount(moons: APIMoon[] | null | undefined): string {
  if (moons === null || moons === undefined) {
    return "0";
  }

  if (Array.isArray(moons)) {
    return moons.length.toString();
  }

  return "0";
}

/**
 * Format large numbers with thousand separators
 * @param value - Numerical value
 * @returns Formatted string like "1,234,567"
 */
export function formatLargeNumber(value: number | undefined | null): string {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return DATA_UNAVAILABLE;
  }

  return value.toLocaleString("en-US");
}

/**
 * Format gravity value
 * @param gravity - Gravity in m/s²
 * @returns Formatted string like "9.81 m/s²"
 */
export function formatGravity(gravity: number | undefined | null): string {
  if (gravity === undefined || gravity === null || !Number.isFinite(gravity)) {
    return DATA_UNAVAILABLE;
  }

  return `${gravity.toFixed(2)} m/s²`;
}

/**
 * Format density value
 * @param density - Density in g/cm³
 * @returns Formatted string like "5.51 g/cm³"
 */
export function formatDensity(density: number | undefined | null): string {
  if (density === undefined || density === null || !Number.isFinite(density)) {
    return DATA_UNAVAILABLE;
  }

  return `${density.toFixed(2)} g/cm³`;
}
