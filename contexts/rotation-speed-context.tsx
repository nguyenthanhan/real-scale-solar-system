"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

interface SimulationSpeedContextType {
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  rotationSpeedMinutes: number;
  setRotationSpeedMinutes: Dispatch<SetStateAction<number>>;
}

const SimulationSpeedContext = createContext<
  SimulationSpeedContextType | undefined
>(undefined);

const MAX_SPEED = 10000000;
const MIN_SPEED = 1;

export function SimulationSpeedProvider({ children }: { children: ReactNode }) {
  const [simulationSpeed, setSimulationSpeedState] = useState<number>(2000000);
  const [rotationSpeedMinutes, setRotationSpeedMinutes] = useState<number>(15);

  const setSimulationSpeed = useCallback((speed: number) => {
    let validSpeed = isNaN(speed) ? MIN_SPEED : Number(speed);
    validSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, validSpeed));

    if (validSpeed > MIN_SPEED && validSpeed < MAX_SPEED) {
      if (validSpeed >= 100 && validSpeed < MAX_SPEED) {
        validSpeed = Math.round(validSpeed / 100) * 100;
      } else {
        validSpeed = Math.round(validSpeed);
      }
    }

    setSimulationSpeedState(validSpeed);
  }, []);

  const setRotationSpeedMinutesCallback = useCallback<
    Dispatch<SetStateAction<number>>
  >((value) => {
    setRotationSpeedMinutes(value);
  }, []);

  const contextValue = useMemo<SimulationSpeedContextType>(
    () => ({
      simulationSpeed,
      setSimulationSpeed,
      rotationSpeedMinutes,
      setRotationSpeedMinutes: setRotationSpeedMinutesCallback,
    }),
    [
      simulationSpeed,
      setSimulationSpeed,
      rotationSpeedMinutes,
      setRotationSpeedMinutesCallback,
    ]
  );

  return (
    <SimulationSpeedContext.Provider value={contextValue}>
      {children}
    </SimulationSpeedContext.Provider>
  );
}

export function useSimulationSpeed() {
  const context = useContext(SimulationSpeedContext);
  if (context === undefined) {
    throw new Error(
      "useSimulationSpeed must be used within a SimulationSpeedProvider"
    );
  }
  return context;
}

// Legacy hook for backward compatibility
export function useRotationSpeed() {
  const context = useContext(SimulationSpeedContext);
  if (context === undefined) {
    throw new Error(
      "useRotationSpeed must be used within a SimulationSpeedProvider"
    );
  }
  return {
    rotationSpeedMinutes: context.rotationSpeedMinutes,
    setRotationSpeedMinutes: context.setRotationSpeedMinutes,
  };
}
