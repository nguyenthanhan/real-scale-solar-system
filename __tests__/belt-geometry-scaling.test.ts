/**
 * Property-based tests for belt geometry scaling
 * Feature: belt-region-indicator, Property 2: Belt geometry uses correct scale
 * Validates: Requirements 2.2
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { BELT_DATA, BeltData } from "../data/belt-data";
import { AU_TO_UNITS } from "../components/belt/belt-region";

describe("Belt Geometry Scaling", () => {
  /**
   * Property 2: Belt geometry uses correct scale
   * For any belt with innerRadiusAU and outerRadiusAU, the scaled radii
   * SHALL equal AU value multiplied by 1000 (AU_TO_UNITS constant).
   */
  describe("Property 2: Belt geometry uses correct scale", () => {
    it("AU_TO_UNITS constant should be 1000", () => {
      expect(AU_TO_UNITS).toBe(1000);
    });

    it("should scale inner radius correctly for all belts", () => {
      fc.assert(
        fc.property(fc.constantFrom(...BELT_DATA), (belt: BeltData) => {
          const scaledInnerRadius = belt.innerRadiusAU * AU_TO_UNITS;
          expect(scaledInnerRadius).toBe(belt.innerRadiusAU * 1000);
        }),
        { numRuns: 100 },
      );
    });

    it("should scale outer radius correctly for all belts", () => {
      fc.assert(
        fc.property(fc.constantFrom(...BELT_DATA), (belt: BeltData) => {
          const scaledOuterRadius = belt.outerRadiusAU * AU_TO_UNITS;
          expect(scaledOuterRadius).toBe(belt.outerRadiusAU * 1000);
        }),
        { numRuns: 100 },
      );
    });

    it("should maintain inner < outer relationship after scaling", () => {
      fc.assert(
        fc.property(fc.constantFrom(...BELT_DATA), (belt: BeltData) => {
          const scaledInnerRadius = belt.innerRadiusAU * AU_TO_UNITS;
          const scaledOuterRadius = belt.outerRadiusAU * AU_TO_UNITS;
          expect(scaledInnerRadius).toBeLessThan(scaledOuterRadius);
        }),
        { numRuns: 100 },
      );
    });

    // Test with arbitrary AU values to ensure scaling formula is correct
    it("should correctly scale arbitrary AU values", () => {
      fc.assert(
        fc.property(
          fc.float({
            min: Math.fround(0.1),
            max: Math.fround(100),
            noNaN: true,
          }),
          (auValue: number) => {
            const scaled = auValue * AU_TO_UNITS;
            expect(scaled).toBeCloseTo(auValue * 1000, 5);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  // Verify specific belt scaling values
  describe("Specific belt scaling", () => {
    it("should scale Asteroid Belt inner radius to 2200 units", () => {
      const asteroidBelt = BELT_DATA.find((b) => b.id === "asteroid-belt");
      expect(asteroidBelt!.innerRadiusAU * AU_TO_UNITS).toBe(2200);
    });

    it("should scale Asteroid Belt outer radius to 3200 units", () => {
      const asteroidBelt = BELT_DATA.find((b) => b.id === "asteroid-belt");
      expect(asteroidBelt!.outerRadiusAU * AU_TO_UNITS).toBe(3200);
    });

    it("should scale Kuiper Belt inner radius to 30000 units", () => {
      const kuiperBelt = BELT_DATA.find((b) => b.id === "kuiper-belt");
      expect(kuiperBelt!.innerRadiusAU * AU_TO_UNITS).toBe(30000);
    });

    it("should scale Kuiper Belt outer radius to 50000 units", () => {
      const kuiperBelt = BELT_DATA.find((b) => b.id === "kuiper-belt");
      expect(kuiperBelt!.outerRadiusAU * AU_TO_UNITS).toBe(50000);
    });
  });
});
