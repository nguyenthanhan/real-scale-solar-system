"use client";

import { cn } from "@/lib/utils";
import {
  HistoricalEvent,
  SolarEclipseEvent,
  LunarEclipseEvent,
  PlanetaryConjunctionEvent,
  SpaceMissionEvent,
  MeteorShowerEvent,
} from "@/data/historical-events-types";
import { formatEventDate } from "@/utils/historical-events-utils";

interface EventCardProps {
  event: HistoricalEvent;
  onClick: () => void;
  isFuture: boolean;
  isHighlighted: boolean;
  searchTerm: string;
}

function HighlightedText({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) {
  if (!highlight.trim()) {
    return <>{text}</>;
  }

  const regex = new RegExp(
    `(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi",
  );
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

function SolarEclipseDetails({ event }: { event: SolarEclipseEvent }) {
  return (
    <>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Type: <span className="capitalize">{event.eclipseType}</span>
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Visible: {event.visibilityRegion}
      </span>
    </>
  );
}

function LunarEclipseDetails({ event }: { event: LunarEclipseEvent }) {
  return (
    <>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Type: <span className="capitalize">{event.eclipseType}</span>
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Duration: {event.duration}
      </span>
    </>
  );
}

function ConjunctionDetails({ event }: { event: PlanetaryConjunctionEvent }) {
  return (
    <>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Planets: {event.planets.join(", ")}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Separation: {event.angularSeparation}°
      </span>
    </>
  );
}

function SpaceMissionDetails({ event }: { event: SpaceMissionEvent }) {
  return (
    <>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {event.achievement}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Agency: {event.agency}
      </span>
    </>
  );
}

function MeteorShowerDetails({ event }: { event: MeteorShowerEvent }) {
  return (
    <>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Peak: {event.peakRate}/hour
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Parent: {event.parentBody}
      </span>
    </>
  );
}

function EventDetails({ event }: { event: HistoricalEvent }) {
  switch (event.category) {
    case "solar-eclipse":
      return <SolarEclipseDetails event={event} />;
    case "lunar-eclipse":
      return <LunarEclipseDetails event={event} />;
    case "planetary-conjunction":
      return <ConjunctionDetails event={event} />;
    case "space-mission":
      return <SpaceMissionDetails event={event} />;
    case "meteor-shower":
      return <MeteorShowerDetails event={event} />;
    default:
      return null;
  }
}

export function EventCard({
  event,
  onClick,
  isFuture,
  isHighlighted,
  searchTerm,
}: EventCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-all",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
        isHighlighted && "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
        !isHighlighted && "border-gray-200 dark:border-gray-700",
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={`${event.name} on ${formatEventDate(event.date)}${isFuture ? ", future event" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
          <HighlightedText text={event.name} highlight={searchTerm} />
        </h4>
        {isFuture && (
          <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
            Future
          </span>
        )}
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
        {formatEventDate(event.date)}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
        <HighlightedText text={event.description} highlight={searchTerm} />
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        <EventDetails event={event} />
      </div>
    </button>
  );
}
