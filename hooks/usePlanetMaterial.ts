import { useState, useEffect, useRef } from "react";
import {
  MeshStandardMaterial,
  MeshBasicMaterial,
  TextureLoader,
  Material,
  Texture,
} from "three";
import { PlanetData } from "@/data/planet-types";
import { PLANET_TEXTURES } from "@/lib/planet-textures/texture-config";
import { textureCache, TextureCacheKey } from "@/utils/texture-cache";

/**
 * Custom hook for loading and managing planet materials with realistic texture images.
 * Replaces Canvas-based procedural texture generation with TextureLoader for photorealistic planets.
 *
 * Features:
 * - Asynchronous texture loading with loading states
 * - Texture caching to prevent duplicate loads
 * - Error handling with fallback to base colors
 * - Proper cleanup of materials without disposing shared cached textures
 * - Special handling for Sun (emissive MeshBasicMaterial)
 */
export function usePlanetMaterial(planet: PlanetData): Material {
  const [material, setMaterial] = useState<Material | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const materialRef = useRef<Material | null>(null);
  const loaderRef = useRef<TextureLoader | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    // Get texture configuration for this planet
    const config = PLANET_TEXTURES[planet.name];

    if (!config) {
      // No texture configuration found - fallback to color-based material
      console.warn(`No texture configuration found for planet: ${planet.name}`);
      const fallbackMaterial = new MeshStandardMaterial({
        color: planet.color,
        metalness: 0.1,
        roughness: 0.6,
      });
      materialRef.current = fallbackMaterial;
      setMaterial(fallbackMaterial);
      setIsLoading(false);
      return;
    }

    // Create cache key for this texture
    const cacheKey: TextureCacheKey = {
      type: planet.name,
      path: config.texturePath,
    };

    // Check if texture is already cached
    const cachedTexture = textureCache.get(cacheKey);

    if (cachedTexture) {
      // Use cached texture to create material
      const mat = createMaterialWithTexture(
        cachedTexture,
        config.materialType,
        planet.color
      );
      materialRef.current = mat;
      setMaterial(mat);
      setIsLoading(false);
      return;
    }

    // Load texture asynchronously
    const loader = new TextureLoader();
    loaderRef.current = loader;

    loader.load(
      config.texturePath,
      // onLoad callback
      (texture) => {
        if (!isMountedRef.current) return;

        // Store texture in cache for reuse
        textureCache.set(cacheKey, texture);

        // Create material with loaded texture
        const mat = createMaterialWithTexture(
          texture,
          config.materialType,
          planet.color
        );
        materialRef.current = mat;
        setMaterial(mat);
        setIsLoading(false);
      },
      // onProgress callback (optional)
      undefined,
      // onError callback
      (error) => {
        if (!isMountedRef.current) return;

        console.error(
          `Failed to load texture for ${planet.name} from ${config.texturePath}:`,
          error
        );

        // Fallback to color-based material on error
        const fallbackMaterial = new MeshStandardMaterial({
          color: planet.color,
          metalness: 0.1,
          roughness: 0.6,
        });
        materialRef.current = fallbackMaterial;
        setMaterial(fallbackMaterial);
        setIsLoading(false);
      }
    );

    // Cleanup function
    return () => {
      isMountedRef.current = false;

      // Dispose material but NOT cached textures (they're shared resources)
      if (materialRef.current) {
        // Only dispose the material's map if it's NOT in the cache
        const mat = materialRef.current as
          | MeshStandardMaterial
          | MeshBasicMaterial;
        if (mat.map && !textureCache.has(cacheKey)) {
          mat.map.dispose();
        }
        materialRef.current.dispose();
        materialRef.current = null;
      }

      // Clear loader reference
      loaderRef.current = null;
    };
  }, [planet.name, planet.color]);

  // Return temporary color-based material while loading
  if (isLoading || !material) {
    return new MeshStandardMaterial({
      color: planet.color,
      metalness: 0.1,
      roughness: 0.6,
    });
  }

  return material;
}

/**
 * Helper function to create the appropriate material type with a loaded texture.
 *
 * @param texture - The loaded Three.js Texture
 * @param materialType - "basic" for Sun (emissive), "standard" for planets
 * @param baseColor - Fallback color for the material
 * @returns Material instance (MeshBasicMaterial or MeshStandardMaterial)
 */
function createMaterialWithTexture(
  texture: Texture,
  materialType: "standard" | "basic",
  baseColor: string
): Material {
  if (materialType === "basic") {
    // Sun uses MeshBasicMaterial for emissive, self-illuminated effect
    return new MeshBasicMaterial({
      map: texture,
      color: baseColor,
    });
  } else {
    // Planets use MeshStandardMaterial for realistic lighting
    return new MeshStandardMaterial({
      map: texture,
      metalness: 0.1,
      roughness: 0.6,
    });
  }
}
