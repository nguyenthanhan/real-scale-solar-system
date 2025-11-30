import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import fc from "fast-check";
import {
  SimulationModeProvider,
  useSimulationMode,
  type SimulationMode,
} from "@/contexts/simulation-mode-context";

// Wrapper component for testing hooks
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SimulationModeProvider>{children}</SimulationModeProvider>
);

describe("Simulation Mode Context", () => {
  /**
   * **Feature: date-mode-simulation, Property 1: Mode toggle switches between speed and date**
   *
   * For any current mode, clicking the toggle button should switch to the other mode.
   */
  describe("Property 1: Mode toggle switches between speed and date", () => {
    it("should toggle from speed to date", () => {
      const { result } = renderHook(() => useSimulationMode(), { wrapper });

      expect(result.current.mode).toBe("speed");

      act(() => {
        result.current.toggleMode();
      });

      expect(result.current.mode).toBe("date");
    });

    it("should toggle from date to speed", () => {
      const { result } = renderHook(() => useSimulationMode(), { wrapper });

      // First toggle to date
      act(() => {
        result.current.toggleMode();
      });
      expect(result.current.mode).toBe("date");

      // Then toggle back to speed
      act(() => {
        result.current.toggleMode();
      });
      expect(result.current.mode).toBe("speed");
    });

    it("should always switch to the opposite mode", () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 10 }), (toggleCount) => {
          const { result } = renderHook(() => useSimulationMode(), { wrapper });

          let expectedMode: SimulationMode = "speed";

          for (let i = 0; i < toggleCount; i++) {
            act(() => {
              result.current.toggleMode();
            });
            expectedMode = expectedMode === "speed" ? "date" : "speed";
          }

          return result.current.mode === expectedMode;
        }),
        { numRuns: 20 }
      );
    });
  });

  /**
   * Unit tests for mode context
   */
  describe("Unit tests for mode context", () => {
    it("should have initial mode as speed", () => {
      const { result } = renderHook(() => useSimulationMode(), { wrapper });
      expect(result.current.mode).toBe("speed");
      expect(result.current.isSpeedMode).toBe(true);
      expect(result.current.isDateMode).toBe(false);
    });

    it("should have initial date as current date", () => {
      const { result } = renderHook(() => useSimulationMode(), { wrapper });
      const now = new Date();

      // Should be within 1 second of now
      const diff = Math.abs(
        result.current.selectedDate.getTime() - now.getTime()
      );
      expect(diff).toBeLessThan(1000);
    });

    it("should update mode with setMode", () => {
      const { result } = renderHook(() => useSimulationMode(), { wrapper });

      act(() => {
        result.current.setMode("date");
      });

      expect(result.current.mode).toBe("date");
      expect(result.current.isDateMode).toBe(true);
      expect(result.current.isSpeedMode).toBe(false);
    });

    it("should update selectedDate with setSelectedDate", () => {
      const { result } = renderHook(() => useSimulationMode(), { wrapper });
      const testDate = new Date("2024-06-15");

      act(() => {
        result.current.setSelectedDate(testDate);
      });

      expect(result.current.selectedDate.getTime()).toBe(testDate.getTime());
    });

    it("should not update with invalid mode", () => {
      const { result } = renderHook(() => useSimulationMode(), { wrapper });

      act(() => {
        // @ts-expect-error Testing invalid input
        result.current.setMode("invalid");
      });

      expect(result.current.mode).toBe("speed");
    });

    it("should not update with invalid date", () => {
      const { result } = renderHook(() => useSimulationMode(), { wrapper });
      const originalDate = result.current.selectedDate;

      act(() => {
        result.current.setSelectedDate(new Date("invalid"));
      });

      expect(result.current.selectedDate.getTime()).toBe(
        originalDate.getTime()
      );
    });

    it("should throw error when used outside provider", () => {
      expect(() => {
        renderHook(() => useSimulationMode());
      }).toThrow(
        "useSimulationMode must be used within a SimulationModeProvider"
      );
    });
  });
});
