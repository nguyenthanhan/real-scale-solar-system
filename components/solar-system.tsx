"use client";

import { useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Sun } from "@/components/planet/sun";
import { Planet } from "@/components/planet";
import { ControlModal } from "@/components/modal/control";
import { planetData, sunData } from "@/data/planet-data";
import { PlanetData } from "@/data/planet-types";
import { ModalOverlay } from "@/components/modal/modal-overlay";
import { GitHubButton } from "@/components/button/github-button";
import {
  SimulationSpeedProvider,
  useSimulationSpeed,
} from "@/contexts/rotation-speed-context";
import { MemoryMonitor } from "@/components/debug/memory-monitor";

// Component that runs inside the Canvas (has access to Three.js context)
function SceneContent({
  simulationSpeed,
  onSunClick,
  onPlanetClick,
  selectedPlanet,
}: {
  simulationSpeed: number;
  onSunClick: () => void;
  onPlanetClick: (planet: PlanetData) => void;
  selectedPlanet: PlanetData | null;
}) {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[0, 10, 5]} intensity={1.5} />
      <directionalLight position={[0, -10, -5]} intensity={0.8} />
      <Sun onClick={onSunClick} simulationSpeed={simulationSpeed} />
      {planetData.map((planet) => (
        <Planet
          key={planet.name}
          planet={planet}
          simulationSpeed={simulationSpeed}
          onClick={onPlanetClick}
          showLabels={!selectedPlanet}
        />
      ))}
      <Stars
        radius={15000}
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
        maxDistance={38000}
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
  const { simulationSpeed, setSimulationSpeed } = useSimulationSpeed();

  const handlePlanetClick = useCallback((planet: PlanetData) => {
    setSelectedPlanet(planet);
  }, []);

  const handleSunClick = useCallback(() => {
    setSelectedPlanet(sunData);
  }, []);

  const handleCloseInfo = () => {
    setSelectedPlanet(null);
  };

  return (
    <div className="w-full h-screen relative bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      <Canvas
        camera={{ position: [0, 2000, 4000], fov: 60, near: 0.1, far: 70000 }}
      >
        <SceneContent
          simulationSpeed={simulationSpeed}
          onSunClick={handleSunClick}
          onPlanetClick={handlePlanetClick}
          selectedPlanet={selectedPlanet}
        />
      </Canvas>

      <ModalOverlay planet={selectedPlanet} onClose={handleCloseInfo} />

      {/* Show control modal when no planet is selected, with manual visibility control */}
      {!selectedPlanet && (
        <ControlModal
          simulationSpeed={simulationSpeed}
          onSpeedChange={setSimulationSpeed}
          isVisible={controlModalVisible}
          onToggleVisibility={setControlModalVisible}
        />
      )}

      <div className="absolute bottom-4 left-4 text-white bg-black/80 p-2 rounded-md text-xs max-w-[180px]">
        <div className="flex flex-col space-y-1">
          <p>• Click objects for info</p>
        </div>
      </div>

      <GitHubButton />

      {/* Debug components - only show in development */}
      {process.env.NODE_ENV === "development" && <MemoryMonitor />}
    </div>
  );
}

// Main component that provides the context
export default function SolarSystem() {
  return (
    <SimulationSpeedProvider>
      <SolarSystemContent />
    </SimulationSpeedProvider>
  );
}
