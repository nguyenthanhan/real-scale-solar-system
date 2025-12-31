import fc from "fast-check";
import {
  interpolateDate,
  calculateAnimationDuration,
  determineTimeDirection,
  isSameDate,
  isValidAnimationDate,
} from "../utils/date-interpolation";

/**
 * Property-based tests for date interpolation utilities
 * **Feature: date-transition-animation**
 */
describe("Date Interpolation - Property Tests", () => {
  // Date generator for reasonable date range - using integer timestamps to avoid NaN
  const dateArb = fc
    .integer({
      min: new Date("1700-01-01").getTime(),
      max: new Date("2300-12-31").getTime(),
    })
    .map((ts) => new Date(ts));

  describe("Property 1: Animation interpolates dates correctly", () => {
    /**
     * **Property 1: Animation interpolates dates correctly**
     * For any start date, target date, and progress value (0-1),
     * the interpolated date should be mathematically between start and target dates.
     * **Validates: Requirements 1.1, 1.2**
     */
    test("interpolated date is between start and target dates", () => {
      fc.assert(
        fc.property(
          dateArb,
          dateArb,
          fc.double({ min: 0, max: 1, noNaN: true }),
          (startDate, targetDate, progress) => {
            const interpolated = interpolateDate(
              startDate,
              targetDate,
              progress,
            );
            const interpolatedTime = interpolated.getTime();

            const minTime = Math.min(startDate.getTime(), targetDate.getTime());
            const maxTime = Math.max(startDate.getTime(), targetDate.getTime());

            return interpolatedTime >= minTime && interpolatedTime <= maxTime;
          },
        ),
        { numRuns: 100 },
      );
    });

    test("progress 0 returns start date", () => {
      fc.assert(
        fc.property(dateArb, dateArb, (startDate, targetDate) => {
          const interpolated = interpolateDate(startDate, targetDate, 0);
          return interpolated.getTime() === startDate.getTime();
        }),
        { numRuns: 100 },
      );
    });

    test("progress 1 returns target date", () => {
      fc.assert(
        fc.property(dateArb, dateArb, (startDate, targetDate) => {
          const interpolated = interpolateDate(startDate, targetDate, 1);
          return interpolated.getTime() === targetDate.getTime();
        }),
        { numRuns: 100 },
      );
    });
  });

  describe("Property 2: Animation duration scales with time span", () => {
    /**
     * **Property 2: Animation duration scales with time span**
     * For any two date transitions, the one with a larger time span
     * should have a longer or equal animation duration.
     * **Validates: Requirements 5.4, 5.5**
     */
    test("larger time spans have longer or equal durations", () => {
      fc.assert(
        fc.property(
          dateArb,
          dateArb,
          dateArb,
          fc.double({ min: 0, max: 0.99, noNaN: true }),
          (date1, date2, date3, speed) => {
            // Create two transitions with different time spans
            const span1 = Math.abs(date2.getTime() - date1.getTime());
            const span2 = Math.abs(date3.getTime() - date1.getTime());

            const duration1 = calculateAnimationDuration(date1, date2, speed);
            const duration2 = calculateAnimationDuration(date1, date3, speed);

            // If span1 < span2, then duration1 <= duration2
            if (span1 < span2) {
              return duration1 <= duration2;
            }
            // If span1 > span2, then duration1 >= duration2
            if (span1 > span2) {
              return duration1 >= duration2;
            }
            // If spans are equal, durations should be equal
            return Math.abs(duration1 - duration2) < 1;
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe("Property 3: Speed setting affects duration inversely", () => {
    /**
     * **Property 3: Speed setting affects duration inversely**
     * For any animation speed setting, higher speed values
     * should result in shorter animation durations.
     * **Validates: Requirements 2.2**
     */
    test("higher speed results in shorter or equal duration", () => {
      fc.assert(
        fc.property(
          dateArb,
          dateArb,
          fc.double({ min: 0, max: 0.98, noNaN: true }),
          fc.double({ min: 0.01, max: 0.02, noNaN: true }),
          (startDate, targetDate, speed1, speedDelta) => {
            // Skip if same date (duration would be 0 regardless)
            if (startDate.getTime() === targetDate.getTime()) {
              return true;
            }

            const speed2 = Math.min(speed1 + speedDelta, 0.99);
            const duration1 = calculateAnimationDuration(
              startDate,
              targetDate,
              speed1,
            );
            const duration2 = calculateAnimationDuration(
              startDate,
              targetDate,
              speed2,
            );

            // Higher speed should result in shorter or equal duration
            return duration2 <= duration1;
          },
        ),
        { numRuns: 100 },
      );
    });

    test("instant mode (speed >= 1) returns 0 duration", () => {
      fc.assert(
        fc.property(dateArb, dateArb, (startDate, targetDate) => {
          const duration = calculateAnimationDuration(startDate, targetDate, 1);
          return duration === 0;
        }),
        { numRuns: 100 },
      );
    });
  });

  describe("Property 9: Orbital direction matches time direction", () => {
    /**
     * **Property 9: Orbital direction matches time direction**
     * For any date transition where target date differs from start date,
     * the direction should be 'forward' for future dates and 'backward' for past dates.
     * **Validates: Requirements 1.6, 1.7**
     */
    test("forward direction for future dates", () => {
      fc.assert(
        fc.property(dateArb, dateArb, (startDate, targetDate) => {
          const direction = determineTimeDirection(startDate, targetDate);

          if (targetDate.getTime() > startDate.getTime()) {
            return direction === "forward";
          }
          if (targetDate.getTime() < startDate.getTime()) {
            return direction === "backward";
          }
          // Same date - direction doesn't matter
          return true;
        }),
        { numRuns: 100 },
      );
    });

    test("interpolated dates progress monotonically from start to target", () => {
      fc.assert(
        fc.property(
          dateArb,
          dateArb,
          fc.double({ min: 0, max: 0.99, noNaN: true }),
          fc.double({ min: 0.001, max: 0.01, noNaN: true }),
          (startDate, targetDate, progress1, progressDelta) => {
            const progress2 = Math.min(progress1 + progressDelta, 1);

            const date1 = interpolateDate(startDate, targetDate, progress1);
            const date2 = interpolateDate(startDate, targetDate, progress2);

            const direction = determineTimeDirection(startDate, targetDate);

            if (direction === "forward") {
              // For forward direction, later progress = later date
              return date2.getTime() >= date1.getTime();
            } else {
              // For backward direction, later progress = earlier date
              return date2.getTime() <= date1.getTime();
            }
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe("Property 10: Same date transition is no-op", () => {
    /**
     * **Property 10: Same date transition is no-op**
     * For any date transition where start date equals target date,
     * no animation should occur (duration = 0).
     * **Validates: Requirements 1.1**
     */
    test("same date returns 0 duration", () => {
      fc.assert(
        fc.property(
          dateArb,
          fc.double({ min: 0, max: 0.99, noNaN: true }),
          (date, speed) => {
            const duration = calculateAnimationDuration(date, date, speed);
            return duration === 0;
          },
        ),
        { numRuns: 100 },
      );
    });

    test("isSameDate returns true for identical dates", () => {
      fc.assert(
        fc.property(dateArb, (date) => {
          return isSameDate(date, new Date(date.getTime()));
        }),
        { numRuns: 100 },
      );
    });
  });

  describe("Edge cases", () => {
    test("interpolateDate clamps progress outside [0, 1]", () => {
      const start = new Date("2024-01-01");
      const target = new Date("2024-12-31");

      const belowZero = interpolateDate(start, target, -0.5);
      const aboveOne = interpolateDate(start, target, 1.5);

      expect(belowZero.getTime()).toBe(start.getTime());
      expect(aboveOne.getTime()).toBe(target.getTime());
    });

    test("isValidAnimationDate validates dates correctly", () => {
      expect(isValidAnimationDate(new Date())).toBe(true);
      expect(isValidAnimationDate(new Date("2024-01-01"))).toBe(true);
      expect(isValidAnimationDate(new Date("invalid"))).toBe(false);
    });
  });
});
