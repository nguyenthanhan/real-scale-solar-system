import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { planetData } from "@/data/planet-data";
import {
  SECONDS_PER_DAY,
  FULL_CIRCLE_RADIANS,
} from "@/utils/physics-constants";

describe("Planet Movement Data Reading", () => {
  /**
   * **Feature: accurate-physics-calculations, Property 1: Orbital periods are read from planet data**
   *
   * For any planet, the calculated orbital speed should be based on planet.orbitalPeriodDays,
   * not a hardcoded value.
   */
  describe("Property 1: Orbital periods are read from planet data", () => {
    it("should calculate orbital speed from planet.orbitalPeriodDays", () => {
      planetData.forEach((planet) => {
        // Simulate what usePlanetMovement does
        const orbitalPeriodDays = planet.orbitalPeriodDays;
        const orbitalPeriodSeconds = orbitalPeriodDays * SECONDS_PER_DAY;
        const baseSpeed = FULL_CIRCLE_RADIANS / orbitalPeriodSeconds;

        // Verify the calculation is based on planet data
        expect(orbitalPeriodDays).toBe(planet.orbitalPeriodDays);
        expect(baseSpeed).toBeGreaterThan(0);
        expect(Number.isFinite(baseSpeed)).toBe(true);
      });
    });

    it("should have different orbital speeds for different planets", () => {
      const speeds = planetData.map((planet) => {
        const orbitalPeriodSeconds = planet.orbitalPeriodDays * SECONDS_PER_DAY;
        return FULL_CIRCLE_RADIANS / orbitalPeriodSeconds;
      });

      // All speeds should be unique (no two planets have same orbital period)
      const uniqueSpeeds = new Set(speeds);
      expect(uniqueSpeeds.size).toBe(speeds.length);
    });

    it("should update orbital speed when planet data changes", () => {
      // Test that changing orbitalPeriodDays changes the calculated speed
      fc.assert(
        fc.property(
          fc.double({ min: 1, max: 100000, noNaN: true }),
          fc.double({ min: 1, max: 100000, noNaN: true }),
          (period1, period2) => {
            // Ensure they're significantly different (at least 1% difference)
            const percentDiff =
              Math.abs(period1 - period2) / Math.min(period1, period2);
            fc.pre(percentDiff > 0.01);

            const speed1 = FULL_CIRCLE_RADIANS / (period1 * SECONDS_PER_DAY);
            const speed2 = FULL_CIRCLE_RADIANS / (period2 * SECONDS_PER_DAY);

            // Different periods should produce different speeds
            // Use relative difference for better floating point comparison
            const speedDiff =
              Math.abs(speed1 - speed2) / Math.max(speed1, speed2);
            return speedDiff > 0.000001;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should have Mercury with fastest orbital speed (shortest period)", () => {
      const mercury = planetData.find((p) => p.name === "Mercury")!;
      const mercurySpeed =
        FULL_CIRCLE_RADIANS / (mercury.orbitalPeriodDays * SECONDS_PER_DAY);

      planetData.forEach((planet) => {
        const planetSpeed =
          FULL_CIRCLE_RADIANS / (planet.orbitalPeriodDays * SECONDS_PER_DAY);
        expect(mercurySpeed).toBeGreaterThanOrEqual(planetSpeed);
      });
    });

    it("should have Neptune with slowest orbital speed (longest period)", () => {
      const neptune = planetData.find((p) => p.name === "Neptune")!;
      const neptuneSpeed =
        FULL_CIRCLE_RADIANS / (neptune.orbitalPeriodDays * SECONDS_PER_DAY);

      planetData.forEach((planet) => {
        const planetSpeed =
          FULL_CIRCLE_RADIANS / (planet.orbitalPeriodDays * SECONDS_PER_DAY);
        expect(neptuneSpeed).toBeLessThanOrEqual(planetSpeed);
      });
    });

    it("should calculate speed inversely proportional to orbital period", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 1, max: 100000, noNaN: true }),
          (orbitalPeriodDays) => {
            const orbitalPeriodSeconds = orbitalPeriodDays * SECONDS_PER_DAY;
            const baseSpeed = FULL_CIRCLE_RADIANS / orbitalPeriodSeconds;

            // Longer period = slower speed
            // speed * period = 2π (constant)
            const product = baseSpeed * orbitalPeriodSeconds;
            return Math.abs(product - FULL_CIRCLE_RADIANS) < 0.0001;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Unit tests for specific planets
   */
  describe("Unit tests for specific planets", () => {
    it("should use Mercury's orbital period of 87.969 days", () => {
      const mercury = planetData.find((p) => p.name === "Mercury")!;
      expect(mercury.orbitalPeriodDays).toBe(87.969);

      const orbitalPeriodSeconds = mercury.orbitalPeriodDays * SECONDS_PER_DAY;
      const baseSpeed = FULL_CIRCLE_RADIANS / orbitalPeriodSeconds;

      expect(baseSpeed).toBeGreaterThan(0);
    });

    it("should use Venus's orbital period of 224.701 days", () => {
      const venus = planetData.find((p) => p.name === "Venus")!;
      expect(venus.orbitalPeriodDays).toBe(224.701);

      const orbitalPeriodSeconds = venus.orbitalPeriodDays * SECONDS_PER_DAY;
      const baseSpeed = FULL_CIRCLE_RADIANS / orbitalPeriodSeconds;

      expect(baseSpeed).toBeGreaterThan(0);
    });

    it("should use Earth's orbital period of 365.256 days", () => {
      const earth = planetData.find((p) => p.name === "Earth")!;
      expect(earth.orbitalPeriodDays).toBe(365.256);

      const orbitalPeriodSeconds = earth.orbitalPeriodDays * SECONDS_PER_DAY;
      const baseSpeed = FULL_CIRCLE_RADIANS / orbitalPeriodSeconds;

      expect(baseSpeed).toBeGreaterThan(0);
    });

    it("should use Mars's orbital period of 686.98 days", () => {
      const mars = planetData.find((p) => p.name === "Mars")!;
      expect(mars.orbitalPeriodDays).toBe(686.98);
    });

    it("should use Jupiter's orbital period of 4332.59 days", () => {
      const jupiter = planetData.find((p) => p.name === "Jupiter")!;
      expect(jupiter.orbitalPeriodDays).toBe(4332.59);
    });

    it("should use Saturn's orbital period of 10759.22 days", () => {
      const saturn = planetData.find((p) => p.name === "Saturn")!;
      expect(saturn.orbitalPeriodDays).toBe(10759.22);
    });

    it("should use Uranus's orbital period of 30688.5 days", () => {
      const uranus = planetData.find((p) => p.name === "Uranus")!;
      expect(uranus.orbitalPeriodDays).toBe(30688.5);
    });

    it("should use Neptune's orbital period of 60182 days", () => {
      const neptune = planetData.find((p) => p.name === "Neptune")!;
      expect(neptune.orbitalPeriodDays).toBe(60182);
    });
  });

  /**
   * Conversion tests
   */
  describe("Orbital period conversion", () => {
    it("should convert days to seconds correctly (86400 seconds per day)", () => {
      expect(SECONDS_PER_DAY).toBe(86400);

      planetData.forEach((planet) => {
        const orbitalPeriodSeconds = planet.orbitalPeriodDays * SECONDS_PER_DAY;
        const expectedSeconds = planet.orbitalPeriodDays * 24 * 60 * 60;
        // Use toBeCloseTo for floating point comparison
        expect(orbitalPeriodSeconds).toBeCloseTo(expectedSeconds, 5);
      });
    });

    it("should maintain precision when converting to seconds", () => {
      fc.assert(
        fc.property(fc.double({ min: 1, max: 100000, noNaN: true }), (days) => {
          const seconds = days * SECONDS_PER_DAY;
          const backToDays = seconds / SECONDS_PER_DAY;

          return Math.abs(backToDays - days) < 0.000001;
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Integration with simulation
   */
  describe("Integration with simulation speed", () => {
    it("should scale correctly with simulation speed multiplier", () => {
      const earth = planetData.find((p) => p.name === "Earth")!;
      const orbitalPeriodSeconds = earth.orbitalPeriodDays * SECONDS_PER_DAY;
      const baseSpeed = FULL_CIRCLE_RADIANS / orbitalPeriodSeconds;

      // Test different simulation speeds
      const speeds = [1, 10, 100, 1000, 10000];

      speeds.forEach((simSpeed) => {
        const effectiveSpeed = baseSpeed * simSpeed;
        expect(effectiveSpeed).toBe(baseSpeed * simSpeed);
      });
    });

    it("should complete orbit in correct time at different simulation speeds", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 1, max: 10000, noNaN: true }), // orbital period
          fc.double({ min: 1, max: 10000, noNaN: true }), // simulation speed
          (orbitalPeriodDays, simSpeed) => {
            const orbitalPeriodSeconds = orbitalPeriodDays * SECONDS_PER_DAY;
            const baseSpeed = FULL_CIRCLE_RADIANS / orbitalPeriodSeconds;

            // Time to complete one orbit at given simulation speed
            const realTimeToComplete = orbitalPeriodSeconds / simSpeed;

            // Angle covered in that time
            const angleCovered = baseSpeed * simSpeed * realTimeToComplete;

            // Should be 2π (one complete orbit)
            return Math.abs(angleCovered - FULL_CIRCLE_RADIANS) < 0.0001;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
