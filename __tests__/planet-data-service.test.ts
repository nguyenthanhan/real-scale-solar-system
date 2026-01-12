/**
 * Planet Data Service Tests
 * Tests for API request handling and data fetching
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fc from "fast-check";
import { PlanetDataService } from "../services/planet-data-service";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("PlanetDataService", () => {
  let service: PlanetDataService;

  beforeEach(() => {
    service = new PlanetDataService(
      "https://api.le-systeme-solaire.net/rest/bodies",
    );
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // **Feature: real-planet-data-api, Property 1: API requests use planet name**
  // **Validates: Requirements 1.2**
  describe("Property 1: API requests use planet name", () => {
    it("should use correct API endpoint containing planet name", async () => {
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
            "Neptune",
          ),
          async (planetName) => {
            // Clear mocks before each iteration
            mockFetch.mockClear();

            // Mock successful response
            mockFetch.mockResolvedValueOnce({
              ok: true,
              json: async () => ({
                name: planetName.toLowerCase(),
                englishName: planetName,
                isPlanet: true,
                mass: { massValue: 1, massExponent: 24 },
                avgTemp: 300,
                sideralOrbit: 365,
                sideralRotation: 24,
                moons: null,
              }),
            });

            await service.fetchPlanetData(planetName);

            // Verify the URL contains the planet name (lowercase)
            expect(mockFetch).toHaveBeenCalledWith(
              expect.stringContaining(planetName.toLowerCase()),
              expect.any(Object),
            );

            const callUrl = mockFetch.mock.calls[0][0] as string;
            expect(callUrl).toBe(
              `https://api.le-systeme-solaire.net/rest/bodies/${planetName.toLowerCase()}`,
            );

            return true;
          },
        ),
        { numRuns: 8 }, // Test all 8 planets
      );
    });
  });

  // **Feature: real-planet-data-api, Property 2: JSON responses are parsed correctly**
  // **Validates: Requirements 1.3**
  describe("Property 2: JSON responses are parsed correctly", () => {
    it("should parse any valid JSON response correctly", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1 }),
            englishName: fc.string({ minLength: 1 }),
            isPlanet: fc.boolean(),
            mass: fc.record({
              massValue: fc.double({ min: 0.1, max: 1000 }),
              massExponent: fc.integer({ min: 20, max: 30 }),
            }),
            avgTemp: fc.double({ min: 50, max: 1000 }),
            sideralOrbit: fc.double({ min: 1, max: 100000 }),
            sideralRotation: fc.double({ min: 1, max: 10000 }),
            moons: fc.oneof(
              fc.constant(null),
              fc.array(
                fc.record({
                  moon: fc.string(),
                  rel: fc.string(),
                }),
              ),
            ),
          }),
          async (mockData) => {
            mockFetch.mockResolvedValueOnce({
              ok: true,
              json: async () => mockData,
            });

            const result = await service.fetchPlanetData("Earth");

            // Verify that the parsed result matches the mock data
            expect(result).toEqual(mockData);
            expect(result.name).toBe(mockData.name);
            expect(result.englishName).toBe(mockData.englishName);
            expect(result.isPlanet).toBe(mockData.isPlanet);
            expect(result.mass).toEqual(mockData.mass);
            expect(result.avgTemp).toBe(mockData.avgTemp);
            expect(result.sideralOrbit).toBe(mockData.sideralOrbit);
            expect(result.sideralRotation).toBe(mockData.sideralRotation);
            expect(result.moons).toEqual(mockData.moons);

            return true;
          },
        ),
        { numRuns: 50 },
      );
    });
  });

  // Unit Tests
  describe("Unit Tests", () => {
    it("should fetch data successfully", async () => {
      const mockData = {
        name: "earth",
        englishName: "Earth",
        isPlanet: true,
        mass: { massValue: 5.972, massExponent: 24 },
        avgTemp: 288,
        sideralOrbit: 365.25,
        sideralRotation: 23.93,
        moons: [{ moon: "Moon", rel: "moon" }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await service.fetchPlanetData("Earth");
      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.le-systeme-solaire.net/rest/bodies/earth",
        expect.objectContaining({
          signal: expect.any(AbortSignal),
          headers: expect.objectContaining({
            Accept: "application/json",
          }),
        }),
      );
    });

    it("should handle API timeout", async () => {
      // Mock fetch to simulate abort signal
      mockFetch.mockImplementationOnce(
        (_url: string, options: { signal?: AbortSignal }) => {
          return new Promise((_resolve, reject) => {
            // Listen for abort signal
            if (options?.signal) {
              options.signal.addEventListener("abort", () => {
                const error = new Error("The operation was aborted");
                error.name = "AbortError";
                reject(error);
              });
            }
            // Never resolve - wait for abort
          });
        },
      );

      // Create a service with a very short timeout
      const shortTimeoutService = new PlanetDataService(
        "https://api.le-systeme-solaire.net/rest/bodies",
        50, // 50ms timeout
      );

      await expect(
        shortTimeoutService.fetchPlanetData("Earth"),
      ).rejects.toThrow("API request timed out");
    });

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(service.fetchPlanetData("Earth")).rejects.toThrow(
        "Network error",
      );

      expect(console.error).toHaveBeenCalled();
    });

    it("should handle HTTP errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(service.fetchPlanetData("Earth")).rejects.toThrow(
        "API returned status 404",
      );
    });

    it("should handle invalid JSON response structure", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: "data" }), // Missing required fields
      });

      await expect(service.fetchPlanetData("Earth")).rejects.toThrow(
        "Invalid API response structure",
      );
    });

    it("should build correct URL for planet name", () => {
      expect(service.buildUrl("Earth")).toBe(
        "https://api.le-systeme-solaire.net/rest/bodies/earth",
      );
      expect(service.buildUrl("MARS")).toBe(
        "https://api.le-systeme-solaire.net/rest/bodies/mars",
      );
      expect(service.buildUrl("Jupiter")).toBe(
        "https://api.le-systeme-solaire.net/rest/bodies/jupiter",
      );
    });
  });
});
