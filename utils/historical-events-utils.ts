import {
  HistoricalEvent,
  EventCategory,
} from "../data/historical-events-types";

/**
 * Format a date for display
 */
export function formatEventDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Highlight matching text in a string with a background color span
 */
export function highlightText(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) {
    return text;
  }

  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, "gi");
  return text.replace(
    regex,
    '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>',
  );
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Filter and sort historical events based on criteria
 */
export function filterAndSortEvents(
  events: HistoricalEvent[],
  category: EventCategory | "all",
  searchTerm: string,
  sortOrder: "asc" | "desc",
  timeFilter: "all" | "past" | "future",
): HistoricalEvent[] {
  const now = new Date();

  return events
    .filter((event) => {
      // Category filter
      if (category !== "all" && event.category !== category) {
        return false;
      }

      // Time filter
      if (timeFilter === "past" && event.date >= now) {
        return false;
      }
      if (timeFilter === "future" && event.date < now) {
        return false;
      }

      // Search filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = event.name.toLowerCase().includes(term);
        const matchesDescription = event.description
          .toLowerCase()
          .includes(term);
        const matchesDate = formatEventDate(event.date)
          .toLowerCase()
          .includes(term);

        if (!matchesName && !matchesDescription && !matchesDate) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      const comparison = a.date.getTime() - b.date.getTime();
      return sortOrder === "asc" ? comparison : -comparison;
    });
}

/**
 * Check if an event is in the future
 */
export function isFutureEvent(event: HistoricalEvent): boolean {
  return event.date > new Date();
}

/**
 * Validate that an event has a valid date
 */
export function validateEventDate(event: HistoricalEvent): boolean {
  if (!(event.date instanceof Date) || isNaN(event.date.getTime())) {
    console.error(`Invalid date for event: ${event.id}`);
    return false;
  }
  return true;
}
