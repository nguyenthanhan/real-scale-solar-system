"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

interface PlanetAtmosphericGlowProps {
  planetSize: number;
  planetName: string;
}

export function PlanetAtmosphericGlow({
  planetSize,
  planetName,
}: PlanetAtmosphericGlowProps) {
  const glowRef = useRef<THREE.Mesh | null>(null);
  const { camera } = useThree();

  // Reusable Vector3 instances to avoid allocations
  const worldPosition = useMemo(() => new THREE.Vector3(), []);
  const toCamera = useMemo(() => new THREE.Vector3(), []);
  const cameraDirection = useMemo(() => new THREE.Vector3(), []);

  // Only add atmospheric glow to certain planets
  const hasAtmosphere = [
    "Earth",
    "Venus",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
  ].includes(planetName);

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

  // Calculate view-dependent opacity based on viewing angle
  const calculateViewDependentOpacity = useMemo(() => {
    return () => {
      if (!glowRef.current) return 0.1;

      // Get the world position of the glow mesh
      glowRef.current.getWorldPosition(worldPosition);

      // Get camera's forward direction
      camera.getWorldDirection(cameraDirection);

      // Calculate the vector from planet to camera
      toCamera.copy(camera.position).sub(worldPosition).normalize();

      // Calculate the angle between camera direction and planet-to-camera vector
      // This gives us the viewing angle relative to the camera's orientation
      const viewAngle = Math.acos(Math.abs(cameraDirection.dot(toCamera)));

      // Atmosphere appears thicker at the edges (grazing angle)
      const edgeFactor = Math.sin(viewAngle);
      const baseOpacity = 0.05;
      const edgeOpacity = 0.15;

      return baseOpacity + (edgeOpacity - baseOpacity) * edgeFactor;
    };
  }, [camera, worldPosition, toCamera, cameraDirection]);

  // Update opacity based on viewing angle
  useFrame(() => {
    if (glowRef.current && hasAtmosphere) {
      const opacity = calculateViewDependentOpacity();
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
  });

  // Return null if no atmosphere, otherwise return the glow
  if (!hasAtmosphere) return null;

  return (
    <Sphere ref={glowRef} args={[planetSize * 1.1, 32, 32]}>
      <meshBasicMaterial
        color={getGlowColor(planetName)}
        transparent
        opacity={0.1}
        side={THREE.BackSide}
      />
    </Sphere>
  );
}
