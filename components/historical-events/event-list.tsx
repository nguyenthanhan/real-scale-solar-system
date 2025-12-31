"use client";

import { HistoricalEvent } from "@/data/historical-events-types";
import { isSameDay, isFutureEvent } from "@/utils/historical-events-utils";
import { EventCard } from "./event-card";
import { Search } from "lucide-react";

interface EventListProps {
  events: HistoricalEvent[];
  onEventClick: (event: HistoricalEvent) => void;
  currentDate: Date;
  searchTerm: string;
}

export function EventList({
  events,
  onEventClick,
  currentDate,
  searchTerm,
}: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
        <Search className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm font-medium">No events found</p>
        <p className="text-xs mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px] pr-1">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onClick={() => onEventClick(event)}
          isFuture={isFutureEvent(event)}
          isHighlighted={isSameDay(event.date, currentDate)}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  );
}
