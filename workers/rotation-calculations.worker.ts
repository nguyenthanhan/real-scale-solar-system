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

interface RotationCalculationErrorResponse {
  type: "ROTATION_CALCULATION_ERROR";
  error: string;
  id: string;
}

interface InitWorkerRequest {
  type: "INIT_WORKER";
}

type WorkerRequest = RotationCalculationRequest | InitWorkerRequest;

// Cache for worker-side calculations
const workerCache = new Map<string, number>();
const MAX_CACHE_SIZE = 100;

// Message validation utilities
function validateMessageStructure(data: unknown): data is WorkerRequest {
  if (!data || typeof data !== "object") {
    return false;
  }

  const message = data as Record<string, unknown>;

  if (!message.type || typeof message.type !== "string") {
    return false;
  }

  switch (message.type) {
    case "CALCULATE_ROTATION_MULTIPLIER": {
      return (
        typeof message.planetRotationPeriod === "number" &&
        typeof message.rotationSpeedMinutes === "number" &&
        typeof message.id === "string" &&
        message.id.length > 0
      );
    }

    case "INIT_WORKER": {
      // INIT_WORKER only requires the type field
      return true;
    }

    default:
      return false;
  }
}

function generateCacheKey(
  planetRotationPeriod: number,
  rotationSpeedMinutes: number
): string {
  // Use full precision values to avoid quantization issues
  // This ensures distinct inputs generate distinct cache keys
  return `${planetRotationPeriod}_${rotationSpeedMinutes}`;
}

function getCachedRotationMultiplier(
  planetRotationPeriod: number,
  rotationSpeedMinutes: number
): number | null {
  const key = generateCacheKey(planetRotationPeriod, rotationSpeedMinutes);
  const value = workerCache.get(key);

  if (value !== undefined) {
    // Move accessed entry to end (most recently used position)
    // This implements LRU behavior by maintaining access order
    workerCache.delete(key);
    workerCache.set(key, value);
    return value;
  }

  return null;
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
    // Use explicit undefined check to avoid issues with falsy but valid keys
    if (firstKey !== undefined) {
      workerCache.delete(firstKey);
    }
  }

  workerCache.set(key, result);
}

function calculateRotationMultiplier(
  planetRotationPeriod: number,
  rotationSpeedMinutes: number
): number {
  // Input validation to prevent NaN or Infinity results
  if (!Number.isFinite(planetRotationPeriod)) {
    throw new Error(
      `Invalid planetRotationPeriod: ${planetRotationPeriod}. Must be a finite number.`
    );
  }

  if (!Number.isFinite(rotationSpeedMinutes)) {
    throw new Error(
      `Invalid rotationSpeedMinutes: ${rotationSpeedMinutes}. Must be a finite number.`
    );
  }

  // Validate sensible ranges to prevent extreme calculations
  const MAX_ROTATION_PERIOD = 1000; // 1000 days max
  const MIN_ROTATION_PERIOD = 0.001; // 0.001 days min (about 1.4 minutes)
  const MAX_SPEED_MINUTES = 1_000_000; // 1 million minutes per second max
  const MIN_SPEED_MINUTES = 0.001; // 0.001 minutes per second min

  if (Math.abs(planetRotationPeriod) > MAX_ROTATION_PERIOD) {
    throw new Error(
      `Planet rotation period ${planetRotationPeriod} exceeds maximum allowed value of ${MAX_ROTATION_PERIOD} days.`
    );
  }

  if (
    Math.abs(planetRotationPeriod) < MIN_ROTATION_PERIOD &&
    planetRotationPeriod !== 0
  ) {
    throw new Error(
      `Planet rotation period ${planetRotationPeriod} is below minimum allowed value of ${MIN_ROTATION_PERIOD} days.`
    );
  }

  if (rotationSpeedMinutes > MAX_SPEED_MINUTES) {
    throw new Error(
      `Rotation speed ${rotationSpeedMinutes} exceeds maximum allowed value of ${MAX_SPEED_MINUTES} minutes per second.`
    );
  }

  if (rotationSpeedMinutes < MIN_SPEED_MINUTES && rotationSpeedMinutes !== 0) {
    throw new Error(
      `Rotation speed ${rotationSpeedMinutes} is below minimum allowed value of ${MIN_SPEED_MINUTES} minutes per second.`
    );
  }

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

  // Validate the result to catch any remaining issues
  if (!Number.isFinite(result)) {
    throw new Error(
      `Calculation resulted in invalid value: ${result}. Inputs: planetRotationPeriod=${planetRotationPeriod}, rotationSpeedMinutes=${rotationSpeedMinutes}`
    );
  }

  // Cache the result
  setCachedRotationMultiplier(
    planetRotationPeriod,
    rotationSpeedMinutes,
    result
  );

  return result;
}

// Handle all worker messages with unified validation and error handling
self.addEventListener("message", (event: MessageEvent<WorkerRequest>) => {
  try {
    // Validate message structure
    if (!validateMessageStructure(event.data)) {
      const errorResponse: RotationCalculationErrorResponse = {
        type: "ROTATION_CALCULATION_ERROR",
        error: `Invalid message structure: ${JSON.stringify(event.data)}`,
        id: "validation_error",
      };
      self.postMessage(errorResponse);
      return;
    }

    const { type } = event.data;

    switch (type) {
      case "CALCULATE_ROTATION_MULTIPLIER": {
        const { planetRotationPeriod, rotationSpeedMinutes, id } = event.data;

        try {
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
        } catch (error) {
          // Send calculation error response back to main thread
          const errorResponse: RotationCalculationErrorResponse = {
            type: "ROTATION_CALCULATION_ERROR",
            error:
              error instanceof Error
                ? error.message
                : "Unknown calculation error",
            id,
          };

          self.postMessage(errorResponse);
        }
        break;
      }

      case "INIT_WORKER": {
        self.postMessage({ type: "WORKER_READY" });
        break;
      }

      default: {
        // This should never happen due to validation, but handle for completeness
        const errorResponse: RotationCalculationErrorResponse = {
          type: "ROTATION_CALCULATION_ERROR",
          error: `Unknown message type: ${type}`,
          id: "unknown_type",
        };
        self.postMessage(errorResponse);
      }
    }
  } catch (error) {
    // Catch any unexpected errors in message handling
    const errorResponse: RotationCalculationErrorResponse = {
      type: "ROTATION_CALCULATION_ERROR",
      error: `Unexpected error in message handling: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      id: "unexpected_error",
    };
    self.postMessage(errorResponse);
  }
});

export type {
  RotationCalculationRequest,
  RotationCalculationResponse,
  RotationCalculationErrorResponse,
  InitWorkerRequest,
  WorkerRequest,
};
