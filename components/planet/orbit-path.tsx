"use client";

import * as THREE from "three";
import { useMemo } from "react";

interface OrbitPathProps {
  orbitCurve: THREE.EllipseCurve;
}

export function OrbitPath({ orbitCurve }: OrbitPathProps) {
  // Create orbit path visualization
  const orbitPath = useMemo(() => {
    const points = orbitCurve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(
      points.map((p) => new THREE.Vector3(p.x, 0, p.y))
    );

    return (
      <primitive
        object={
          new THREE.LineLoop(
            geometry,
            new THREE.LineBasicMaterial({
              color: "#666666",
              opacity: 0.5,
              transparent: true,
            })
          )
        }
      />
    );
  }, [orbitCurve]);

  return orbitPath;
}
