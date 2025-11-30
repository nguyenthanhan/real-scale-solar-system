"use client";

import { useState, useCallback, useRef } from "react";
import {
  validateDate,
  isDateInAccurateRange,
} from "@/utils/astronomy-calculations";

// Date picker configuration
const DATE_PICKER_CONFIG = {
  MIN_DATE: new Date("1700-01-01"),
  MAX_DATE: new Date("2300-12-31"),
  PRESETS: [
    {
      id: "year-ago",
      label: "1 Year Ago",
      getDate: () => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 1);
        return d;
      },
    },
    { id: "today", label: "Today", getDate: () => new Date() },
    {
      id: "year-ahead",
      label: "1 Year Ahead",
      getDate: () => {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 1);
        return d;
      },
    },
  ],
  HISTORICAL_PRESETS: [
    { id: "moon-landing", label: "Moon Landing", date: new Date("1969-07-20") },
    { id: "mars-rover", label: "Mars Rover", date: new Date("2021-02-18") },
    { id: "voyager", label: "Voyager 1", date: new Date("1977-09-05") },
  ],
};

interface DatePickerProps {
  /** Currently selected date */
  selectedDate: Date;
  /** Callback when date changes */
  onDateChange: (date: Date) => void;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Format date to "Month Day, Year" format
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format date to ISO string for input value
 */
function toInputValue(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Date picker component for selecting dates in Date Mode
 */
export function DatePicker({
  selectedDate,
  onDateChange,
  className = "",
}: DatePickerProps) {
  const [error, setError] = useState<string | null>(null);
  const [showHistorical, setShowHistorical] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDateChange = useCallback(
    (newDate: Date) => {
      const validation = validateDate(newDate);

      if (!validation.valid) {
        setError(validation.error || "Invalid date");
        return;
      }

      if (!isDateInAccurateRange(newDate)) {
        console.warn("Date outside accurate range (1700-2300)");
      }

      setError(null);
      onDateChange(newDate);
    },
    [onDateChange]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = new Date(e.target.value);
      if (!isNaN(newDate.getTime())) {
        handleDateChange(newDate);
      }
    },
    [handleDateChange]
  );

  const handlePresetClick = useCallback(
    (getDate: () => Date) => {
      handleDateChange(getDate());
    },
    [handleDateChange]
  );

  const handleHistoricalClick = useCallback(
    (date: Date) => {
      handleDateChange(date);
      setShowHistorical(false);
    },
    [handleDateChange]
  );

  // Touch gesture state
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const SWIPE_THRESHOLD = 50; // pixels

  // Touch gesture handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };

      const deltaX = touchEnd.x - touchStart.x;
      const deltaY = touchEnd.y - touchStart.y;
      const currentDate = new Date(selectedDate);

      // Horizontal swipe (day navigation)
      if (
        Math.abs(deltaX) > Math.abs(deltaY) &&
        Math.abs(deltaX) > SWIPE_THRESHOLD
      ) {
        if (deltaX < 0) {
          // Swipe left: next day
          currentDate.setDate(currentDate.getDate() + 1);
        } else {
          // Swipe right: previous day
          currentDate.setDate(currentDate.getDate() - 1);
        }
        handleDateChange(currentDate);
      }

      // Vertical swipe (month navigation)
      if (
        Math.abs(deltaY) > Math.abs(deltaX) &&
        Math.abs(deltaY) > SWIPE_THRESHOLD
      ) {
        if (deltaY < 0) {
          // Swipe up: next month
          currentDate.setMonth(currentDate.getMonth() + 1);
        } else {
          // Swipe down: previous month
          currentDate.setMonth(currentDate.getMonth() - 1);
        }
        handleDateChange(currentDate);
      }

      setTouchStart(null);
    },
    [touchStart, selectedDate, handleDateChange]
  );

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentDate = new Date(selectedDate);

      switch (e.key) {
        case "ArrowLeft":
          // Previous day
          e.preventDefault();
          currentDate.setDate(currentDate.getDate() - 1);
          handleDateChange(currentDate);
          break;
        case "ArrowRight":
          // Next day
          e.preventDefault();
          currentDate.setDate(currentDate.getDate() + 1);
          handleDateChange(currentDate);
          break;
        case "ArrowUp":
          // Previous month
          e.preventDefault();
          currentDate.setMonth(currentDate.getMonth() - 1);
          handleDateChange(currentDate);
          break;
        case "ArrowDown":
          // Next month
          e.preventDefault();
          currentDate.setMonth(currentDate.getMonth() + 1);
          handleDateChange(currentDate);
          break;
        case "Enter":
          // Confirm date (close historical if open)
          if (showHistorical) {
            setShowHistorical(false);
          }
          break;
        case "Escape":
          // Close historical presets
          if (showHistorical) {
            e.preventDefault();
            setShowHistorical(false);
          }
          break;
      }
    },
    [selectedDate, handleDateChange, showHistorical]
  );

  return (
    <div
      ref={containerRef}
      className={`bg-black/80 rounded-lg p-3 text-white w-fit min-w-[220px] ${className}`}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="application"
      aria-label="Date picker. Use arrow keys to navigate: Left/Right for days, Up/Down for months. On touch devices, swipe to navigate."
    >
      {/* Current date display */}
      <div className="flex items-center gap-2 mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 text-blue-400 shrink-0"
        >
          <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
          <path
            fillRule="evenodd"
            d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm font-medium">{formatDate(selectedDate)}</span>
      </div>

      {/* Date input */}
      <input
        type="date"
        value={toInputValue(selectedDate)}
        onChange={handleInputChange}
        min={toInputValue(DATE_PICKER_CONFIG.MIN_DATE)}
        max={toInputValue(DATE_PICKER_CONFIG.MAX_DATE)}
        className="w-full px-2 py-2 bg-white/10 rounded border border-white/20 text-white text-sm mb-3"
      />

      {/* Error message */}
      {error && <div className="text-red-400 text-sm mb-3">{error}</div>}

      {/* Quick presets */}
      <div className="flex gap-1.5 mb-3">
        {DATE_PICKER_CONFIG.PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetClick(preset.getDate)}
            className="flex-1 px-1.5 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Historical events toggle */}
      <button
        onClick={() => setShowHistorical(!showHistorical)}
        className="w-full px-2 py-2 text-xs bg-blue-500/20 hover:bg-blue-500/30 rounded transition-colors flex items-center justify-center gap-1"
      >
        <span>Historical Events</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-3 h-3 transition-transform ${
            showHistorical ? "rotate-180" : ""
          }`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Historical presets */}
      {showHistorical && (
        <div className="mt-2 space-y-1">
          {DATE_PICKER_CONFIG.HISTORICAL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleHistoricalClick(preset.date)}
              className="w-full px-2 py-1.5 text-xs text-left bg-white/5 hover:bg-white/10 rounded transition-colors"
            >
              <span className="font-medium">{preset.label}</span>
              <span className="text-white/50 ml-1 text-[10px]">
                ({formatDate(preset.date)})
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
