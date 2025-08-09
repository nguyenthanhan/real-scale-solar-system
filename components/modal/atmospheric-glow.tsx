"use client";

import { Sphere } from "@react-three/drei";
import * as THREE from "three";

interface AtmosphericGlowProps {
  planetSize: number;
  planetName: string;
}

export function AtmosphericGlow({ planetSize, planetName }: AtmosphericGlowProps) {
  // Only add atmospheric glow to certain planets
  const hasAtmosphere = ["Earth", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"].includes(planetName);
  
  if (!hasAtmosphere) return null;

  // Different glow colors for different planets
  const getGlowColor = (planetName: string) => {
    switch (planetName) {
      case "Earth":
        return "#4B6CB7";
      case "Venus":
        return "#E6E6FA";
      case "Mars":
        return "#d14b28";
      case "Jupiter":
        return "#D8CA9D";
      case "Saturn":
        return "#f5deb3";
      case "Uranus":
        return "#afeeee";
      case "Neptune":
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
