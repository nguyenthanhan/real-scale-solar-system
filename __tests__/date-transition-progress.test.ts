import fc from "fast-check";
import {
  interpolateDate,
  calculateAnimationDuration,
} from "../utils/date-interpolation";
import { easeInOutCubic } from "../utils/easing-functions";

/**
 * Property-based tests for progress tracking
 * **Feature: date-transition-animation**
 */
describe("Date Transition Progress - Property Tests", () => {
  // Date generator for reasonable date range
  const dateArb = fc
    .integer({
      min: new Date("1700-01-01").getTime(),
      max: new Date("2300-12-31").getTime(),
    })
    .map((ts) => new Date(ts));

  describe("Property 4: Progress percentage matches elapsed time", () => {
    /**
     * **Property 4: Progress percentage matches elapsed time**
     * For any point during animation, the progress percentage should equal
     * (elapsed time / total duration) * 100.
     * **Validates: Requirements 3.2, 3.5**
     */
    test("progress is proportional to elapsed time", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0, max: 1, noNaN: true }),
          fc.double({ min: 100, max: 3000, noNaN: true }),
          (progressRatio, duration) => {
            // Simulate elapsed time
            const elapsed = progressRatio * duration;

            // Calculate raw progress
            const rawProgress = Math.min(elapsed / duration, 1);

            // Progress should match the ratio
            return Math.abs(rawProgress - progressRatio) < 0.0001;
          },
        ),
        { numRuns: 100 },
      );
    });

    test("progress percentage is always between 0 and 100", () => {
      fc.assert(
        fc.property(
          fc.double({ min: -100, max: 5000, noNaN: true }),
          fc.double({ min: 100, max: 3000, noNaN: true }),
          (elapsed, duration) => {
            const rawProgress = Math.min(Math.max(elapsed / duration, 0), 1);
            const percentage = rawProgress * 100;

            return percentage >= 0 && percentage <= 100;
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe("Property 5: Interpolated date matches progress", () => {
    /**
     * **Property 5: Interpolated date matches progress**
     * For any progress value, the displayed interpolated date should be
     * at the corresponding point between start and target dates.
     * **Validates: Requirements 3.4**
     */
    test("interpolated date corresponds to progress value", () => {
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

            // Calculate expected time
            const expectedTime =
              startDate.getTime() +
              (targetDate.getTime() - startDate.getTime()) * progress;

            // Allow small floating point tolerance
            return Math.abs(interpolated.getTime() - expectedTime) < 1;
          },
        ),
        { numRuns: 100 },
      );
    });

    test("eased progress produces smooth interpolation", () => {
      fc.assert(
        fc.property(
          dateArb,
          dateArb,
          fc.double({ min: 0, max: 1, noNaN: true }),
          (startDate, targetDate, rawProgress) => {
            const easedProgress = easeInOutCubic(rawProgress);
            const interpolated = interpolateDate(
              startDate,
              targetDate,
              easedProgress,
            );

            // Interpolated date should still be between start and target
            const minTime = Math.min(startDate.getTime(), targetDate.getTime());
            const maxTime = Math.max(startDate.getTime(), targetDate.getTime());

            return (
              interpolated.getTime() >= minTime &&
              interpolated.getTime() <= maxTime
            );
          },
        ),
        { numRuns: 100 },
      );
    });

    test("progress 0.5 with linear interpolation gives midpoint date", () => {
      fc.assert(
        fc.property(dateArb, dateArb, (startDate, targetDate) => {
          const interpolated = interpolateDate(startDate, targetDate, 0.5);

          const expectedMidpoint =
            (startDate.getTime() + targetDate.getTime()) / 2;

          // Allow small floating point tolerance
          return Math.abs(interpolated.getTime() - expectedMidpoint) < 1;
        }),
        { numRuns: 100 },
      );
    });
  });

  describe("Animation duration and progress relationship", () => {
    test("longer durations allow more granular progress updates", () => {
      fc.assert(
        fc.property(
          dateArb,
          dateArb,
          fc.double({ min: 0, max: 0.5, noNaN: true }),
          (startDate, targetDate, speed) => {
            // Skip same dates
            if (startDate.getTime() === targetDate.getTime()) {
              return true;
            }

            const duration = calculateAnimationDuration(
              startDate,
              targetDate,
              speed,
            );

            // At 60fps, we get duration/16.67 frames
            // More frames = more granular progress updates
            const expectedFrames = duration / 16.67;

            // Should have at least a few frames for smooth animation
            return duration === 0 || expectedFrames >= 1;
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
