"use client";

import { Sphere } from "@react-three/drei";
import * as THREE from "three";

interface AtmosphericGlowProps {
  planetSize: number;
  planetName: string;
}

export function AtmosphericGlow({
  planetSize,
  planetName,
}: AtmosphericGlowProps) {
  // Normalize planet name to lowercase for case-insensitive comparison
  const normalizedPlanetName = planetName.toLowerCase();

  // Only add atmospheric glow to certain planets (using Set for efficient lookup)
  const planetsWithAtmosphere = new Set([
    "earth",
    "venus",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
  ]);

  const hasAtmosphere = planetsWithAtmosphere.has(normalizedPlanetName);

  if (!hasAtmosphere) return null;

  // Different glow colors for different planets
  const getGlowColor = (planetName: string) => {
    switch (planetName.toLowerCase()) {
      case "earth":
        return "#4B6CB7";
      case "venus":
        return "#E6E6FA";
      case "mars":
        return "#d14b28";
      case "jupiter":
        return "#D8CA9D";
      case "saturn":
        return "#f5deb3";
      case "uranus":
        return "#afeeee";
      case "neptune":
        return "#4169e1";
      default:
        return "#ffffff";
    }
  };

  return (
    <Sphere args={[planetSize * 1.1, 32, 32]}>
      <meshBasicMaterial
        color={getGlowColor(planetName)}
        transparent
        opacity={0.1}
        side={THREE.BackSide}
      />
    </Sphere>
  );
}
