import { PlanetData } from "@/data/planet-types";

/**
 * Validation error structure
 */
export interface ValidationError {
  planetName: string;
  field: string;
  value: unknown;
  expected: string;
}

/**
 * Validate planet physics data
 * @param planet - Planet data to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validatePlanetData(planet: PlanetData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check orbitalPeriodDays
  if (
    typeof planet.orbitalPeriodDays !== "number" ||
    !Number.isFinite(planet.orbitalPeriodDays) ||
    planet.orbitalPeriodDays <= 0
  ) {
    errors.push({
      planetName: planet.name,
      field: "orbitalPeriodDays",
      value: planet.orbitalPeriodDays,
      expected: "positive number",
    });
  }

  // Check eccentricity
  if (
    typeof planet.eccentricity !== "number" ||
    planet.eccentricity < 0 ||
    planet.eccentricity >= 1
  ) {
    errors.push({
      planetName: planet.name,
      field: "eccentricity",
      value: planet.eccentricity,
      expected: "number between 0 and 1",
    });
  }

  // Check rotationSpeedByDays
  if (
    typeof planet.rotationSpeedByDays !== "number" ||
    !Number.isFinite(planet.rotationSpeedByDays)
  ) {
    errors.push({
      planetName: planet.name,
      field: "rotationSpeedByDays",
      value: planet.rotationSpeedByDays,
      expected: "number (negative for retrograde)",
    });
  }

  // Check orbitalInclination (optional field, but if present should be valid)
  if (
    planet.orbitalInclination !== undefined &&
    (typeof planet.orbitalInclination !== "number" ||
      !Number.isFinite(planet.orbitalInclination) ||
      planet.orbitalInclination < 0 ||
      planet.orbitalInclination > 180)
  ) {
    errors.push({
      planetName: planet.name,
      field: "orbitalInclination",
      value: planet.orbitalInclination,
      expected: "number between 0 and 180 degrees",
    });
  }

  // Check axialTilt
  if (
    typeof planet.axialTilt !== "number" ||
    !Number.isFinite(planet.axialTilt) ||
    planet.axialTilt < 0 ||
    planet.axialTilt > 180
  ) {
    errors.push({
      planetName: planet.name,
      field: "axialTilt",
      value: planet.axialTilt,
      expected: "number between 0 and 180 degrees",
    });
  }

  return errors;
}

/**
 * Validate all planet data on load
 * @param planets - Array of planet data
 * @throws Error if validation fails
 */
export function validateAllPlanets(planets: PlanetData[]): void {
  const allErrors: ValidationError[] = [];

  planets.forEach((planet) => {
    const errors = validatePlanetData(planet);
    allErrors.push(...errors);
  });

  if (allErrors.length > 0) {
    console.error("❌ Planet data validation failed:", allErrors);
    allErrors.forEach((error) => {
      console.error(
        `  ${error.planetName}.${error.field}: ` +
          `got ${JSON.stringify(error.value)}, expected ${error.expected}`,
      );
    });
    throw new Error(
      `Planet data validation failed with ${allErrors.length} errors`,
    );
  }

  console.log("✅ All planet data validated successfully");
}
