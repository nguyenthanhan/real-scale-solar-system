"use client";

import { Html } from "@react-three/drei";
import { PlanetData } from "@/types/planet-types";
import { useGetLabelDistance } from "@/hooks/useGetLabelDistance";

export function PlanetLabel({
  planet,
  onClick,
}: {
  planet: PlanetData;
  onClick?: () => void;
}) {
  const { labelDistance, labelRef } = useGetLabelDistance({ planet });

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
      <div
        ref={labelRef}
        className="bg-black/70 text-white px-2 py-1 rounded text-sm whitespace-nowrap cursor-pointer"
      >
        {planet.name}
      </div>
    </Html>
  ) : null;
}
