"use client";

import { PlanetData } from "@/data/planet-types";
import { useThree, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group, Vector3 } from "three";

const SCREEN_DISTANCE = 0.02;

export function useGetLabelDistance({ planet }: { planet: PlanetData }) {
  const { camera } = useThree();
  const scaledSize = planet.diameterRelativeEarth;
  const anchorRef = useRef<Group>(null);
  const labelOffsetRef = useRef<Group>(null);
  const worldPos = useMemo(() => new Vector3(), []);

  useFrame(() => {
    if (!anchorRef.current || !labelOffsetRef.current) return;

    anchorRef.current.getWorldPosition(worldPos);
    const distanceToCamera = camera.position.distanceTo(worldPos);
    labelOffsetRef.current.position.y =
      scaledSize + SCREEN_DISTANCE * distanceToCamera;
  });

  return { anchorRef, labelOffsetRef };
}
