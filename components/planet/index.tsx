"use client";

import { useRef } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";
import { PlanetData } from "@/data/planet-types";
import { PlanetLabel } from "@/components/planet/planet-label";
import { usePlanetMovement } from "@/hooks/usePlanetMovement";
import { usePlanetMaterial } from "@/hooks/usePlanetMaterial";
import { PlanetRings } from "@/components/planet/planet-rings";
import { OrbitPath } from "@/components/planet/orbit-path";

// Define the planet props
interface PlanetProps {
  planet: PlanetData;
  simulationSpeed: number;
  onClick: (planet: PlanetData) => void;
  showLabels: boolean;
}

export function Planet({
  planet,
  simulationSpeed,
  onClick,
  showLabels,
}: PlanetProps) {
  const planetRef = useRef<THREE.Mesh | null>(null);
  const orbitRef = useRef<THREE.Group | null>(null);

  const planetMaterial = usePlanetMaterial(planet);

  // TRUE TO SCALE - No artificial scaling for visibility
  // Using real astronomical proportions

  // Size: 1 AU = 149,597,870 km (Earth-Sun distance)
  // For visualization: 1 AU = 1000 units (compressed but proportional)
  const AU_TO_UNITS = 1000; // 1 AU = 1000 units

  // Distance: Real orbital distance from Sun center
  const scaledDistance = planet.distanceInAU * AU_TO_UNITS;

  // Size: Real diameter proportions
  // Earth diameter = 12,742 km, Sun diameter = 1,392,700 km
  // For visualization: Earth = 1 unit, Sun = 109.2 units
  const EARTH_DIAMETER_UNITS = 1; // Earth = 1 unit
  const scaledSize = planet.diameterRelativeEarth * EARTH_DIAMETER_UNITS;

  // Initialize and update planet movement
  const { orbitCurve } = usePlanetMovement({
    planet,
    simulationSpeed,
    scaledDistance,
    orbitRef,
    planetRef,
  });

  // Handle planet click with proper event propagation
  const handlePlanetClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(planet);
  };

  return (
    <>
      <OrbitPath orbitCurve={orbitCurve} />
      <group ref={orbitRef}>
        <Sphere
          ref={planetRef}
          args={[scaledSize, 128, 128]} // Increased segments for better detail when zoomed
          onClick={handlePlanetClick}
        >
          <primitive object={planetMaterial} attach="material" />
        </Sphere>
        {planet.hasRings && (
          <PlanetRings
            scaledSize={scaledSize}
            ringColor={planet.ringColor}
            ringTilt={planet.ringTilt || 0}
            axialTilt={planet.axialTilt}
          />
        )}

        {showLabels && <PlanetLabel planet={planet} onClick={onClick} />}
      </group>
    </>
  );
}
