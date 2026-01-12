import { describe, it, expect, beforeEach } from "vitest";
import fc from "fast-check";
import {
  calculateDaysSinceJ2000,
  daysToDate,
  calculateEclipticLongitude,
  convertLongitudeToRotation,
  getPlanetPosition,
  getAllPlanetPositions,
  isDateInAccurateRange,
  validateDate,
  getSupportedPlanets,
  PLANET_BODY_MAP,
  getCachedEclipticLongitude,
  clearLongitudeCache,
  getCacheSize,
  getCachedPlanetPosition,
} from "@/utils/astronomy-calculations";
import { FULL_CIRCLE_RADIANS } from "@/utils/physics-constants";

describe("Astronomy Calculations", () => {
  /**
   * **Feature: date-mode-simulation, Property 6: Days since J2000 calculation is correct**
   *
   * For any date, the calculated days since J2000 epoch should match the mathematical formula.
   */
  describe("Property 6: Days since J2000 calculation is correct", () => {
    it("should calculate days since J2000 correctly for any valid date", () => {
      fc.assert(
        fc.property(
          fc
            .date({ min: new Date("1700-01-01"), max: new Date("2300-12-31") })
            .filter((d) => !isNaN(d.getTime())),
          (date) => {
            const calculated = calculateDaysSinceJ2000(date);

            // Manual calculation
            const j2000 = new Date("2000-01-01T12:00:00Z");
            const millisDiff = date.getTime() - j2000.getTime();
            const expected = millisDiff / (1000 * 60 * 60 * 24);

            // Should match within floating point precision
            return Math.abs(calculated - expected) < 0.0001;
          },
        ),
        { numRuns: 100 },
      );
    });

    it("should return 0 for J2000 epoch date", () => {
      const j2000 = new Date("2000-01-01T12:00:00Z");
      const days = calculateDaysSinceJ2000(j2000);
      expect(days).toBeCloseTo(0, 5);
    });

    it("should return negative for dates before J2000", () => {
      const beforeJ2000 = new Date("1999-01-01T12:00:00Z");
      const days = calculateDaysSinceJ2000(beforeJ2000);
      expect(days).toBeLessThan(0);
    });

    it("should return positive for dates after J2000", () => {
      const afterJ2000 = new Date("2001-01-01T12:00:00Z");
      const days = calculateDaysSinceJ2000(afterJ2000);
      expect(days).toBeGreaterThan(0);
    });
  });

  /**
   * **Feature: date-mode-simulation, Property 11: Date round-trip consistency**
   *
   * For any date, converting to days since J2000 and back should return the same date.
   */
  describe("Property 11: Date round-trip consistency", () => {
    it("should round-trip dates correctly", () => {
      fc.assert(
        fc.property(
          fc
            .date({ min: new Date("1700-01-01"), max: new Date("2300-12-31") })
            .filter((d) => !isNaN(d.getTime())),
          (date) => {
            const days = calculateDaysSinceJ2000(date);
            const roundTripped = daysToDate(days);

            // Should match within 1 second (millisecond precision)
            const diffMs = Math.abs(date.getTime() - roundTripped.getTime());
            return diffMs < 1000;
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  /**
   * **Feature: date-mode-simulation, Property 7: Ecliptic longitude applied as Y-axis rotation**
   *
   * For any ecliptic longitude value, it should be converted to radians correctly.
   */
  describe("Property 7: Ecliptic longitude applied as Y-axis rotation", () => {
    it("should convert longitude to rotation in radians correctly", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0, max: 360, noNaN: true }),
          (longitude) => {
            const rotation = convertLongitudeToRotation(longitude);
            const expected = (longitude / 360) * FULL_CIRCLE_RADIANS;

            return Math.abs(rotation - expected) < 0.0001;
          },
        ),
        { numRuns: 100 },
      );
    });

    it("should return 0 for 0 degrees", () => {
      const rotation = convertLongitudeToRotation(0);
      expect(rotation).toBe(0);
    });

    it("should return π for 180 degrees", () => {
      const rotation = convertLongitudeToRotation(180);
      expect(rotation).toBeCloseTo(Math.PI, 5);
    });

    it("should return 2π for 360 degrees", () => {
      const rotation = convertLongitudeToRotation(360);
      expect(rotation).toBeCloseTo(FULL_CIRCLE_RADIANS, 5);
    });
  });

  /**
   * **Feature: date-mode-simulation, Property 9: Utility functions are pure**
   *
   * For any input to astronomy utility functions, calling multiple times should return identical results.
   */
  describe("Property 9: Utility functions are pure", () => {
    it("should return consistent results for calculateDaysSinceJ2000", () => {
      fc.assert(
        fc.property(
          fc.date({ min: new Date("1700-01-01"), max: new Date("2300-12-31") }),
          (date) => {
            const result1 = calculateDaysSinceJ2000(date);
            const result2 = calculateDaysSinceJ2000(date);
            return result1 === result2;
          },
        ),
        { numRuns: 100 },
      );
    });

    it("should return consistent results for convertLongitudeToRotation", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0, max: 360, noNaN: true }),
          (longitude) => {
            const result1 = convertLongitudeToRotation(longitude);
            const result2 = convertLongitudeToRotation(longitude);
            return result1 === result2;
          },
        ),
        { numRuns: 100 },
      );
    });

    it("should return consistent results for calculateEclipticLongitude", () => {
      fc.assert(
        fc.property(
          fc.date({ min: new Date("1700-01-01"), max: new Date("2300-12-31") }),
          fc.constantFrom(
            "Mercury",
            "Venus",
            "Earth",
            "Mars",
            "Jupiter",
            "Saturn",
            "Uranus",
            "Neptune",
          ),
          (date, planetName) => {
            const result1 = calculateEclipticLongitude(planetName, date);
            const result2 = calculateEclipticLongitude(planetName, date);
            return result1 === result2;
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  /**
   * Unit tests for astronomy utilities
   */
  describe("Unit tests for astronomy utilities", () => {
    describe("calculateEclipticLongitude", () => {
      it("should return a value between 0 and 360 for all planets", () => {
        const planets = getSupportedPlanets();
        const testDate = new Date("2024-01-01");

        planets.forEach((planet) => {
          const longitude = calculateEclipticLongitude(planet, testDate);
          expect(longitude).toBeGreaterThanOrEqual(0);
          expect(longitude).toBeLessThan(360);
        });
      });

      it("should return 0 for unknown planet", () => {
        const longitude = calculateEclipticLongitude("Pluto", new Date());
        expect(longitude).toBe(0);
      });

      it("should return 0 for invalid date", () => {
        const longitude = calculateEclipticLongitude(
          "Earth",
          new Date("invalid"),
        );
        expect(longitude).toBe(0);
      });

      it("should calculate different longitudes for different dates", () => {
        const date1 = new Date("2024-01-01");
        const date2 = new Date("2024-07-01");

        const longitude1 = calculateEclipticLongitude("Earth", date1);
        const longitude2 = calculateEclipticLongitude("Earth", date2);

        expect(longitude1).not.toBe(longitude2);
      });
    });

    describe("getPlanetPosition", () => {
      it("should return complete position data", () => {
        const date = new Date("2024-01-01");
        const position = getPlanetPosition("Earth", date);

        expect(position).toHaveProperty("planetName", "Earth");
        expect(position).toHaveProperty("longitudeDegrees");
        expect(position).toHaveProperty("rotationRadians");
        expect(position).toHaveProperty("date");
        expect(typeof position.longitudeDegrees).toBe("number");
        expect(typeof position.rotationRadians).toBe("number");
      });

      it("should have consistent longitude and rotation", () => {
        const date = new Date("2024-01-01");
        const position = getPlanetPosition("Mars", date);

        const expectedRotation =
          (position.longitudeDegrees / 360) * FULL_CIRCLE_RADIANS;
        expect(position.rotationRadians).toBeCloseTo(expectedRotation, 5);
      });
    });

    describe("getAllPlanetPositions", () => {
      it("should return positions for all 8 planets", () => {
        const date = new Date("2024-01-01");
        const positions = getAllPlanetPositions(date);

        expect(positions).toHaveLength(8);
        expect(positions.map((p) => p.planetName)).toEqual([
          "Mercury",
          "Venus",
          "Earth",
          "Mars",
          "Jupiter",
          "Saturn",
          "Uranus",
          "Neptune",
        ]);
      });
    });

    describe("isDateInAccurateRange", () => {
      it("should return true for dates between 1700 and 2300", () => {
        expect(isDateInAccurateRange(new Date("1700-01-01"))).toBe(true);
        expect(isDateInAccurateRange(new Date("2000-01-01"))).toBe(true);
        expect(isDateInAccurateRange(new Date("2300-12-31"))).toBe(true);
      });

      it("should return false for dates before 1700", () => {
        expect(isDateInAccurateRange(new Date("1699-12-31"))).toBe(false);
        expect(isDateInAccurateRange(new Date("1600-01-01"))).toBe(false);
      });

      it("should return false for dates after 2300", () => {
        expect(isDateInAccurateRange(new Date("2301-01-01"))).toBe(false);
        expect(isDateInAccurateRange(new Date("3000-01-01"))).toBe(false);
      });

      it("should return false for invalid dates", () => {
        expect(isDateInAccurateRange(new Date("invalid"))).toBe(false);
      });
    });

    describe("validateDate", () => {
      it("should return valid for dates in range", () => {
        const result = validateDate(new Date("2024-01-01"));
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it("should return error for dates before 1700", () => {
        const result = validateDate(new Date("1699-01-01"));
        expect(result.valid).toBe(false);
        expect(result.error).toContain("1700");
      });

      it("should return error for dates after 2300", () => {
        const result = validateDate(new Date("2301-01-01"));
        expect(result.valid).toBe(false);
        expect(result.error).toContain("2300");
      });

      it("should return error for invalid dates", () => {
        const result = validateDate(new Date("invalid"));
        expect(result.valid).toBe(false);
        expect(result.error).toContain("Invalid");
      });
    });

    describe("getSupportedPlanets", () => {
      it("should return all 8 planets", () => {
        const planets = getSupportedPlanets();
        expect(planets).toHaveLength(8);
        expect(planets).toContain("Mercury");
        expect(planets).toContain("Venus");
        expect(planets).toContain("Earth");
        expect(planets).toContain("Mars");
        expect(planets).toContain("Jupiter");
        expect(planets).toContain("Saturn");
        expect(planets).toContain("Uranus");
        expect(planets).toContain("Neptune");
      });
    });

    describe("PLANET_BODY_MAP", () => {
      it("should have entries for all 8 planets", () => {
        expect(Object.keys(PLANET_BODY_MAP)).toHaveLength(8);
      });
    });
  });
});

describe("Caching functionality", () => {
  // Clear cache before each test in this describe block
  beforeEach(() => {
    clearLongitudeCache();
  });

  describe("getCachedEclipticLongitude", () => {
    it("should return same value as non-cached version", () => {
      const date = new Date("2024-06-15");
      const cached = getCachedEclipticLongitude("Earth", date);
      const nonCached = calculateEclipticLongitude("Earth", date);

      expect(cached).toBe(nonCached);
    });

    it("should cache calculations", () => {
      const date = new Date("2024-06-15");

      // First call - should calculate
      getCachedEclipticLongitude("Earth", date);
      expect(getCacheSize()).toBe(1);

      // Second call - should use cache
      getCachedEclipticLongitude("Earth", date);
      expect(getCacheSize()).toBe(1); // Still 1, not 2
    });

    it("should cache different planets separately", () => {
      const date = new Date("2024-06-15");

      getCachedEclipticLongitude("Earth", date);
      getCachedEclipticLongitude("Mars", date);

      expect(getCacheSize()).toBe(2);
    });

    it("should cache different dates separately", () => {
      const date1 = new Date("2024-06-15");
      const date2 = new Date("2024-06-16");

      getCachedEclipticLongitude("Earth", date1);
      getCachedEclipticLongitude("Earth", date2);

      expect(getCacheSize()).toBe(2);
    });
  });

  describe("clearLongitudeCache", () => {
    it("should clear all cached values", () => {
      const date = new Date("2024-06-15");

      getCachedEclipticLongitude("Earth", date);
      getCachedEclipticLongitude("Mars", date);
      expect(getCacheSize()).toBe(2);

      clearLongitudeCache();
      expect(getCacheSize()).toBe(0);
    });
  });

  describe("getCachedPlanetPosition", () => {
    it("should return complete position data", () => {
      const date = new Date("2024-06-15");
      const position = getCachedPlanetPosition("Earth", date);

      expect(position).toHaveProperty("planetName", "Earth");
      expect(position).toHaveProperty("longitudeDegrees");
      expect(position).toHaveProperty("rotationRadians");
      expect(position).toHaveProperty("date");
    });

    it("should use caching internally", () => {
      const date = new Date("2024-06-15");

      getCachedPlanetPosition("Earth", date);
      expect(getCacheSize()).toBe(1);

      getCachedPlanetPosition("Earth", date);
      expect(getCacheSize()).toBe(1); // Still cached
    });

    it("should return default position for invalid date", () => {
      const invalidDate = new Date("invalid");
      const position = getCachedPlanetPosition("Earth", invalidDate);

      expect(position.planetName).toBe("Earth");
      expect(position.longitudeDegrees).toBe(0);
      expect(position.rotationRadians).toBe(0);
      expect(position.date).toBeDefined();
      // Should not add invalid date to cache
      expect(getCacheSize()).toBe(0);
    });
  });
});
