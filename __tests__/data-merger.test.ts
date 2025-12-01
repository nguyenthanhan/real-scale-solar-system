/**
 * Data Merger Tests
 * Property-based and unit tests for data merging utilities
 */

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  mergePlanetData,
  createLoadingState,
  safeExtractField,
} from "../utils/data-merger";
import { APIResponse } from "../services/planet-api-types";
import { PlanetData } from "../data/planet-types";

describe("Data Merger", () => {
  const mockLocalData: PlanetData = {
    name: "Earth",
    color: "#4A90E2",
    size: 1,
    distance: 1,
    orbitalPeriod: 365.25,
    rotationSpeed: 1,
    description: "Our home planet",
    funFact: "The only planet known to support life",
    temperature: "15°C average",
    gravity: "9.81 m/s²",
    atmosphere: "Nitrogen, Oxygen",
    dayLength: "24 hours",
    moons: "1 (Moon)",
    diameterInKm: 12742,
    distanceFromSunInKm: 149600000,
    axialTilt: 23.44,
    rotationSpeedByDay: 1,
  };

  // **Feature: real-planet-data-api, Property 9: API data prioritized over local data**
  // **Validates: Requirements 9.3, 9.5**
  describe("Property 9: API data prioritized over local data", () => {
    it("should include API data when available", () => {
      fc.assert(
        fc.property(
          fc.record({
            massValue: fc.double({ min: 0.1, max: 100, noNaN: true }),
            massExponent: fc.integer({ min: 20, max: 30 }),
            avgTemp: fc.double({ min: 50, max: 500, noNaN: true }),
            sideralOrbit: fc.double({ min: 1, max: 100000, noNaN: true }),
            sideralRotation: fc.double({ min: 0.1, max: 10000, noNaN: true }),
            gravity: fc.double({ min: 0.1, max: 30, noNaN: true }),
          }),
          (apiFields) => {
            const apiData: APIResponse = {
              id: "earth",
              name: "earth",
              englishName: "Earth",
              isPlanet: true,
              mass: {
                massValue: apiFields.massValue,
                massExponent: apiFields.massExponent,
              },
              avgTemp: apiFields.avgTemp,
              sideralOrbit: apiFields.sideralOrbit,
              sideralRotation: apiFields.sideralRotation,
              gravity: apiFields.gravity,
              moons: null,
            } as APIResponse;

            const merged = mergePlanetData(apiData, mockLocalData);

            // API data should be present and formatted
            expect(merged.apiMass).toBeDefined();
            expect(merged.apiMass).toContain(apiFields.massValue.toFixed(2));
            expect(merged.apiTemperature).toBeDefined();
            expect(merged.apiOrbitalPeriod).toBeDefined();
            expect(merged.apiRotationPeriod).toBeDefined();
            expect(merged.apiGravity).toBeDefined();
            expect(merged.hasApiData).not.toBe(true); // apiError should be false

            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it("should use local data when API data is null", () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string({ minLength: 1 }),
            orbitalPeriod: fc.double({ min: 1, max: 100000, noNaN: true }),
          }),
          (localFields) => {
            const localData: PlanetData = {
              ...mockLocalData,
              name: localFields.name,
              orbitalPeriod: localFields.orbitalPeriod,
            };

            const merged = mergePlanetData(null, localData);

            // Should use local data when API data is null
            expect(merged.name).toBe(localFields.name);
            expect(merged.orbitalPeriod).toBe(localFields.orbitalPeriod);
            expect(merged.apiError).toBe(true);
            expect(merged.apiMass).toBeUndefined();
            expect(merged.apiTemperature).toBeUndefined();

            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  // Unit Tests
  describe("Unit Tests", () => {
    it("should merge complete API data with local data", () => {
      const apiData: APIResponse = {
        id: "earth",
        name: "earth",
        englishName: "Earth",
        isPlanet: true,
        mass: { massValue: 5.972, massExponent: 24 },
        avgTemp: 288,
        sideralOrbit: 365.25,
        sideralRotation: 23.93,
        gravity: 9.81,
        density: 5.51,
        moons: [{ moon: "Moon", rel: "moon" }],
      } as APIResponse;

      const merged = mergePlanetData(apiData, mockLocalData);

      expect(merged.name).toBe("Earth");
      expect(merged.apiError).toBe(false);
      expect(merged.isLoadingAPIData).toBe(false);
      expect(merged.apiMass).toBe("5.97 × 10^24 kg");
      expect(merged.apiTemperature).toBe("14.9°C");
      expect(merged.apiOrbitalPeriod).toBe("365.3 days");
      expect(merged.apiRotationPeriod).toBe("23.93 hours");
      expect(merged.apiMoonCount).toBe("1");
      expect(merged.apiGravity).toBe("9.81 m/s²");
      expect(merged.apiDensity).toBe("5.51 g/cm³");
    });

    it("should merge partial API data with local data", () => {
      const apiData: APIResponse = {
        id: "mars",
        name: "mars",
        englishName: "Mars",
        isPlanet: true,
        mass: { massValue: 6.39, massExponent: 23 },
        avgTemp: 210,
        // Missing sideralOrbit, sideralRotation, etc.
      } as APIResponse;

      const merged = mergePlanetData(apiData, mockLocalData);

      expect(merged.apiError).toBe(false);
      expect(merged.apiMass).toBe("6.39 × 10^23 kg");
      // 210K - 273.15 = -63.15, rounded to 1 decimal = -63.1 or -63.2
      expect(merged.apiTemperature).toMatch(/^-63\.[12]°C$/);
      expect(merged.apiOrbitalPeriod).toBeUndefined();
      expect(merged.apiRotationPeriod).toBeUndefined();
      expect(merged.apiMoonCount).toBe("0"); // null moons
    });

    it("should handle null API data (fallback to local)", () => {
      const merged = mergePlanetData(null, mockLocalData);

      expect(merged.name).toBe("Earth");
      expect(merged.apiError).toBe(true);
      expect(merged.isLoadingAPIData).toBe(false);
      expect(merged.apiMass).toBeUndefined();
      expect(merged.apiTemperature).toBeUndefined();
      expect(merged.orbitalPeriod).toBe(365.25); // Local data preserved
    });

    it("should handle API data with invalid mass", () => {
      const apiData: APIResponse = {
        id: "invalid",
        name: "invalid",
        englishName: "Invalid",
        isPlanet: true,
        mass: null, // Invalid mass
        avgTemp: 288,
      } as APIResponse;

      const merged = mergePlanetData(apiData, mockLocalData);

      expect(merged.apiError).toBe(false);
      expect(merged.apiMass).toBeUndefined(); // Invalid mass not formatted
      expect(merged.apiTemperature).toBe("14.9°C"); // Valid temp still formatted
    });

    it("should preserve all local data fields", () => {
      const apiData: APIResponse = {
        id: "earth",
        name: "earth",
        englishName: "Earth",
        isPlanet: true,
      } as APIResponse;

      const merged = mergePlanetData(apiData, mockLocalData);

      // All local fields should be preserved
      expect(merged.color).toBe(mockLocalData.color);
      expect(merged.size).toBe(mockLocalData.size);
      expect(merged.distance).toBe(mockLocalData.distance);
      expect(merged.description).toBe(mockLocalData.description);
      expect(merged.funFact).toBe(mockLocalData.funFact);
      expect(merged.temperature).toBe(mockLocalData.temperature);
      expect(merged.gravity).toBe(mockLocalData.gravity);
      expect(merged.atmosphere).toBe(mockLocalData.atmosphere);
    });
  });

  describe("createLoadingState", () => {
    it("should create loading state with local data", () => {
      const loadingState = createLoadingState(mockLocalData);

      expect(loadingState.name).toBe("Earth");
      expect(loadingState.isLoadingAPIData).toBe(true);
      expect(loadingState.apiError).toBe(false);
      expect(loadingState.apiMass).toBeUndefined();
    });
  });

  describe("safeExtractField", () => {
    it("should extract nested fields safely", () => {
      const obj = {
        level1: {
          level2: {
            value: "found",
          },
        },
      };

      expect(safeExtractField(obj, "level1.level2.value", "default")).toBe(
        "found"
      );
      expect(safeExtractField(obj, "level1.missing", "default")).toBe(
        "default"
      );
      expect(safeExtractField(null, "any.path", "default")).toBe("default");
      expect(safeExtractField(undefined, "any.path", "default")).toBe(
        "default"
      );
    });
  });
});
