"use client";

import { Line } from "@react-three/drei";
import * as THREE from "three";

interface RotationAxisProps {
  planetSize: number;
  axialTilt: number;
}

export function RotationAxis({ planetSize, axialTilt = 0 }: RotationAxisProps) {
  // Create a simple line that represents the rotation axis
  const axisLength = planetSize * 2.2; // Make it longer than the planet diameter

  // Create two points for a straight line along Y-axis (rotation axis)
  const points = [
    new THREE.Vector3(0, -axisLength / 2, 0),
    new THREE.Vector3(0, axisLength / 2, 0),
  ];

  return (
    <Line
      points={points}
      color="white"
      lineWidth={2}
      transparent
      opacity={0.8}
      rotation={[((axialTilt || 0) * Math.PI) / 180, 0, 0]}
      dashed
      dashScale={planetSize * 0.1}
      dashSize={planetSize * 0.08}
      dashOffset={0}
    />
  );
}
