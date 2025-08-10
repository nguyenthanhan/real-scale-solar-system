/**
 * Texture cache system for storing generated planet textures
 * Prevents unnecessary regeneration and improves performance
 */

import { Texture } from "three";

export interface TextureCacheKey {
  type: "earth" | "mars" | "gas-giant" | "sun" | "ice-giant" | "rocky-planet";
  width: number;
  height: number;
  color?: string;
}

export interface CachedTexture {
  texture: Texture;
  timestamp: number;
}

class TextureCache {
  private cache = new Map<string, CachedTexture>();
  private readonly maxCacheSize = 50; // Maximum number of cached textures

  private generateKey(key: TextureCacheKey): string {
    const { type, width, height, color } = key;
    const normalizedColor =
      typeof color === "string" ? color.trim().toLowerCase() : "default";
    return `${type}_${width}x${height}_${normalizedColor}`;
  }

  private cleanupCache(): void {
    if (this.cache.size <= this.maxCacheSize) {
      return;
    }

    // Sort by timestamp (oldest first)
    const entries = Array.from(this.cache.entries()).sort(
      (a, b) => a[1].timestamp - b[1].timestamp
    );

    // Remove oldest entries until we're under limits
    for (const [key, cachedTexture] of entries) {
      if (this.cache.size <= this.maxCacheSize) {
        break;
      }

      this.cache.delete(key);

      // Dispose of the texture to free GPU memory
      cachedTexture.texture.dispose();
    }
  }

  get(key: TextureCacheKey): Texture | null {
    const cacheKey = this.generateKey(key);
    const cached = this.cache.get(cacheKey);

    if (cached) {
      // Update timestamp to mark as recently used
      cached.timestamp = Date.now();
      return cached.texture;
    }

    return null;
  }

  set(key: TextureCacheKey, texture: Texture): void {
    const cacheKey = this.generateKey(key);

    // Remove existing entry if it exists
    const existing = this.cache.get(cacheKey);
    if (existing) {
      existing.texture.dispose();
    }

    // Add new entry with actual memory usage
    this.cache.set(cacheKey, {
      texture,
      timestamp: Date.now(),
    });

    // Cleanup if necessary
    this.cleanupCache();
  }

  has(key: TextureCacheKey): boolean {
    const cacheKey = this.generateKey(key);
    return this.cache.has(cacheKey);
  }

  clear(): void {
    // Dispose of all textures
    for (const cachedTexture of this.cache.values()) {
      cachedTexture.texture.dispose();
    }

    this.cache.clear();
  }

  // Public stats getters for safe external monitoring
  getSize(): number {
    return this.cache.size;
  }

  getMaxSize(): number {
    return this.maxCacheSize;
  }

  // Preload common textures
  async preloadCommonTextures(): Promise<void> {
    const commonTextures: TextureCacheKey[] = [
      { type: "earth", width: 512, height: 256 },
      { type: "mars", width: 512, height: 256 },
      { type: "gas-giant", width: 512, height: 256, color: "#FFD700" }, // Jupiter
      { type: "gas-giant", width: 512, height: 256, color: "#F4A460" }, // Saturn
      { type: "ice-giant", width: 512, height: 256, color: "#87CEEB" }, // Uranus
      { type: "ice-giant", width: 512, height: 256, color: "#4169E1" }, // Neptune
    ];

    // Note: Actual preloading would require the texture generation worker
    // This is a placeholder for future implementation
    console.log("Preloading common textures:", commonTextures.length);
  }
}

// Export singleton instance
export const textureCache = new TextureCache();
