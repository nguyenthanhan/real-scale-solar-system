"use client";

import { cn } from "@/lib/utils";

interface AnimationSpeedControlProps {
  speed: number; // 0-1
  onSpeedChange: (speed: number) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Get human-readable label for animation speed
 */
function getSpeedLabel(speed: number): string {
  if (speed >= 1) return "Instant";
  if (speed >= 0.8) return "Fast";
  if (speed >= 0.5) return "Normal";
  if (speed >= 0.2) return "Slow";
  return "Very Slow";
}

export function AnimationSpeedControl({
  speed,
  onSpeedChange,
  disabled = false,
  className,
}: AnimationSpeedControlProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 px-2 py-1.5 rounded-md bg-black/20",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <label
          htmlFor="animation-speed"
          className="text-xs text-gray-400 select-none"
        >
          Animation
        </label>
        <span className="text-xs text-gray-300 font-medium">
          {getSpeedLabel(speed)}
        </span>
      </div>
      <input
        id="animation-speed"
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={speed}
        onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
        disabled={disabled}
        className={cn(
          "w-full h-1.5 rounded-full appearance-none cursor-pointer",
          "bg-gray-700",
          "[&::-webkit-slider-thumb]:appearance-none",
          "[&::-webkit-slider-thumb]:w-3",
          "[&::-webkit-slider-thumb]:h-3",
          "[&::-webkit-slider-thumb]:rounded-full",
          "[&::-webkit-slider-thumb]:bg-blue-500",
          "[&::-webkit-slider-thumb]:cursor-pointer",
          "[&::-webkit-slider-thumb]:transition-transform",
          "[&::-webkit-slider-thumb]:hover:scale-110",
          "[&::-moz-range-thumb]:w-3",
          "[&::-moz-range-thumb]:h-3",
          "[&::-moz-range-thumb]:rounded-full",
          "[&::-moz-range-thumb]:bg-blue-500",
          "[&::-moz-range-thumb]:border-0",
          "[&::-moz-range-thumb]:cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        aria-label={`Animation speed: ${getSpeedLabel(speed)}`}
      />
    </div>
  );
}
