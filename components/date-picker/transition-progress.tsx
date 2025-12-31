"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type { TimeDirection } from "@/utils/date-interpolation";

interface TransitionProgressProps {
  isAnimating: boolean;
  progress: number;
  currentDate: Date;
  targetDate: Date;
  direction: TimeDirection;
  onCancel: () => void;
  className?: string;
}

/**
 * Format date consistently with date picker format
 */
export function formatTransitionDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function TransitionProgress({
  isAnimating,
  progress,
  currentDate,
  targetDate,
  direction,
  onCancel,
  className,
}: TransitionProgressProps) {
  if (!isAnimating) return null;

  const directionIcon = direction === "forward" ? "→" : "←";
  const percentage = Math.round(progress * 100);

  return (
    <div
      className={cn(
        "flex flex-col gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30",
        "animate-in fade-in slide-in-from-top-2 duration-200",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={`Transitioning to ${formatTransitionDate(targetDate)}, ${percentage}% complete`}
    >
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-100 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Progress info */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-gray-300">
          <span className="text-blue-400">{directionIcon}</span>
          <span className="font-medium">
            {formatTransitionDate(currentDate)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-400 tabular-nums">{percentage}%</span>

          <button
            onClick={onCancel}
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded",
              "text-gray-400 hover:text-white",
              "bg-gray-700/50 hover:bg-gray-600/50",
              "transition-colors duration-150",
            )}
            aria-label="Skip animation and jump to target date"
          >
            <X className="w-3 h-3" />
            <span>Skip</span>
          </button>
        </div>
      </div>
    </div>
  );
}
