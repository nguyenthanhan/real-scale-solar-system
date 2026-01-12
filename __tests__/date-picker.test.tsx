import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DatePicker } from "@/components/date-picker/date-picker";
import { ModeToggleButton } from "@/components/button/mode-toggle-button";

// Mock localStorage to avoid issues in test environment
const localStorageMock = {
  getItem: vi.fn((key) => {
    if (key === "date-picker-animation-speed") return "1"; // Instant mode
    return null;
  }),
  setItem: vi.fn(() => {}),
  removeItem: vi.fn(() => {}),
  clear: vi.fn(() => {}),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("DatePicker", () => {
  const mockOnDateChange = vi.fn();
  const baseDate = new Date("2024-06-15");

  beforeEach(() => {
    mockOnDateChange.mockClear();
  });

  describe("Basic functionality", () => {
    it("should display selected date and have preset buttons", () => {
      render(
        <DatePicker selectedDate={baseDate} onDateChange={mockOnDateChange} />,
      );

      expect(screen.getByText("June 15, 2024")).toBeInTheDocument();
      expect(screen.getByText("Today")).toBeInTheDocument();
      expect(screen.getByText("1 Year Ago")).toBeInTheDocument();
      expect(screen.getByText("1 Year Ahead")).toBeInTheDocument();
    });

    it("should call onDateChange when preset is clicked", async () => {
      render(
        <DatePicker
          selectedDate={new Date("2020-01-01")}
          onDateChange={mockOnDateChange}
        />,
      );

      fireEvent.click(screen.getByText("Today"));

      await waitFor(() => {
        expect(mockOnDateChange).toHaveBeenCalled();
      });
      // Today button should call with current date (today)
      const calledDate = mockOnDateChange.mock.calls[0][0];
      expect(calledDate.getFullYear()).toBe(new Date().getFullYear());
    });

    it("should show and use historical presets", async () => {
      render(
        <DatePicker selectedDate={baseDate} onDateChange={mockOnDateChange} />,
      );

      fireEvent.click(screen.getByText("Quick Presets"));
      expect(screen.getByText("Moon Landing")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Moon Landing"));

      await waitFor(() => {
        expect(mockOnDateChange).toHaveBeenCalled();
      });

      const calledDate = mockOnDateChange.mock.calls[0][0];
      expect(calledDate.getFullYear()).toBe(1969);
      expect(calledDate.getMonth()).toBe(6);
      expect(calledDate.getDate()).toBe(20);
    });
  });

  describe("Keyboard navigation", () => {
    it("should navigate with arrow keys", async () => {
      render(
        <DatePicker selectedDate={baseDate} onDateChange={mockOnDateChange} />,
      );

      const container = screen.getByRole("application");

      // ArrowLeft - previous day
      fireEvent.keyDown(container, { key: "ArrowLeft" });

      await waitFor(() => {
        expect(mockOnDateChange).toHaveBeenCalled();
      });

      expect(mockOnDateChange.mock.calls[0][0].getDate()).toBe(14);

      mockOnDateChange.mockClear();

      // ArrowRight - next day
      fireEvent.keyDown(container, { key: "ArrowRight" });

      await waitFor(() => {
        expect(mockOnDateChange).toHaveBeenCalled();
      });

      expect(mockOnDateChange.mock.calls[0][0].getDate()).toBe(16);

      mockOnDateChange.mockClear();

      // ArrowUp - previous month
      fireEvent.keyDown(container, { key: "ArrowUp" });

      await waitFor(() => {
        expect(mockOnDateChange).toHaveBeenCalled();
      });

      expect(mockOnDateChange.mock.calls[0][0].getMonth()).toBe(4); // May (June - 1)

      mockOnDateChange.mockClear();

      // ArrowDown - next month
      fireEvent.keyDown(container, { key: "ArrowDown" });

      await waitFor(() => {
        expect(mockOnDateChange).toHaveBeenCalled();
      });

      expect(mockOnDateChange.mock.calls[0][0].getMonth()).toBe(6); // July (June + 1)
    });

    it("should close historical presets on Escape/Enter", () => {
      render(
        <DatePicker selectedDate={baseDate} onDateChange={mockOnDateChange} />,
      );

      const container = screen.getByRole("application");

      // Open and close with Escape
      fireEvent.click(screen.getByText("Quick Presets"));
      expect(screen.getByText("Moon Landing")).toBeInTheDocument();
      fireEvent.keyDown(container, { key: "Escape" });
      expect(screen.queryByText("Moon Landing")).not.toBeInTheDocument();
    });
  });

  describe("Touch gestures", () => {
    it("should navigate with swipe gestures", async () => {
      render(
        <DatePicker selectedDate={baseDate} onDateChange={mockOnDateChange} />,
      );

      const container = screen.getByRole("application");

      // Swipe left - next day (from x=100 to x=0, delta > 50)
      fireEvent.touchStart(container, {
        touches: [{ clientX: 100, clientY: 50 }],
      });
      fireEvent.touchEnd(container, {
        changedTouches: [{ clientX: 0, clientY: 50 }],
      });

      await waitFor(() => {
        expect(mockOnDateChange).toHaveBeenCalled();
      });
      expect(mockOnDateChange.mock.calls[0][0].getDate()).toBe(16);

      mockOnDateChange.mockClear();

      // Swipe right - previous day (from x=0 to x=100, delta > 50)
      fireEvent.touchStart(container, {
        touches: [{ clientX: 0, clientY: 50 }],
      });
      fireEvent.touchEnd(container, {
        changedTouches: [{ clientX: 100, clientY: 50 }],
      });

      await waitFor(() => {
        expect(mockOnDateChange).toHaveBeenCalled();
      });
      expect(mockOnDateChange.mock.calls[0][0].getDate()).toBe(14);
    });

    it("should not trigger on small swipes", async () => {
      render(
        <DatePicker selectedDate={baseDate} onDateChange={mockOnDateChange} />,
      );

      const container = screen.getByRole("application");
      fireEvent.touchStart(container, {
        touches: [{ clientX: 50, clientY: 50 }],
      });
      fireEvent.touchEnd(container, {
        changedTouches: [{ clientX: 70, clientY: 50 }],
      });

      // Give async handlers time to run, then verify no call was made
      await waitFor(
        () => {
          expect(mockOnDateChange).not.toHaveBeenCalled();
        },
        { timeout: 100 }
      );
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria attributes and be focusable", () => {
      render(
        <DatePicker selectedDate={baseDate} onDateChange={mockOnDateChange} />,
      );

      const container = screen.getByRole("application");
      expect(container).toHaveAttribute(
        "aria-label",
        expect.stringContaining("Date picker"),
      );
      expect(container).toHaveAttribute("tabIndex", "0");
    });
  });
});

describe("ModeToggleButton", () => {
  it("should show correct label and call onToggle", () => {
    const onToggle = vi.fn();
    const { rerender } = render(
      <ModeToggleButton mode="speed" onToggle={onToggle} />,
    );

    expect(screen.getByText("Date Mode")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledTimes(1);

    rerender(<ModeToggleButton mode="date" onToggle={onToggle} />);
    expect(screen.getByText("Speed Mode")).toBeInTheDocument();
  });

  it("should have correct aria-pressed and styling", () => {
    const onToggle = vi.fn();
    const { rerender } = render(
      <ModeToggleButton mode="speed" onToggle={onToggle} />,
    );

    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");

    rerender(<ModeToggleButton mode="date" onToggle={onToggle} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button")).toHaveClass("ring-2");
  });
});
