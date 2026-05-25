"use client";

import { useMemo } from "react";
import { BELT_DATA } from "@/features/belt-regions/data/belt-data";
import { BeltRegion } from "./belt-region";
import { useIsMobile } from "@/hooks/useIsMobile";

interface BeltRegionsProps {
  visible: boolean;
}

const MOBILE_PARTICLE_SCALE = 0.35;

/**
 * BeltRegions container component that renders all belt regions.
 * Maps over BELT_DATA and renders a BeltRegion for each belt.
 * Conditionally renders based on visible prop.
 */
export function BeltRegions({ visible }: BeltRegionsProps) {
  const isMobile = useIsMobile();

  const scaledBelts = useMemo(
    () =>
      BELT_DATA.map((belt) => ({
        ...belt,
        particleCount: isMobile
          ? Math.round(belt.particleCount * MOBILE_PARTICLE_SCALE)
          : belt.particleCount,
      })),
    [isMobile],
  );

  if (!visible) {
    return null;
  }

  return (
    <group name="belt-regions">
      {scaledBelts.map((belt) => (
        <BeltRegion key={belt.id} belt={belt} />
      ))}
    </group>
  );
}
