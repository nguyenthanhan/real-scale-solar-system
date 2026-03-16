/**
 * Easing functions for smooth animation transitions
 * Used by date transition animation feature
 */

export type EasingFunction = (t: number) => number;

/**
 * Cubic ease-in-out: slow start, fast middle, slow end
 * Best for general UI animations
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Quartic ease-out: fast start, slow end
 * Good for elements entering the screen
 */
export function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

/**
 * Linear: constant speed
 * Use when consistent motion is needed
 */
export function linear(t: number): number {
  return t;
}

/**
 * Quadratic ease-in-out: gentler than cubic
 */
export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
