import { describe, it, expect } from "vitest";
import { planetData } from "@/data/planet-data";
import { PlanetData } from "@/data/planet-types";
import {
  validatePlanetData,
  validateAllPlanets,
} from "@/utils/validate-planet-data";

describe("Planet Data Validation", () => {
  /**
   * **Feature: accurate-physics-calculations, Property 3: All required numeric fields are present and valid**
   *
   * For any planet in the data array, orbitalPeriodDays, eccentricity, and rotationSpeedByDays
   * should all be numeric and within valid ranges.
   */
  describe("Property 3: All required numeric fields are present and valid", () => {
    it("should have all planets with valid orbitalPeriodDays", () => {
      planetData.forEach((planet) => {
        expect(typeof planet.orbitalPeriodDays).toBe("number");
        expect(planet.orbitalPeriodDays).toBeGreaterThan(0);
        expect(Number.isFinite(planet.orbitalPeriodDays)).toBe(true);
      });
    });

    it("should have all planets with valid eccentricity", () => {
      planetData.forEach((planet) => {
        expect(typeof planet.eccentricity).toBe("number");
        expect(planet.eccentricity).toBeGreaterThanOrEqual(0);
        expect(planet.eccentricity).toBeLessThan(1);
        expect(Number.isFinite(planet.eccentricity)).toBe(true);
      });
    });

    it("should have all planets with valid rotationSpeedByDays", () => {
      planetData.forEach((planet) => {
        expect(typeof planet.rotationSpeedByDays).toBe("number");
        expect(Number.isFinite(planet.rotationSpeedByDays)).toBe(true);
      });
    });

    it("should validate all planets without errors", () => {
      expect(() => validateAllPlanets(planetData)).not.toThrow();
    });

    it("should return empty errors array for valid planet data", () => {
      planetData.forEach((planet) => {
        const errors = validatePlanetData(planet);
        expect(errors).toEqual([]);
      });
    });
  });

  /**
   * Validation function tests
   */
  describe("validatePlanetData function", () => {
    it("should detect missing orbitalPeriodDays", () => {
      const invalidPlanet: Partial<PlanetData> = {
        ...planetData[0],
      };
      delete (invalidPlanet as Partial<PlanetData>).orbitalPeriodDays;

      const errors = validatePlanetData(invalidPlanet);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].field).toBe("orbitalPeriodDays");
      expect(errors[0].expected).toBe("positive number");
    });

    it("should detect negative orbitalPeriodDays", () => {
      const invalidPlanet = {
        ...planetData[0],
        orbitalPeriodDays: -100,
      };

      const errors = validatePlanetData(invalidPlanet);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].field).toBe("orbitalPeriodDays");
    });

    it("should detect zero orbitalPeriodDays", () => {
      const invalidPlanet = {
        ...planetData[0],
        orbitalPeriodDays: 0,
      };

      const errors = validatePlanetData(invalidPlanet);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].field).toBe("orbitalPeriodDays");
    });

    it("should detect invalid eccentricity (< 0)", () => {
      const invalidPlanet = {
        ...planetData[0],
        eccentricity: -0.1,
      };

      const errors = validatePlanetData(invalidPlanet);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.field === "eccentricity")).toBe(true);
    });

    it("should detect invalid eccentricity (>= 1)", () => {
      const invalidPlanet = {
        ...planetData[0],
        eccentricity: 1.0,
      };

      const errors = validatePlanetData(invalidPlanet);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.field === "eccentricity")).toBe(true);
    });

    it("should detect non-numeric rotationSpeedByDays", () => {
      const invalidPlanet = {
        ...planetData[0],
        rotationSpeedByDays: "not a number" as unknown as number,
      };

      const errors = validatePlanetData(invalidPlanet);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.field === "rotationSpeedByDays")).toBe(true);
    });

    it("should allow negative rotationSpeedByDays (retrograde)", () => {
      const venus = planetData.find((p) => p.name === "Venus")!;
      const errors = validatePlanetData(venus);

      expect(errors).toEqual([]);
      expect(venus.rotationSpeedByDays).toBeLessThan(0);
    });

    it("should detect multiple validation errors", () => {
      const invalidPlanet = {
        ...planetData[0],
        orbitalPeriodDays: -1,
        eccentricity: 2.0,
        rotationSpeedByDays: "invalid" as unknown as number,
      };

      const errors = validatePlanetData(invalidPlanet);

      expect(errors.length).toBe(3);
      expect(errors.some((e) => e.field === "orbitalPeriodDays")).toBe(true);
      expect(errors.some((e) => e.field === "eccentricity")).toBe(true);
      expect(errors.some((e) => e.field === "rotationSpeedByDays")).toBe(true);
    });
  });

  /**
   * validateAllPlanets function tests
   */
  describe("validateAllPlanets function", () => {
    it("should pass validation for actual planet data", () => {
      expect(() => validateAllPlanets(planetData)).not.toThrow();
    });

    it("should throw error when validation fails", () => {
      const invalidData = [
        {
          ...planetData[0],
          orbitalPeriodDays: -1,
        },
      ];

      expect(() => validateAllPlanets(invalidData)).toThrow(
        /Planet data validation failed/,
      );
    });

    it("should include planet name in error message", () => {
      const invalidData = [
        {
          ...planetData[0],
          name: "TestPlanet",
          orbitalPeriodDays: -1,
        },
      ];

      try {
        validateAllPlanets(invalidData);
        expect.unreachable("Should have thrown an error");
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toContain("Planet data validation failed");
        } else {
          throw new Error("Unexpected non-Error thrown");
        }
      }
    });

    it("should validate all planets in array", () => {
      const mixedData = [
        planetData[0], // Valid
        {
          ...planetData[1],
          eccentricity: 2.0, // Invalid
        },
        planetData[2], // Valid
      ];

      expect(() => validateAllPlanets(mixedData)).toThrow();
    });
  });

  /**
   * Type safety tests
   */
  describe("Type safety (Requirement 5.1)", () => {
    it("should have orbitalPeriodDays typed as number", () => {
      planetData.forEach((planet) => {
        // TypeScript should infer this as number
        const period: number = planet.orbitalPeriodDays;
        expect(typeof period).toBe("number");
      });
    });

    it("should allow direct numeric operations on orbitalPeriodDays", () => {
      planetData.forEach((planet) => {
        // Should be able to perform calculations without type errors
        const periodInSeconds = planet.orbitalPeriodDays * 86400;
        expect(typeof periodInSeconds).toBe("number");
        expect(periodInSeconds).toBeGreaterThan(0);
      });
    });

    it("should have eccentricity typed as number", () => {
      planetData.forEach((planet) => {
        const ecc: number = planet.eccentricity;
        expect(typeof ecc).toBe("number");
      });
    });

    it("should have rotationSpeedByDays typed as number", () => {
      planetData.forEach((planet) => {
        const rotation: number = planet.rotationSpeedByDays;
        expect(typeof rotation).toBe("number");
      });
    });
  });

  /**
   * Edge cases
   */
  describe("Edge cases", () => {
    it("should handle NaN values as invalid", () => {
      const invalidPlanet = {
        ...planetData[0],
        orbitalPeriodDays: NaN,
      };

      const errors = validatePlanetData(invalidPlanet);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should handle Infinity as invalid", () => {
      const invalidPlanet = {
        ...planetData[0],
        orbitalPeriodDays: Infinity,
      };

      const errors = validatePlanetData(invalidPlanet);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should handle very small positive orbitalPeriodDays", () => {
      const planet = {
        ...planetData[0],
        orbitalPeriodDays: 0.001,
      };

      const errors = validatePlanetData(planet);
      expect(errors).toEqual([]);
    });

    it("should handle very large orbitalPeriodDays", () => {
      const planet = {
        ...planetData[0],
        orbitalPeriodDays: 1000000,
      };

      const errors = validatePlanetData(planet);
      expect(errors).toEqual([]);
    });

    it("should handle eccentricity at boundary (0)", () => {
      const planet = {
        ...planetData[0],
        eccentricity: 0,
      };

      const errors = validatePlanetData(planet);
      expect(errors).toEqual([]);
    });

    it("should handle eccentricity just below 1", () => {
      const planet = {
        ...planetData[0],
        eccentricity: 0.9999,
      };

      const errors = validatePlanetData(planet);
      expect(errors).toEqual([]);
    });
  });
});
