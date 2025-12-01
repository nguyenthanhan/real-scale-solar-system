/**
 * Planet Info Modal Tests
 * Tests for the planet information modal component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlanetInfo } from "../components/modal/planet-info";
import { PlanetData } from "../data/planet-types";
import * as usePlanetAPIDataModule from "../hooks/usePlanetAPIData";

// Mock the hooks and components
vi.mock("../hooks/usePlanetAPIData", () => ({
  usePlanetAPIData: vi.fn(),
}));

vi.mock("../contexts/rotation-speed-context", () => ({
  useSimulationSpeed: () => ({ simulationSpeed: 1000000 }),
}));

vi.mock("../components/modal/planet-3d-model", () => ({
  Planet3DModel: () => <div data-testid="planet-3d-model">3D Model</div>,
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

const mockUsePlanetAPIData = vi.mocked(usePlanetAPIDataModule.usePlanetAPIData);

describe("PlanetInfo Modal", () => {
  const mockPlanet: PlanetData = {
    name: "Earth",
    diameterRelativeEarth: 1,
    diameterInKm: 12742,
    distanceInKm: 149600000,
    distanceInAU: 1,
    eccentricity: 0.017,
    axialTilt: 23.44,
    orbitalInclination: 0,
    color: "#4A90E2",
    texture: "/textures/earth.jpg",
    orbitSpeedByEarth: 1,
    orbitSpeedByKmH: 107000,
    orbitalPeriodDays: 365.256,
    orbitalPeriod: "365.25 days",
    rotationSpeedByDays: 1,
    rotationSpeedByKmH: 1670,
    hasRings: false,
    ringColor: "",
    ringTilt: 0,
    description: "Our home planet",
    dayLength: "24 hours",
    funFact: "The only planet known to support life",
    temperature: "15°C average",
    gravity: "9.81 m/s²",
    atmosphere: "Nitrogen, Oxygen",
    moons: "1 (Moon)",
    yearDiscovered: "Ancient",
  };

  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should show loading spinner during API fetch", () => {
    mockUsePlanetAPIData.mockReturnValue({
      mergedData: { ...mockPlanet, isLoadingAPIData: true, apiError: false },
      isLoading: true,
      error: false,
      refetch: vi.fn(),
    });

    render(<PlanetInfo planet={mockPlanet} onClose={mockOnClose} />);

    // Should show loading spinner
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeTruthy();
  });

  it("should hide loading spinner after fetch completes", () => {
    mockUsePlanetAPIData.mockReturnValue({
      mergedData: {
        ...mockPlanet,
        apiMass: "5.97 × 10^24 kg",
        apiTemperature: "14.9°C",
        isLoadingAPIData: false,
        apiError: false,
      },
      isLoading: false,
      error: false,
      refetch: vi.fn(),
    });

    render(<PlanetInfo planet={mockPlanet} onClose={mockOnClose} />);

    // Should not show loading spinner
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeFalsy();
  });

  it("should display planet name", () => {
    mockUsePlanetAPIData.mockReturnValue({
      mergedData: { ...mockPlanet, isLoadingAPIData: false, apiError: false },
      isLoading: false,
      error: false,
      refetch: vi.fn(),
    });

    render(<PlanetInfo planet={mockPlanet} onClose={mockOnClose} />);

    expect(screen.getByText("Earth")).toBeTruthy();
  });

  it("should display API data when available", () => {
    mockUsePlanetAPIData.mockReturnValue({
      mergedData: {
        ...mockPlanet,
        apiMass: "5.97 × 10^24 kg",
        apiTemperature: "14.9°C",
        apiOrbitalPeriod: "365.3 days",
        apiMoonCount: "1",
        isLoadingAPIData: false,
        apiError: false,
      },
      isLoading: false,
      error: false,
      refetch: vi.fn(),
    });

    render(<PlanetInfo planet={mockPlanet} onClose={mockOnClose} />);

    expect(screen.getByText("5.97 × 10^24 kg")).toBeTruthy();
    expect(screen.getByText("14.9°C")).toBeTruthy();
    expect(screen.getByText("365.3 days")).toBeTruthy();
  });

  it("should display local data when API data is not available", () => {
    mockUsePlanetAPIData.mockReturnValue({
      mergedData: { ...mockPlanet, isLoadingAPIData: false, apiError: true },
      isLoading: false,
      error: true,
      refetch: vi.fn(),
    });

    render(<PlanetInfo planet={mockPlanet} onClose={mockOnClose} />);

    // Should show local data as fallback
    expect(screen.getByText("365.25 days")).toBeTruthy();
    expect(screen.getByText("15°C average")).toBeTruthy();
  });

  it("should not show spinner for fallback data", () => {
    mockUsePlanetAPIData.mockReturnValue({
      mergedData: { ...mockPlanet, isLoadingAPIData: false, apiError: true },
      isLoading: false,
      error: true,
      refetch: vi.fn(),
    });

    render(<PlanetInfo planet={mockPlanet} onClose={mockOnClose} />);

    // Should not show loading spinner for fallback
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeFalsy();
  });
});
