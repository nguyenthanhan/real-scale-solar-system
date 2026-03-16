"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Search, X, ArrowUpDown, Clock } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

export function SearchInput({
  value,
  onChange,
  resultCount,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Announce result count to screen readers
    if (inputRef.current && document.activeElement === inputRef.current) {
      const announcement =
        resultCount === 0
          ? "No events found"
          : `${resultCount} event${resultCount === 1 ? "" : "s"} found`;
      inputRef.current.setAttribute(
        "aria-label",
        `Search events. ${announcement}`,
      );
    }
  }, [resultCount]);

  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search events..."
        className={cn(
          "w-full pl-8 pr-8 py-2 text-sm rounded-lg",
          "bg-gray-100 dark:bg-gray-800",
          "border border-gray-200 dark:border-gray-700",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          "placeholder:text-gray-400",
        )}
        aria-label={`Search events. ${resultCount} event${resultCount === 1 ? "" : "s"} found`}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5 text-gray-400" />
        </button>
      )}
    </div>
  );
}

interface SortToggleProps {
  order: "asc" | "desc";
  onToggle: (order: "asc" | "desc") => void;
}

export function SortToggle({ order, onToggle }: SortToggleProps) {
  return (
    <button
      onClick={() => onToggle(order === "asc" ? "desc" : "asc")}
      className={cn(
        "flex items-center gap-1 px-2.5 py-2 text-xs rounded-lg",
        "bg-gray-100 dark:bg-gray-800",
        "border border-gray-200 dark:border-gray-700",
        "hover:bg-gray-200 dark:hover:bg-gray-700",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
      )}
      aria-label={`Sort ${order === "asc" ? "oldest first" : "newest first"}`}
      title={order === "asc" ? "Oldest first" : "Newest first"}
    >
      <ArrowUpDown className="w-4 h-4" />
      <span className="hidden sm:inline">
        {order === "asc" ? "Oldest" : "Newest"}
      </span>
    </button>
  );
}

interface TimeFilterProps {
  value: "all" | "past" | "future";
  onChange: (value: "all" | "past" | "future") => void;
}

export function TimeFilter({ value, onChange }: TimeFilterProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as "all" | "past" | "future")}
        className={cn(
          "appearance-none pl-8 pr-6 py-2 text-xs rounded-lg",
          "bg-gray-100 dark:bg-gray-800",
          "border border-gray-200 dark:border-gray-700",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          "cursor-pointer",
        )}
        aria-label="Filter by time"
      >
        <option value="all">All Time</option>
        <option value="past">Past</option>
        <option value="future">Future</option>
      </select>
      <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}
