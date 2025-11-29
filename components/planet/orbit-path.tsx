"use client";

import * as THREE from "three";
import { useMemo, useRef, useEffect } from "react";
import { PlanetData } from "@/data/planet-types";
import { getOrbitColor } from "@/utils/orbit-geometry";
import { getInclinationRotation } from "@/utils/orbital-inclination";

interface OrbitPathProps {
  planet: PlanetData;
  scaledDistance: number;
}

/**
 * OrbitPath component renders a planet's orbital path as an ellipse.
 *
 * Key features:
 * - Uses elliptical curve matching planet's actual eccentricity
 * - Applies orbital inclination for accurate 3D positioning
 * - Color-coded: lighter gray for inner planets, darker for outer planets
 * - Semi-transparent with double-sided rendering for visibility from all angles
 * - Optimized with useMemo and proper cleanup on unmount
 */
export function OrbitPath({ planet, scaledDistance }: OrbitPathProps) {
  const lineRef = useRef<THREE.Line>(null);

  // Create elliptical orbit curve matching planet's eccentricity
  const orbitCurve = useMemo(() => {
    return new THREE.EllipseCurve(
      0, // center x
      0, // center y
      scaledDistance, // x radius
      scaledDistance * (1 - planet.eccentricity), // y radius (adjusted for eccentricity)
      0, // start angle
      2 * Math.PI, // end angle
      false, // clockwise
      0 // rotation
    );
  }, [scaledDistance, planet.eccentricity]);

  // Create orbit geometry from ellipse points
  const geometry = useMemo(() => {
    const points = orbitCurve.getPoints(128);
    const geometry = new THREE.BufferGeometry().setFromPoints(
      points.map((p) => new THREE.Vector3(p.x, 0, p.y))
    );
    return geometry;
  }, [orbitCurve]);

  // Create orbit material with planet-specific color
  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: getOrbitColor(planet.name),
      opacity: 0.3,
      transparent: true,
      depthWrite: false,
    });
  }, [planet.name]);

  // Apply render order and orbital inclination rotation
  useEffect(() => {
    if (lineRef.current) {
      // Set render order to draw orbits before planets
      lineRef.current.renderOrder = -1;

      // Apply orbital inclination rotation using shared utility
      // This ensures orbit path uses same inclination as planet movement
      if (planet.orbitalInclination !== undefined) {
        lineRef.current.rotation.x = getInclinationRotation(
          planet.orbitalInclination
        );
      }
    }
  }, [planet.orbitalInclination]);

  // Cleanup geometry and material on unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <lineLoop ref={lineRef} geometry={geometry} material={material} />;
}
