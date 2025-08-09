"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface RotationSpeedContextType {
  rotationSpeedMinutes: number;
  setRotationSpeedMinutes: (speed: number) => void;
}

const RotationSpeedContext = createContext<
  RotationSpeedContextType | undefined
>(undefined);

export function RotationSpeedProvider({ children }: { children: ReactNode }) {
  const [rotationSpeedMinutes, setRotationSpeedMinutes] = useState(15);

  return (
    <RotationSpeedContext.Provider
      value={{ rotationSpeedMinutes, setRotationSpeedMinutes }}
    >
      {children}
    </RotationSpeedContext.Provider>
  );
}

export function useRotationSpeed() {
  const context = useContext(RotationSpeedContext);
  if (context === undefined) {
    throw new Error(
      "useRotationSpeed must be used within a RotationSpeedProvider"
    );
  }
  return context;
}
