"use client";

/**
 * Debug component for monitoring actual memory usage and performance.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { textureCache } from "@/utils/texture-cache";

export function MemoryMonitor() {
  // UI state
  const [isVisible, setIsVisible] = useState(true);

  // FPS tracking
  const [fps, setFps] = useState(0);
  const lastTimeRef = useRef(0);
  const fpsSamplesRef = useRef<number[]>([]);
  const [visibilityTrigger, setVisibilityTrigger] = useState(0);
  const [isClient] = useState(() => typeof window !== "undefined");

  // JS heap (when supported)
  const [heapUsed, setHeapUsed] = useState<number | null>(null);
  const [heapTotal, setHeapTotal] = useState<number | null>(null);
  const [heapLimit, setHeapLimit] = useState<number | null>(null);

  // Texture cache stats (safe introspection without external edits)
  const [cacheSize, setCacheSize] = useState<number>(0);
  const [cacheMaxSize, setCacheMaxSize] = useState<number | null>(null);

  const supportsPerformanceMemory =
    isClient &&
    typeof performance !== "undefined" &&
    (performance as unknown as { memory: unknown }).memory;

  const updateHeapStats = useCallback(() => {
    try {
      const mem = (
        performance as unknown as {
          memory:
            | {
                usedJSHeapSize?: number;
                totalJSHeapSize?: number;
                jsHeapSizeLimit?: number;
              }
            | undefined;
        }
      ).memory;
      if (mem) {
        setHeapUsed(
          typeof mem.usedJSHeapSize === "number" ? mem.usedJSHeapSize : null,
        );
        setHeapTotal(
          typeof mem.totalJSHeapSize === "number" ? mem.totalJSHeapSize : null,
        );
        setHeapLimit(
          typeof mem.jsHeapSizeLimit === "number" ? mem.jsHeapSizeLimit : null,
        );
      } else {
        setHeapUsed(null);
        setHeapTotal(null);
        setHeapLimit(null);
      }
    } catch {
      // ignore
    }
  }, []);

  const updateCacheStats = useCallback(() => {
    try {
      const size =
        typeof textureCache.getSize === "function" ? textureCache.getSize() : 0;
      const max =
        typeof textureCache.getMaxSize === "function"
          ? textureCache.getMaxSize()
          : null;
      setCacheSize(size ?? 0);
      setCacheMaxSize(typeof max === "number" ? max : null);
    } catch {
      setCacheSize(0);
      setCacheMaxSize(null);
    }
  }, []);

  // FPS tracking using rAF with simple smoothing (last 20 samples)
  useEffect(() => {
    let rafId: number;

    const measure = (now: number) => {
      // Guard: early return if visibility changed mid-frame
      if (
        !isClient ||
        !isVisible ||
        typeof document === "undefined" ||
        document.visibilityState !== "visible"
      ) {
        return;
      }

      if (lastTimeRef.current) {
        const dt = now - lastTimeRef.current;
        const current = dt > 0 ? 1000 / dt : 0;
        const samples = fpsSamplesRef.current;
        samples.push(current);
        if (samples.length > 20) samples.shift();
        const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
        setFps(Math.round(avg));
      }
      lastTimeRef.current = now;

      // Only schedule next frame if panel is visible and document is visible
      if (
        isClient &&
        isVisible &&
        typeof document !== "undefined" &&
        document.visibilityState === "visible"
      ) {
        rafId = requestAnimationFrame(measure);
      }
    };

    // Only start measuring if panel is visible and document is visible
    if (
      isClient &&
      isVisible &&
      typeof document !== "undefined" &&
      document.visibilityState === "visible"
    ) {
      // Clear stale data before starting/restarting measurement
      fpsSamplesRef.current = [];
      lastTimeRef.current = 0;

      rafId = requestAnimationFrame(measure);
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isClient, isVisible, visibilityTrigger]);

  // Listen for document visibility changes to resume/pause FPS tracking
  useEffect(() => {
    if (!isClient || typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      // Trigger the FPS effect to re-run by updating the visibility trigger
      setVisibilityTrigger((prev) => prev + 1);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isClient]);

  // Periodic stats refresh
  useEffect(() => {
    // Only set up polling if panel is visible and document is visible
    if (
      isClient &&
      isVisible &&
      typeof document !== "undefined" &&
      document.visibilityState === "visible"
    ) {
      const id = setInterval(() => {
        // Double-check visibility state before each update
        if (
          typeof document !== "undefined" &&
          document.visibilityState === "visible"
        ) {
          updateHeapStats();
          updateCacheStats();
        }
      }, 1000);
      return () => clearInterval(id);
    }
  }, [
    updateHeapStats,
    updateCacheStats,
    isClient,
    isVisible,
    visibilityTrigger,
  ]);

  // Initial stats update when visibility changes
  /* eslint-disable */
  useEffect(() => {
    if (
      isClient &&
      isVisible &&
      typeof document !== "undefined" &&
      document.visibilityState === "visible"
    ) {
      updateHeapStats();
      updateCacheStats();
    }
  }, [
    isClient,
    isVisible,
    visibilityTrigger,
    updateHeapStats,
    updateCacheStats,
  ]);
  /* eslint-enable */

  const formatBytes = (bytes: number | null): string => {
    if (bytes == null || isNaN(bytes)) return "n/a";
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"] as const;
    const i = Math.min(
      Math.floor(Math.log(bytes) / Math.log(k)),
      sizes.length - 1,
    );
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getMemoryBarColor = (percentage: number): string => {
    if (percentage < 30) return "bg-green-500";
    if (percentage < 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getFpsColor = (value: number): string => {
    if (value >= 55) return "text-green-400";
    if (value >= 30) return "text-yellow-400";
    return "text-red-400";
  };

  const handleClearCache = useCallback(() => {
    try {
      textureCache.clear();
      updateCacheStats();
    } catch (e) {
      console.warn("Failed to clear texture cache", e);
    }
  }, [updateCacheStats]);

  const cacheUsagePct =
    cacheMaxSize && cacheMaxSize > 0 ? (cacheSize / cacheMaxSize) * 100 : null;

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded text-xs hover:bg-gray-700"
      >
        Memory Monitor
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white p-4 rounded-lg shadow-lg w-[320px]">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold">Memory Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="space-y-3 text-xs">
        {/* Performance Section */}
        <div className="border-b border-gray-700 pb-2">
          <div className="flex justify-between mb-1">
            <span className="font-medium">Performance</span>
          </div>
          <div className="flex justify-between">
            <span>FPS:</span>
            <span className={getFpsColor(fps)}>{fps}</span>
          </div>
        </div>

        {/* Texture Cache Section */}
        <div className="border-b border-gray-700 pb-2">
          <div className="flex justify-between mb-1">
            <span className="font-medium">Texture Cache</span>
          </div>
          <div className="flex justify-between">
            <span>Cache Size:</span>
            <span>
              {cacheSize}
              {cacheMaxSize != null ? ` / ${cacheMaxSize}` : ""} textures
            </span>
          </div>
          {cacheUsagePct != null && cacheUsagePct > 0 && (
            <div className="mt-2">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getMemoryBarColor(
                    cacheUsagePct,
                  )}`}
                  style={{ width: `${Math.min(cacheUsagePct, 100)}%` }}
                />
              </div>
            </div>
          )}
          <div className="flex gap-2 mt-2 justify-end">
            <button
              onClick={updateCacheStats}
              className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs"
            >
              Refresh
            </button>
            <button
              onClick={handleClearCache}
              className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
            >
              Clear Cache
            </button>
          </div>
        </div>

        {/* Browser Memory Section (reference) */}
        <div className="pb-1">
          <div className="flex justify-between mb-1">
            <span className="font-medium">Browser Memory</span>
            <span className="text-gray-400">
              {supportsPerformanceMemory
                ? "from performance.memory"
                : "not supported"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Used:</span>
            <span className="text-gray-300">{formatBytes(heapUsed)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total:</span>
            <span className="text-gray-300">{formatBytes(heapTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Limit:</span>
            <span className="text-gray-300">{formatBytes(heapLimit)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
