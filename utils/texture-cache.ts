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
  size: number; // Memory usage estimate
}

class TextureCache {
  private cache = new Map<string, CachedTexture>();
  private readonly maxCacheSize = 50; // Maximum number of cached textures
  private readonly maxMemoryUsage = 100 * 1024 * 1024; // 100MB limit
  private currentMemoryUsage = 0;
  private memoryTrackingEnabled = false;

  private generateKey(key: TextureCacheKey): string {
    const { type, width, height, color } = key;
    return `${type}_${width}x${height}_${color || "default"}`;
  }

  private estimateTextureSize(width: number, height: number): number {
    // Estimate memory usage: width * height * 4 bytes (RGBA) * 2 (for mipmaps)
    return width * height * 4 * 2;
  }

  private getActualMemoryUsage(): number {
    if (!this.memoryTrackingEnabled || typeof performance === "undefined") {
      return this.currentMemoryUsage; // Fallback to estimated usage
    }

    try {
      // Use Performance Memory API for actual memory tracking
      const memoryInfo = (
        performance as Performance & { memory?: { usedJSHeapSize: number } }
      ).memory;
      if (memoryInfo) {
        return memoryInfo.usedJSHeapSize;
      }
    } catch (error) {
      console.warn("Failed to get actual memory usage:", error);
    }

    return this.currentMemoryUsage;
  }

  private getTextureMemoryUsage(texture: Texture): number {
    if (!texture.image) {
      return this.estimateTextureSize(512, 256); // Default fallback
    }

    try {
      // Try to get actual texture memory usage
      if (texture.image instanceof ImageBitmap) {
        return texture.image.width * texture.image.height * 4; // RGBA
      } else if (texture.image instanceof HTMLCanvasElement) {
        return texture.image.width * texture.image.height * 4; // RGBA
      } else if (texture.image instanceof HTMLImageElement) {
        return texture.image.naturalWidth * texture.image.naturalHeight * 4; // RGBA
      } else if (texture.image instanceof ImageData) {
        return texture.image.data.length; // Actual byte count
      }
    } catch (error) {
      console.warn("Failed to get texture memory usage:", error);
    }

    // Fallback to estimation
    return this.estimateTextureSize(512, 256);
  }

  private cleanupCache(): void {
    if (
      this.cache.size <= this.maxCacheSize &&
      this.currentMemoryUsage <= this.maxMemoryUsage
    ) {
      return;
    }

    // Sort by timestamp (oldest first)
    const entries = Array.from(this.cache.entries()).sort(
      (a, b) => a[1].timestamp - b[1].timestamp
    );

    // Remove oldest entries until we're under limits
    for (const [key, cachedTexture] of entries) {
      if (
        this.cache.size <= this.maxCacheSize &&
        this.currentMemoryUsage <= this.maxMemoryUsage
      ) {
        break;
      }

      this.cache.delete(key);
      this.currentMemoryUsage -= cachedTexture.size;

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
    const actualSize = this.getTextureMemoryUsage(texture);

    // Remove existing entry if it exists
    const existing = this.cache.get(cacheKey);
    if (existing) {
      this.currentMemoryUsage -= existing.size;
      existing.texture.dispose();
    }

    // Add new entry with actual memory usage
    this.cache.set(cacheKey, {
      texture,
      timestamp: Date.now(),
      size: actualSize,
    });

    this.currentMemoryUsage += actualSize;

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
    this.currentMemoryUsage = 0;
  }

  getStats(): {
    size: number;
    memoryUsage: number;
    actualMemoryUsage: number;
    maxSize: number;
    maxMemoryUsage: number;
    memoryTrackingEnabled: boolean;
  } {
    return {
      size: this.cache.size,
      memoryUsage: this.currentMemoryUsage,
      actualMemoryUsage: this.getActualMemoryUsage(),
      maxSize: this.maxCacheSize,
      maxMemoryUsage: this.maxMemoryUsage,
      memoryTrackingEnabled: this.memoryTrackingEnabled,
    };
  }

  // Enable/disable actual memory tracking
  enableMemoryTracking(): boolean {
    if (typeof performance !== "undefined" && (performance as any).memory) {
      this.memoryTrackingEnabled = true;
      console.log("Memory tracking enabled");
      return true;
    } else {
      console.warn("Memory tracking not available - using estimates only");
      return false;
    }
  }

  disableMemoryTracking(): void {
    this.memoryTrackingEnabled = false;
    console.log("Memory tracking disabled");
  }

  // Initialize memory tracking
  initialize(): void {
    this.enableMemoryTracking();
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
