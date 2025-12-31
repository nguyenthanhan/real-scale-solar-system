"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { Mesh } from "three";
import { PlanetData } from "@/data/planet-types";
import { usePlanetMaterial } from "@/hooks/usePlanetMaterial";
import { PlanetRings } from "@/components/planet/planet-rings";
import { AtmosphericGlow } from "@/components/modal/atmospheric-glow";
import { RotationAxis } from "@/components/modal/rotation-axis";
import {
  calculateAdjustedPlanetSize,
  rotationCache,
} from "@/utils/rotation-calculations";

interface Planet3DModelProps {
  planet: PlanetData;
  size?: number;
  simulationSpeed?: number;
}

// Component that goes inside the Canvas (can use useFrame)
function PlanetMesh({
  planet,
  size,
  simulationSpeed = 1_000_000,
}: Planet3DModelProps) {
  const planetRef = useRef<Mesh | null>(null);
  const planetMaterial = usePlanetMaterial(planet);

  // Calculate rotation based on simulation speed
  // Convert simulation speed to rotation multiplier
  const rotationMultiplier = useMemo(() => {
    const period = Math.abs(planet.rotationSpeedByDays);
    if (period === 0) return 0;

    // Use simulation speed directly for rotation
    const baseRotation = (2 * Math.PI) / (period * 86400); // radians per second in real time
    const speedMultiplier = simulationSpeed * baseRotation;

    return speedMultiplier * (planet.rotationSpeedByDays < 0 ? -1 : 1);
  }, [planet.rotationSpeedByDays, simulationSpeed]);

  // Optimized rotation animation using useFrame
  useFrame((_, delta) => {
    if (planetRef.current && rotationMultiplier !== 0) {
      // Rotate around Y-axis (vertical axis) with pre-calculated multiplier
      planetRef.current.rotation.y += rotationMultiplier * delta;
    }
  });

  // Reset rotation when planet changes
  useEffect(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y = 0;
      planetRef.current.rotation.x = 0;
      planetRef.current.rotation.z = 0;
    }
  }, [planet.name]);

  // Optimized planet size calculation using utility function
  const planetSize = useMemo(
    () => calculateAdjustedPlanetSize(planet.name, size ?? 0),
    [planet.name, size],
  );

  return (
    <group>
      {/* Atmospheric glow */}
      <AtmosphericGlow planetSize={planetSize} planetName={planet.name} />

      {/* Main planet sphere */}
      <Sphere ref={planetRef} args={[planetSize, 64, 64]} position={[0, 0, 0]}>
        <primitive object={planetMaterial} attach="material" />
      </Sphere>

      {/* Planet rings */}
      {planet.hasRings && (
        <PlanetRings
          scaledSize={planetSize}
          ringColor={planet.ringColor}
          ringTilt={planet.ringTilt}
          axialTilt={planet.axialTilt}
        />
      )}
    </group>
  );
}

// Main component that contains the Canvas
function Planet3DModel({
  planet,
  size = 80,
  simulationSpeed = 1_000_000,
}: Planet3DModelProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{
          position: [0, 0, planet.hasRings ? 350 : 300],
          fov: planet.hasRings ? 25 : 30,
        }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <directionalLight position={[-10, -10, -5]} intensity={0.6} />
        <pointLight position={[0, 0, 100]} intensity={0.3} />

        <PlanetMesh
          planet={planet}
          size={size}
          simulationSpeed={simulationSpeed}
        />
      </Canvas>
    </div>
  );
}

export { Planet3DModel };
