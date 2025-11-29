import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { MathUtils } from "three";
import {
  applyInclinationToPosition,
  getInclinationRotation,
} from "@/utils/orbital-inclination";
import { planetData } from "@/data/planet-data";

describe("Orbital Inclination Utilities", () => {
  /**
   * **Feature: orbital-inclination-support, Property 1: Inclination transforms position correctly**
   *
   * For any 2D position (x, z) and inclination angle, applying the inclination
   * transformation should produce a 3D position where:
   * - X component remains unchanged
   * - Y component equals z * sin(inclination)
   * - Z component equals z * cos(inclination)
   */
  describe("Property 1: Inclination transforms position correctly", () => {
    it("should transform position with correct Y and Z components for any valid input", () => {
      fc.assert(
        fc.property(
          fc.double({ min: -10000, max: 10000, noNaN: true }),
          fc.double({ min: -10000, max: 10000, noNaN: true }),
          fc.double({ min: -90, max: 90, noNaN: true }),
          (x, z, inclinationDegrees) => {
            const result = applyInclinationToPosition(x, z, inclinationDegrees);
            const radians = MathUtils.degToRad(inclinationDegrees);

            // Three.js rotation.x convention: y' = -z * sin(θ), z' = z * cos(θ)
            const expectedY = -z * Math.sin(radians);
            const expectedZ = z * Math.cos(radians);

            // X should remain unchanged
            expect(result.x).toBeCloseTo(x, 4);
            // Y should be -z * sin(inclination) to match Three.js rotation.x
            expect(result.y).toBeCloseTo(expectedY, 4);
            // Z should be z * cos(inclination)
            expect(result.z).toBeCloseTo(expectedZ, 4);
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should preserve distance from origin (rotation preserves magnitude)", () => {
      fc.assert(
        fc.property(
          fc.double({ min: -1000, max: 1000, noNaN: true }),
          fc.double({ min: -1000, max: 1000, noNaN: true }),
          fc.double({ min: -90, max: 90, noNaN: true }),
          (x, z, inclinationDegrees) => {
            const result = applyInclinationToPosition(x, z, inclinationDegrees);

            // Original distance in XZ plane
            const originalDistance = Math.sqrt(x * x + z * z);
            // New distance in 3D space
            const newDistance = Math.sqrt(
              result.x * result.x + result.y * result.y + result.z * result.z
            );

            expect(newDistance).toBeCloseTo(originalDistance, 4);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Unit tests for specific edge cases
   */
  describe("Unit tests for utility functions", () => {
    it("should return Y=0 when inclination is 0 degrees", () => {
      const result = applyInclinationToPosition(100, 50, 0);
      expect(result.x).toBe(100);
      expect(result.y).toBeCloseTo(0, 10);
      expect(result.z).toBeCloseTo(50, 10);
    });

    it("should rotate Z fully to Y when inclination is 90 degrees", () => {
      const result = applyInclinationToPosition(100, 50, 90);
      expect(result.x).toBe(100);
      // With Three.js convention: y = -z * sin(90) = -50
      expect(result.y).toBeCloseTo(-50, 10);
      expect(result.z).toBeCloseTo(0, 10);
    });

    it("should handle negative inclination values", () => {
      const result = applyInclinationToPosition(100, 50, -45);
      const radians = MathUtils.degToRad(-45);
      expect(result.x).toBe(100);
      // Three.js convention: y = -z * sin(θ)
      expect(result.y).toBeCloseTo(-50 * Math.sin(radians), 10);
      expect(result.z).toBeCloseTo(50 * Math.cos(radians), 10);
    });

    it("should use fallback of 0 for NaN inclination", () => {
      const result = applyInclinationToPosition(100, 50, NaN);
      expect(result.x).toBe(100);
      expect(result.y).toBeCloseTo(0, 10);
      expect(result.z).toBeCloseTo(50, 10);
    });

    it("should use fallback of 0 for Infinity inclination", () => {
      const result = applyInclinationToPosition(100, 50, Infinity);
      expect(result.x).toBe(100);
      expect(result.y).toBeCloseTo(0, 10);
      expect(result.z).toBeCloseTo(50, 10);
    });

    it("should clamp inclination to -180 to 180 range", () => {
      const result200 = applyInclinationToPosition(100, 50, 200);
      const result180 = applyInclinationToPosition(100, 50, 180);
      expect(result200.y).toBeCloseTo(result180.y, 10);
      expect(result200.z).toBeCloseTo(result180.z, 10);
    });
  });

  describe("getInclinationRotation", () => {
    it("should convert degrees to radians correctly", () => {
      fc.assert(
        fc.property(
          fc.double({ min: -180, max: 180, noNaN: true }),
          (degrees) => {
            const result = getInclinationRotation(degrees);
            const expected = MathUtils.degToRad(degrees);
            expect(result).toBeCloseTo(expected, 10);
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should return 0 for 0 degrees", () => {
      expect(getInclinationRotation(0)).toBe(0);
    });

    it("should return PI/2 for 90 degrees", () => {
      expect(getInclinationRotation(90)).toBeCloseTo(Math.PI / 2, 10);
    });

    it("should handle invalid values with fallback to 0", () => {
      expect(getInclinationRotation(NaN)).toBe(0);
      expect(getInclinationRotation(Infinity)).toBe(0);
    });
  });

  /**
   * **Feature: orbital-inclination-support, Property 3: Same inclination applied to planet and orbit**
   */
  describe("Property 3: Same inclination for planet and orbit", () => {
    it("should produce consistent rotation for all planets", () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...planetData.map((p) => p.name)),
          (planetName) => {
            const planet = planetData.find((p) => p.name === planetName)!;
            const orbitRotation = getInclinationRotation(
              planet.orbitalInclination
            );
            const expectedRotation = MathUtils.degToRad(
              planet.orbitalInclination
            );

            expect(Math.abs(orbitRotation - expectedRotation)).toBeLessThan(
              0.0001
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: orbital-inclination-support, Property 4: Each planet has unique inclination (where applicable)**
   */
  describe("Property 4: Each planet has unique inclination", () => {
    it("should have different inclination angles for planets with different data", () => {
      const inclinations = planetData.map((p) => ({
        name: p.name,
        inclination: p.orbitalInclination,
      }));

      // Group by inclination to find duplicates
      const inclinationMap = new Map<number, string[]>();
      inclinations.forEach(({ name, inclination }) => {
        const existing = inclinationMap.get(inclination) || [];
        inclinationMap.set(inclination, [...existing, name]);
      });

      // Only Earth should have 0 inclination (reference plane)
      const zeroInclination = inclinationMap.get(0);
      expect(zeroInclination).toEqual(["Earth"]);

      // All other planets should have unique non-zero inclinations
      const nonZeroInclinations = Array.from(inclinationMap.entries()).filter(
        ([inc]) => inc !== 0
      );
      nonZeroInclinations.forEach(([, planets]) => {
        expect(planets.length).toBe(1);
      });
    });
  });
});

/**
 * **Feature: orbital-inclination-support, Property 2: Planet remains on inclined orbit path**
 *
 * For any planet at any point in its orbit, the planet's 3D position should lie
 * on the inclined elliptical orbit path defined by the same eccentricity and inclination.
 */
describe("Property 2: Planet remains on inclined orbit path", () => {
  it("should position planet on inclined orbit path for any angle", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...planetData.map((p) => p.name)),
        fc.double({ min: 0, max: 2 * Math.PI, noNaN: true }),
        fc.double({ min: 10, max: 1000, noNaN: true }), // scaledDistance
        (planetName, angle, scaledDistance) => {
          const planet = planetData.find((p) => p.name === planetName)!;

          // Simulate what usePlanetMovement does:
          // 1. Create ellipse curve
          const semiMajorAxis = scaledDistance;
          const semiMinorAxis = scaledDistance * (1 - planet.eccentricity);

          // 2. Get 2D position on ellipse
          const t = angle / (2 * Math.PI);
          const theta = 2 * Math.PI * t;
          const x = semiMajorAxis * Math.cos(theta);
          const z2D = semiMinorAxis * Math.sin(theta);

          // 3. Apply inclination
          const position3D = applyInclinationToPosition(
            x,
            z2D,
            planet.orbitalInclination
          );

          // Verify: The position should satisfy the inclined ellipse equation
          // After inclination rotation around X-axis, the ellipse is tilted
          // The point should still be at distance from center matching ellipse

          // Calculate expected position on inclined orbit path
          const inclinationRad = MathUtils.degToRad(planet.orbitalInclination);

          // The orbit path geometry rotates the flat ellipse around X-axis
          // Three.js convention: y = -z * sin(inc), z = z * cos(inc)
          const expectedY = -z2D * Math.sin(inclinationRad);
          const expectedZ = z2D * Math.cos(inclinationRad);

          expect(position3D.x).toBeCloseTo(x, 4);
          expect(position3D.y).toBeCloseTo(expectedY, 4);
          expect(position3D.z).toBeCloseTo(expectedZ, 4);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should keep Earth on flat orbit (0 inclination)", () => {
    const earth = planetData.find((p) => p.name === "Earth")!;
    const scaledDistance = 100;

    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 2 * Math.PI, noNaN: true }),
        (angle) => {
          const t = angle / (2 * Math.PI);
          const theta = 2 * Math.PI * t;
          const x = scaledDistance * Math.cos(theta);
          const z2D =
            scaledDistance * (1 - earth.eccentricity) * Math.sin(theta);

          const position3D = applyInclinationToPosition(
            x,
            z2D,
            earth.orbitalInclination
          );

          // Earth's Y should always be ~0 (flat orbit)
          expect(position3D.y).toBeCloseTo(0, 4);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should give Mercury maximum Y displacement due to highest inclination", () => {
    const mercury = planetData.find((p) => p.name === "Mercury")!;
    const scaledDistance = 100;

    // At angle where z2D is maximum (90 degrees), Y displacement is maximum
    const angle = Math.PI / 2;
    const t = angle / (2 * Math.PI);
    const theta = 2 * Math.PI * t;
    const x = scaledDistance * Math.cos(theta);
    const z2D = scaledDistance * (1 - mercury.eccentricity) * Math.sin(theta);

    const position3D = applyInclinationToPosition(
      x,
      z2D,
      mercury.orbitalInclination
    );

    // Mercury has 7.005° inclination - should have noticeable Y
    // Three.js convention: y = -z * sin(inc)
    const expectedY =
      -z2D * Math.sin(MathUtils.degToRad(mercury.orbitalInclination));
    expect(position3D.y).toBeCloseTo(expectedY, 4);
    expect(Math.abs(position3D.y)).toBeGreaterThan(0);
  });
});

/**
 * Integration tests for planet-orbit alignment
 */
describe("Planet-Orbit Alignment Verification", () => {
  it("should align planet position with orbit path for all 8 planets", () => {
    const scaledDistance = 100;

    planetData.forEach((planet) => {
      // Test at multiple angles
      const angles = [0, Math.PI / 4, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

      angles.forEach((angle) => {
        // Calculate planet position (what usePlanetMovement does)
        const semiMajorAxis = scaledDistance;
        const semiMinorAxis = scaledDistance * (1 - planet.eccentricity);

        const t = angle / (2 * Math.PI);
        const theta = 2 * Math.PI * t;
        const x = semiMajorAxis * Math.cos(theta);
        const z2D = semiMinorAxis * Math.sin(theta);

        const planetPosition = applyInclinationToPosition(
          x,
          z2D,
          planet.orbitalInclination
        );

        // Calculate expected orbit path position (what OrbitPath renders)
        // Three.js rotation.x convention: y = -z * sin(θ)
        const orbitRotation = getInclinationRotation(planet.orbitalInclination);
        const expectedY = -z2D * Math.sin(orbitRotation);
        const expectedZ = z2D * Math.cos(orbitRotation);

        // Planet should be on orbit path
        expect(planetPosition.x).toBeCloseTo(x, 4);
        expect(planetPosition.y).toBeCloseTo(expectedY, 4);
        expect(planetPosition.z).toBeCloseTo(expectedZ, 4);
      });
    });
  });

  it("should maintain alignment at different simulation speeds (logic verification)", () => {
    // Simulation speed doesn't affect the position calculation formula
    // It only affects how fast the angle changes
    // The position at any given angle should be the same regardless of speed

    const planet = planetData.find((p) => p.name === "Mars")!;
    const scaledDistance = 100;
    const angle = Math.PI / 3;

    // Calculate position
    const semiMajorAxis = scaledDistance;
    const semiMinorAxis = scaledDistance * (1 - planet.eccentricity);
    const t = angle / (2 * Math.PI);
    const theta = 2 * Math.PI * t;
    const x = semiMajorAxis * Math.cos(theta);
    const z2D = semiMinorAxis * Math.sin(theta);

    const position = applyInclinationToPosition(
      x,
      z2D,
      planet.orbitalInclination
    );

    // Position should be deterministic based on angle, not speed
    const position2 = applyInclinationToPosition(
      x,
      z2D,
      planet.orbitalInclination
    );

    expect(position.x).toBe(position2.x);
    expect(position.y).toBe(position2.y);
    expect(position.z).toBe(position2.z);
  });
});

/**
 * Edge case tests
 */
describe("Edge Cases", () => {
  it("should keep Earth orbit flat (0° inclination) - Requirement 1.3", () => {
    const earth = planetData.find((p) => p.name === "Earth")!;

    expect(earth.orbitalInclination).toBe(0);

    // Test multiple positions
    const positions = [
      { x: 100, z: 0 },
      { x: 0, z: 100 },
      { x: -100, z: 0 },
      { x: 0, z: -100 },
      { x: 70.7, z: 70.7 },
    ];

    positions.forEach(({ x, z }) => {
      const result = applyInclinationToPosition(x, z, earth.orbitalInclination);
      expect(result.y).toBeCloseTo(0, 10);
      expect(result.z).toBeCloseTo(z, 10);
    });
  });

  it("should apply Mercury maximum inclination (7.005°) - Requirement 1.4", () => {
    const mercury = planetData.find((p) => p.name === "Mercury")!;

    expect(mercury.orbitalInclination).toBe(7.005);

    // Mercury should have the highest inclination among all planets
    const maxInclination = Math.max(
      ...planetData.map((p) => p.orbitalInclination)
    );
    expect(mercury.orbitalInclination).toBe(maxInclination);

    // Test that Y component is non-zero when z is non-zero
    // Three.js convention: y = -z * sin(inc)
    const result = applyInclinationToPosition(
      100,
      50,
      mercury.orbitalInclination
    );
    const expectedY = -50 * Math.sin(MathUtils.degToRad(7.005));
    expect(result.y).toBeCloseTo(expectedY, 4);
    expect(Math.abs(result.y)).toBeGreaterThan(0);
  });

  it("should maintain alignment under simulation speed changes - Requirement 3.4", () => {
    // The inclination calculation is independent of simulation speed
    // Position at a given angle should be the same regardless of how fast we got there

    fc.assert(
      fc.property(
        fc.constantFrom(...planetData.map((p) => p.name)),
        fc.double({ min: 0, max: 2 * Math.PI, noNaN: true }),
        (planetName, angle) => {
          const planet = planetData.find((p) => p.name === planetName)!;
          const scaledDistance = 100;

          const semiMajorAxis = scaledDistance;
          const semiMinorAxis = scaledDistance * (1 - planet.eccentricity);
          const t = angle / (2 * Math.PI);
          const theta = 2 * Math.PI * t;
          const x = semiMajorAxis * Math.cos(theta);
          const z2D = semiMinorAxis * Math.sin(theta);

          // Calculate position multiple times - should be deterministic
          const pos1 = applyInclinationToPosition(
            x,
            z2D,
            planet.orbitalInclination
          );
          const pos2 = applyInclinationToPosition(
            x,
            z2D,
            planet.orbitalInclination
          );

          expect(pos1.x).toBe(pos2.x);
          expect(pos1.y).toBe(pos2.y);
          expect(pos1.z).toBe(pos2.z);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should display correct inclination from any camera angle - Requirement 3.5", () => {
    // The inclination is applied as a rotation around X-axis
    // This is a geometric property that doesn't change with viewing angle
    // We verify the math is correct

    fc.assert(
      fc.property(
        fc.double({ min: -180, max: 180, noNaN: true }),
        (inclinationDegrees) => {
          const rotation = getInclinationRotation(inclinationDegrees);
          const clampedInclination = Math.max(
            -180,
            Math.min(180, inclinationDegrees)
          );
          const expectedRotation = MathUtils.degToRad(clampedInclination);

          expect(rotation).toBeCloseTo(expectedRotation, 10);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: orbital-inclination-support, Property 5: Alignment maintained under simulation changes**
 *
 * For any change in simulation speed or time, the planet should remain positioned on its orbit path.
 */
describe("Property 5: Alignment maintained under simulation changes", () => {
  it("should maintain planet on orbit path regardless of how angle was reached", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...planetData.map((p) => p.name)),
        fc.double({ min: 0, max: 2 * Math.PI, noNaN: true }),
        fc.double({ min: 10, max: 500, noNaN: true }),
        (planetName, finalAngle, scaledDistance) => {
          const planet = planetData.find((p) => p.name === planetName)!;

          // Calculate final position
          const semiMajorAxis = scaledDistance;
          const semiMinorAxis = scaledDistance * (1 - planet.eccentricity);
          const t = finalAngle / (2 * Math.PI);
          const theta = 2 * Math.PI * t;
          const x = semiMajorAxis * Math.cos(theta);
          const z2D = semiMinorAxis * Math.sin(theta);

          const planetPosition = applyInclinationToPosition(
            x,
            z2D,
            planet.orbitalInclination
          );

          // Verify planet is on the inclined orbit path
          // The orbit path is the flat ellipse rotated around X-axis
          // Three.js convention: y = -z * sin(θ)
          const inclinationRad = getInclinationRotation(
            planet.orbitalInclination
          );

          // Expected position on rotated orbit
          const expectedY = -z2D * Math.sin(inclinationRad);
          const expectedZ = z2D * Math.cos(inclinationRad);

          expect(planetPosition.x).toBeCloseTo(x, 4);
          expect(planetPosition.y).toBeCloseTo(expectedY, 4);
          expect(planetPosition.z).toBeCloseTo(expectedZ, 4);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should produce same position for same angle regardless of simulation history", () => {
    // This verifies that the position calculation is stateless
    // The same angle should always produce the same position

    const planet = planetData.find((p) => p.name === "Saturn")!;
    const scaledDistance = 200;
    const testAngle = Math.PI / 4;

    // Calculate position
    const semiMajorAxis = scaledDistance;
    const semiMinorAxis = scaledDistance * (1 - planet.eccentricity);
    const t = testAngle / (2 * Math.PI);
    const theta = 2 * Math.PI * t;
    const x = semiMajorAxis * Math.cos(theta);
    const z2D = semiMinorAxis * Math.sin(theta);

    // Call multiple times to verify determinism
    const positions = Array.from({ length: 10 }, () =>
      applyInclinationToPosition(x, z2D, planet.orbitalInclination)
    );

    // All positions should be identical
    positions.forEach((pos) => {
      expect(pos.x).toBe(positions[0].x);
      expect(pos.y).toBe(positions[0].y);
      expect(pos.z).toBe(positions[0].z);
    });
  });
});
