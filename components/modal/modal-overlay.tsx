"use client";

import { PlanetData } from "@/data/planet-types";
import { PlanetInfo } from "@/components/modal/planet-info";

export function ModalOverlay({
  planet,
  onClose,
}: {
  planet: PlanetData | null;
  onClose: () => void;
}) {
  if (!planet) return null;

  return (
    <div className="fixed inset-0 z-modal" onClick={(e) => e.stopPropagation()}>
      <PlanetInfo planet={planet} onClose={onClose} />
    </div>
  );
}
