"use client";

import { Html } from "@react-three/drei";
import { PlanetData } from "@/types/planet-types";

export function PlanetLabel({
  planet,
  scaledSize,
  onClick,
}: {
  planet: PlanetData;
  scaledSize: number;
  onClick?: () => void;
}) {
  // Calculate appropriate distance for label based on planet size
  // For very small planets, ensure the label is still visible
  const labelDistance = Math.max(scaledSize * 1.5, 0.1);

  return [
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
  ].includes(planet.name) ? (
    <Html
      position={[0, labelDistance, 0]}
      style={{ pointerEvents: "auto" }}
      center
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick();
      }}
    >
      <div className="bg-black/70 text-white px-2 py-1 rounded text-sm whitespace-nowrap cursor-pointer">
        {planet.name}
      </div>
    </Html>
  ) : null;
}
