"use client";

import { Html } from "@react-three/drei";
import { PlanetData } from "@/types/planet-types";
import { useThree, useFrame } from "@react-three/fiber";
import { useState, useRef } from "react";
import { Vector3 } from "three";
import { DISTANCE_SCALE } from "@/constants/planet-data";

export function useGetLabelDistance({ planet }: { planet: PlanetData }) {
  const { camera } = useThree();
  const scaledSize = planet.size * DISTANCE_SCALE;
  const [labelDistance, setLabelDistance] = useState(scaledSize);
  const labelRef = useRef<HTMLDivElement>(null);
  const planetPosition = useRef(new Vector3(0, 0, 0));

  // Set a fixed screen-space distance for the label
  const SCREEN_DISTANCE = 0.02; // This controls how far the label appears from the planet in screen space

  // Update the label position on each frame based on camera distance
  useFrame(() => {
    if (!labelRef.current) return;

    // Calculate camera distance to planet
    const distanceToCamera = camera.position.distanceTo(planetPosition.current);

    // Scale the label distance based on camera distance
    // This keeps the label at a visually consistent distance regardless of zoom
    const newLabelDistance = scaledSize + SCREEN_DISTANCE * distanceToCamera;
    setLabelDistance(newLabelDistance);
  });

  console.log("labelDistance", JSON.stringify(labelDistance, null, 2));

  return { labelDistance, labelRef };
}
