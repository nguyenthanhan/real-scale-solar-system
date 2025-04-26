import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PlanetData } from "@/types/planet-types";

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

  // Basic coefficient to adjust the overall simulation speed
  const baseSpeed = 0.00005;

  // Create elliptical orbit path
  const orbitCurve = useMemo(() => {
    return new THREE.EllipseCurve(
      0,
      0, // Center x, y
      scaledDistance,
      scaledDistance * 0.95, // xRadius, yRadius
      0,
      2 * Math.PI, // Start angle, end angle
      false, // Clockwise
      0 // Rotation
    );
  }, [scaledDistance]);

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
        // Calculate angle increment based on planet's orbit speed
        const angleIncrement =
          (deltaTime * simulationSpeed * baseSpeed) / planet.orbitSpeed;

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
        simulationSpeed === 0 ? 0.0001 : simulationSpeed * baseSpeed * 0.5;
      planetRef.current.rotation.y +=
        (0.01 / planet.rotationSpeed) * rotationSpeed;
    }
  });

  return { orbitCurve };
}
