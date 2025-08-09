/**
 * Custom hook for texture generation with Web Worker support, caching, and debouncing
 * Prevents UI freezing during heavy texture generation operations
 */

import { useRef, useCallback, useEffect, useState, useMemo } from "react";
import { Texture } from "three";
import { textureCache, TextureCacheKey } from "@/utils/texture-cache";

interface TextureGenerationRequest {
  type: "GENERATE_TEXTURE";
  textureType:
    | "earth"
    | "mars"
    | "gas-giant"
    | "sun"
    | "ice-giant"
    | "rocky-planet";
  width: number;
  height: number;
  color?: string;
  id: string;
}

interface TextureGenerationResponse {
  type: "TEXTURE_GENERATED";
  imageData: ImageBitmap;
  id: string;
}

interface WorkerErrorResponse {
  type: "TEXTURE_ERROR";
  error: string;
  id: string;
}

interface WorkerMessage {
  type: "WORKER_READY";
}

export function useTextureGeneration() {
  const workerRef = useRef<Worker | null>(null);
  const [isWorkerReady, setIsWorkerReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const pendingRequests = useRef<Map<string, (texture: Texture) => void>>(
    new Map()
  );
  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Initialize worker
  useEffect(() => {
    if (typeof window !== "undefined" && "Worker" in window) {
      try {
        // Create worker instance
        workerRef.current = new Worker(
          new URL("../workers/texture-generation.worker.ts", import.meta.url),
          { type: "module" }
        );

        // Handle worker messages
        workerRef.current.onmessage = async (
          event: MessageEvent<
            TextureGenerationResponse | WorkerErrorResponse | WorkerMessage
          >
        ) => {
          const { type } = event.data;

          if (type === "WORKER_READY") {
            setIsWorkerReady(true);
          } else if (type === "TEXTURE_GENERATED") {
            const { imageData, id } = event.data as TextureGenerationResponse;
            const callback = pendingRequests.current.get(id);

            if (callback) {
              try {
                // Convert ImageBitmap to Three.js Texture
                const texture = new Texture(imageData);
                texture.needsUpdate = true;

                // Close the ImageBitmap to free GPU memory
                imageData.close();

                callback(texture);
                pendingRequests.current.delete(id);
                setIsGenerating(false);
              } catch (error) {
                console.error(
                  "Error creating texture from ImageBitmap:",
                  error
                );
                // Ensure ImageBitmap is closed even on error
                try {
                  imageData.close();
                } catch (closeError) {
                  console.warn("Error closing ImageBitmap:", closeError);
                }
                setIsGenerating(false);
              }
            }
          } else if (type === "TEXTURE_ERROR") {
            const { error, id } = event.data as WorkerErrorResponse;
            console.error("Texture generation error:", error);
            pendingRequests.current.delete(id);
            setIsGenerating(false);
          }
        };

        // Handle worker errors
        workerRef.current.onerror = (error) => {
          console.error("Texture generation worker error:", error);
          setIsWorkerReady(false);
          setIsGenerating(false);
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

          // Clear debounce timers
          for (const timer of debounceTimers.current.values()) {
            clearTimeout(timer);
          }
          debounceTimers.current.clear();
        };
      } catch (error) {
        console.warn("Failed to initialize texture generation worker:", error);
        setIsWorkerReady(false);
      }
    }
  }, []);

  // Generate texture with caching and debouncing
  const generateTexture = useCallback(
    (key: TextureCacheKey, debounceMs: number = 300): Promise<Texture> => {
      return new Promise((resolve, reject) => {
        const cacheKey = `${key.type}_${key.width}x${key.height}_${
          key.color || "default"
        }`;

        // Check cache first
        const cachedTexture = textureCache.get(key);
        if (cachedTexture) {
          resolve(cachedTexture);
          return;
        }

        // Clear existing debounce timer for this key
        const existingTimer = debounceTimers.current.get(cacheKey);
        if (existingTimer) {
          clearTimeout(existingTimer);
        }

        // Set new debounce timer
        const timer = setTimeout(() => {
          debounceTimers.current.delete(cacheKey);

          if (!workerRef.current || !isWorkerReady) {
            reject(new Error("Worker not ready"));
            return;
          }

          setIsGenerating(true);
          const requestId = `${Date.now()}_${Math.random()}`;

          // Store callback for when worker responds
          pendingRequests.current.set(requestId, (texture: Texture) => {
            // Cache the generated texture
            textureCache.set(key, texture);
            resolve(texture);
          });

          // Send generation request to worker
          const request: TextureGenerationRequest = {
            type: "GENERATE_TEXTURE",
            textureType: key.type,
            width: key.width,
            height: key.height,
            color: key.color,
            id: requestId,
          };

          workerRef.current.postMessage(request);

          // Timeout after 10 seconds
          setTimeout(() => {
            if (pendingRequests.current.has(requestId)) {
              pendingRequests.current.delete(requestId);
              setIsGenerating(false);
              reject(new Error("Texture generation timeout"));
            }
          }, 10000);
        }, debounceMs);

        debounceTimers.current.set(cacheKey, timer);
      });
    },
    [isWorkerReady]
  );

  // Preload common textures
  const preloadTextures = useCallback(async (): Promise<void> => {
    const commonTextures: TextureCacheKey[] = [
      { type: "earth", width: 512, height: 256 },
      { type: "mars", width: 512, height: 256 },
      { type: "gas-giant", width: 512, height: 256, color: "#FFD700" }, // Jupiter
      { type: "gas-giant", width: 512, height: 256, color: "#F4A460" }, // Saturn
      { type: "ice-giant", width: 512, height: 256, color: "#87CEEB" }, // Uranus
      { type: "ice-giant", width: 512, height: 256, color: "#4169E1" }, // Neptune
    ];

    const promises = commonTextures.map((key) =>
      generateTexture(key, 0).catch((error) => {
        console.warn(`Failed to preload texture ${key.type}:`, error);
        return null;
      })
    );

    await Promise.all(promises);
  }, [generateTexture]);

  // Initialize memory tracking on mount
  useEffect(() => {
    textureCache.initialize();
  }, []);

  // Get cache statistics
  const cacheStats = useMemo(() => textureCache.getStats(), []);

  return {
    isWorkerReady,
    isGenerating,
    generateTexture,
    preloadTextures,
    cacheStats,
    clearCache: () => textureCache.clear(),
  };
}
