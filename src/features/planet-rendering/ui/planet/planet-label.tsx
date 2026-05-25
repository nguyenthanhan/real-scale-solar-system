"use client";

import { Html } from "@react-three/drei";
import { PlanetData } from "@/data/planet-types";
import { useGetLabelDistance } from "@/hooks/useGetLabelDistance";

const LABELED_PLANETS = new Set([
  "Mercury",
  "Venus",
  "Earth",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
]);

export function PlanetLabel({
  planet,
  onClick,
}: {
  planet: PlanetData;
  onClick: (planet: PlanetData) => void;
}) {
  const { anchorRef, labelOffsetRef } = useGetLabelDistance({ planet });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(planet);
  };

  if (!LABELED_PLANETS.has(planet.name)) return null;

  return (
    <group ref={anchorRef}>
      <group ref={labelOffsetRef}>
        <Html
          center
          zIndexRange={[10, 0]}
          style={{
            pointerEvents: "auto",
          }}
        >
          <div
            onClick={handleClick}
            className="bg-black/70 text-white px-2 py-1 rounded text-sm whitespace-nowrap cursor-pointer hover:bg-black/90"
          >
            {planet.name}
          </div>
        </Html>
      </group>
    </group>
  );
}
