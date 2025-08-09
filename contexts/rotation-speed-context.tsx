"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";

interface RotationSpeedContextType {
  rotationSpeedMinutes: number;
  setRotationSpeedMinutes: React.Dispatch<React.SetStateAction<number>>;
}

const RotationSpeedContext = createContext<
  RotationSpeedContextType | undefined
>(undefined);

export function RotationSpeedProvider({ children }: { children: ReactNode }) {
  const [rotationSpeedMinutes, setRotationSpeedMinutes] = useState<number>(15);

  const setRotationSpeedMinutesCallback = useCallback<
    React.Dispatch<React.SetStateAction<number>>
  >((value) => {
    setRotationSpeedMinutes(value);
  }, []);

  const contextValue = useMemo<RotationSpeedContextType>(
    () => ({
      rotationSpeedMinutes,
      setRotationSpeedMinutes: setRotationSpeedMinutesCallback,
    }),
    [rotationSpeedMinutes, setRotationSpeedMinutesCallback]
  );

  return (
    <RotationSpeedContext.Provider value={contextValue}>
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
