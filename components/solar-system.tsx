"use client";

import { useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Sun } from "@/components/planet/sun";
import { Planet } from "@/components/planet";
import { BeltRegions } from "@/components/belt";
import { ControlModal } from "@/components/modal/control";
import { planetData, sunData } from "@/data/planet-data";
import { PlanetData } from "@/data/planet-types";
import { ModalOverlay } from "@/components/modal/modal-overlay";
import { GitHubButton } from "@/components/button/github-button";
import {
  SimulationSpeedProvider,
  useSimulationSpeed,
} from "@/contexts/rotation-speed-context";
import {
  SimulationModeProvider,
  useSimulationMode,
} from "@/contexts/simulation-mode-context";
import { ModeToggleButton } from "@/components/button/mode-toggle-button";
import { DatePicker } from "@/components/date-picker/date-picker";
import { MemoryMonitor } from "@/components/debug/memory-monitor";

import type { SimulationMode } from "@/contexts/simulation-mode-context";

// Component that runs inside the Canvas (has access to Three.js context)
function SceneContent({
  simulationSpeed,
  simulationMode,
  selectedDate,
  onSunClick,
  onPlanetClick,
  selectedPlanet,
  showPlanetLabels,
  showOrbitPath,
  showBeltRegions,
}: {
  simulationSpeed: number;
  simulationMode: SimulationMode;
  selectedDate: Date;
  onSunClick: () => void;
  onPlanetClick: (planet: PlanetData) => void;
  selectedPlanet: PlanetData | null;
  showPlanetLabels: boolean;
  showOrbitPath: boolean;
  showBeltRegions: boolean;
}) {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[0, 10, 5]} intensity={1.5} />
      <directionalLight position={[0, -10, -5]} intensity={0.8} />
      <Sun
        onClick={onSunClick}
        simulationSpeed={simulationSpeed}
        simulationMode={simulationMode}
      />
      {planetData.map((planet) => (
        <Planet
          key={planet.name}
          planet={planet}
          simulationSpeed={simulationSpeed}
          simulationMode={simulationMode}
          selectedDate={selectedDate}
          onClick={onPlanetClick}
          showLabels={showPlanetLabels && !selectedPlanet}
          showOrbitPath={showOrbitPath}
        />
      ))}
      <BeltRegions visible={showBeltRegions} />
      <Stars
        radius={60000}
        depth={2000}
        count={3000}
        factor={4}
        saturation={1}
        fade
        speed={1}
      />
      <OrbitControls
        makeDefault
        enableZoom
        enableRotate
        minDistance={100}
        maxDistance={60000}
        zoomSpeed={1.2}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

// Inner component that uses the context
function SolarSystemContent() {
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
  const { mode, toggleMode, selectedDate, setSelectedDate } =
    useSimulationMode();

  // Check if in Date Mode
  const isDateMode = mode === "date";

  const handlePlanetClick = useCallback((planet: PlanetData) => {
    setSelectedPlanet(planet);
  }, []);

  const handleSunClick = useCallback(() => {
    setSelectedPlanet(sunData);
  }, []);

  const handleCloseInfo = () => {
    setSelectedPlanet(null);
  };

  // Handle mode toggle - preserve speed when switching modes
  const handleModeToggle = useCallback(() => {
    toggleMode();
  }, [toggleMode]);

  return (
    <div className="w-full h-screen relative bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      <Canvas
        camera={{ position: [0, 2000, 4000], fov: 60, near: 0.1, far: 120000 }}
      >
        <SceneContent
          simulationSpeed={simulationSpeed}
          simulationMode={mode}
          selectedDate={selectedDate}
          onSunClick={handleSunClick}
          onPlanetClick={handlePlanetClick}
          selectedPlanet={selectedPlanet}
          showPlanetLabels={showPlanetLabels}
          showOrbitPath={showOrbitPath}
          showBeltRegions={showBeltRegions}
        />
      </Canvas>

      <ModalOverlay planet={selectedPlanet} onClose={handleCloseInfo} />

      {/* Mode toggle button - hide when planet modal is open */}
      {!selectedPlanet && (
        <div className="absolute top-4 left-4 z-buttons">
          <ModeToggleButton mode={mode} onToggle={handleModeToggle} />
        </div>
      )}

      {/* Date picker - only visible in Date Mode and when modal is closed */}
      {isDateMode && !selectedPlanet && (
        <div
          className="absolute top-16 left-4 z-controls animate-in fade-in duration-500"
          style={{ animation: "fadeIn 500ms ease-in-out" }}
        >
          <DatePicker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
      )}

      {/* Control modal is always visible, with manual visibility control */}
      <ControlModal
        simulationSpeed={simulationSpeed}
        onSpeedChange={setSimulationSpeed}
        isVisible={controlModalVisible}
        onToggleVisibility={setControlModalVisible}
        showPlanetLabels={showPlanetLabels}
        onTogglePlanetLabels={setShowPlanetLabels}
        showOrbitPath={showOrbitPath}
        onToggleOrbitPath={setShowOrbitPath}
        showBeltRegions={showBeltRegions}
        onToggleBeltRegions={setShowBeltRegions}
        disabled={isDateMode}
        modalAutoRotate={modalAutoRotate}
        onToggleModalAutoRotate={setModalAutoRotate}
        isPlanetModalOpen={selectedPlanet !== null}
      />

      {/* Hint text - hide when planet modal is open */}
      {!selectedPlanet && (
        <div className="absolute bottom-4 left-4 text-white bg-black/80 p-2 rounded-md text-xs max-w-[180px]">
          <div className="flex flex-col space-y-1">
            <p>• Click objects for info</p>
          </div>
        </div>
      )}

      {/* GitHub button - hide when planet modal is open */}
      {!selectedPlanet && <GitHubButton />}

      {/* Debug components - only show in development */}
      {process.env.NODE_ENV === "development" && <MemoryMonitor />}
    </div>
  );
}

// Main component that provides the context
export default function SolarSystem() {
  return (
    <SimulationSpeedProvider>
      <SimulationModeProvider>
        <SolarSystemContent />
      </SimulationModeProvider>
    </SimulationSpeedProvider>
  );
}
