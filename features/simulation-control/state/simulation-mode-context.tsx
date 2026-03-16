"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import type { ReactNode } from "react";

/**
 * Simulation mode types
 * - 'speed': Continuous animation with speed control
 * - 'date': Static positions based on selected date
 */
export type SimulationMode = "speed" | "date";

interface SimulationModeContextType {
  /** Current simulation mode */
  mode: SimulationMode;
  /** Set the simulation mode */
  setMode: (mode: SimulationMode) => void;
  /** Toggle between speed and date modes */
  toggleMode: () => void;
  /** Selected date for Date Mode */
  selectedDate: Date;
  /** Set the selected date */
  setSelectedDate: (date: Date) => void;
  /** Whether currently in Date Mode */
  isDateMode: boolean;
  /** Whether currently in Speed Mode */
  isSpeedMode: boolean;
}

const SimulationModeContext = createContext<
  SimulationModeContextType | undefined
>(undefined);

export function SimulationModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<SimulationMode>("speed");
  const [selectedDate, setSelectedDateState] = useState<Date>(new Date());

  const setMode = useCallback((newMode: SimulationMode) => {
    if (newMode !== "speed" && newMode !== "date") {
      console.error(`Invalid simulation mode: ${newMode}`);
      return;
    }
    setModeState(newMode);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((current) => (current === "speed" ? "date" : "speed"));
  }, []);

  const setSelectedDate = useCallback((date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error("Invalid date provided to setSelectedDate");
      return;
    }
    setSelectedDateState(date);
  }, []);

  const contextValue = useMemo<SimulationModeContextType>(
    () => ({
      mode,
      setMode,
      toggleMode,
      selectedDate,
      setSelectedDate,
      isDateMode: mode === "date",
      isSpeedMode: mode === "speed",
    }),
    [mode, setMode, toggleMode, selectedDate, setSelectedDate]
  );

  return (
    <SimulationModeContext.Provider value={contextValue}>
      {children}
    </SimulationModeContext.Provider>
  );
}

/**
 * Hook to access simulation mode context
 * @throws Error if used outside SimulationModeProvider
 */
export function useSimulationMode() {
  const context = useContext(SimulationModeContext);
  if (context === undefined) {
    throw new Error(
      "useSimulationMode must be used within a SimulationModeProvider"
    );
  }
  return context;
}
