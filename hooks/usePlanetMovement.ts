import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PlanetData } from "@/data/planet-types";

interface PlanetMovementProps {
  planet: PlanetData;
  simulationSpeed: number;
  scaledDistance: number;
  orbitRef: React.RefObject<THREE.Group | null>;
  planetRef: React.RefObject<THREE.Mesh | null>;
}

export function usePlanetMovement({
  planet,
  simulationSpeed,
  scaledDistance,
  orbitRef,
  planetRef,
}: PlanetMovementProps) {
  // Refs to store current position and angle
  const currentAngleRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lastSpeedRef = useRef(simulationSpeed);

  // Adjust base speed to match real orbital periods
  const baseSpeed = 0.00001;

  // Create elliptical orbit path with more accurate eccentricity
  const orbitCurve = useMemo(() => {
    return new THREE.EllipseCurve(
      0,
      0,
      scaledDistance,
      scaledDistance * (1 - planet.eccentricity),
      0,
      2 * Math.PI,
      false,
      0
    );
  }, [scaledDistance, planet.eccentricity]);

  // Update position when speed changes
  useEffect(() => {
    lastSpeedRef.current = simulationSpeed;
  }, [simulationSpeed]);

  // Calculate the position based on time and simulation speed
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - lastTimeRef.current;
    lastTimeRef.current = elapsedTime;

    // Calculate the position on the orbit
    if (orbitRef?.current) {
      if (simulationSpeed === 0) {
        // Keep current position
      } else {
        // Smooth transition for angle increment when speed changes
        const averageSpeed = (lastSpeedRef.current + simulationSpeed) / 2; // Average speed
        const angleIncrement =
          (deltaTime * averageSpeed * baseSpeed) / planet.orbitSpeedByEarth;
        // Update current angle
        currentAngleRef.current =
          (currentAngleRef.current + angleIncrement) % (2 * Math.PI);

        // Get position on the elliptical curve
        const position = orbitCurve.getPoint(
          currentAngleRef.current / (2 * Math.PI)
        );

        // Update planet position directly
        orbitRef.current.position.x = position.x;
        orbitRef.current.position.z = position.y; // y from curve maps to z in 3D
      }
    }

    // Update planet rotation around its axis
    if (planetRef?.current) {
      const rotationSpeed =
        simulationSpeed === 0
          ? 0
          : simulationSpeed * baseSpeed * planet.rotationSpeedByDays;

      // Apply axial tilt
      if (!planetRef.current.rotation.z) {
        planetRef.current.rotation.z = THREE.MathUtils.degToRad(
          planet.axialTilt
        );
      }

      planetRef.current.rotation.y += rotationSpeed;
    }
  });

  return { orbitCurve };
}
