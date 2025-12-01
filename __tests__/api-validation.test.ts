/**
 * API Validation Tests
 * Tests for API response validation and error handling
 */

import { describe, it, expect } from "vitest";
import {
  isValidAPIResponse,
  isValidMass,
  APIResponse,
} from "../services/planet-api-types";

describe("API Validation", () => {
  describe("isValidAPIResponse", () => {
    it("should validate correct API response structure", () => {
      const validResponse: APIResponse = {
        id: "earth",
        name: "earth",
        englishName: "Earth",
        isPlanet: true,
        moons: null,
        semimajorAxis: 149598023,
        perihelion: 147092000,
        aphelion: 152100000,
        eccentricity: 0.0167,
        inclination: 0,
        mass: { massValue: 5.972, massExponent: 24 },
        vol: { volValue: 1.083, volExponent: 12 },
        density: 5.51,
        gravity: 9.81,
        escape: 11186,
        meanRadius: 6371,
        equaRadius: 6378,
        polarRadius: 6357,
        flattening: 0.00335,
        dimension: "",
        sideralOrbit: 365.256,
        sideralRotation: 23.93,
        aroundPlanet: null,
        discoveredBy: "",
        discoveryDate: "",
        alternativeName: "",
        axialTilt: 23.44,
        avgTemp: 288,
        mainAnomaly: 0,
        argPeriapsis: 0,
        longAscNode: 0,
      };

      expect(isValidAPIResponse(validResponse)).toBe(true);
    });

    it("should reject null or undefined", () => {
      expect(isValidAPIResponse(null)).toBe(false);
      expect(isValidAPIResponse(undefined)).toBe(false);
    });

    it("should reject non-object values", () => {
      expect(isValidAPIResponse("string")).toBe(false);
      expect(isValidAPIResponse(123)).toBe(false);
      expect(isValidAPIResponse([])).toBe(false);
    });

    it("should reject objects missing required fields", () => {
      expect(isValidAPIResponse({})).toBe(false);
      expect(isValidAPIResponse({ name: "earth" })).toBe(false);
      expect(isValidAPIResponse({ englishName: "Earth" })).toBe(false);
      expect(isValidAPIResponse({ name: "earth", englishName: "Earth" })).toBe(
        false
      );
    });

    it("should reject objects with wrong field types", () => {
      expect(
        isValidAPIResponse({
          name: 123, // should be string
          englishName: "Earth",
          isPlanet: true,
        })
      ).toBe(false);

      expect(
        isValidAPIResponse({
          name: "earth",
          englishName: "Earth",
          isPlanet: "true", // should be boolean
        })
      ).toBe(false);
    });
  });

  describe("isValidMass", () => {
    it("should validate correct mass structure", () => {
      expect(isValidMass({ massValue: 5.972, massExponent: 24 })).toBe(true);
      expect(isValidMass({ massValue: 0.1, massExponent: 20 })).toBe(true);
    });

    it("should reject null or undefined", () => {
      expect(isValidMass(null)).toBe(false);
      expect(isValidMass(undefined)).toBe(false);
    });

    it("should reject invalid mass values", () => {
      expect(isValidMass({ massValue: NaN, massExponent: 24 })).toBe(false);
      expect(isValidMass({ massValue: 5.972, massExponent: NaN })).toBe(false);
      expect(isValidMass({ massValue: Infinity, massExponent: 24 })).toBe(
        false
      );
    });

    it("should reject missing fields", () => {
      expect(isValidMass({ massValue: 5.972 })).toBe(false);
      expect(isValidMass({ massExponent: 24 })).toBe(false);
      expect(isValidMass({})).toBe(false);
    });

    it("should reject wrong field types", () => {
      expect(isValidMass({ massValue: "5.972", massExponent: 24 })).toBe(false);
      expect(isValidMass({ massValue: 5.972, massExponent: "24" })).toBe(false);
    });
  });

  // Note: safeExtractField tests are in data-merger.test.ts

  describe("Error Handling", () => {
    it("should handle invalid JSON gracefully", () => {
      // Simulate what happens when JSON parsing fails
      const invalidData = "not json";

      expect(isValidAPIResponse(invalidData)).toBe(false);
    });

    it("should handle partial API responses", () => {
      // API might return partial data
      const partialResponse = {
        name: "earth",
        englishName: "Earth",
        isPlanet: true,
        // Missing most fields
      };

      // Should still be valid if required fields are present
      expect(isValidAPIResponse(partialResponse)).toBe(true);
    });

    it("should handle API response with null optional fields", () => {
      const responseWithNulls = {
        name: "earth",
        englishName: "Earth",
        isPlanet: true,
        mass: null,
        moons: null,
        avgTemp: null,
      };

      expect(isValidAPIResponse(responseWithNulls)).toBe(true);
      expect(isValidMass(responseWithNulls.mass)).toBe(false);
    });
  });
});
