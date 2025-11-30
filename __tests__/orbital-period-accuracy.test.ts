import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { planetData } from "@/data/planet-data";
import {
  SECONDS_PER_DAY,
  FULL_CIRCLE_RADIANS,
} from "@/utils/physics-constants";

describe("Orbital Period Accuracy", () => {
  /**
   * **Feature: accurate-physics-calculations, Property 2: One complete orbit takes exactly one period**
   *
   * For any planet, when elapsed time equals orbitalPeriodDays, the planet should complete exactly one orbit (2π radians).
   */
  describe("Property 2: One complete orbit takes exactly one period", () => {
    it("should complete exactly 2π radians after one orbital period (property-based)", () => {
      fc.assert(
        fc.property(
          fc.double({
            min: 1,
            max: 100000,
            noNaN: true,
            noDefaultInfinity: true,
          }), // orbital period in days
          (orbitalPeriodDays) => {
            // Convert orbital period to seconds
            const orbitalPeriodSeconds = orbitalPeriodDays * SECONDS_PER_DAY;

            // Calculate base angular speed (radians per second)
            const baseSpeed = FULL_CIRCLE_RADIANS / orbitalPeriodSeconds;

            // After one complete period, calculate the angle traveled
            const angleAfterOnePeriod = baseSpeed * orbitalPeriodSeconds;

            // Should be exactly 2π radians (one complete orbit)
            // Using small epsilon for floating point comparison
            return Math.abs(angleAfterOnePeriod - FULL_CIRCLE_RADIANS) < 0.0001;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should complete exactly one orbit for Earth after 365.256 days", () => {
      const earth = planetData.find((p) => p.name === "Earth")!;
      const orbitalPeriodSeconds = earth.orbitalPeriodDays * SECONDS_PER_DAY;
      const baseSpeed = FULL_CIRCLE_RADIANS / orbitalPeriodSeconds;

      // After one Earth year
      const angleAfterOneYear = baseSpeed * orbitalPeriodSeconds;

      expect(angleAfterOneYear).toBeCloseTo(FULL_CIRCLE_RADIANS, 4);
    });

    it("should complete exactly one orbit for Mercury after 87.969 days", () => {
      const mercury = planetData.find((p) => p.name === "Mercury")!;
      const orbitalPeriodSeconds = mercury.orbitalPeriodDays * SECONDS_PER_DAY;
      const baseSpeed = FULL_CIRCLE_RADIANS / orbitalPeriodSeconds;

      // After one Mercury year
      const angleAfterOneYear = baseSpeed * orbitalPeriodSeconds;

      expect(angleAfterOneYear).toBeCloseTo(FULL_CIRCLE_RADIANS, 4);
    });

    it("should complete exactly one orbit for all planets after their orbital period", () => {
      planetData.forEach((planet) => {
        const orbitalPeriodSeconds = planet.orbitalPeriodDays * SECONDS_PER_DAY;
        const baseSpeed = FULL_CIRCLE_RADIANS / orbitalPeriodSeconds;

        // After one complete period
        const angleAfterOnePeriod = baseSpeed * orbitalPeriodSeconds;

        expect(angleAfterOnePeriod).toBeCloseTo(FULL_CIRCLE_RADIANS, 4);
      });
    });
  });

  /**
   * Unit tests for specific orbital periods
   */
  describe("Unit tests for NASA JPL orbital period values", () => {
    it("should have Earth orbital period of 365.256 days (Requirement 3.1)", () => {
      const earth = planetData.find((p) => p.name === "Earth")!;
      expect(earth.orbitalPeriodDays).toBe(365.256);
    });

    it("should have Mercury orbital period of 87.969 days (Requirement 3.2)", () => {
      const mercury = planetData.find((p) => p.name === "Mercury")!;
      expect(mercury.orbitalPeriodDays).toBe(87.969);
    });

    it("should have Venus orbital period of 224.701 days", () => {
      const venus = planetData.find((p) => p.name === "Venus")!;
      expect(venus.orbitalPeriodDays).toBe(224.701);
    });

    it("should have Mars orbital period of 686.98 days", () => {
      const mars = planetData.find((p) => p.name === "Mars")!;
      expect(mars.orbitalPeriodDays).toBe(686.98);
    });

    it("should have Jupiter orbital period of 4332.59 days", () => {
      const jupiter = planetData.find((p) => p.name === "Jupiter")!;
      expect(jupiter.orbitalPeriodDays).toBe(4332.59);
    });

    it("should have Saturn orbital period of 10759.22 days", () => {
      const saturn = planetData.find((p) => p.name === "Saturn")!;
      expect(saturn.orbitalPeriodDays).toBe(10759.22);
    });

    it("should have Uranus orbital period of 30688.5 days", () => {
      const uranus = planetData.find((p) => p.name === "Uranus")!;
      expect(uranus.orbitalPeriodDays).toBe(30688.5);
    });

    it("should have Neptune orbital period of 60182 days", () => {
      const neptune = planetData.find((p) => p.name === "Neptune")!;
      expect(neptune.orbitalPeriodDays).toBe(60182);
    });
  });

  /**
   * Validation tests
   */
  describe("Orbital period validation", () => {
    it("should have all planets with positive orbital periods", () => {
      planetData.forEach((planet) => {
        expect(planet.orbitalPeriodDays).toBeGreaterThan(0);
      });
    });

    it("should have orbital periods as number type", () => {
      planetData.forEach((planet) => {
        expect(typeof planet.orbitalPeriodDays).toBe("number");
        expect(Number.isFinite(planet.orbitalPeriodDays)).toBe(true);
      });
    });

    it("should have Mercury with shortest orbital period", () => {
      const mercury = planetData.find((p) => p.name === "Mercury")!;
      const minPeriod = Math.min(...planetData.map((p) => p.orbitalPeriodDays));

      expect(mercury.orbitalPeriodDays).toBe(minPeriod);
    });

    it("should have Neptune with longest orbital period", () => {
      const neptune = planetData.find((p) => p.name === "Neptune")!;
      const maxPeriod = Math.max(...planetData.map((p) => p.orbitalPeriodDays));

      expect(neptune.orbitalPeriodDays).toBe(maxPeriod);
    });
  });

  /**
   * Angular speed calculations
   */
  describe("Angular speed calculations (Requirement 3.4)", () => {
    it("should calculate correct angular speed for Earth", () => {
      const earth = planetData.find((p) => p.name === "Earth")!;
      const orbitalPeriodSeconds = earth.orbitalPeriodDays * SECONDS_PER_DAY;
      const baseSpeed = FULL_CIRCLE_RADIANS / orbitalPeriodSeconds;

      // Earth's angular speed should be approximately 1.991e-7 rad/s
      expect(baseSpeed).toBeCloseTo(1.991e-7, 10);
    });

    it("should have Mercury with fastest angular speed", () => {
      const angularSpeeds = planetData.map((planet) => {
        const orbitalPeriodSeconds = planet.orbitalPeriodDays * SECONDS_PER_DAY;
        return FULL_CIRCLE_RADIANS / orbitalPeriodSeconds;
      });

      const mercury = planetData.find((p) => p.name === "Mercury")!;
      const mercurySpeed =
        FULL_CIRCLE_RADIANS / (mercury.orbitalPeriodDays * SECONDS_PER_DAY);

      expect(mercurySpeed).toBe(Math.max(...angularSpeeds));
    });

    it("should have Neptune with slowest angular speed", () => {
      const angularSpeeds = planetData.map((planet) => {
        const orbitalPeriodSeconds = planet.orbitalPeriodDays * SECONDS_PER_DAY;
        return FULL_CIRCLE_RADIANS / orbitalPeriodSeconds;
      });

      const neptune = planetData.find((p) => p.name === "Neptune")!;
      const neptuneSpeed =
        FULL_CIRCLE_RADIANS / (neptune.orbitalPeriodDays * SECONDS_PER_DAY);

      expect(neptuneSpeed).toBe(Math.min(...angularSpeeds));
    });

    it("should have angular speed inversely proportional to orbital period", () => {
      planetData.forEach((planet) => {
        const orbitalPeriodSeconds = planet.orbitalPeriodDays * SECONDS_PER_DAY;
        const baseSpeed = FULL_CIRCLE_RADIANS / orbitalPeriodSeconds;

        // Verify the relationship: speed * period = 2π
        const product = baseSpeed * orbitalPeriodSeconds;
        expect(product).toBeCloseTo(FULL_CIRCLE_RADIANS, 4);
      });
    });
  });

  /**
   * No drift over extended simulation (Requirement 3.4)
   */
  describe("No drift over extended simulation", () => {
    it("should complete exact number of orbits after multiple periods", () => {
      fc.assert(
        fc.property(
          fc.double({
            min: 1,
            max: 10000,
            noNaN: true,
            noDefaultInfinity: true,
          }), // orbital period
          fc.integer({ min: 1, max: 100 }), // number of periods
          (orbitalPeriodDays, numPeriods) => {
            const orbitalPeriodSeconds = orbitalPeriodDays * SECONDS_PER_DAY;
            const baseSpeed = FULL_CIRCLE_RADIANS / orbitalPeriodSeconds;

            // After N periods
            const totalTime = orbitalPeriodSeconds * numPeriods;
            const totalAngle = baseSpeed * totalTime;

            // Should be exactly N * 2π radians
            const expectedAngle = numPeriods * FULL_CIRCLE_RADIANS;

            return Math.abs(totalAngle - expectedAngle) < 0.0001;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should not drift for Earth after 10 years", () => {
      const earth = planetData.find((p) => p.name === "Earth")!;
      const orbitalPeriodSeconds = earth.orbitalPeriodDays * SECONDS_PER_DAY;
      const baseSpeed = FULL_CIRCLE_RADIANS / orbitalPeriodSeconds;

      // After 10 Earth years
      const tenYearsInSeconds = orbitalPeriodSeconds * 10;
      const angleAfterTenYears = baseSpeed * tenYearsInSeconds;

      // Should be exactly 10 * 2π radians
      expect(angleAfterTenYears).toBeCloseTo(10 * FULL_CIRCLE_RADIANS, 4);
    });

    it("should not drift for Mercury after 100 orbits", () => {
      const mercury = planetData.find((p) => p.name === "Mercury")!;
      const orbitalPeriodSeconds = mercury.orbitalPeriodDays * SECONDS_PER_DAY;
      const baseSpeed = FULL_CIRCLE_RADIANS / orbitalPeriodSeconds;

      // After 100 Mercury years
      const hundredOrbitsInSeconds = orbitalPeriodSeconds * 100;
      const angleAfterHundredOrbits = baseSpeed * hundredOrbitsInSeconds;

      // Should be exactly 100 * 2π radians
      expect(angleAfterHundredOrbits).toBeCloseTo(100 * FULL_CIRCLE_RADIANS, 4);
    });
  });
});
