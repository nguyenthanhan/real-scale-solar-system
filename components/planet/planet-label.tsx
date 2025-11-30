"use client";

import { Html } from "@react-three/drei";
import { PlanetData } from "@/data/planet-types";
import { useGetLabelDistance } from "@/hooks/useGetLabelDistance";

export function PlanetLabel({
  planet,
  onClick,
}: {
  planet: PlanetData;
  onClick: (planet: PlanetData) => void;
}) {
  const { labelDistance, labelRef } = useGetLabelDistance({ planet });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(planet);
  };

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
      center
      zIndexRange={[10, 0]}
      style={{
        pointerEvents: "auto",
      }}
    >
      <div
        ref={labelRef}
        onClick={handleClick}
        className="bg-black/70 text-white px-2 py-1 rounded text-sm whitespace-nowrap cursor-pointer hover:bg-black/90"
      >
        {planet.name}
      </div>
    </Html>
  ) : null;
}
