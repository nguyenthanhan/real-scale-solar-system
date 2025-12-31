/**
 * Property-based tests for belt data structure
 * Feature: belt-region-indicator, Property 1: Belt data structure completeness
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { BELT_DATA, BeltData } from "../data/belt-data";

describe("Belt Data Structure", () => {
  /**
   * Property 1: Belt data structure completeness
   * For any belt in BELT_DATA, it SHALL have valid innerRadiusAU (number > 0),
   * outerRadiusAU (number > innerRadiusAU), name (non-empty string),
   * color (valid hex string), and opacity (number between 0 and 1).
   */
  describe("Property 1: Belt data structure completeness", () => {
    it("should have valid innerRadiusAU (positive number) for all belts", () => {
      fc.assert(
        fc.property(fc.constantFrom(...BELT_DATA), (belt: BeltData) => {
          expect(typeof belt.innerRadiusAU).toBe("number");
          expect(belt.innerRadiusAU).toBeGreaterThan(0);
        }),
        { numRuns: 100 },
      );
    });

    it("should have outerRadiusAU greater than innerRadiusAU for all belts", () => {
      fc.assert(
        fc.property(fc.constantFrom(...BELT_DATA), (belt: BeltData) => {
          expect(typeof belt.outerRadiusAU).toBe("number");
          expect(belt.outerRadiusAU).toBeGreaterThan(belt.innerRadiusAU);
        }),
        { numRuns: 100 },
      );
    });

    it("should have non-empty name for all belts", () => {
      fc.assert(
        fc.property(fc.constantFrom(...BELT_DATA), (belt: BeltData) => {
          expect(typeof belt.name).toBe("string");
          expect(belt.name.trim().length).toBeGreaterThan(0);
        }),
        { numRuns: 100 },
      );
    });

    it("should have valid hex color for all belts", () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      fc.assert(
        fc.property(fc.constantFrom(...BELT_DATA), (belt: BeltData) => {
          expect(typeof belt.color).toBe("string");
          expect(belt.color).toMatch(hexColorRegex);
        }),
        { numRuns: 100 },
      );
    });

    it("should have opacity between 0 and 1 for all belts", () => {
      fc.assert(
        fc.property(fc.constantFrom(...BELT_DATA), (belt: BeltData) => {
          expect(typeof belt.opacity).toBe("number");
          expect(belt.opacity).toBeGreaterThanOrEqual(0);
          expect(belt.opacity).toBeLessThanOrEqual(1);
        }),
        { numRuns: 100 },
      );
    });

    it("should have unique id for all belts", () => {
      const ids = BELT_DATA.map((belt) => belt.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  /**
   * Property 3: Belt colors are distinct
   * For any two different belts in BELT_DATA, their color values SHALL be different strings.
   */
  describe("Property 3: Belt colors are distinct", () => {
    it("should have distinct colors for all belts", () => {
      const colors = BELT_DATA.map((belt) => belt.color);
      expect(new Set(colors).size).toBe(colors.length);
    });
  });

  /**
   * Property 4: Belt opacity within valid range
   * For any belt in BELT_DATA, the opacity value SHALL be between 0.05 and 0.3.
   */
  describe("Property 4: Belt opacity within valid range", () => {
    it("should have opacity between 0.05 and 0.3 for all belts", () => {
      fc.assert(
        fc.property(fc.constantFrom(...BELT_DATA), (belt: BeltData) => {
          expect(belt.opacity).toBeGreaterThanOrEqual(0.05);
          expect(belt.opacity).toBeLessThanOrEqual(0.3);
        }),
        { numRuns: 100 },
      );
    });
  });

  /**
   * Property 6: Belt particle configuration
   * For any belt in BELT_DATA, it SHALL have valid particleCount and particleSize.
   */
  describe("Property 6: Belt particle configuration", () => {
    it("should have positive particleCount for all belts", () => {
      fc.assert(
        fc.property(fc.constantFrom(...BELT_DATA), (belt: BeltData) => {
          expect(typeof belt.particleCount).toBe("number");
          expect(belt.particleCount).toBeGreaterThan(0);
        }),
        { numRuns: 100 },
      );
    });

    it("should have positive particleSize for all belts", () => {
      fc.assert(
        fc.property(fc.constantFrom(...BELT_DATA), (belt: BeltData) => {
          expect(typeof belt.particleSize).toBe("number");
          expect(belt.particleSize).toBeGreaterThan(0);
        }),
        { numRuns: 100 },
      );
    });
  });

  // Verify expected belts exist
  describe("Expected belts", () => {
    it("should contain Asteroid Belt with correct AU range", () => {
      const asteroidBelt = BELT_DATA.find((b) => b.id === "asteroid-belt");
      expect(asteroidBelt).toBeDefined();
      expect(asteroidBelt?.innerRadiusAU).toBe(2.2);
      expect(asteroidBelt?.outerRadiusAU).toBe(3.2);
    });

    it("should contain Kuiper Belt with correct AU range", () => {
      const kuiperBelt = BELT_DATA.find((b) => b.id === "kuiper-belt");
      expect(kuiperBelt).toBeDefined();
      expect(kuiperBelt?.innerRadiusAU).toBe(30);
      expect(kuiperBelt?.outerRadiusAU).toBe(50);
    });
  });
});
