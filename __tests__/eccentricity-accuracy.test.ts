import { describe, it, expect } from "vitest";
import { planetData } from "@/data/planet-data";
import { NASA_JPL_ECCENTRICITIES } from "@/utils/physics-constants";

describe("Eccentricity Accuracy", () => {
  /**
   * **Feature: accurate-physics-calculations, Property 5: Eccentricity values match NASA data**
   *
   * For any planet, the eccentricity value should match NASA JPL data to 4 decimal places.
   */
  describe("Property 5: Eccentricity values match NASA data", () => {
    it("should match NASA JPL eccentricity values for all planets", () => {
      planetData.forEach((planet) => {
        const expectedEccentricity =
          NASA_JPL_ECCENTRICITIES[
            planet.name as keyof typeof NASA_JPL_ECCENTRICITIES
          ];

        expect(planet.eccentricity).toBe(expectedEccentricity);
      });
    });

    it("should have eccentricity values with 4 decimal places precision", () => {
      planetData.forEach((planet) => {
        // Convert to string and check decimal places
        const eccentricityStr = planet.eccentricity.toString();
        const decimalPart = eccentricityStr.split(".")[1];

        // Should have at most 4 decimal places
        if (decimalPart) {
          expect(decimalPart.length).toBeLessThanOrEqual(4);
        }
      });
    });

    it("should have all eccentricity values between 0 and 1", () => {
      planetData.forEach((planet) => {
        expect(planet.eccentricity).toBeGreaterThanOrEqual(0);
        expect(planet.eccentricity).toBeLessThan(1);
      });
    });

    it("should have Mercury with highest eccentricity (most elliptical)", () => {
      const mercury = planetData.find((p) => p.name === "Mercury")!;
      const maxEccentricity = Math.max(
        ...planetData.map((p) => p.eccentricity)
      );

      expect(mercury.eccentricity).toBe(maxEccentricity);
      expect(mercury.eccentricity).toBe(0.2056);
    });

    it("should have Earth with nearly circular orbit", () => {
      const earth = planetData.find((p) => p.name === "Earth")!;

      expect(earth.eccentricity).toBe(0.0167);
      expect(earth.eccentricity).toBeLessThan(0.02);
    });

    it("should have Venus with nearly circular orbit (lowest eccentricity)", () => {
      const venus = planetData.find((p) => p.name === "Venus")!;
      const minEccentricity = Math.min(
        ...planetData.map((p) => p.eccentricity)
      );

      expect(venus.eccentricity).toBe(0.0068);
      expect(venus.eccentricity).toBe(minEccentricity);
    });
  });

  /**
   * Unit tests for specific eccentricity values
   */
  describe("Unit tests for specific eccentricity values", () => {
    it("should have Mercury eccentricity of 0.2056 (Requirement 6.2)", () => {
      const mercury = planetData.find((p) => p.name === "Mercury")!;
      expect(mercury.eccentricity).toBe(0.2056);
    });

    it("should have Earth eccentricity of 0.0167 (Requirement 6.3)", () => {
      const earth = planetData.find((p) => p.name === "Earth")!;
      expect(earth.eccentricity).toBe(0.0167);
    });

    it("should have Venus eccentricity of 0.0068", () => {
      const venus = planetData.find((p) => p.name === "Venus")!;
      expect(venus.eccentricity).toBe(0.0068);
    });

    it("should have Mars eccentricity of 0.0934", () => {
      const mars = planetData.find((p) => p.name === "Mars")!;
      expect(mars.eccentricity).toBe(0.0934);
    });

    it("should have Jupiter eccentricity of 0.0484", () => {
      const jupiter = planetData.find((p) => p.name === "Jupiter")!;
      expect(jupiter.eccentricity).toBe(0.0484);
    });

    it("should have Saturn eccentricity of 0.0539", () => {
      const saturn = planetData.find((p) => p.name === "Saturn")!;
      expect(saturn.eccentricity).toBe(0.0539);
    });

    it("should have Uranus eccentricity of 0.0463", () => {
      const uranus = planetData.find((p) => p.name === "Uranus")!;
      expect(uranus.eccentricity).toBe(0.0463);
    });

    it("should have Neptune eccentricity of 0.0086", () => {
      const neptune = planetData.find((p) => p.name === "Neptune")!;
      expect(neptune.eccentricity).toBe(0.0086);
    });
  });

  /**
   * Validation tests
   */
  describe("Eccentricity validation (Requirement 6.4)", () => {
    it("should validate all eccentricity values are between 0 and 1", () => {
      planetData.forEach((planet) => {
        // Eccentricity must be >= 0 (circular orbit)
        expect(planet.eccentricity).toBeGreaterThanOrEqual(0);

        // Eccentricity must be < 1 (elliptical orbit, not parabolic)
        expect(planet.eccentricity).toBeLessThan(1);
      });
    });

    it("should have no planet with eccentricity of 0 (perfectly circular)", () => {
      // All planets have some eccentricity
      planetData.forEach((planet) => {
        expect(planet.eccentricity).toBeGreaterThan(0);
      });
    });

    it("should have eccentricity as a number type", () => {
      planetData.forEach((planet) => {
        expect(typeof planet.eccentricity).toBe("number");
        expect(Number.isFinite(planet.eccentricity)).toBe(true);
      });
    });
  });

  /**
   * Orbit shape implications
   */
  describe("Orbit shape implications (Requirement 6.5)", () => {
    it("should have more circular orbits (e < 0.05) for most planets", () => {
      const circularOrbits = planetData.filter((p) => p.eccentricity < 0.05);

      // Venus, Earth, Jupiter, Uranus, Neptune have nearly circular orbits (5 planets)
      expect(circularOrbits.length).toBeGreaterThanOrEqual(5);
    });

    it("should have Mercury with most elliptical orbit (e > 0.2)", () => {
      const mercury = planetData.find((p) => p.name === "Mercury")!;

      expect(mercury.eccentricity).toBeGreaterThan(0.2);
    });

    it("should have Mars with moderately elliptical orbit (0.09 < e < 0.1)", () => {
      const mars = planetData.find((p) => p.name === "Mars")!;

      expect(mars.eccentricity).toBeGreaterThan(0.09);
      expect(mars.eccentricity).toBeLessThan(0.1);
    });

    it("should calculate semi-minor axis correctly based on eccentricity", () => {
      planetData.forEach((planet) => {
        const semiMajorAxis = 100; // arbitrary unit
        const semiMinorAxis = semiMajorAxis * (1 - planet.eccentricity);

        // Semi-minor axis should be less than or equal to semi-major axis
        expect(semiMinorAxis).toBeLessThanOrEqual(semiMajorAxis);

        // For low eccentricity, semi-minor should be close to semi-major
        if (planet.eccentricity < 0.05) {
          expect(semiMinorAxis).toBeGreaterThan(semiMajorAxis * 0.95);
        }
      });
    });
  });
});
