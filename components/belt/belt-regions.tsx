"use client";

import { BELT_DATA } from "@/data/belt-data";
import { BeltRegion } from "./belt-region";

interface BeltRegionsProps {
  visible: boolean;
}

/**
 * BeltRegions container component that renders all belt regions.
 * Maps over BELT_DATA and renders a BeltRegion for each belt.
 * Conditionally renders based on visible prop.
 */
export function BeltRegions({ visible }: BeltRegionsProps) {
  if (!visible) {
    return null;
  }

  return (
    <group name="belt-regions">
      {BELT_DATA.map((belt) => (
        <BeltRegion key={belt.id} belt={belt} />
      ))}
    </group>
  );
}
