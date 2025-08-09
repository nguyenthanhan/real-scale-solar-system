/**
 * Web Worker for rotation calculations
 * Moves complex mathematical operations off the main thread
 */

import {
  ROTATION_CONSTANTS,
  calculateRotationSpeed,
  calculateRotationDirection,
} from "../utils/rotation-calculations";

// Message types for worker communication
interface RotationCalculationRequest {
  type: "CALCULATE_ROTATION_MULTIPLIER";
  planetRotationPeriod: number;
  rotationSpeedMinutes: number;
  id: string;
}

interface RotationCalculationResponse {
  type: "ROTATION_MULTIPLIER_RESULT";
  result: number;
  id: string;
}

// Cache for worker-side calculations
const workerCache = new Map<string, number>();
const MAX_CACHE_SIZE = 100;

function generateCacheKey(
  planetRotationPeriod: number,
  rotationSpeedMinutes: number
): string {
  return `${planetRotationPeriod.toFixed(6)}_${rotationSpeedMinutes.toFixed(
    1
  )}`;
}

function getCachedRotationMultiplier(
  planetRotationPeriod: number,
  rotationSpeedMinutes: number
): number | null {
  const key = generateCacheKey(planetRotationPeriod, rotationSpeedMinutes);
  return workerCache.get(key) || null;
}

function setCachedRotationMultiplier(
  planetRotationPeriod: number,
  rotationSpeedMinutes: number,
  result: number
): void {
  const key = generateCacheKey(planetRotationPeriod, rotationSpeedMinutes);

  // Prevent cache from growing too large
  if (workerCache.size >= MAX_CACHE_SIZE) {
    const firstKey = workerCache.keys().next().value;
    workerCache.delete(firstKey);
  }

  workerCache.set(key, result);
}

function calculateRotationMultiplier(
  planetRotationPeriod: number,
  rotationSpeedMinutes: number
): number {
  // Check cache first
  const cached = getCachedRotationMultiplier(
    planetRotationPeriod,
    rotationSpeedMinutes
  );
  if (cached !== null) {
    return cached;
  }

  // Calculate new value
  const speed = calculateRotationSpeed(
    planetRotationPeriod,
    rotationSpeedMinutes
  );
  const direction = calculateRotationDirection(planetRotationPeriod);
  const result = speed * direction;

  // Cache the result
  setCachedRotationMultiplier(
    planetRotationPeriod,
    rotationSpeedMinutes,
    result
  );

  return result;
}

// Handle messages from main thread
self.addEventListener(
  "message",
  (event: MessageEvent<RotationCalculationRequest>) => {
    const { type, planetRotationPeriod, rotationSpeedMinutes, id } = event.data;

    if (type === "CALCULATE_ROTATION_MULTIPLIER") {
      const result = calculateRotationMultiplier(
        planetRotationPeriod,
        rotationSpeedMinutes
      );

      const response: RotationCalculationResponse = {
        type: "ROTATION_MULTIPLIER_RESULT",
        result,
        id,
      };

      self.postMessage(response);
    }
  }
);

// Handle worker initialization
self.addEventListener("message", (event: MessageEvent) => {
  if (event.data.type === "INIT_WORKER") {
    self.postMessage({ type: "WORKER_READY" });
  }
});

export type { RotationCalculationRequest, RotationCalculationResponse };
