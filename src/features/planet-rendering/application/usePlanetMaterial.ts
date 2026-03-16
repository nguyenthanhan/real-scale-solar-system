import { useState, useEffect, useRef, useMemo } from "react";
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
 * - Error handling with fallback to base colors (planet.color) when textures fail to load
 * - Proper cleanup of materials without disposing shared cached textures
 * - Special handling for Sun (emissive MeshBasicMaterial)
 *
 * IMPORTANT: When textures are successfully loaded, the material color property is NOT set.
 * This prevents tinting of realistic planetary textures. The planet.color from PlanetData
 * is ONLY used as a fallback when:
 * 1. No texture configuration exists for the planet (PLANET_TEXTURES[planet.name] is undefined)
 * 2. Texture loading fails (onError callback)
 * 3. Material is still loading (temporary fallback during async load)
 */
export function usePlanetMaterial(planet: PlanetData): Material {
  const [material, setMaterial] = useState<Material | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const materialRef = useRef<Material | null>(null);
  const loaderRef = useRef<TextureLoader | null>(null);
  const isMountedRef = useRef(true);
  // Initialize fallback material using useMemo to avoid render-time side effects
  // This memoizes the fallback material and recomputes only when planet.color changes
  const fallbackMaterial = useMemo(
    () => getOrCreateFallbackMaterial(planet.color),
    [planet.color]
  );

  useEffect(() => {
    isMountedRef.current = true;
    let cancelled = false;

    // Get texture configuration for this planet
    const config = PLANET_TEXTURES[planet.name];

    if (!config) {
      // No texture configuration found - fallback to color-based material
      console.warn(`No texture configuration found for planet: ${planet.name}`);
      // Use the pre-initialized fallback material
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
      );
      materialRef.current = mat;
      // Use setTimeout to defer state updates and avoid cascading renders
      setTimeout(() => {
        if (!cancelled && isMountedRef.current) {
          setMaterial(mat);
          setIsLoading(false);
        }
      }, 0);
      return () => {
        cancelled = true;
        isMountedRef.current = false;
        // Don't dispose mat here - it uses cached texture
      };
    }

    // Load texture asynchronously
    const loader = new TextureLoader();
    loaderRef.current = loader;

    loader.load(
      config.texturePath,
      // onLoad callback
      (texture) => {
        if (cancelled || !isMountedRef.current) return;

        // Store texture in cache for reuse
        textureCache.set(cacheKey, texture);

        // Create material with loaded texture
        const mat = createMaterialWithTexture(
          texture,
          config.materialType,
        );
        materialRef.current = mat;
        setMaterial(mat);
        setIsLoading(false);
      },
      // onProgress callback (optional)
      undefined,
      // onError callback
      (error) => {
        if (cancelled || !isMountedRef.current) return;

        console.error(
          `Failed to load texture for ${planet.name} from ${config.texturePath}:`,
          error,
        );

        // Use the pre-initialized fallback material
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
  }, [planet.name, planet.color, fallbackMaterial]);



  // Return cached fallback material while the actual material is being prepared
  // Fallback material is initialized using useState lazy initializer to avoid render-time side effects
  if (isLoading || !material) {
    return fallbackMaterial;
  }

  return material;
}

/**
 * Helper function to create the appropriate material type with a loaded texture.
 *
 * IMPORTANT: The color property is intentionally omitted when textures are present.
 * In Three.js, setting a material's color multiplies it with the texture, causing
 * unwanted tinting (e.g., Earth texture would be tinted blue, Mars reddish, etc.).
 * The planet.color from PlanetData is only used as a fallback when no texture
 * configuration exists (see getOrCreateFallbackMaterial).
 *
 * @param texture - The loaded Three.js Texture
 * @param materialType - "basic" for Sun (emissive), "standard" for planets
 * @returns Material instance (MeshBasicMaterial or MeshStandardMaterial) without color property
 */
function createMaterialWithTexture(
  texture: Texture,
  materialType: "standard" | "basic",
): Material {
  if (materialType === "basic") {
    // Sun uses MeshBasicMaterial for emissive, self-illuminated effect
    // Color is intentionally omitted to prevent tinting the texture
    // planet.color is only used as a fallback when textures aren't available
    return new MeshBasicMaterial({
      map: texture,
      // No color property - texture provides all color information
    });
  } else {
    // Planets use MeshStandardMaterial for realistic lighting
    // Color is intentionally omitted to prevent tinting the texture
    // planet.color is only used as a fallback when textures aren't available
    return new MeshStandardMaterial({
      map: texture,
      metalness: 0.1,
      roughness: 0.6,
      // No color property - texture provides all color information
    });
  }
}
