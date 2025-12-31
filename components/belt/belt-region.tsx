"use client";

import * as THREE from "three";
import { useMemo, useRef, useEffect } from "react";
import { Text } from "@react-three/drei";
import { BeltData } from "@/data/belt-data";

// Scale factor: 1 AU = 1000 units (consistent with planet scaling)
export const AU_TO_UNITS = 1000;

interface BeltRegionProps {
  belt: BeltData;
  showLabel?: boolean;
}

/**
 * BeltLabel component renders text label on the belt
 * Positioned flat on the ecliptic plane, facing toward the Sun (center)
 * Text is placed on the near side (negative Z) for better visibility
 */
function BeltLabel({
  text,
  radius,
  fontSize,
  color,
}: {
  text: string;
  radius: number;
  fontSize: number;
  color: string;
}) {
  return (
    <Text
      position={[0, 10, -radius]}
      rotation={[-Math.PI / 2, 0, 0]}
      fontSize={fontSize}
      color={color}
      anchorX="center"
      anchorY="middle"
      fillOpacity={0.9}
      outlineWidth={fontSize * 0.05}
      outlineColor="#000000"
      renderOrder={100}
      material-depthTest={false}
      frustumCulled={false}
    >
      {text}
    </Text>
  );
}

/**
 * BeltRegion component renders a belt region with:
 * 1. Filled ring (RingGeometry) showing the belt area
 * 2. Particle field with randomly distributed points
 * 3. Curved label text showing belt name
 */
export function BeltRegion({ belt, showLabel = true }: BeltRegionProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Scale radii from AU to visualization units
  const scaledInnerRadius = belt.innerRadiusAU * AU_TO_UNITS;
  const scaledOuterRadius = belt.outerRadiusAU * AU_TO_UNITS;

  // Create filled ring geometry
  const ringGeometry = useMemo(() => {
    return new THREE.RingGeometry(scaledInnerRadius, scaledOuterRadius, 128);
  }, [scaledInnerRadius, scaledOuterRadius]);

  // Create ring material
  const ringMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: belt.color,
      opacity: belt.opacity,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, [belt.color, belt.opacity]);

  // Create particle positions randomly distributed in the belt region
  const particleGeometry = useMemo(() => {
    const positions = new Float32Array(belt.particleCount * 3);
    const colors = new Float32Array(belt.particleCount * 3);
    const baseColor = new THREE.Color(belt.color);

    for (let i = 0; i < belt.particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radiusRange = scaledOuterRadius - scaledInnerRadius;
      const radius = scaledInnerRadius + Math.random() * radiusRange;

      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * radiusRange * 0.05;
      const z = Math.sin(angle) * radius;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const colorVariation = 0.8 + Math.random() * 0.4;
      colors[i * 3] = baseColor.r * colorVariation;
      colors[i * 3 + 1] = baseColor.g * colorVariation;
      colors[i * 3 + 2] = baseColor.b * colorVariation;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, [belt.particleCount, belt.color, scaledInnerRadius, scaledOuterRadius]);

  // Create particle material
  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: belt.particleSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      depthWrite: false,
    });
  }, [belt.particleSize]);

  // Set render order and rotate ring to lie on ecliptic plane
  useEffect(() => {
    if (ringRef.current) {
      ringRef.current.renderOrder = -2;
      ringRef.current.rotation.x = -Math.PI / 2;
    }
    if (particlesRef.current) {
      particlesRef.current.renderOrder = -1;
    }
  }, []);

  // Cleanup geometries and materials on unmount
  useEffect(() => {
    return () => {
      ringGeometry.dispose();
      ringMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [ringGeometry, ringMaterial, particleGeometry, particleMaterial]);

  // Calculate label parameters
  const labelRadius = (scaledInnerRadius + scaledOuterRadius) / 2;
  const labelFontSize = (scaledOuterRadius - scaledInnerRadius) * 0.25;

  return (
    <group name={`belt-${belt.id}`}>
      {/* Filled ring showing belt area */}
      <mesh ref={ringRef} geometry={ringGeometry} material={ringMaterial} />
      {/* Particle field */}
      <points
        ref={particlesRef}
        geometry={particleGeometry}
        material={particleMaterial}
      />
      {/* Belt name label */}
      {showLabel && (
        <BeltLabel
          text={belt.name}
          radius={labelRadius}
          fontSize={labelFontSize}
          color={belt.color}
        />
      )}
    </group>
  );
}
