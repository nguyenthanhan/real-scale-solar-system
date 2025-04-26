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
      position={[0, scaledSize + 0.2, 0]} // Lowered position
      style={{ pointerEvents: "auto" }} // Enable pointer events
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
