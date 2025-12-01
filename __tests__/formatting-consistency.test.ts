/**
 * Formatting Consistency Tests
 * Property-based tests for consistent formatting across planets
 */

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  formatMass,
  formatTemperature,
  formatOrbitalPeriod,
  formatRotationPeriod,
  formatMoonCount,
  formatGravity,
  formatDensity,
  DATA_UNAVAILABLE,
} from "../utils/data-formatters";
import { mergePlanetData } from "../utils/data-merger";
import { APIResponse } from "../services/planet-api-types";
import { PlanetData } from "../data/planet-types";

describe("Formatting Consistency", () => {
  // **Feature: real-planet-data-api, Property 10: Consistent formatting across planets**
  // **Validates: Requirements 10.1, 10.5**
  describe("Property 10: Consistent formatting across planets", () => {
    const basePlanetData: PlanetData = {
      name: "TestPlanet",
      diameterRelativeEarth: 1,
      diameterInKm: 12742,
      distanceInKm: 149600000,
      distanceInAU: 1,
      eccentricity: 0.017,
      axialTilt: 23.44,
      orbitalInclination: 0,
      color: "#4A90E2",
      texture: "/textures/test.jpg",
      orbitSpeedByEarth: 1,
      orbitSpeedByKmH: 107000,
      orbitalPeriodDays: 365.256,
      orbitalPeriod: "365.25 days",
      rotationSpeedByDays: 1,
      rotationSpeedByKmH: 1670,
      hasRings: false,
      ringColor: "",
      ringTilt: 0,
      description: "Test planet",
      dayLength: "24 hours",
      funFact: "Test fact",
      temperature: "15°C",
      gravity: "9.81 m/s²",
      atmosphere: "Test",
      moons: "1",
      yearDiscovered: "2024",
    };

    it("should format equivalent fields identically for any two planets", () => {
      fc.assert(
        fc.property(
          // Generate two sets of API data with same values
          fc.record({
            massValue: fc.double({ min: 0.1, max: 100, noNaN: true }),
            massExponent: fc.integer({ min: 20, max: 30 }),
            avgTemp: fc.double({ min: 50, max: 500, noNaN: true }),
            sideralOrbit: fc.double({ min: 1, max: 100000, noNaN: true }),
            sideralRotation: fc.double({ min: 0.1, max: 10000, noNaN: true }),
            gravity: fc.double({ min: 0.1, max: 30, noNaN: true }),
            density: fc.double({ min: 0.1, max: 20, noNaN: true }),
          }),
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          (apiFields, planet1Name, planet2Name) => {
            // Create two different planets with same API values
            const planet1Data = { ...basePlanetData, name: planet1Name };
            const planet2Data = { ...basePlanetData, name: planet2Name };

            const apiData: APIResponse = {
              id: "test",
              name: "test",
              englishName: "Test",
              isPlanet: true,
              mass: {
                massValue: apiFields.massValue,
                massExponent: apiFields.massExponent,
              },
              avgTemp: apiFields.avgTemp,
              sideralOrbit: apiFields.sideralOrbit,
              sideralRotation: apiFields.sideralRotation,
              gravity: apiFields.gravity,
              density: apiFields.density,
              moons: null,
            } as APIResponse;

            const merged1 = mergePlanetData(apiData, planet1Data);
            const merged2 = mergePlanetData(apiData, planet2Data);

            // Same API values should produce identical formatted strings
            expect(merged1.apiMass).toBe(merged2.apiMass);
            expect(merged1.apiTemperature).toBe(merged2.apiTemperature);
            expect(merged1.apiOrbitalPeriod).toBe(merged2.apiOrbitalPeriod);
            expect(merged1.apiRotationPeriod).toBe(merged2.apiRotationPeriod);
            expect(merged1.apiGravity).toBe(merged2.apiGravity);
            expect(merged1.apiDensity).toBe(merged2.apiDensity);

            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it("should use consistent decimal places for all numerical values", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.1, max: 10000, noNaN: true }),
          (value) => {
            // Temperature: 1 decimal place
            const temp = formatTemperature(value);
            if (temp !== DATA_UNAVAILABLE) {
              const tempMatch = temp.match(/(-?\d+\.\d)/);
              expect(tempMatch).toBeTruthy();
            }

            // Orbital period: 1 decimal place
            const orbital = formatOrbitalPeriod(value);
            if (orbital !== DATA_UNAVAILABLE) {
              const orbitalMatch = orbital.match(/(\d+\.\d)/);
              expect(orbitalMatch).toBeTruthy();
            }

            // Rotation period: 2 decimal places
            const rotation = formatRotationPeriod(value);
            if (rotation !== DATA_UNAVAILABLE) {
              const rotationMatch = rotation.match(/(\d+\.\d{2})/);
              expect(rotationMatch).toBeTruthy();
            }

            // Gravity: 2 decimal places
            const gravity = formatGravity(value);
            if (gravity !== DATA_UNAVAILABLE) {
              const gravityMatch = gravity.match(/(\d+\.\d{2})/);
              expect(gravityMatch).toBeTruthy();
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should use standard SI units consistently", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.1, max: 1000, noNaN: true }),
          fc.integer({ min: 20, max: 30 }),
          (value, exponent) => {
            // Mass should always use kg
            const mass = formatMass(value, exponent);
            if (mass !== DATA_UNAVAILABLE) {
              expect(mass).toContain("kg");
            }

            // Temperature should always use °C
            const temp = formatTemperature(value);
            if (temp !== DATA_UNAVAILABLE) {
              expect(temp).toContain("°C");
            }

            // Gravity should always use m/s²
            const gravity = formatGravity(value);
            if (gravity !== DATA_UNAVAILABLE) {
              expect(gravity).toContain("m/s²");
            }

            // Density should always use g/cm³
            const density = formatDensity(value);
            if (density !== DATA_UNAVAILABLE) {
              expect(density).toContain("g/cm³");
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use "Data unavailable" consistently for all missing fields', () => {
      // All formatters should return the same string for invalid input
      expect(formatMass(undefined, undefined)).toBe(DATA_UNAVAILABLE);
      expect(formatTemperature(undefined)).toBe(DATA_UNAVAILABLE);
      expect(formatOrbitalPeriod(undefined)).toBe(DATA_UNAVAILABLE);
      expect(formatRotationPeriod(undefined)).toBe(DATA_UNAVAILABLE);
      expect(formatGravity(undefined)).toBe(DATA_UNAVAILABLE);
      expect(formatDensity(undefined)).toBe(DATA_UNAVAILABLE);

      // NaN should also return DATA_UNAVAILABLE
      expect(formatMass(NaN, 24)).toBe(DATA_UNAVAILABLE);
      expect(formatTemperature(NaN)).toBe(DATA_UNAVAILABLE);
      expect(formatOrbitalPeriod(NaN)).toBe(DATA_UNAVAILABLE);
      expect(formatRotationPeriod(NaN)).toBe(DATA_UNAVAILABLE);
      expect(formatGravity(NaN)).toBe(DATA_UNAVAILABLE);
      expect(formatDensity(NaN)).toBe(DATA_UNAVAILABLE);
    });
  });
});
