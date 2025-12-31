"use client";

import { Sparkles } from "lucide-react";

interface NotableFeaturesProps {
  features: string[] | undefined;
}

export function NotableFeatures({ features }: NotableFeaturesProps) {
  // Don't render if no features data or empty array
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-1.5">
      {features.map((feature, index) => (
        <li
          key={index}
          className="flex items-start gap-2 text-sm text-white/80"
        >
          <Sparkles
            size={14}
            className="text-yellow-400 mt-0.5 flex-shrink-0"
          />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}
