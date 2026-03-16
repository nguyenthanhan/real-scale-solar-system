/**
 * Optimized rotation calculations for planet 3D models
 * Centralized calculations to reduce render cycle overhead
 */

// Pre-calculated constants for performance optimization
export const ROTATION_CONSTANTS = {
  MINUTES_PER_DAY: 1440,
  SIMULATED_SECONDS_PER_DAY: 1440 / 15, // MINUTES_PER_DAY / BASE_SPEED_MINUTES
  DEGREES_PER_ROTATION: 360,
  BASE_SPEED_MINUTES: 15,
  DEGREES_PER_SECOND_BASE: 360 / (1440 / 15), // DEGREES_PER_ROTATION / SIMULATED_SECONDS_PER_DAY

  // Validation bounds for input parameters
  MAX_ROTATION_PERIOD: 1000, // 1000 days max
  MIN_ROTATION_PERIOD: 0.001, // 0.001 days min (about 1.4 minutes)
  MAX_SPEED_MINUTES: 1_000_000, // 1 million minutes per second max
  MIN_SPEED_MINUTES: 0.001, // 0.001 minutes per second min
} as const;

/**
 * Calculate optimized rotation speed for a planet
 * @param planetRotationPeriod - Planet's rotation period in days
 * @param rotationSpeedMinutes - User-controlled speed (minutes per second)
 * @returns Rotation speed in degrees per second
 */
export function calculateRotationSpeed(
  planetRotationPeriod: number,
  rotationSpeedMinutes: number
): number {
  const period = Math.abs(planetRotationPeriod);

  // Avoid division by zero and handle edge cases
  if (period === 0) return 0;

  // Optimized calculation: (360 / (period * 96)) * (speed / 15)
  // Simplified to: (360 / 96) * (speed / (period * 15))
  // Further simplified to: 3.75 * (speed / (period * 15))
  const speedMultiplier =
    rotationSpeedMinutes / (period * ROTATION_CONSTANTS.BASE_SPEED_MINUTES);
  return ROTATION_CONSTANTS.DEGREES_PER_SECOND_BASE * speedMultiplier;
}

/**
 * Calculate rotation direction for a planet
 * @param planetRotationPeriod - Planet's rotation period in days (negative for retrograde)
 * @returns 1 for prograde, -1 for retrograde
 */
export function calculateRotationDirection(
  planetRotationPeriod: number
): number {
  return planetRotationPeriod < 0 ? -1 : 1;
}

/**
 * Calculate the final rotation multiplier for useFrame
 * @param planetRotationPeriod - Planet's rotation period in days
 * @param rotationSpeedMinutes - User-controlled speed (minutes per second)
 * @returns Rotation multiplier for useFrame calculations
 */
export function calculateRotationMultiplier(
  planetRotationPeriod: number,
  rotationSpeedMinutes: number
): number {
  const speed = calculateRotationSpeed(
    planetRotationPeriod,
    rotationSpeedMinutes
  );
  const direction = calculateRotationDirection(planetRotationPeriod);
  return speed * direction;
}

/**
 * Calculate adjusted planet size for ring visibility
 * @param planetName - Name of the planet
 * @param baseSize - Base size of the planet
 * @returns Adjusted size for optimal ring visibility
 */
export function calculateAdjustedPlanetSize(
  planetName: string,
  baseSize: number
): number {
  // Saturn has the most spectacular and largest ring system
  if (planetName === "Saturn") {
    return baseSize * 0.55; // Reduce Saturn size significantly to show rings
  }
  // Neptune has prominent rings
  if (planetName === "Neptune") {
    return baseSize * 0.7; // Reduce Neptune size to show rings
  }
  // Jupiter and Uranus have subtle rings
  if (planetName === "Jupiter" || planetName === "Uranus") {
    return baseSize * 0.85; // Slight reduction for ring visibility
  }
  return baseSize;
}

/**
 * Cache for frequently used rotation calculations
 * This prevents recalculating the same values multiple times
 */
class RotationCalculationCache {
  private cache = new Map<string, number>();
  private readonly maxCacheSize = 100;

  private generateKey(
    planetRotationPeriod: number,
    rotationSpeedMinutes: number
  ): string {
    // Use full precision values to avoid quantization issues
    // This ensures distinct inputs generate distinct cache keys
    return `${planetRotationPeriod}_${rotationSpeedMinutes}`;
  }

  getRotationSpeed(
    planetRotationPeriod: number,
    rotationSpeedMinutes: number
  ): number {
    const key = this.generateKey(planetRotationPeriod, rotationSpeedMinutes);

    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const result = calculateRotationSpeed(
      planetRotationPeriod,
      rotationSpeedMinutes
    );

    // Prevent cache from growing too large
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, result);
    return result;
  }

  clear(): void {
    this.cache.clear();
  }
}

// Export singleton instance for use across components
export const rotationCache = new RotationCalculationCache();
