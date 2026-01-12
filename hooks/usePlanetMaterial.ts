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
  const loadingMaterialRef = useRef<MeshStandardMaterial | null>(null);
  // Initialize fallback material from cache synchronously to avoid creating materials during render
  const fallbackMaterialRef = useRef<MeshStandardMaterial | null>(
    getOrCreateFallbackMaterial(planet.color),
  );

  const [loadingMaterial, setLoadingMaterial] =
    useState<MeshStandardMaterial | null>(null);

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

  // Initialize and update loading material when planet color changes
  useEffect(() => {
    let cancelled = false;

    // Capture previous material but don't dispose it yet
    const previousMaterial = loadingMaterialRef.current;

    // Create new loading material for current planet color
    const newMaterial = new MeshStandardMaterial({
      color: planet.color,
      metalness: 0.1,
      roughness: 0.6,
    });
    // Assign new material to ref immediately to avoid race conditions
    loadingMaterialRef.current = newMaterial;
    
    // Use setTimeout to defer state updates and avoid cascading renders
    // Dispose previous material AFTER state update to prevent render-window race
    setTimeout(() => {
      if (!cancelled && isMountedRef.current) {
        setLoadingMaterial(newMaterial);
        // Dispose previous material after state update completes
        if (previousMaterial) {
          previousMaterial.dispose();
        }
      } else {
        // If cancelled, dispose the new material we just created
        newMaterial.dispose();
      }
    }, 0);

    // Initialize or update cached fallback material for the current color
    fallbackMaterialRef.current = getOrCreateFallbackMaterial(planet.color);

    // Cleanup: dispose materials on unmount or when planet.color changes
    return () => {
      cancelled = true;
      // Dispose current material in ref (the new material we just created)
      if (loadingMaterialRef.current) {
        loadingMaterialRef.current.dispose();
        loadingMaterialRef.current = null;
      }
      // Also dispose previous material as safety net (setTimeout might not have run yet)
      // Disposing twice is safe in Three.js (it's a no-op)
      if (previousMaterial) {
        previousMaterial.dispose();
      }
      // Clear fallback ref (but don't dispose cached material - it's shared)
      fallbackMaterialRef.current = null;
    };
  }, [planet.color]);

  // Return loading material while the actual material is being prepared
  // Use state value (not ref) to avoid accessing refs during render
  if (isLoading || !material) {
    // Always return the persisted loading material from state
    // loadingMaterial is initialized with a value, so it should never be null
    if (!loadingMaterial) {
      // Fallback: use cached fallback material (can happen on initial render before useEffect's setTimeout runs)
      // Access cache directly during render (cache is module-level, not a ref)
      return getOrCreateFallbackMaterial(planet.color);
    }
    return loadingMaterial;
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
