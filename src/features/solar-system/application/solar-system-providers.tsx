"use client";

import { ReactNode } from "react";
import { SimulationSpeedProvider } from "@/features/simulation-control/state/rotation-speed-context";
import { SimulationModeProvider } from "@/features/simulation-control/state/simulation-mode-context";

type SolarSystemProvidersProps = {
  children: ReactNode;
};

export function SolarSystemProviders({ children }: SolarSystemProvidersProps) {
  return (
    <SimulationSpeedProvider>
      <SimulationModeProvider>{children}</SimulationModeProvider>
    </SimulationSpeedProvider>
  );
}
