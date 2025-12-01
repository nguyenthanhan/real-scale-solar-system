/**
 * Fetch with Fallback Tests
 * Property-based and unit tests for API fetch with fallback
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fc from "fast-check";
import {
  fetchWithFallback,
  fetchWithCache,
  clearAPICache,
} from "../services/fetch-with-fallback";
import { planetDataService } from "../services/planet-data-service";
import { PlanetData } from "../data/planet-types";

// Mock the planet data service
vi.mock("../services/planet-data-service", () => ({
  planetDataService: {
    fetchPlanetData: vi.fn(),
  },
}));

const mockPlanetDataService = vi.mocked(planetDataService);

describe("Fetch with Fallback", () => {
  const mockLocalData: PlanetData = {
    name: "Earth",
    color: "#4A90E2",
    size: 1,
    distance: 1,
    orbitalPeriod: 365.25,
    rotationSpeed: 1,
    description: "Our home planet",
    funFact: "The only planet known to support life",
    temperature: "15°C average",
    gravity: "9.81 m/s²",
    atmosphere: "Nitrogen, Oxygen",
    dayLength: "24 hours",
    moons: "1 (Moon)",
    diameterInKm: 12742,
    distanceFromSunInKm: 149600000,
    axialTilt: 23.44,
    rotationSpeedByDay: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    clearAPICache();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // **Feature: real-planet-data-api, Property 8: API failures trigger fallback**
  // **Validates: Requirements 6.1, 6.4**
  describe("Property 8: API failures trigger fallback", () => {
    it("should always return merged data even when API fails", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(
            "Mercury",
            "Venus",
            "Earth",
            "Mars",
            "Jupiter",
            "Saturn",
            "Uranus",
            "Neptune"
          ),
          fc.constantFrom(
            "network-error",
            "timeout-error",
            "json-error",
            "http-error"
          ),
          async (planetName, errorType) => {
            // Mock different types of API failures
            switch (errorType) {
              case "network-error":
                mockPlanetDataService.fetchPlanetData.mockRejectedValue(
                  new Error("Network error")
                );
                break;
              case "timeout-error":
                mockPlanetDataService.fetchPlanetData.mockRejectedValue(
                  new Error("API request timed out")
                );
                break;
              case "json-error":
                mockPlanetDataService.fetchPlanetData.mockRejectedValue(
                  new Error("Invalid JSON")
                );
                break;
              case "http-error":
                mockPlanetDataService.fetchPlanetData.mockRejectedValue(
                  new Error("HTTP 500")
                );
                break;
            }

            const result = await fetchWithFallback(planetName, mockLocalData);

            // Should always return data (never throw)
            expect(result).toBeDefined();
            // Should have local data preserved
            expect(result.name).toBe(mockLocalData.name);
            expect(result.color).toBe(mockLocalData.color);
            // Should indicate API error
            expect(result.apiError).toBe(true);
            // Should not have API data
            expect(result.apiMass).toBeUndefined();

            return true;
          }
        ),
        { numRuns: 32 } // 8 planets × 4 error types
      );
    });

    it("should return merged data on API success", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom("Earth", "Mars", "Jupiter"),
          async (planetName) => {
            mockPlanetDataService.fetchPlanetData.mockResolvedValue({
              id: planetName.toLowerCase(),
              name: planetName.toLowerCase(),
              englishName: planetName,
              isPlanet: true,
              mass: { massValue: 5.97, massExponent: 24 },
              avgTemp: 288,
              sideralOrbit: 365.25,
              sideralRotation: 23.93,
              moons: [{ moon: "Moon", rel: "moon" }],
            });

            const result = await fetchWithFallback(planetName, mockLocalData);

            // Should have merged data
            expect(result).toBeDefined();
            expect(result.apiError).toBe(false);
            expect(result.apiMass).toBeDefined();
            expect(result.apiTemperature).toBeDefined();

            return true;
          }
        ),
        { numRuns: 3 }
      );
    });
  });

  // Unit Tests
  describe("Unit Tests", () => {
    it("should return merged data on successful fetch", async () => {
      mockPlanetDataService.fetchPlanetData.mockResolvedValue({
        id: "earth",
        name: "earth",
        englishName: "Earth",
        isPlanet: true,
        mass: { massValue: 5.972, massExponent: 24 },
        avgTemp: 288,
        sideralOrbit: 365.25,
        sideralRotation: 23.93,
        moons: [{ moon: "Moon", rel: "moon" }],
      });

      const result = await fetchWithFallback("Earth", mockLocalData);

      expect(result.name).toBe("Earth");
      expect(result.apiError).toBe(false);
      expect(result.apiMass).toBe("5.97 × 10^24 kg");
      expect(result.apiTemperature).toBe("14.9°C");
      expect(result.apiMoonCount).toBe("1");
    });

    it("should return local data on API failure", async () => {
      mockPlanetDataService.fetchPlanetData.mockRejectedValue(
        new Error("Network error")
      );

      const result = await fetchWithFallback("Earth", mockLocalData);

      expect(result.name).toBe("Earth");
      expect(result.apiError).toBe(true);
      expect(result.apiMass).toBeUndefined();
      expect(result.apiTemperature).toBeUndefined();
      // Local data should be preserved
      expect(result.color).toBe(mockLocalData.color);
      expect(result.orbitalPeriod).toBe(mockLocalData.orbitalPeriod);
    });

    it("should log error but not throw on API failure", async () => {
      mockPlanetDataService.fetchPlanetData.mockRejectedValue(
        new Error("API timeout")
      );

      // Should not throw
      await expect(
        fetchWithFallback("Earth", mockLocalData)
      ).resolves.toBeDefined();

      // Should log error
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("Caching", () => {
    it("should cache successful API responses", async () => {
      mockPlanetDataService.fetchPlanetData.mockResolvedValue({
        id: "earth",
        name: "earth",
        englishName: "Earth",
        isPlanet: true,
        mass: { massValue: 5.972, massExponent: 24 },
        avgTemp: 288,
      });

      // First call
      await fetchWithCache("Earth", mockLocalData);
      expect(mockPlanetDataService.fetchPlanetData).toHaveBeenCalledTimes(1);

      // Second call should use cache
      await fetchWithCache("Earth", mockLocalData);
      expect(mockPlanetDataService.fetchPlanetData).toHaveBeenCalledTimes(1);
    });

    it("should not cache failed API responses", async () => {
      mockPlanetDataService.fetchPlanetData.mockRejectedValue(
        new Error("Network error")
      );

      // First call (fails)
      await fetchWithCache("Mars", mockLocalData);
      expect(mockPlanetDataService.fetchPlanetData).toHaveBeenCalledTimes(1);

      // Second call should try again (not cached)
      await fetchWithCache("Mars", mockLocalData);
      expect(mockPlanetDataService.fetchPlanetData).toHaveBeenCalledTimes(2);
    });

    it("should clear cache correctly", async () => {
      mockPlanetDataService.fetchPlanetData.mockResolvedValue({
        id: "earth",
        name: "earth",
        englishName: "Earth",
        isPlanet: true,
      });

      // First call
      await fetchWithCache("Earth", mockLocalData);
      expect(mockPlanetDataService.fetchPlanetData).toHaveBeenCalledTimes(1);

      // Clear cache
      clearAPICache();

      // Should fetch again after cache clear
      await fetchWithCache("Earth", mockLocalData);
      expect(mockPlanetDataService.fetchPlanetData).toHaveBeenCalledTimes(2);
    });
  });
});
