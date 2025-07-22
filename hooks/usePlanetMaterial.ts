import { useMemo } from "react";
import * as THREE from "three";
import { PlanetData } from "@/data/planet-types";
import { createSunTexture } from "@/lib/planet-textures/sun-texture";
import { createGasGiantTexture } from "@/lib/planet-textures/gas-giant-texture";
import { createEarthTexture } from "@/lib/planet-textures/earth-texture";
import { createMarsTexture } from "@/lib/planet-textures/mars-texture";
import { createRockyPlanetTexture } from "@/lib/planet-textures/rocky-planet-texture";
import { createIceGiantTexture } from "@/lib/planet-textures/ice-giant-texture";

export function usePlanetMaterial(planet: PlanetData) {
  return useMemo(() => {
    // Create a canvas for the texture
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      // Fallback to basic material if canvas context is unavailable
      return new THREE.MeshStandardMaterial({
        color: planet.color,
        metalness: 0.1,
        roughness: 0.6,
      });
    }

    // Fill with base color
    ctx.fillStyle = planet.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Generate specific texture based on planet type
    if (planet.name === "Sun") {
      createSunTexture(ctx, canvas);
    } else if (planet.name === "Jupiter" || planet.name === "Saturn") {
      createGasGiantTexture(ctx, canvas, planet.color);
    } else if (planet.name === "Earth") {
      createEarthTexture(ctx, canvas);
    } else if (planet.name === "Mars") {
      createMarsTexture(ctx, canvas);
    } else if (planet.name === "Mercury" || planet.name === "Venus") {
      createRockyPlanetTexture(ctx, canvas, planet.color);
    } else if (planet.name === "Uranus" || planet.name === "Neptune") {
      createIceGiantTexture(ctx, canvas, planet.color);
    }

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    return new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.1,
      roughness: 0.6,
    });
  }, [planet.name, planet.color]);
}
