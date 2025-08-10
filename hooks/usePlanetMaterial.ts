import { useMemo, useEffect, useRef } from "react";
import { MeshStandardMaterial, CanvasTexture, RepeatWrapping } from "three";
import { PlanetData } from "@/data/planet-types";
import { createSunTexture } from "@/lib/planet-textures/sun-texture";
import { createGasGiantTexture } from "@/lib/planet-textures/gas-giant-texture";
import { createEarthTexture } from "@/lib/planet-textures/earth-texture";
import { createMarsTexture } from "@/lib/planet-textures/mars-texture";
import { createRockyPlanetTexture } from "@/lib/planet-textures/rocky-planet-texture";
import { createIceGiantTexture } from "@/lib/planet-textures/ice-giant-texture";
import { textureCache, TextureCacheKey } from "@/utils/texture-cache";

export type TextureQuality = "detailed" | "simple";

export function usePlanetMaterial(planet: PlanetData) {
  const materialRef = useRef<MeshStandardMaterial | null>(null);
  const textureRef = useRef<CanvasTexture | null>(null);
  const textureFromCacheRef = useRef<boolean>(false);

  // Texture generation constants
  const TEX_WIDTH = 512;
  const TEX_HEIGHT = 256;

  const resolveTextureKey = (p: PlanetData): TextureCacheKey => {
    // Map planet names to cache texture types
    if (p.name === "Sun") return { type: "sun", width: TEX_WIDTH, height: TEX_HEIGHT };
    if (p.name === "Jupiter" || p.name === "Saturn")
      return { type: "gas-giant", width: TEX_WIDTH, height: TEX_HEIGHT, color: p.color };
    if (p.name === "Earth") return { type: "earth", width: TEX_WIDTH, height: TEX_HEIGHT };
    if (p.name === "Mars") return { type: "mars", width: TEX_WIDTH, height: TEX_HEIGHT };
    if (p.name === "Mercury" || p.name === "Venus")
      return { type: "rocky-planet", width: TEX_WIDTH, height: TEX_HEIGHT, color: p.color };
    if (p.name === "Uranus" || p.name === "Neptune")
      return { type: "ice-giant", width: TEX_WIDTH, height: TEX_HEIGHT, color: p.color };
    // Default to rocky-planet keyed by color
    return { type: "rocky-planet", width: TEX_WIDTH, height: TEX_HEIGHT, color: p.color };
  };

  const material = useMemo(() => {
    // Dispose of previous material and texture
    if (materialRef.current) {
      if (materialRef.current.map && !textureFromCacheRef.current) {
        // Only dispose owned textures, not cache-shared ones
        materialRef.current.map.dispose();
      }
      materialRef.current.dispose();
    }
    if (textureRef.current && !textureFromCacheRef.current) {
      textureRef.current.dispose();
    }
    textureFromCacheRef.current = false;

    // Try cache first
    const key = resolveTextureKey(planet);
    const cached = textureCache.get(key);
    if (cached) {
      const mat = new MeshStandardMaterial({
        map: cached,
        metalness: 0.1,
        roughness: 0.6,
      });
      materialRef.current = mat;
      // Track that this texture is shared from cache; don't dispose on cleanup
      textureFromCacheRef.current = true;
      // We still keep a ref for symmetry, but do not dispose it
      textureRef.current = cached as CanvasTexture;
      return mat;
    }

    // Create a canvas for the texture (will be cached after generation)
    const canvas = document.createElement("canvas");
    canvas.width = TEX_WIDTH;
    canvas.height = TEX_HEIGHT;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.warn("Failed to create canvas context");
      // Fallback to basic material if canvas context is unavailable
      const fallbackMaterial = new MeshStandardMaterial({
        color: planet.color,
        metalness: 0.1,
        roughness: 0.6,
      });
      materialRef.current = fallbackMaterial;
      return fallbackMaterial;
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
    const texture = new CanvasTexture(canvas);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    textureRef.current = texture;

    // Store in cache for reuse elsewhere
    textureCache.set(key, texture);

    const material = new MeshStandardMaterial({
      map: texture,
      metalness: 0.1,
      roughness: 0.6,
    });
    materialRef.current = material;

    return material;
  }, [planet.name, planet.color]);

  // Cleanup effect to dispose materials and textures on unmount
  useEffect(() => {
    return () => {
      if (materialRef.current) {
        if (materialRef.current.map && !textureFromCacheRef.current) {
          materialRef.current.map.dispose();
        }
        materialRef.current.dispose();
        materialRef.current = null;
      }
      if (textureRef.current && !textureFromCacheRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
      textureFromCacheRef.current = false;
    };
  }, []);

  return material;
}
