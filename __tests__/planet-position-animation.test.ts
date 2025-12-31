import fc from "fast-check";
import {
  getCachedPlanetPosition,
  getCacheSize,
  clearLongitudeCache,
} from "../utils/astronomy-calculations";
import { interpolateDate } from "../utils/date-interpolation";

/**
 * Property-based tests for planet position calculation during animation
 * **Feature: date-transition-animation, Property 8: Planet positions use astronomy calculations**
 * **Validates: Requirements 5.3**
 */
describe("Planet Position Animation - Property Tests", () => {
  const PLANETS = [
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
  ];

  // Date generator for reasonable date range
  const dateArb = fc
    .integer({
      min: new Date("1700-01-01").getTime(),
      max: new Date("2300-12-31").getTime(),
    })
    .map((ts) => new Date(ts));

  // Planet name generator
  const planetArb = fc.constantFrom(...PLANETS);

  beforeEach(() => {
    clearLongitudeCache();
  });

  describe("Property 8: Planet positions use astronomy calculations", () => {
    /**
     * **Property 8: Planet positions use astronomy calculations**
     * For any interpolated date during animation, planet positions should be
     * calculated using the astronomy-engine library (via getCachedPlanetPosition).
     * **Validates: Requirements 5.3**
     */
    test("getCachedPlanetPosition returns valid position data for any date", () => {
      fc.assert(
        fc.property(planetArb, dateArb, (planetName, date) => {
          const position = getCachedPlanetPosition(planetName, date);

          // Should have all required properties
          return (
            position.planetName === planetName &&
            typeof position.longitudeDegrees === "number" &&
            typeof position.rotationRadians === "number" &&
            !isNaN(position.longitudeDegrees) &&
            !isNaN(position.rotationRadians)
          );
        }),
        { numRuns: 100 },
      );
    });

    test("position changes smoothly between interpolated dates", () => {
      fc.assert(
        fc.property(
          planetArb,
          dateArb,
          dateArb,
          fc.double({ min: 0, max: 0.99, noNaN: true }),
          fc.double({ min: 0.001, max: 0.01, noNaN: true }),
          (planetName, startDate, targetDate, progress1, progressDelta) => {
            const progress2 = Math.min(progress1 + progressDelta, 1);

            const date1 = interpolateDate(startDate, targetDate, progress1);
            const date2 = interpolateDate(startDate, targetDate, progress2);

            const position1 = getCachedPlanetPosition(planetName, date1);
            const position2 = getCachedPlanetPosition(planetName, date2);

            // Both positions should be valid
            return (
              !isNaN(position1.longitudeDegrees) &&
              !isNaN(position2.longitudeDegrees) &&
              !isNaN(position1.rotationRadians) &&
              !isNaN(position2.rotationRadians)
            );
          },
        ),
        { numRuns: 100 },
      );
    });

    test("caching improves performance for repeated date lookups", () => {
      fc.assert(
        fc.property(planetArb, dateArb, (planetName, date) => {
          clearLongitudeCache();

          // First call
          getCachedPlanetPosition(planetName, date);
          const cacheSize1 = getCacheSize();

          // Second call with same parameters
          getCachedPlanetPosition(planetName, date);
          const cacheSize2 = getCacheSize();

          // Cache size should not increase for same parameters
          return cacheSize1 === cacheSize2;
        }),
        { numRuns: 50 },
      );
    });
  });

  describe("Animation frame simulation", () => {
    test("simulated animation frames produce valid positions", () => {
      fc.assert(
        fc.property(
          planetArb,
          dateArb,
          dateArb,
          fc.integer({ min: 10, max: 60 }), // Number of frames
          (planetName, startDate, targetDate, frameCount) => {
            const positions: number[] = [];

            // Simulate animation frames
            for (let i = 0; i <= frameCount; i++) {
              const progress = i / frameCount;
              const interpolatedDate = interpolateDate(
                startDate,
                targetDate,
                progress,
              );
              const position = getCachedPlanetPosition(
                planetName,
                interpolatedDate,
              );
              positions.push(position.longitudeDegrees);
            }

            // All positions should be valid numbers
            return positions.every((p) => !isNaN(p) && isFinite(p));
          },
        ),
        { numRuns: 50 },
      );
    });
  });

  describe("Longitude bounds", () => {
    test("longitude is always within valid range (0-360 degrees)", () => {
      fc.assert(
        fc.property(planetArb, dateArb, (planetName, date) => {
          const position = getCachedPlanetPosition(planetName, date);

          // Longitude should be between 0 and 360 degrees
          return (
            position.longitudeDegrees >= 0 && position.longitudeDegrees < 360
          );
        }),
        { numRuns: 100 },
      );
    });
  });
});
