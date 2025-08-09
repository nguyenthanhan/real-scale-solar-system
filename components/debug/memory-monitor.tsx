"use client";
/**
 * Debug component for monitoring actual memory usage
 * Shows real memory consumption vs estimates
 */

import { useState, useEffect } from "react";
import { textureCache } from "@/utils/texture-cache";

export function MemoryMonitor() {
  const [stats, setStats] = useState(textureCache.getStats());
  const [isVisible, setIsVisible] = useState(false);
  const [fps, setFps] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [lastTime, setLastTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(textureCache.getStats());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  // FPS tracking
  useEffect(() => {
    let animationId: number;

    const measureFPS = (currentTime: number) => {
      if (lastTime !== 0) {
        const deltaTime = currentTime - lastTime;
        const currentFps = 1000 / deltaTime;
        setFps(Math.round(currentFps));
      }

      setLastTime(currentTime);
      setFrameCount((prev) => prev + 1);
      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [lastTime]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getMemoryUsagePercentage = (): number => {
    return (stats.actualMemoryUsage / stats.maxMemoryUsage) * 100;
  };

  const getMemoryBarColor = (percentage: number): string => {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getFpsColor = (fps: number): string => {
    if (fps >= 55) return "text-green-400";
    if (fps >= 30) return "text-yellow-400";
    return "text-red-400";
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded text-xs hover:bg-gray-700"
      >
        Memory Monitor
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold">Memory Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>

      <div className="space-y-2 text-xs">
        {/* Performance Section */}
        <div className="border-b border-gray-700 pb-2 mb-2">
          <div className="flex justify-between mb-1">
            <span className="font-medium">Performance</span>
          </div>
          <div className="flex justify-between">
            <span>FPS:</span>
            <span className={getFpsColor(fps)}>{fps}</span>
          </div>
          <div className="flex justify-between">
            <span>Frames:</span>
            <span>{frameCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Cache Section */}
        <div className="border-b border-gray-700 pb-2 mb-2">
          <div className="flex justify-between mb-1">
            <span className="font-medium">Texture Cache</span>
          </div>
          {/* Cache Size */}
          <div className="flex justify-between">
            <span>Cache Size:</span>
            <span>
              {stats.size} / {stats.maxSize} textures
            </span>
          </div>

          {/* Cache Efficiency */}
          <div className="flex justify-between">
            <span>Cache Usage:</span>
            <span>{((stats.size / stats.maxSize) * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Memory Section */}
        <div className="border-b border-gray-700 pb-2 mb-2">
          <div className="flex justify-between mb-1">
            <span className="font-medium">Memory Usage</span>
          </div>
          {/* Estimated Memory */}
          <div className="flex justify-between">
            <span>Estimated:</span>
            <span>{formatBytes(stats.memoryUsage)}</span>
          </div>

          {/* Actual Memory */}
          <div className="flex justify-between">
            <span>Actual:</span>
            <span
              className={
                stats.memoryTrackingEnabled
                  ? "text-green-400"
                  : "text-yellow-400"
              }
            >
              {formatBytes(stats.actualMemoryUsage)}
              {!stats.memoryTrackingEnabled && " (est)"}
            </span>
          </div>

          {/* Memory Usage Bar */}
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Usage</span>
              <span>{getMemoryUsagePercentage().toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getMemoryBarColor(
                  getMemoryUsagePercentage()
                )}`}
                style={{
                  width: `${Math.min(getMemoryUsagePercentage(), 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Memory Limit */}
          <div className="flex justify-between text-gray-400">
            <span>Limit:</span>
            <span>{formatBytes(stats.maxMemoryUsage)}</span>
          </div>
        </div>

        {/* Status Section */}
        <div className="border-b border-gray-700 pb-2 mb-2">
          <div className="flex justify-between mb-1">
            <span className="font-medium">Status</span>
          </div>
          {/* Tracking Status */}
          <div className="flex justify-between text-xs">
            <span>Memory Tracking:</span>
            <span
              className={
                stats.memoryTrackingEnabled
                  ? "text-green-400"
                  : "text-yellow-400"
              }
            >
              {stats.memoryTrackingEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>

          {/* Environment */}
          <div className="flex justify-between text-xs">
            <span>Environment:</span>
            <span className="text-blue-400">{process.env.NODE_ENV}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3 pt-2">
          <button
            onClick={() => textureCache.clear()}
            className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
          >
            Clear Cache
          </button>
          <button
            onClick={() => textureCache.enableMemoryTracking()}
            className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
          >
            Enable Tracking
          </button>
        </div>
      </div>
    </div>
  );
}
