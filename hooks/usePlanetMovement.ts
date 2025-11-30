import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { EllipseCurve, Group, Mesh, MathUtils } from "three";
import { PlanetData } from "@/data/planet-types";
import { applyInclinationToPosition } from "@/utils/orbital-inclination";
import {
  SECONDS_PER_DAY,
  FULL_CIRCLE_RADIANS,
  EARTH_ORBITAL_PERIOD_DAYS,
} from "@/utils/physics-constants";

/**
 * Props for the usePlanetMovement hook.
 */
interface PlanetMovementProps {
  /** Planet data containing orbital parameters */
  planet: PlanetData;
  /** Simulation speed multiplier (1 = real-time, 1000 = 1000x faster) */
  simulationSpeed: number;
  /** Scaled distance from the Sun for visualization */
  scaledDistance: number;
  /** Reference to the planet's orbit group for position updates */
  orbitRef: React.RefObject<Group | null>;
  /** Reference to the planet mesh for rotation updates */
  planetRef: React.RefObject<Mesh | null>;
}

/**
 * Hook that handles planet movement along its orbital path.
 *
 * This hook calculates and updates the planet's position on its elliptical orbit,
 * applying orbital inclination to create accurate 3D orbital mechanics.
 *
 * Key features:
 * - Elliptical orbit based on planet's eccentricity
 * - Orbital inclination applied for 3D positioning (planets move above/below ecliptic plane)
 * - Real-time based simulation with configurable speed multiplier
 * - Axial tilt and rotation around planet's axis
 *
 * @param props - Planet movement configuration
 * @returns Object containing the orbit curve for reference
 *
 * @example
 * const { orbitCurve } = usePlanetMovement({
 *   planet: earthData,
 *   simulationSpeed: 1000,
 *   scaledDistance: 100,
 *   orbitRef,
 *   planetRef,
 * });
 */
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
  const lastLoggedDayRef = useRef(-1);
  const axialTiltSetRef = useRef(false);

  // Calculate orbital period in seconds from planet data
  // Fallback to Earth's period if missing (with error log)
  const orbitalPeriodDays =
    planet.orbitalPeriodDays ?? EARTH_ORBITAL_PERIOD_DAYS;

  if (!planet.orbitalPeriodDays) {
    console.error(
      `Planet ${planet.name} missing orbitalPeriodDays, using Earth's period`
    );
  }

  // Convert orbital period from days to seconds
  const orbitalPeriodSeconds = orbitalPeriodDays * SECONDS_PER_DAY;

  // Calculate base speed for real-time simulation (radians per second)
  const baseSpeed = FULL_CIRCLE_RADIANS / orbitalPeriodSeconds;

  // Create elliptical orbit path with more accurate eccentricity
  const orbitCurve = useMemo(() => {
    return new EllipseCurve(
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

        // Debug logging only in development
        if (process.env.NODE_ENV === "development") {
          if (planet.name === "Earth" && simulationSpeed === 1) {
            const currentOrbitalTime = totalTimeRef.current / (24 * 60 * 60); // Convert to days
            const currentDay = Math.floor(currentOrbitalTime);
            if (
              currentDay % 50 === 0 &&
              currentDay !== lastLoggedDayRef.current &&
              currentDay > 0
            ) {
              lastLoggedDayRef.current = currentDay;
              console.log(
                `Earth orbital time: ${currentOrbitalTime.toFixed(1)} days`
              );
            }
          }
        }

        // Get position on the elliptical curve (2D)
        const position2D = orbitCurve.getPoint(
          currentAngleRef.current / (2 * Math.PI)
        );

        // Apply orbital inclination to get 3D position
        // position2D.y from curve maps to z in 3D space before inclination
        const inclination = planet.orbitalInclination ?? 0;
        const position3D = applyInclinationToPosition(
          position2D.x,
          position2D.y,
          inclination
        );

        // Update planet position with inclination applied
        orbitRef.current.position.x = position3D.x;
        orbitRef.current.position.y = position3D.y; // Now has inclination component
        orbitRef.current.position.z = position3D.z;
      }
    }

    // Ensure axial tilt is applied once regardless of self-rotation state
    if (planetRef?.current && !axialTiltSetRef.current) {
      planetRef.current.rotation.x = MathUtils.degToRad(planet.axialTilt);
      axialTiltSetRef.current = true;
    }

    // Update planet rotation around its axis
    if (planetRef?.current && simulationSpeed !== 0) {
      // Calculate rotation speed based on real day length
      const dayLengthSeconds =
        Math.abs(planet.rotationSpeedByDays) * SECONDS_PER_DAY;
      const rotationSpeedRadiansPerSecond =
        FULL_CIRCLE_RADIANS / dayLengthSeconds;

      const rotationSpeed =
        deltaTime * simulationSpeed * rotationSpeedRadiansPerSecond;

      // Determine rotation direction from the perspective of the Solar System's north pole
      const rotationDirection = planet.rotationSpeedByDays < 0 ? -1 : 1;

      planetRef.current.rotation.y += rotationSpeed * rotationDirection;
    }
  });

  return { orbitCurve };
}
