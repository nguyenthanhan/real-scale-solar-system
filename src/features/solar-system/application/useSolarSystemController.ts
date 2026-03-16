"use client";

import { useCallback, useMemo, useState } from "react";
import { sunData } from "@/data/planet-data";
import { PlanetData } from "@/data/planet-types";
import { useSimulationSpeed } from "@/features/simulation-control/state/rotation-speed-context";
import { useSimulationMode } from "@/features/simulation-control/state/simulation-mode-context";

export function useSolarSystemController() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [controlModalVisible, setControlModalVisible] = useState(true);
  const [showPlanetLabels, setShowPlanetLabels] = useState(true);
  const [showOrbitPath, setShowOrbitPath] = useState(true);
  const [showBeltRegions, setShowBeltRegions] = useState(true);

  const {
    simulationSpeed,
    setSimulationSpeed,
    modalAutoRotate,
    setModalAutoRotate,
  } = useSimulationSpeed();
  const { mode, toggleMode, selectedDate, setSelectedDate } = useSimulationMode();

  const isDateMode = mode === "date";
  const isPlanetModalOpen = selectedPlanet !== null;

  const handlePlanetClick = useCallback((planet: PlanetData) => {
    setSelectedPlanet(planet);
  }, []);

  const handleSunClick = useCallback(() => {
    setSelectedPlanet(sunData);
  }, []);

  const handleCloseInfo = useCallback(() => {
    setSelectedPlanet(null);
  }, []);

  const handleModeToggle = useCallback(() => {
    toggleMode();
  }, [toggleMode]);

  return useMemo(
    () => ({
      selectedPlanet,
      controlModalVisible,
      showPlanetLabels,
      showOrbitPath,
      showBeltRegions,
      simulationSpeed,
      modalAutoRotate,
      mode,
      selectedDate,
      isDateMode,
      isPlanetModalOpen,
      setControlModalVisible,
      setShowPlanetLabels,
      setShowOrbitPath,
      setShowBeltRegions,
      setSimulationSpeed,
      setModalAutoRotate,
      setSelectedDate,
      handlePlanetClick,
      handleSunClick,
      handleCloseInfo,
      handleModeToggle,
    }),
    [
      selectedPlanet,
      controlModalVisible,
      showPlanetLabels,
      showOrbitPath,
      showBeltRegions,
      simulationSpeed,
      modalAutoRotate,
      mode,
      selectedDate,
      isDateMode,
      isPlanetModalOpen,
      setSimulationSpeed,
      setModalAutoRotate,
      setSelectedDate,
      handlePlanetClick,
      handleSunClick,
      handleCloseInfo,
      handleModeToggle,
    ]
  );
}
