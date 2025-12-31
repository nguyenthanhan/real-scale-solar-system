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
  /** Whether auto-rotation is enabled for planet modal 3D model */
  modalAutoRotate: boolean;
  setModalAutoRotate: (enabled: boolean) => void;
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
  const [modalAutoRotate, setModalAutoRotateState] = useState<boolean>(true);

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

  const setModalAutoRotate = useCallback((enabled: boolean) => {
    setModalAutoRotateState(enabled);
  }, []);

  const contextValue = useMemo<SimulationSpeedContextType>(
    () => ({
      simulationSpeed,
      setSimulationSpeed,
      rotationSpeedMinutes,
      setRotationSpeedMinutes,
      modalAutoRotate,
      setModalAutoRotate,
    }),
    [
      simulationSpeed,
      setSimulationSpeed,
      rotationSpeedMinutes,
      setRotationSpeedMinutes,
      modalAutoRotate,
      setModalAutoRotate,
    ],
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
      "useSimulationSpeed must be used within a SimulationSpeedProvider",
    );
  }
  return context;
}

export function useRotationSpeed() {
  const context = useContext(SimulationSpeedContext);
  if (context === undefined) {
    throw new Error(
      "useRotationSpeed must be used within a SimulationSpeedProvider",
    );
  }
  return {
    rotationSpeedMinutes: context.rotationSpeedMinutes,
    setRotationSpeedMinutes: context.setRotationSpeedMinutes,
  };
}
