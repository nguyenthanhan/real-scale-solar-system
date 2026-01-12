/**
 * usePlanetAPIData Hook Tests
 * Tests for the React hook that fetches and manages planet API data
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { usePlanetAPIData } from "../hooks/usePlanetAPIData";
import * as fetchModule from "../services/fetch-with-fallback";
import { PlanetData } from "../data/planet-types";

// Mock the fetch module
vi.mock("../services/fetch-with-fallback", () => ({
  fetchWithCache: vi.fn(),
  clearAPICache: vi.fn(),
}));

const mockFetchWithCache = vi.mocked(fetchModule.fetchWithCache);

describe("usePlanetAPIData", () => {
  const mockLocalData: PlanetData = {
    name: "Earth",
    color: "#4A90E2",
    diameterRelativeEarth: 1,
    distanceInAU: 1,
    orbitalPeriodDays: 365.256,
    orbitalPeriod: "365.25 days",
    description: "Our home planet",
    funFact: "The only planet known to support life",
    temperature: "15°C average",
    gravity: "9.81 m/s²",
    atmosphere: "Nitrogen, Oxygen",
    dayLength: "24 hours",
    moons: "1 (Moon)",
    diameterInKm: 12742,
    distanceInKm: 149600000,
    axialTilt: 23.44,
    rotationSpeedByDays: 1,
    eccentricity: 0.0167,
    orbitalInclination: 0,
    texture: "/textures/earth.jpg",
    orbitSpeedByEarth: 1,
    orbitSpeedByKmH: 107226,
    rotationSpeedByKmH: 1674.4,
    hasRings: false,
    ringColor: "",
    ringTilt: 0,
    yearDiscovered: "Prehistoric",
    notableFeatures: [
      "Only known planet with life",
      "71% water coverage",
      "One natural satellite",
    ],
  };

  const mockMergedData = {
    ...mockLocalData,
    apiMass: "5.97 × 10^24 kg",
    apiTemperature: "14.9°C",
    apiOrbitalPeriod: "365.3 days",
    apiRotationPeriod: "23.93 hours",
    apiMoonCount: "1",
    isLoadingAPIData: false,
    apiError: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch data on mount", async () => {
    mockFetchWithCache.mockResolvedValue(mockMergedData);

    const { result } = renderHook(() =>
      usePlanetAPIData("Earth", mockLocalData),
    );

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchWithCache).toHaveBeenCalledWith("Earth", mockLocalData);
    expect(result.current.mergedData.apiMass).toBe("5.97 × 10^24 kg");
  });

  it("should update when planetName changes", async () => {
    mockFetchWithCache.mockResolvedValue(mockMergedData);

    const { result, rerender } = renderHook(
      ({ planetName, localData }) => usePlanetAPIData(planetName, localData),
      {
        initialProps: { planetName: "Earth", localData: mockLocalData },
      },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchWithCache).toHaveBeenCalledTimes(1);

    // Change planet name
    const marsLocalData = { ...mockLocalData, name: "Mars" };
    const marsMergedData = {
      ...marsLocalData,
      apiMass: "6.39 × 10^23 kg",
      isLoadingAPIData: false,
      apiError: false,
    };
    mockFetchWithCache.mockResolvedValue(marsMergedData);

    rerender({ planetName: "Mars", localData: marsLocalData });

    await waitFor(() => {
      expect(mockFetchWithCache).toHaveBeenCalledTimes(2);
    });

    expect(mockFetchWithCache).toHaveBeenLastCalledWith("Mars", marsLocalData);
  });

  it("should set loading state during fetch", async () => {
    let resolvePromise: (value: PlanetData) => void;
    const promise = new Promise<PlanetData>((resolve) => {
      resolvePromise = resolve;
    });
    mockFetchWithCache.mockReturnValue(promise);

    const { result } = renderHook(() =>
      usePlanetAPIData("Earth", mockLocalData),
    );

    // Should be loading
    expect(result.current.isLoading).toBe(true);

    // Resolve the promise
    await act(async () => {
      resolvePromise!(mockMergedData);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("should handle errors gracefully", async () => {
    mockFetchWithCache.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() =>
      usePlanetAPIData("Earth", mockLocalData),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(true);
    // Should still have local data
    expect(result.current.mergedData.name).toBe("Earth");
  });

  it("should provide refetch function", async () => {
    mockFetchWithCache.mockResolvedValue(mockMergedData);

    const { result } = renderHook(() =>
      usePlanetAPIData("Earth", mockLocalData),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchWithCache).toHaveBeenCalledTimes(1);

    // Call refetch
    await act(async () => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(mockFetchWithCache).toHaveBeenCalledTimes(2);
    });
  });

  it("should handle null planetName", async () => {
    const { result } = renderHook(() => usePlanetAPIData(null, mockLocalData));

    // Should not fetch when planetName is null
    expect(mockFetchWithCache).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle null localData", async () => {
    const { result } = renderHook(() => usePlanetAPIData("Earth", null));

    // Should not fetch when localData is null
    expect(mockFetchWithCache).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });
});
