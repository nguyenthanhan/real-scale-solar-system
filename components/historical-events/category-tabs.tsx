"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  EventCategory,
  EVENT_CATEGORY_LABELS,
} from "@/data/historical-events-types";
import { Sun, Moon, Orbit, Rocket, Star } from "lucide-react";

type CategoryOption = EventCategory | "all";

interface CategoryTabsProps {
  selected: CategoryOption;
  onSelect: (category: CategoryOption) => void;
}

const CATEGORY_ICONS: Record<CategoryOption, React.ReactNode> = {
  all: <Star className="w-4 h-4" />,
  "solar-eclipse": <Sun className="w-4 h-4" />,
  "lunar-eclipse": <Moon className="w-4 h-4" />,
  "planetary-conjunction": <Orbit className="w-4 h-4" />,
  "space-mission": <Rocket className="w-4 h-4" />,
  "meteor-shower": <Star className="w-4 h-4" />,
};

const CATEGORIES: CategoryOption[] = [
  "all",
  "solar-eclipse",
  "lunar-eclipse",
  "planetary-conjunction",
  "space-mission",
  "meteor-shower",
];

export function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let newIndex = index;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      newIndex = (index + 1) % CATEGORIES.length;
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      newIndex = (index - 1 + CATEGORIES.length) % CATEGORIES.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      newIndex = CATEGORIES.length - 1;
    }

    if (newIndex !== index) {
      tabsRef.current[newIndex]?.focus();
      onSelect(CATEGORIES[newIndex]);
    }
  };

  return (
    <div
      className="flex flex-wrap gap-1 mb-3"
      role="tablist"
      aria-label="Event categories"
    >
      {CATEGORIES.map((category, index) => (
        <button
          key={category}
          ref={(el) => {
            tabsRef.current[index] = el;
          }}
          role="tab"
          aria-selected={selected === category}
          aria-controls={`tabpanel-${category}`}
          tabIndex={selected === category ? 0 : -1}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full transition-all",
            "focus:outline-none focus:ring-2 focus:ring-blue-500",
            selected === category
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
          )}
          onClick={() => onSelect(category)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        >
          {CATEGORY_ICONS[category]}
          <span>
            {category === "all" ? "All" : EVENT_CATEGORY_LABELS[category]}
          </span>
        </button>
      ))}
    </div>
  );
}
