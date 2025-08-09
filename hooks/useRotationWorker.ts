/**
 * Custom hook for managing rotation calculations via Web Worker
 * Provides an alternative to main thread calculations for better performance
 */

import { useRef, useCallback, useEffect, useState } from "react";
import { calculateRotationMultiplier } from "@/utils/rotation-calculations";

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

interface WorkerMessage {
  type: "WORKER_READY";
}

export function useRotationWorker() {
  const workerRef = useRef<Worker | null>(null);
  const [isWorkerReady, setIsWorkerReady] = useState(false);
  const pendingRequests = useRef<Map<string, (result: number) => void>>(
    new Map()
  );

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
          event: MessageEvent<RotationCalculationResponse | WorkerMessage>
        ) => {
          const { type } = event.data;

          if (type === "WORKER_READY") {
            setIsWorkerReady(true);
          } else if (type === "ROTATION_MULTIPLIER_RESULT") {
            const { result, id } = event.data as RotationCalculationResponse;
            const callback = pendingRequests.current.get(id);

            if (callback) {
              callback(result);
              pendingRequests.current.delete(id);
            }
          }
        };

        // Handle worker errors
        workerRef.current.onerror = (error) => {
          console.error("Rotation worker error:", error);
          setIsWorkerReady(false);
        };

        // Initialize worker
        workerRef.current.postMessage({ type: "INIT_WORKER" });

        // Cleanup on unmount
        return () => {
          if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
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
      return new Promise((resolve) => {
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

        // Store callback for when worker responds
        pendingRequests.current.set(requestId, resolve);

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
