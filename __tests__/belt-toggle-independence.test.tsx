/**
 * Property-based tests for toggle state independence
 * Feature: belt-region-indicator, Property 5: Toggle state independence
 * Validates: Requirements 3.4
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fc from "fast-check";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ControlModal } from "../components/modal/control";

describe("Belt Toggle Independence", () => {
  beforeEach(() => {
    cleanup();
  });

  /**
   * Property 5: Toggle state independence
   * For any sequence of toggle operations on showBeltRegions,
   * the showOrbitPath state SHALL remain unchanged, and vice versa.
   */
  describe("Property 5: Toggle state independence", () => {
    it("toggling belt regions should not call orbit path callback", () => {
      fc.assert(
        fc.property(
          fc.boolean(), // initial belt state
          fc.boolean(), // initial orbit state
          fc.nat({ max: 10 }), // number of belt toggles
          (initialBelt, initialOrbit, toggleCount) => {
            cleanup();

            const onToggleBeltRegions = vi.fn();
            const onToggleOrbitPath = vi.fn();

            render(
              <ControlModal
                simulationSpeed={1}
                onSpeedChange={() => {}}
                showBeltRegions={initialBelt}
                onToggleBeltRegions={onToggleBeltRegions}
                showOrbitPath={initialOrbit}
                onToggleOrbitPath={onToggleOrbitPath}
              />,
            );

            const beltButton = screen.getByRole("switch", {
              name: /toggle belt regions/i,
            });

            // Click belt toggle multiple times
            for (let i = 0; i < toggleCount; i++) {
              fireEvent.click(beltButton);
            }

            // onToggleOrbitPath should never have been called
            expect(onToggleOrbitPath).not.toHaveBeenCalled();

            cleanup();
          },
        ),
        { numRuns: 100 },
      );
    });

    it("toggling orbit path should not call belt regions callback", () => {
      fc.assert(
        fc.property(
          fc.boolean(), // initial belt state
          fc.boolean(), // initial orbit state
          fc.nat({ max: 10 }), // number of orbit toggles
          (initialBelt, initialOrbit, toggleCount) => {
            cleanup();

            const onToggleBeltRegions = vi.fn();
            const onToggleOrbitPath = vi.fn();

            render(
              <ControlModal
                simulationSpeed={1}
                onSpeedChange={() => {}}
                showBeltRegions={initialBelt}
                onToggleBeltRegions={onToggleBeltRegions}
                showOrbitPath={initialOrbit}
                onToggleOrbitPath={onToggleOrbitPath}
              />,
            );

            const orbitButton = screen.getByRole("switch", {
              name: /toggle orbit path/i,
            });

            // Click orbit toggle multiple times
            for (let i = 0; i < toggleCount; i++) {
              fireEvent.click(orbitButton);
            }

            // onToggleBeltRegions should never have been called
            expect(onToggleBeltRegions).not.toHaveBeenCalled();

            cleanup();
          },
        ),
        { numRuns: 100 },
      );
    });

    it("belt toggle callback receives correct value", () => {
      const onToggleBeltRegions = vi.fn();

      render(
        <ControlModal
          simulationSpeed={1}
          onSpeedChange={() => {}}
          showBeltRegions={true}
          onToggleBeltRegions={onToggleBeltRegions}
        />,
      );

      const beltButton = screen.getByRole("switch", {
        name: /toggle belt regions/i,
      });
      fireEvent.click(beltButton);

      // Should be called with opposite of current state
      expect(onToggleBeltRegions).toHaveBeenCalledWith(false);
    });

    it("belt toggle defaults to visible (true)", () => {
      render(
        <ControlModal
          simulationSpeed={1}
          onSpeedChange={() => {}}
          onToggleBeltRegions={() => {}}
        />,
      );

      const beltButton = screen.getByRole("switch", {
        name: /toggle belt regions/i,
      });

      // Default state should be true (pressed)
      expect(beltButton).toHaveAttribute("aria-pressed", "true");
    });

    it("belt and orbit toggles are independent - interleaved operations", () => {
      fc.assert(
        fc.property(
          fc.boolean(),
          fc.boolean(),
          fc.array(fc.boolean(), { minLength: 1, maxLength: 5 }), // true = belt, false = orbit
          (initialBelt, initialOrbit, toggleSequence) => {
            cleanup();

            let beltCallCount = 0;
            let orbitCallCount = 0;

            const onToggleBeltRegions = vi.fn(() => {
              beltCallCount++;
            });
            const onToggleOrbitPath = vi.fn(() => {
              orbitCallCount++;
            });

            render(
              <ControlModal
                simulationSpeed={1}
                onSpeedChange={() => {}}
                showBeltRegions={initialBelt}
                onToggleBeltRegions={onToggleBeltRegions}
                showOrbitPath={initialOrbit}
                onToggleOrbitPath={onToggleOrbitPath}
              />,
            );

            let expectedBeltCalls = 0;
            let expectedOrbitCalls = 0;

            for (const isBeltToggle of toggleSequence) {
              if (isBeltToggle) {
                const beltButton = screen.getByRole("switch", {
                  name: /toggle belt regions/i,
                });
                fireEvent.click(beltButton);
                expectedBeltCalls++;
              } else {
                const orbitButton = screen.getByRole("switch", {
                  name: /toggle orbit path/i,
                });
                fireEvent.click(orbitButton);
                expectedOrbitCalls++;
              }
            }

            // Each toggle should only affect its own callback
            expect(beltCallCount).toBe(expectedBeltCalls);
            expect(orbitCallCount).toBe(expectedOrbitCalls);

            cleanup();
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
