export const ANIMATION_SPEED_STORAGE_KEY = "date-picker-animation-speed";
export const DEFAULT_ANIMATION_SPEED = 0.5;

export function parseStoredAnimationSpeed(
  value: string | null,
  fallback = DEFAULT_ANIMATION_SPEED,
): number {
  if (value === null) {
    return fallback;
  }

  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(1, Math.max(0, parsed));
}
