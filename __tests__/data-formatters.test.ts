/**
 * Data Formatters Tests
 * Property-based and unit tests for data formatting utilities
 */

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  formatMass,
  formatTemperature,
  formatOrbitalPeriod,
  formatRotationPeriod,
  formatMoonCount,
  formatLargeNumber,
  formatGravity,
  formatDensity,
  DATA_UNAVAILABLE,
} from "../utils/data-formatters";

describe("Data Formatters", () => {
  // **Feature: real-planet-data-api, Property 3: Mass formatting includes scientific notation**
  // **Validates: Requirements 2.2, 2.5**
  describe("Property 3: Mass formatting includes scientific notation", () => {
    it("should format any valid mass with scientific notation pattern", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.01, max: 1000, noNaN: true }),
          fc.integer({ min: 1, max: 50 }),
          (massValue, massExponent) => {
            const result = formatMass(massValue, massExponent);

            // Should contain the formatted value
            expect(result).toContain(massValue.toFixed(2));
            // Should contain the multiplication symbol
            expect(result).toContain("×");
            // Should contain "10^" for scientific notation
            expect(result).toContain("10^");
            // Should contain "kg" unit
            expect(result).toContain("kg");
            // Should not be "Data unavailable"
            expect(result).not.toBe(DATA_UNAVAILABLE);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // **Feature: real-planet-data-api, Property 4: Temperature conversion from Kelvin to Celsius**
  // **Validates: Requirements 3.2**
  describe("Property 4: Temperature conversion from Kelvin to Celsius", () => {
    it("should convert any Kelvin temperature to Celsius correctly", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0, max: 10000, noNaN: true }),
          (kelvin) => {
            const result = formatTemperature(kelvin);
            const expectedCelsius = kelvin - 273.15;

            // Should contain the converted temperature
            expect(result).toContain(expectedCelsius.toFixed(1));
            // Should contain the Celsius symbol
            expect(result).toContain("°C");
            // Should not be "Data unavailable"
            expect(result).not.toBe(DATA_UNAVAILABLE);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // **Feature: real-planet-data-api, Property 5: Temperature formatting to one decimal place**
  // **Validates: Requirements 3.3, 3.4**
  describe("Property 5: Temperature formatting to one decimal place", () => {
    it("should format any temperature to exactly one decimal place", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0, max: 10000, noNaN: true }),
          (kelvin) => {
            const result = formatTemperature(kelvin);

            if (result !== DATA_UNAVAILABLE) {
              // Extract the numeric part (everything before °C)
              const numericPart = result.replace("°C", "");
              const decimalParts = numericPart.split(".");

              // Should have exactly one decimal place
              expect(decimalParts).toHaveLength(2);
              expect(decimalParts[1]).toHaveLength(1);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // **Feature: real-planet-data-api, Property 6: Rotation period units based on duration**
  // **Validates: Requirements 4.4, 4.5**
  describe("Property 6: Rotation period units based on duration", () => {
    it("should use hours for periods <= 24h and days for periods > 24h", () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.1, max: 10000, noNaN: true }),
          (hours) => {
            const result = formatRotationPeriod(hours);

            if (result !== DATA_UNAVAILABLE) {
              const absHours = Math.abs(hours);
              if (absHours > 24) {
                expect(result).toContain("days");
                const expectedDays = absHours / 24;
                expect(result).toContain(expectedDays.toFixed(2));
              } else {
                expect(result).toContain("hours");
                expect(result).toContain(absHours.toFixed(2));
              }
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // **Feature: real-planet-data-api, Property 7: Moon count from array length**
  // **Validates: Requirements 5.2**
  describe("Property 7: Moon count from array length", () => {
    it("should return count equal to array length", () => {
      fc.assert(
        fc.property(
          fc.array(fc.record({ moon: fc.string(), rel: fc.string() })),
          (moons) => {
            const result = formatMoonCount(moons);
            const count = moons.length;

            expect(result).toBe(count.toString());

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Unit Tests
  describe("Unit Tests", () => {
    describe("formatMass", () => {
      it("should format valid mass values", () => {
        expect(formatMass(5.972, 24)).toBe("5.97 × 10^24 kg");
        expect(formatMass(1.989, 30)).toBe("1.99 × 10^30 kg");
        expect(formatMass(6.42, 23)).toBe("6.42 × 10^23 kg");
      });

      it('should return "Data unavailable" for invalid values', () => {
        expect(formatMass(undefined, 24)).toBe(DATA_UNAVAILABLE);
        expect(formatMass(5.972, undefined)).toBe(DATA_UNAVAILABLE);
        expect(formatMass(null, 24)).toBe(DATA_UNAVAILABLE);
        expect(formatMass(0, 24)).toBe(DATA_UNAVAILABLE);
        expect(formatMass(NaN, 24)).toBe(DATA_UNAVAILABLE);
        expect(formatMass(Infinity, 24)).toBe(DATA_UNAVAILABLE);
      });
    });

    describe("formatTemperature", () => {
      it("should convert Kelvin to Celsius", () => {
        expect(formatTemperature(288)).toBe("14.9°C");
        expect(formatTemperature(273.15)).toBe("0.0°C");
        expect(formatTemperature(373.15)).toBe("100.0°C");
        // Absolute zero: 0 - 273.15 = -273.15, rounded to 1 decimal = -273.1 or -273.2
        const absoluteZero = formatTemperature(0);
        expect(absoluteZero).toMatch(/^-273\.[12]°C$/);
      });

      it('should return "Data unavailable" for invalid values', () => {
        expect(formatTemperature(undefined)).toBe(DATA_UNAVAILABLE);
        expect(formatTemperature(null)).toBe(DATA_UNAVAILABLE);
        expect(formatTemperature(NaN)).toBe(DATA_UNAVAILABLE);
        expect(formatTemperature(Infinity)).toBe(DATA_UNAVAILABLE);
      });
    });

    describe("formatOrbitalPeriod", () => {
      it("should format orbital period with days unit", () => {
        expect(formatOrbitalPeriod(365.25)).toBe("365.3 days");
        expect(formatOrbitalPeriod(687)).toBe("687.0 days");
        expect(formatOrbitalPeriod(88)).toBe("88.0 days");
      });

      it('should return "Data unavailable" for invalid values', () => {
        expect(formatOrbitalPeriod(undefined)).toBe(DATA_UNAVAILABLE);
        expect(formatOrbitalPeriod(null)).toBe(DATA_UNAVAILABLE);
        expect(formatOrbitalPeriod(NaN)).toBe(DATA_UNAVAILABLE);
      });
    });

    describe("formatRotationPeriod", () => {
      it("should use hours for periods <= 24h", () => {
        expect(formatRotationPeriod(23.93)).toBe("23.93 hours");
        expect(formatRotationPeriod(24)).toBe("24.00 hours");
        expect(formatRotationPeriod(10.7)).toBe("10.70 hours");
      });

      it("should use days for periods > 24h", () => {
        expect(formatRotationPeriod(5832)).toBe("243.00 days"); // Venus
        expect(formatRotationPeriod(48)).toBe("2.00 days");
      });

      it("should handle negative rotation (retrograde)", () => {
        expect(formatRotationPeriod(-5832)).toBe("243.00 days");
        expect(formatRotationPeriod(-10)).toBe("10.00 hours");
      });

      it('should return "Data unavailable" for invalid values', () => {
        expect(formatRotationPeriod(undefined)).toBe(DATA_UNAVAILABLE);
        expect(formatRotationPeriod(null)).toBe(DATA_UNAVAILABLE);
        expect(formatRotationPeriod(NaN)).toBe(DATA_UNAVAILABLE);
      });
    });

    describe("formatMoonCount", () => {
      it("should handle null and undefined moons", () => {
        expect(formatMoonCount(null)).toBe("0");
        expect(formatMoonCount(undefined)).toBe("0");
        expect(formatMoonCount([])).toBe("0");
      });

      it("should count moons correctly", () => {
        expect(formatMoonCount([{ moon: "Moon", rel: "moon" }])).toBe("1");
        expect(
          formatMoonCount([
            { moon: "Io", rel: "moon" },
            { moon: "Europa", rel: "moon" },
            { moon: "Ganymede", rel: "moon" },
          ])
        ).toBe("3");
      });
    });

    describe("formatLargeNumber", () => {
      it("should format large numbers with separators", () => {
        expect(formatLargeNumber(1000)).toBe("1,000");
        expect(formatLargeNumber(1234567)).toBe("1,234,567");
      });

      it("should format small numbers", () => {
        expect(formatLargeNumber(999)).toBe("999");
        expect(formatLargeNumber(123.45)).toBe("123.45");
      });

      it('should return "Data unavailable" for invalid values', () => {
        expect(formatLargeNumber(undefined)).toBe(DATA_UNAVAILABLE);
        expect(formatLargeNumber(null)).toBe(DATA_UNAVAILABLE);
        expect(formatLargeNumber(NaN)).toBe(DATA_UNAVAILABLE);
      });
    });

    describe("formatGravity", () => {
      it("should format gravity with m/s² unit", () => {
        expect(formatGravity(9.81)).toBe("9.81 m/s²");
        expect(formatGravity(3.71)).toBe("3.71 m/s²");
      });

      it('should return "Data unavailable" for invalid values', () => {
        expect(formatGravity(undefined)).toBe(DATA_UNAVAILABLE);
        expect(formatGravity(null)).toBe(DATA_UNAVAILABLE);
      });
    });

    describe("formatDensity", () => {
      it("should format density with g/cm³ unit", () => {
        expect(formatDensity(5.51)).toBe("5.51 g/cm³");
        expect(formatDensity(3.93)).toBe("3.93 g/cm³");
      });

      it('should return "Data unavailable" for invalid values', () => {
        expect(formatDensity(undefined)).toBe(DATA_UNAVAILABLE);
        expect(formatDensity(null)).toBe(DATA_UNAVAILABLE);
      });
    });
  });
});
