"use client";

import { Html } from "@react-three/drei";
import { PlanetData } from "@/types/planet-types";

export function PlanetLabel({
  planet,
  scaledSize,
  hovered,
}: {
  planet: PlanetData;
  scaledSize: number;
  hovered: boolean;
}) {
  return (
    <>
      {[
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
          position={[0, scaledSize + 0.5, 0]}
          style={{ pointerEvents: "none" }}
          center
        >
          <div className="bg-black/70 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
            {planet.name}
          </div>
        </Html>
      ) : (
        hovered && (
          <Html style={{ pointerEvents: "none" }}>
            <div className="bg-black/70 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
              {planet.name}
            </div>
          </Html>
        )
      )}
    </>
  );
}
