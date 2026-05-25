"use client";

import { memo, useRef, useMemo, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

interface PlanetAtmosphericGlowProps {
  planetSize: number;
  planetName: string;
}

const PLANETS_WITH_ATMOSPHERE = new Set([
  "Earth",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
]);

const GLOW_COLORS: Record<string, string> = {
  Earth: "#4B6CB7",
  Venus: "#E6E6FA",
  Mars: "#d14b28",
  Jupiter: "#D8CA9D",
  Saturn: "#f5deb3",
  Uranus: "#afeeee",
  Neptune: "#4169e1",
};

export const PlanetAtmosphericGlow = memo(function PlanetAtmosphericGlow({
  planetSize,
  planetName,
}: PlanetAtmosphericGlowProps) {
  const glowRef = useRef<THREE.Mesh | null>(null);
  const { camera } = useThree();

  const worldPosition = useMemo(() => new THREE.Vector3(), []);
  const toCamera = useMemo(() => new THREE.Vector3(), []);
  const cameraDirection = useMemo(() => new THREE.Vector3(), []);

  const hasAtmosphere = PLANETS_WITH_ATMOSPHERE.has(planetName);
  const glowColor = GLOW_COLORS[planetName] ?? "#ffffff";

  const calculateViewDependentOpacity = useCallback(() => {
    if (!glowRef.current) return 0.1;

    glowRef.current.getWorldPosition(worldPosition);
    camera.getWorldDirection(cameraDirection);
    toCamera.copy(camera.position).sub(worldPosition).normalize();

    const viewAngle = Math.acos(Math.abs(cameraDirection.dot(toCamera)));
    const edgeFactor = Math.sin(viewAngle);
    const baseOpacity = 0.05;
    const edgeOpacity = 0.15;

    return baseOpacity + (edgeOpacity - baseOpacity) * edgeFactor;
  }, [camera, worldPosition, toCamera, cameraDirection]);

  useFrame(() => {
    if (glowRef.current && hasAtmosphere) {
      const opacity = calculateViewDependentOpacity();
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
  });

  if (!hasAtmosphere) return null;

  return (
    <Sphere ref={glowRef} args={[planetSize * 1.1, 16, 16]}>
      <meshBasicMaterial
        color={glowColor}
        transparent
        opacity={0.1}
        side={THREE.BackSide}
      />
    </Sphere>
  );
});
