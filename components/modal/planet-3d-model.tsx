"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { PlanetData } from "@/data/planet-types";
import { usePlanetMaterial } from "@/hooks/usePlanetMaterial";
import { PlanetRings } from "@/components/planet/planet-rings";
import { AtmosphericGlow } from "@/components/modal/atmospheric-glow";
import { RotationAxis } from "@/components/modal/rotation-axis";

interface Planet3DModelProps {
  planet: PlanetData;
  size?: number;
  rotationSpeedMinutes?: number; // Minutes per second (5-1440 minutes)
}

// Component that goes inside the Canvas (can use useFrame)
function PlanetMesh({
  planet,
  size,
  rotationSpeedMinutes = 15,
}: Planet3DModelProps) {
  const planetRef = useRef<THREE.Mesh | null>(null);
  const planetMaterial = usePlanetMaterial(planet);

  // Calculate rotation speed based on rotationSpeedMinutes
  const rotationSpeed = useMemo(() => {
    const planetRotationPeriod = Math.abs(planet.rotationSpeedByDays);
    // If rotationSpeedMinutes = 15, then 1 second = 15 minutes
    // So 1 Earth day (1440 minutes) = 96 seconds
    // Planet should complete 1 rotation in: planetRotationPeriod * 96 seconds
    const rotationSpeedPerSecond =
      (360 / (planetRotationPeriod * 96)) * (rotationSpeedMinutes / 15);
    return rotationSpeedPerSecond;
  }, [planet.rotationSpeedByDays, rotationSpeedMinutes]);

  // Determine rotation direction
  const rotationDirection = useMemo(() => {
    // Venus and Uranus rotate retrograde (opposite direction)
    return planet.rotationSpeedByDays < 0 ? 1 : -1;
  }, [planet.rotationSpeedByDays]);

  // Apply rotation animation using useFrame for smooth animation
  useFrame((_, delta) => {
    if (planetRef.current) {
      // Rotate around Y-axis (vertical axis)
      const actualRotation = rotationSpeed * rotationDirection * delta;
      planetRef.current.rotation.y += actualRotation;
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

  // Use fixed size for all planets in modal
  const planetSize = size ?? 0; // All planets same size

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
          ringColor={planet.ringColor || "#CDCDCD"}
          ringTilt={planet.ringTilt || 0}
          axialTilt={0}
        />
      )}

      {/* Rotation axis line */}
      <RotationAxis planetSize={planetSize} axialTilt={0} />
    </group>
  );
}

// Main component that contains the Canvas
function Planet3DModel({
  planet,
  size = 80,
  rotationSpeedMinutes = 15,
}: Planet3DModelProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 300], fov: 30 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <directionalLight position={[-10, -10, -5]} intensity={0.6} />
        <pointLight position={[0, 0, 100]} intensity={0.3} />

        <PlanetMesh
          planet={planet}
          size={size}
          rotationSpeedMinutes={rotationSpeedMinutes}
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate={false}
          autoRotateSpeed={0}
        />
      </Canvas>
    </div>
  );
}

export { Planet3DModel };
