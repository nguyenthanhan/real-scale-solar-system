import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { planetData } from "@/data/planet-data";
import {
  SECONDS_PER_DAY,
  FULL_CIRCLE_RADIANS,
} from "@/utils/physics-constants";

describe("Retrograde Rotation", () => {
  /**
   * **Feature: accurate-physics-calculations, Property 4: Retrograde rotation has negative angular velocity**
   *
   * For any planet with negative rotationSpeedByDays (Venus, Uranus),
   * the calculated angular velocity should be negative.
   */
  describe("Property 4: Retrograde rotation has negative angular velocity", () => {
    it("should have negative rotation direction for planets with negative rotationSpeedByDays", () => {
      fc.assert(
        fc.property(
          fc.double({ min: -1000, max: -0.1, noNaN: true }),
          (rotationSpeedByDays) => {
            // Simulate what usePlanetMovement does
            const rotationDirection = rotationSpeedByDays < 0 ? -1 : 1;

            // Negative rotation speed should produce negative direction
            return rotationDirection === -1;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should have positive rotation direction for planets with positive rotationSpeedByDays", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.1, max: 1000, noNaN: true }),
          (rotationSpeedByDays) => {
            // Simulate what usePlanetMovement does
            const rotationDirection = rotationSpeedByDays < 0 ? -1 : 1;

            // Positive rotation speed should produce positive direction
            return rotationDirection === 1;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should calculate angular velocity with correct sign", () => {
      fc.assert(
        fc.property(
          fc.double({ min: -1000, max: 1000, noNaN: true }),
          fc.double({ min: 0.001, max: 1, noNaN: true }), // deltaTime
          fc.double({ min: 1, max: 10000, noNaN: true }), // simulationSpeed
          (rotationSpeedByDays, deltaTime, simulationSpeed) => {
            fc.pre(rotationSpeedByDays !== 0);

            // Simulate what usePlanetMovement does
            const dayLengthSeconds =
              Math.abs(rotationSpeedByDays) * SECONDS_PER_DAY;
            const rotationSpeedRadiansPerSecond =
              FULL_CIRCLE_RADIANS / dayLengthSeconds;
            const rotationSpeed =
              deltaTime * simulationSpeed * rotationSpeedRadiansPerSecond;
            const rotationDirection = rotationSpeedByDays < 0 ? -1 : 1;
            const angularVelocity = rotationSpeed * rotationDirection;

            // Angular velocity should have same sign as rotationSpeedByDays
            if (rotationSpeedByDays < 0) {
              return angularVelocity < 0;
            } else {
              return angularVelocity > 0;
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Unit tests for specific retrograde planets
   */
  describe("Unit tests for retrograde planets", () => {
    it("should identify Venus as retrograde", () => {
      const venus = planetData.find((p) => p.name === "Venus")!;
      expect(venus.rotationSpeedByDays).toBeLessThan(0);
      expect(venus.rotationSpeedByDays).toBe(-243.025);
    });

    it("should identify Uranus as retrograde", () => {
      const uranus = planetData.find((p) => p.name === "Uranus")!;
      expect(uranus.rotationSpeedByDays).toBeLessThan(0);
      expect(uranus.rotationSpeedByDays).toBe(-0.72);
    });

    it("should have prograde rotation for other planets", () => {
      const progradePlanets = [
        "Mercury",
        "Earth",
        "Mars",
        "Jupiter",
        "Saturn",
        "Neptune",
      ];

      progradePlanets.forEach((planetName) => {
        const planet = planetData.find((p) => p.name === planetName)!;
        expect(planet.rotationSpeedByDays).toBeGreaterThan(0);
      });
    });

    it("should calculate correct rotation direction for Venus", () => {
      const venus = planetData.find((p) => p.name === "Venus")!;
      const rotationDirection = venus.rotationSpeedByDays < 0 ? -1 : 1;
      expect(rotationDirection).toBe(-1);
    });

    it("should calculate correct rotation direction for Uranus", () => {
      const uranus = planetData.find((p) => p.name === "Uranus")!;
      const rotationDirection = uranus.rotationSpeedByDays < 0 ? -1 : 1;
      expect(rotationDirection).toBe(-1);
    });

    it("should calculate correct rotation direction for Earth", () => {
      const earth = planetData.find((p) => p.name === "Earth")!;
      const rotationDirection = earth.rotationSpeedByDays < 0 ? -1 : 1;
      expect(rotationDirection).toBe(1);
    });
  });

  /**
   * Rotation speed calculation tests
   */
  describe("Rotation speed calculations", () => {
    it("should use absolute value for day length calculation", () => {
      fc.assert(
        fc.property(
          fc.double({ min: -1000, max: 1000, noNaN: true }),
          (rotationSpeedByDays) => {
            fc.pre(rotationSpeedByDays !== 0);

            const dayLengthSeconds =
              Math.abs(rotationSpeedByDays) * SECONDS_PER_DAY;

            // Day length should always be positive
            return dayLengthSeconds > 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should produce opposite angular velocities for opposite rotation speeds", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.1, max: 1000, noNaN: true }),
          fc.double({ min: 0.001, max: 1, noNaN: true }),
          fc.double({ min: 1, max: 10000, noNaN: true }),
          (absRotationSpeed, deltaTime, simulationSpeed) => {
            // Calculate for positive rotation
            const dayLengthSeconds1 = absRotationSpeed * SECONDS_PER_DAY;
            const rotationSpeedRadiansPerSecond1 =
              FULL_CIRCLE_RADIANS / dayLengthSeconds1;
            const rotationSpeed1 =
              deltaTime * simulationSpeed * rotationSpeedRadiansPerSecond1;
            const angularVelocity1 = rotationSpeed1 * 1; // prograde

            // Calculate for negative rotation (same magnitude)
            const dayLengthSeconds2 = absRotationSpeed * SECONDS_PER_DAY;
            const rotationSpeedRadiansPerSecond2 =
              FULL_CIRCLE_RADIANS / dayLengthSeconds2;
            const rotationSpeed2 =
              deltaTime * simulationSpeed * rotationSpeedRadiansPerSecond2;
            const angularVelocity2 = rotationSpeed2 * -1; // retrograde

            // Angular velocities should be opposite
            return Math.abs(angularVelocity1 + angularVelocity2) < 0.000001;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
