"use client";

import { Line } from "@react-three/drei";
import * as THREE from "three";

interface RotationAxisProps {
  planetSize: number;
  axialTilt: number;
}

export function RotationAxis({ planetSize, axialTilt = 0 }: RotationAxisProps) {
  // Create a dashed line that represents the rotation axis
  const axisLength = planetSize * 2.2; // Make it longer than the planet diameter

  // Create dashed line points along Y-axis (rotation axis)
  const dashLength = planetSize * 0.1; // Length of each dash
  const gapLength = planetSize * 0.05; // Length of gap between dashes
  const points: THREE.Vector3[] = [];

  let currentY = -axisLength / 2;
  let isDash = true;

  while (currentY < axisLength / 2) {
    const segmentLength = isDash ? dashLength : gapLength;
    const endY = Math.min(currentY + segmentLength, axisLength / 2);

    if (isDash) {
      points.push(new THREE.Vector3(0, currentY, 0));
      points.push(new THREE.Vector3(0, endY, 0));
    }

    currentY = endY;
    isDash = !isDash;
  }

  return (
    <Line
      points={points}
      color="white"
      lineWidth={2}
      transparent
      opacity={0.8}
      rotation={[((axialTilt || 0) * Math.PI) / 180, 0, 0]}
    />
  );
}
