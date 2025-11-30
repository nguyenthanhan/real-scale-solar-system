"use client";

import type { SimulationMode } from "@/contexts/simulation-mode-context";

interface ModeToggleButtonProps {
  /** Current simulation mode */
  mode: SimulationMode;
  /** Callback when button is clicked */
  onToggle: () => void;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Button to toggle between Speed Mode and Date Mode
 */
export function ModeToggleButton({
  mode,
  onToggle,
  className = "",
}: ModeToggleButtonProps) {
  const isDateMode = mode === "date";

  return (
    <button
      onClick={onToggle}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-md
        bg-black/80 text-white text-sm font-medium
        hover:bg-black/90 transition-colors
        ${isDateMode ? "ring-2 ring-blue-500" : ""}
        ${className}
      `}
      aria-label={`Switch to ${isDateMode ? "Speed" : "Date"} Mode`}
      aria-pressed={isDateMode}
      title={
        isDateMode
          ? "Switch to Speed Mode (animated simulation)"
          : "Switch to Date Mode (view specific date)"
      }
    >
      {isDateMode ? (
        <>
          {/* Play icon for switching to Speed Mode */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
              clipRule="evenodd"
            />
          </svg>
          <span>Speed Mode</span>
        </>
      ) : (
        <>
          {/* Calendar icon for switching to Date Mode */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
            <path
              fillRule="evenodd"
              d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
              clipRule="evenodd"
            />
          </svg>
          <span>Date Mode</span>
        </>
      )}
    </button>
  );
}
