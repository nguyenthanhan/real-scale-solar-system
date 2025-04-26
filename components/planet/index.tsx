"use client";

import { useRef } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";
import { PlanetData } from "@/types/planet-types";
import { PlanetLabel } from "@/components/planet/planet-label";
import { usePlanetMovement } from "@/hooks/usePlanetMovement";
import { usePlanetMaterial } from "@/hooks/usePlanetMaterial";
import { PlanetRings } from "@/components/planet/planet-rings";
import { OrbitPath } from "@/components/planet/orbit-path";
import { DISTANCE_SCALE } from "@/constants/planet-data";

// Define the planet props
interface PlanetProps {
  planet: PlanetData;
  simulationSpeed: number;
  onClick: (planet: PlanetData) => void;
}

export function Planet({ planet, simulationSpeed, onClick }: PlanetProps) {
  const planetRef = useRef<THREE.Mesh | null>(null);
  const orbitRef = useRef<THREE.Group | null>(null);

  const planetMaterial = usePlanetMaterial(planet);

  // Compute scaled values
  const scaledDistance = planet.realDistance * DISTANCE_SCALE;
  const scaledSize = planet.size * DISTANCE_SCALE;

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
      {/* Orbit path visualization */}
      <OrbitPath orbitCurve={orbitCurve} />

      {/* Planet group */}
      <group ref={orbitRef} position={[scaledDistance, 0, 0]}>
        {/* Planet sphere */}
        <Sphere
          ref={planetRef}
          args={[scaledSize, 32, 32]}
          onClick={handlePlanetClick}
        >
          <primitive object={planetMaterial} attach="material" />
        </Sphere>
        {/* Planet rings if applicable */}
        {planet.hasRings && (
          <PlanetRings
            scaledSize={scaledSize}
            ringColor={planet.ringColor}
            ringTilt={planet.ringTilt}
          />
        )}

        <PlanetLabel planet={planet} onClick={onClick} />
      </group>
    </>
  );
}
