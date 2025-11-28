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

const MAX_SPEED = 10_000_000;
const MIN_SPEED = 1;

export function SimulationSpeedProvider({ children }: { children: ReactNode }) {
  const [simulationSpeed, setSimulationSpeedState] =
    useState<number>(1_000_000);
  const [rotationSpeedMinutes, setRotationSpeedMinutes] = useState<number>(15);

  const setSimulationSpeed = useCallback((speed: number) => {
    let validSpeed = Number.isFinite(speed) ? speed : MIN_SPEED;
    validSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, validSpeed));

    if (validSpeed > MIN_SPEED && validSpeed < MAX_SPEED) {
      validSpeed =
        validSpeed >= 100
          ? Math.round(validSpeed / 100) * 100
          : Math.round(validSpeed);
    }

    setSimulationSpeedState(validSpeed);
  }, []);

  const contextValue = useMemo<SimulationSpeedContextType>(
    () => ({
      simulationSpeed,
      setSimulationSpeed,
      rotationSpeedMinutes,
      setRotationSpeedMinutes,
    }),
    [
      simulationSpeed,
      setSimulationSpeed,
      rotationSpeedMinutes,
      setRotationSpeedMinutes,
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
