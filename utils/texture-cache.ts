/**
 * Texture Cache System for Planet Textures
 *
 * This module provides a caching layer for Three.js textures loaded from image files.
 * It prevents duplicate texture loads, manages memory usage, and implements LRU eviction.
 *
 * Key Features:
 * - Prevents duplicate texture loads for the same planet
 * - LRU (Least Recently Used) eviction when cache is full
 * - Automatic GPU memory cleanup via texture.dispose()
 * - Timestamp tracking for cache freshness
 *
 * Usage:
 * ```typescript
 * import { textureCache } from '@/utils/texture-cache';
 *
 * const key = { type: 'Earth', path: '/textures/earth.jpg' };
 * const cached = textureCache.get(key);
 * if (!cached) {
 *   loader.load(path, (texture) => {
 *     textureCache.set(key, texture);
 *   });
 * }
 * ```
 */

import { Texture } from "three";

/**
 * Cache key structure for identifying unique textures.
 * Combines planet name and file path to create a unique identifier.
 */
export interface TextureCacheKey {
  /** Planet name (e.g., "Earth", "Mars", "Sun") */
  type: string;
  /** Texture file path (e.g., "/textures/earth.jpg") */
  path: string;
}

/**
 * Cached texture entry with timestamp for LRU tracking.
 */
export interface CachedTexture {
  /** The Three.js Texture instance */
  texture: Texture;
  /** Unix timestamp (ms) of last access for LRU eviction */
  timestamp: number;
}

/**
 * TextureCache class manages a pool of loaded Three.js textures.
 * Implements LRU (Least Recently Used) eviction strategy to manage memory.
 */
class TextureCache {
  /** Internal cache storage mapping string keys to cached texture entries */
  private cache = new Map<string, CachedTexture>();

  /** Maximum number of textures to keep in cache before eviction */
  private readonly maxCacheSize = 20; // Reduced from previous limits since image textures are smaller than canvas textures

  /**
   * Generates a unique string key from a TextureCacheKey object.
   * Format: "{planetName}_{texturePath}"
   *
   * @param key - The cache key object
   * @returns A unique string identifier
   */
  private generateKey(key: TextureCacheKey): string {
    return `${key.type}_${key.path}`;
  }

  /**
   * Implements LRU (Least Recently Used) cache eviction.
   * Removes oldest textures when cache exceeds maxCacheSize.
   * Properly disposes textures to free GPU memory.
   */
  private cleanupCache(): void {
    if (this.cache.size <= this.maxCacheSize) {
      return;
    }

    // Sort entries by timestamp (oldest first) for LRU eviction
    const entries = Array.from(this.cache.entries()).sort(
      (a, b) => a[1].timestamp - b[1].timestamp
    );

    // Remove oldest entries until we're under the size limit
    for (const [key, cachedTexture] of entries) {
      if (this.cache.size <= this.maxCacheSize) {
        break;
      }

      this.cache.delete(key);

      // Dispose of the texture to free GPU memory
      // This is critical to prevent memory leaks
      cachedTexture.texture.dispose();
    }
  }

  /**
   * Retrieves a cached texture if it exists.
   * Updates the timestamp to mark the texture as recently used (LRU tracking).
   *
   * @param key - The cache key identifying the texture
   * @returns The cached Texture instance, or null if not found
   */
  get(key: TextureCacheKey): Texture | null {
    const cacheKey = this.generateKey(key);
    const cached = this.cache.get(cacheKey);

    if (cached) {
      // Update timestamp to mark as recently used (LRU tracking)
      cached.timestamp = Date.now();
      return cached.texture;
    }

    return null;
  }

  /**
   * Stores a texture in the cache.
   * If the key already exists, disposes the old texture before replacing.
   * Triggers cleanup if cache size exceeds the limit.
   *
   * @param key - The cache key identifying the texture
   * @param texture - The Three.js Texture instance to cache
   */
  set(key: TextureCacheKey, texture: Texture): void {
    const cacheKey = this.generateKey(key);

    // Remove existing entry if it exists to prevent memory leaks
    const existing = this.cache.get(cacheKey);
    if (existing) {
      existing.texture.dispose();
    }

    // Add new entry with current timestamp
    this.cache.set(cacheKey, {
      texture,
      timestamp: Date.now(),
    });

    // Trigger LRU cleanup if cache is full
    this.cleanupCache();
  }

  /**
   * Checks if a texture exists in the cache.
   *
   * @param key - The cache key to check
   * @returns True if the texture is cached, false otherwise
   */
  has(key: TextureCacheKey): boolean {
    const cacheKey = this.generateKey(key);
    return this.cache.has(cacheKey);
  }

  /**
   * Clears all cached textures and disposes them to free GPU memory.
   * Use this when cleaning up the entire application or resetting the scene.
   */
  clear(): void {
    // Dispose of all textures to free GPU memory
    for (const cachedTexture of this.cache.values()) {
      cachedTexture.texture.dispose();
    }

    this.cache.clear();
  }

  /**
   * Returns the current number of cached textures.
   * Useful for monitoring and debugging cache usage.
   *
   * @returns Current cache size
   */
  getSize(): number {
    return this.cache.size;
  }

  /**
   * Returns the maximum cache size limit.
   *
   * @returns Maximum number of textures that can be cached
   */
  getMaxSize(): number {
    return this.maxCacheSize;
  }
}

/**
 * Singleton instance of TextureCache.
 * Use this instance throughout the application to ensure textures are shared.
 *
 * Example:
 * ```typescript
 * import { textureCache } from '@/utils/texture-cache';
 *
 * const key = { type: 'Earth', path: '/textures/earth.jpg' };
 * const texture = textureCache.get(key);
 * ```
 */
export const textureCache = new TextureCache();
