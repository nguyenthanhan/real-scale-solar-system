"use client";

import { PlanetData } from "@/types/planet-types";
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
    <>
      <div className="fixed inset-0 bg-transparent z-40" onClick={onClose} />
      <div
        className="fixed top-4 right-4 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <PlanetInfo planet={planet} onClose={onClose} />
      </div>
    </>
  );
}
