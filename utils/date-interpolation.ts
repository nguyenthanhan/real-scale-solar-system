/**
 * Date interpolation utilities for date transition animation
 * Handles smooth date transitions between start and target dates
 */

export type TimeDirection = "forward" | "backward";

export interface AnimationDurationConfig {
  minDuration: number; // Minimum animation duration in ms (default: 300)
  maxDuration: number; // Maximum animation duration in ms (default: 3000)
}

const DEFAULT_CONFIG: AnimationDurationConfig = {
  minDuration: 300,
  maxDuration: 3000,
};

/**
 * Interpolates between two dates based on progress (0-1)
 * @param start - Start date
 * @param target - Target date
 * @param progress - Progress value between 0 and 1
 * @returns Interpolated date
 */
export function interpolateDate(
  start: Date,
  target: Date,
  progress: number,
): Date {
  // Clamp progress to [0, 1]
  const clampedProgress = Math.max(0, Math.min(1, progress));

  const startTime = start.getTime();
  const targetTime = target.getTime();

  const interpolatedTime =
    startTime + (targetTime - startTime) * clampedProgress;

  return new Date(interpolatedTime);
}

/**
 * Calculates animation duration based on time span and speed setting
 * Longer time spans get longer animations (logarithmic scaling)
 * Higher speed values result in shorter durations
 *
 * @param start - Start date
 * @param target - Target date
 * @param speed - Speed value between 0 and 1 (1 = instant)
 * @param config - Optional duration configuration
 * @returns Animation duration in milliseconds
 */
export function calculateAnimationDuration(
  start: Date,
  target: Date,
  speed: number,
  config: AnimationDurationConfig = DEFAULT_CONFIG,
): number {
  // Same date = no animation needed
  if (start.getTime() === target.getTime()) {
    return 0;
  }

  // Instant mode
  if (speed >= 1) {
    return 0;
  }

  const daysDiff =
    Math.abs(target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  // Logarithmic scaling: longer time spans get proportionally longer animations
  // log10(1) = 0, log10(10) = 1, log10(100) = 2, log10(365) ≈ 2.56
  const baseDuration = Math.min(
    config.maxDuration,
    Math.max(config.minDuration, Math.log10(daysDiff + 1) * 1000),
  );

  // Apply speed: higher speed = shorter duration
  // speed 0 = full duration, speed 0.9 = 10% duration
  const speedMultiplier = 1 - speed * 0.9;

  return Math.max(config.minDuration * 0.1, baseDuration * speedMultiplier);
}

/**
 * Determines the time direction based on start and target dates
 * Forward = target is in the future (planets move counter-clockwise)
 * Backward = target is in the past (planets move clockwise)
 *
 * @param start - Start date
 * @param target - Target date
 * @returns Time direction
 */
export function determineTimeDirection(
  start: Date,
  target: Date,
): TimeDirection {
  return target.getTime() > start.getTime() ? "forward" : "backward";
}

/**
 * Checks if two dates are effectively the same (within 1 second tolerance)
 * Used to determine if animation should be skipped
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if dates are the same
 */
export function isSameDate(date1: Date, date2: Date): boolean {
  return Math.abs(date1.getTime() - date2.getTime()) < 1000;
}

/**
 * Validates that a date is valid for animation
 * @param date - Date to validate
 * @returns True if date is valid
 */
export function isValidAnimationDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}
