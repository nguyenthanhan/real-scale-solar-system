"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { HistoricalEvent, EventCategory } from "@/data/historical-events-types";
import { HISTORICAL_EVENTS } from "@/data/historical-events";
import { filterAndSortEvents } from "@/utils/historical-events-utils";
import { CategoryTabs } from "./category-tabs";
import { SearchInput, SortToggle, TimeFilter } from "./search-filters";
import { EventList } from "./event-list";

interface HistoricalEventsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEvent: (event: HistoricalEvent) => void;
  currentDate: Date;
}

export function HistoricalEventsPanel({
  isOpen,
  onClose,
  onSelectEvent,
  currentDate,
}: HistoricalEventsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    EventCategory | "all"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [timeFilter, setTimeFilter] = useState<"all" | "past" | "future">(
    "all",
  );
  const panelRef = useRef<HTMLDivElement>(null);

  const filteredEvents = useMemo(() => {
    return filterAndSortEvents(
      HISTORICAL_EVENTS,
      selectedCategory,
      searchTerm,
      sortOrder,
      timeFilter,
    );
  }, [selectedCategory, searchTerm, sortOrder, timeFilter]);

  const handleEventClick = (event: HistoricalEvent) => {
    onSelectEvent(event);
    onClose();
  };

  // Handle escape key to close panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap within panel
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const focusableElements = panelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement?.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute right-0 top-full mt-2 z-50",
            "w-[360px] max-w-[calc(100vw-2rem)]",
            "bg-white dark:bg-gray-900",
            "border border-gray-200 dark:border-gray-700",
            "rounded-xl shadow-xl",
            "p-4",
          )}
          role="dialog"
          aria-label="Historical astronomical events"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Historical Events
              </h3>
            </div>
            <button
              onClick={onClose}
              className={cn(
                "p-1.5 rounded-lg",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "focus:outline-none focus:ring-2 focus:ring-blue-500",
              )}
              aria-label="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Category Tabs */}
          <CategoryTabs
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          {/* Search and Filters */}
          <div className="flex gap-2 mb-4">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              resultCount={filteredEvents.length}
            />
            <SortToggle order={sortOrder} onToggle={setSortOrder} />
            <TimeFilter value={timeFilter} onChange={setTimeFilter} />
          </div>

          {/* Event List */}
          <EventList
            events={filteredEvents}
            onEventClick={handleEventClick}
            currentDate={currentDate}
            searchTerm={searchTerm}
          />

          {/* Footer with count */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {filteredEvents.length} event
              {filteredEvents.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
