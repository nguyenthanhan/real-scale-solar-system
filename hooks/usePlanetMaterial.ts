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

// Module-level cache for fallback materials to prevent GPU memory leaks
const fallbackMaterialCache = new Map<string, MeshStandardMaterial>();

/**
 * Gets or creates a cached fallback material for the given color.
 * Reuses cached materials to prevent memory leaks.
 */
function getOrCreateFallbackMaterial(
  color: string,
): MeshStandardMaterial {
  let cachedFallback = fallbackMaterialCache.get(color);
  if (!cachedFallback) {
    cachedFallback = new MeshStandardMaterial({
      color,
      metalness: 0.1,
      roughness: 0.6,
    });
    fallbackMaterialCache.set(color, cachedFallback);
  }
  return cachedFallback;
}

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
    let cancelled = false;

    // Get texture configuration for this planet
    const config = PLANET_TEXTURES[planet.name];

    if (!config) {
      // No texture configuration found - fallback to color-based material
      console.warn(`No texture configuration found for planet: ${planet.name}`);
      // Create or reuse fallback material
      const fallbackMaterial = getOrCreateFallbackMaterial(planet.color);
      materialRef.current = fallbackMaterial;
      // Use setTimeout to defer state updates and avoid cascading renders
      setTimeout(() => {
        if (!cancelled && isMountedRef.current) {
          setMaterial(fallbackMaterial);
          setIsLoading(false);
        }
      }, 0);
      return () => {
        cancelled = true;
        isMountedRef.current = false;
      };
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
        planet.color,
      );
      materialRef.current = mat;
      // Use setTimeout to defer state updates and avoid cascading renders
      setTimeout(() => {
        if (!cancelled && isMountedRef.current) {
          setMaterial(mat);
          setIsLoading(false);
        }
      }, 0);
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
          planet.color,
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
          error,
        );

        // Create or reuse fallback material
        const fallbackMaterial = getOrCreateFallbackMaterial(planet.color);
        materialRef.current = fallbackMaterial;
        setMaterial(fallbackMaterial);
        setIsLoading(false);
      },
    );

    // Cleanup function
    return () => {
      cancelled = true;
      isMountedRef.current = false;

      // Dispose material but NOT cached textures or cached fallback materials (they're shared resources)
      if (materialRef.current) {
        const mat = materialRef.current as
          | MeshStandardMaterial
          | MeshBasicMaterial;
        
        // Check if this is a cached fallback material - don't dispose shared cached materials
        const cachedFallback = fallbackMaterialCache.get(planet.color);
        const isCachedFallback = mat === cachedFallback;
        
        if (!isCachedFallback) {
          // Only dispose the material's map if it's NOT in the cache
          if (mat.map && !textureCache.has(cacheKey)) {
            mat.map.dispose();
          }
          materialRef.current.dispose();
        }
        materialRef.current = null;
      }

      // Clear loader reference
      loaderRef.current = null;
    };
  }, [planet.name, planet.color]);

  // Update cached fallback material reference when planet color changes
  useEffect(() => {
    // Update fallback material reference to use cached material for current color
    // This reuses the existing cached fallback material instead of creating a new one
    fallbackMaterialRef.current = getOrCreateFallbackMaterial(planet.color);
    
    // No cleanup needed - cached materials are shared and should not be disposed
    // The ref is just a pointer to the cached material, not ownership
  }, [planet.color]);

  // Return cached fallback material while the actual material is being prepared
  // Use cached fallback material to avoid creating new materials during render
  if (isLoading || !material) {
    // Access cache directly during render (cache is module-level, safe to call)
    // getOrCreateFallbackMaterial uses the cache, so it's safe to call during render
    return getOrCreateFallbackMaterial(planet.color);
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
  baseColor: string,
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
      color: baseColor,
      metalness: 0.1,
      roughness: 0.6,
    });
  }
}
