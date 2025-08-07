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
  const totalTimeRef = useRef(0);

  // Calculate orbital period in seconds for each planet
  const getOrbitalPeriodInSeconds = (planetName: string): number => {
    const periods: { [key: string]: number } = {
      Mercury: 88 * 24 * 60 * 60, // 88 days
      Venus: 225 * 24 * 60 * 60, // 225 days
      Earth: 365.25 * 24 * 60 * 60, // 365.25 days
      Mars: 687 * 24 * 60 * 60, // 687 days
      Jupiter: 4333 * 24 * 60 * 60, // 4333 days
      Saturn: 10759 * 24 * 60 * 60, // 10759 days
      Uranus: 30687 * 24 * 60 * 60, // 30687 days
      Neptune: 60190 * 24 * 60 * 60, // 60190 days
    };
    return periods[planetName] || periods.Earth;
  };

  // Calculate base speed for real-time simulation
  const orbitalPeriodSeconds = getOrbitalPeriodInSeconds(planet.name);
  const baseSpeed = (2 * Math.PI) / orbitalPeriodSeconds; // radians per second for real-time

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

  // Calculate the position based on time and simulation speed
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = Math.max(elapsedTime - lastTimeRef.current, 0.001); // Minimum 1ms
    lastTimeRef.current = elapsedTime;
    totalTimeRef.current += deltaTime;

    // Calculate the position on the orbit
    if (orbitRef?.current) {
      if (simulationSpeed === 0) {
        // Keep current position
      } else {
        // Real-time based simulation speed
        // x1 = real-time, x1000 = 1000x faster than real-time
        const angleIncrement = deltaTime * simulationSpeed * baseSpeed;

        // Update current angle
        currentAngleRef.current =
          (currentAngleRef.current + angleIncrement) % (2 * Math.PI);

        // Debug: Log orbital period for Earth
        if (planet.name === "Earth" && simulationSpeed === 1) {
          const currentOrbitalTime = totalTimeRef.current / (24 * 60 * 60); // Convert to days
          if (
            Math.floor(currentOrbitalTime) % 50 === 0 &&
            currentOrbitalTime > 0
          ) {
            console.log(
              `Earth orbital time: ${currentOrbitalTime.toFixed(1)} days`
            );
          }
        }

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
      // Calculate rotation speed based on real day length
      const dayLengthSeconds =
        Math.abs(planet.rotationSpeedByDays) * 24 * 60 * 60;
      const rotationSpeedRadiansPerSecond = (2 * Math.PI) / dayLengthSeconds;

      const rotationSpeed =
        simulationSpeed === 0
          ? 0
          : deltaTime * simulationSpeed * rotationSpeedRadiansPerSecond;

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
