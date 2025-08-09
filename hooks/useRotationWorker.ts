/**
 * Custom hook for managing rotation calculations via Web Worker
 * Provides an alternative to main thread calculations for better performance
 */

import { useRef, useCallback, useEffect, useState } from "react";
import { calculateRotationMultiplier } from "@/utils/rotation-calculations";
import type {
  RotationCalculationRequest,
  RotationCalculationResponse,
  RotationCalculationErrorResponse,
} from "@/workers/rotation-calculations.worker";

interface WorkerMessage {
  type: "WORKER_READY";
}

export function useRotationWorker() {
  const workerRef = useRef<Worker | null>(null);
  const [isWorkerReady, setIsWorkerReady] = useState(false);
  const pendingRequests = useRef<
    Map<
      string,
      { resolve: (result: number) => void; reject: (error: Error) => void }
    >
  >(new Map());

  // Initialize worker
  useEffect(() => {
    if (typeof window !== "undefined" && "Worker" in window) {
      try {
        // Create worker instance
        workerRef.current = new Worker(
          new URL(
            "../workers/rotation-calculations.worker.ts",
            import.meta.url
          ),
          { type: "module" }
        );

        // Handle worker messages
        workerRef.current.onmessage = (
          event: MessageEvent<
            | RotationCalculationResponse
            | RotationCalculationErrorResponse
            | WorkerMessage
          >
        ) => {
          const { type } = event.data;

          if (type === "WORKER_READY") {
            setIsWorkerReady(true);
          } else if (type === "ROTATION_MULTIPLIER_RESULT") {
            const { result, id } = event.data as RotationCalculationResponse;
            const request = pendingRequests.current.get(id);

            if (request) {
              request.resolve(result);
              pendingRequests.current.delete(id);
            }
          } else if (type === "ROTATION_CALCULATION_ERROR") {
            const { error, id } =
              event.data as RotationCalculationErrorResponse;
            const request = pendingRequests.current.get(id);

            if (request) {
              console.error("Rotation calculation error:", error);
              request.reject(new Error(error));
              pendingRequests.current.delete(id);
            }
          }
        };

        // Handle worker errors
        workerRef.current.onerror = (error) => {
          console.error("Rotation worker error:", error);
          setIsWorkerReady(false);

          // Reject all pending promises immediately
          const workerError = new Error(
            `Worker error: ${error.message || "Unknown worker error"}`
          );
          for (const [id, request] of pendingRequests.current.entries()) {
            request.reject(workerError);
          }
          pendingRequests.current.clear();
        };

        // Initialize worker
        workerRef.current.postMessage({ type: "INIT_WORKER" });

        // Cleanup on unmount
        return () => {
          if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
          }

          // Reject all pending promises before clearing
          const cleanupError = new Error("Worker terminated during cleanup");
          for (const [id, request] of pendingRequests.current.entries()) {
            request.reject(cleanupError);
          }
          pendingRequests.current.clear();
        };
      } catch (error) {
        console.warn("Failed to initialize rotation worker:", error);
        setIsWorkerReady(false);
      }
    }
  }, []);

  // Calculate rotation multiplier using worker with synchronous fallback
  const calculateRotationMultiplierAsync = useCallback(
    (
      planetRotationPeriod: number,
      rotationSpeedMinutes: number
    ): Promise<number> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current || !isWorkerReady) {
          // Synchronous fallback when worker is not ready
          const result = calculateRotationMultiplier(
            planetRotationPeriod,
            rotationSpeedMinutes
          );
          resolve(result);
          return;
        }

        const requestId = `${Date.now()}_${Math.random()}`;

        // Store resolve and reject callbacks for when worker responds
        pendingRequests.current.set(requestId, { resolve, reject });

        // Send calculation request to worker
        const request: RotationCalculationRequest = {
          type: "CALCULATE_ROTATION_MULTIPLIER",
          planetRotationPeriod,
          rotationSpeedMinutes,
          id: requestId,
        };

        workerRef.current.postMessage(request);

        // Timeout after 1 second - fallback to synchronous calculation
        setTimeout(() => {
          if (pendingRequests.current.has(requestId)) {
            pendingRequests.current.delete(requestId);
            // Fallback to synchronous calculation on timeout
            const result = calculateRotationMultiplier(
              planetRotationPeriod,
              rotationSpeedMinutes
            );
            resolve(result);
          }
        }, 1000);
      });
    },
    [isWorkerReady]
  );

  return {
    isWorkerReady,
    calculateRotationMultiplier: calculateRotationMultiplierAsync,
  };
}
