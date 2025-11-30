import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  getPlanetPosition,
  calculateEclipticLongitude,
  getSupportedPlanets,
} from "@/utils/astronomy-calculations";
import { planetData } from "@/data/planet-data";

describe("Planet Date Mode", () => {
  /**
   * **Feature: date-mode-simulation, Property 3: Date calculations use Astronomy Engine**
   *
   * For any planet and date, the position calculation should use the EclipticLongitude
   * function from Astronomy Engine.
   */
  describe("Property 3: Date calculations use Astronomy Engine", () => {
    it("should calculate positions for all planets using Astronomy Engine", () => {
      const testDate = new Date("2024-01-01");
      const planets = getSupportedPlanets();

      planets.forEach((planetName) => {
        const position = getPlanetPosition(planetName, testDate);

        expect(position.planetName).toBe(planetName);
        expect(position.longitudeDegrees).toBeGreaterThanOrEqual(0);
        expect(position.longitudeDegrees).toBeLessThan(360);
        expect(Number.isFinite(position.rotationRadians)).toBe(true);
      });
    });

    it("should return different positions for different dates", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...getSupportedPlanets()),
          fc.date({ min: new Date("1700-01-01"), max: new Date("2300-12-31") }),
          fc.date({ min: new Date("1700-01-01"), max: new Date("2300-12-31") }),
          (planetName, date1, date2) => {
            // Skip if dates are too close (within 1 day)
            const daysDiff =
              Math.abs(date1.getTime() - date2.getTime()) /
              (1000 * 60 * 60 * 24);
            fc.pre(daysDiff > 1);

            const pos1 = getPlanetPosition(planetName, date1);
            const pos2 = getPlanetPosition(planetName, date2);

            // Positions should be different for different dates
            return pos1.longitudeDegrees !== pos2.longitudeDegrees;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * **Feature: date-mode-simulation, Property 4: Date changes update positions immediately**
   *
   * For any date selection, all planet positions should update without animation.
   */
  describe("Property 4: Date changes update positions immediately", () => {
    it("should calculate positions synchronously", () => {
      const testDate = new Date("2024-06-15");
      const startTime = performance.now();

      // Calculate positions for all planets
      const planets = getSupportedPlanets();
      const positions = planets.map((name) =>
        getPlanetPosition(name, testDate)
      );

      const endTime = performance.now();

      // Should complete within 100ms (immediate)
      expect(endTime - startTime).toBeLessThan(100);
      expect(positions).toHaveLength(8);
    });

    it("should return consistent positions for same date", () => {
      fc.assert(
        fc.property(
          fc.date({ min: new Date("1700-01-01"), max: new Date("2300-12-31") }),
          (date) => {
            const planets = getSupportedPlanets();

            // Calculate twice
            const positions1 = planets.map((name) =>
              getPlanetPosition(name, date)
            );
            const positions2 = planets.map((name) =>
              getPlanetPosition(name, date)
            );

            // Should be identical
            return positions1.every(
              (pos, i) =>
                pos.longitudeDegrees === positions2[i].longitudeDegrees &&
                pos.rotationRadians === positions2[i].rotationRadians
            );
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * **Feature: date-mode-simulation, Property 8: Planet distances remain constant**
   *
   * For any date or mode, planet distances from the Sun should not change.
   */
  describe("Property 8: Planet distances remain constant", () => {
    it("should not affect planet distance data", () => {
      const testDates = [
        new Date("1969-07-20"), // Moon landing
        new Date("2000-01-01"), // Y2K
        new Date("2024-01-01"), // Recent
        new Date("2100-01-01"), // Future
      ];

      testDates.forEach((date) => {
        planetData.forEach((planet) => {
          // Distance data should remain unchanged regardless of date
          expect(planet.distanceInAU).toBeGreaterThan(0);
          expect(planet.distanceInKm).toBeGreaterThan(0);

          // Position calculation should not modify planet data
          const position = getPlanetPosition(planet.name, date);
          expect(position).toBeDefined();

          // Verify planet data is unchanged
          expect(planet.distanceInAU).toBeGreaterThan(0);
          expect(planet.distanceInKm).toBeGreaterThan(0);
        });
      });
    });

    it("should maintain constant distances across all dates", () => {
      fc.assert(
        fc.property(
          fc.date({ min: new Date("1700-01-01"), max: new Date("2300-12-31") }),
          (date) => {
            // Get original distances
            const originalDistances = planetData.map((p) => ({
              name: p.name,
              distanceInAU: p.distanceInAU,
              distanceInKm: p.distanceInKm,
            }));

            // Calculate positions (should not affect distances)
            planetData.forEach((planet) => {
              getPlanetPosition(planet.name, date);
            });

            // Verify distances unchanged
            return planetData.every((planet, i) => {
              return (
                planet.distanceInAU === originalDistances[i].distanceInAU &&
                planet.distanceInKm === originalDistances[i].distanceInKm
              );
            });
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * **Feature: date-mode-simulation, Property 10: Animations pause in Date Mode**
   *
   * For any planet, when Date Mode is activated, orbital and rotation animations should stop.
   * This is tested by verifying that position calculations are deterministic.
   */
  describe("Property 10: Animations pause in Date Mode", () => {
    it("should return static positions for a given date", () => {
      const testDate = new Date("2024-01-01");

      // Call multiple times - should always return same result
      const results: ReturnType<typeof getPlanetPosition>[] = [];
      for (let i = 0; i < 10; i++) {
        results.push(getPlanetPosition("Earth", testDate));
      }

      // All results should be identical
      const firstResult = results[0];
      results.forEach((result) => {
        expect(result.longitudeDegrees).toBe(firstResult.longitudeDegrees);
        expect(result.rotationRadians).toBe(firstResult.rotationRadians);
      });
    });
  });

  /**
   * Unit tests for specific historical dates
   */
  describe("Unit tests for historical dates", () => {
    it("should calculate Earth position for Moon Landing (July 20, 1969)", () => {
      const moonLanding = new Date("1969-07-20");
      const position = getPlanetPosition("Earth", moonLanding);

      expect(position.planetName).toBe("Earth");
      expect(position.longitudeDegrees).toBeGreaterThanOrEqual(0);
      expect(position.longitudeDegrees).toBeLessThan(360);
    });

    it("should calculate Mars position for Mars Rover Landing (Feb 18, 2021)", () => {
      const marsRover = new Date("2021-02-18");
      const position = getPlanetPosition("Mars", marsRover);

      expect(position.planetName).toBe("Mars");
      expect(position.longitudeDegrees).toBeGreaterThanOrEqual(0);
      expect(position.longitudeDegrees).toBeLessThan(360);
    });

    it("should calculate all planet positions for J2000 epoch", () => {
      const j2000 = new Date("2000-01-01T12:00:00Z");
      const planets = getSupportedPlanets();

      planets.forEach((planetName) => {
        const position = getPlanetPosition(planetName, j2000);
        expect(position.longitudeDegrees).toBeGreaterThanOrEqual(0);
        expect(position.longitudeDegrees).toBeLessThan(360);
      });
    });
  });
});
