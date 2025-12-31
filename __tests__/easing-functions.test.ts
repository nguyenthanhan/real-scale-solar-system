import fc from "fast-check";
import {
  easeInOutCubic,
  easeOutQuart,
  linear,
  easeInOutQuad,
} from "../utils/easing-functions";

/**
 * Property-based tests for easing functions
 * **Feature: date-transition-animation, Property 6: Easing function output is bounded**
 * **Validates: Requirements 5.1**
 */
describe("Easing Functions - Property Tests", () => {
  describe("Property 6: Easing function output is bounded", () => {
    test("easeInOutCubic returns values between 0 and 1 for inputs between 0 and 1", () => {
      fc.assert(
        fc.property(fc.double({ min: 0, max: 1, noNaN: true }), (t) => {
          const result = easeInOutCubic(t);
          return result >= 0 && result <= 1;
        }),
        { numRuns: 100 },
      );
    });

    test("easeOutQuart returns values between 0 and 1 for inputs between 0 and 1", () => {
      fc.assert(
        fc.property(fc.double({ min: 0, max: 1, noNaN: true }), (t) => {
          const result = easeOutQuart(t);
          return result >= 0 && result <= 1;
        }),
        { numRuns: 100 },
      );
    });

    test("linear returns values between 0 and 1 for inputs between 0 and 1", () => {
      fc.assert(
        fc.property(fc.double({ min: 0, max: 1, noNaN: true }), (t) => {
          const result = linear(t);
          return result >= 0 && result <= 1;
        }),
        { numRuns: 100 },
      );
    });

    test("easeInOutQuad returns values between 0 and 1 for inputs between 0 and 1", () => {
      fc.assert(
        fc.property(fc.double({ min: 0, max: 1, noNaN: true }), (t) => {
          const result = easeInOutQuad(t);
          return result >= 0 && result <= 1;
        }),
        { numRuns: 100 },
      );
    });
  });

  describe("Boundary conditions", () => {
    test("all easing functions return 0 when input is 0", () => {
      expect(easeInOutCubic(0)).toBe(0);
      expect(easeOutQuart(0)).toBe(0);
      expect(linear(0)).toBe(0);
      expect(easeInOutQuad(0)).toBe(0);
    });

    test("all easing functions return 1 when input is 1", () => {
      expect(easeInOutCubic(1)).toBe(1);
      expect(easeOutQuart(1)).toBe(1);
      expect(linear(1)).toBe(1);
      expect(easeInOutQuad(1)).toBe(1);
    });
  });

  describe("Monotonicity", () => {
    test("easing functions are monotonically increasing", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0, max: 0.99, noNaN: true }),
          fc.double({ min: 0.001, max: 0.01, noNaN: true }),
          (t, delta) => {
            const t2 = Math.min(t + delta, 1);
            return easeInOutCubic(t) <= easeInOutCubic(t2);
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
