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
import { GitHubButton } from "@/components/github-button";
import {
  SimulationSpeedProvider,
  useSimulationSpeed,
} from "@/contexts/rotation-speed-context";
import { MemoryMonitor } from "@/components/debug/memory-monitor";

// Inner component that uses the context
function SolarSystemContent() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
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
        camera={{ position: [0, 2000, 4000], fov: 45, near: 0.1, far: 50000 }}
      >
        <color attach="background" args={["#000"]} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[0, 10, 5]} intensity={1.5} />
        <directionalLight position={[0, -10, -5]} intensity={0.8} />
        <Sun onClick={handleSunClick} simulationSpeed={simulationSpeed} />
        {planetData.map((planet) => (
          <Planet
            key={planet.name}
            planet={planet}
            simulationSpeed={simulationSpeed}
            onClick={handlePlanetClick}
            showLabels={!selectedPlanet}
          />
        ))}
        <Stars
          radius={10000}
          depth={2000}
          count={10000}
          factor={4}
          saturation={1}
          fade
          speed={1.5}
        />
        <OrbitControls
          enableZoom
          enableRotate
          minDistance={200}
          maxDistance={20000}
          zoomSpeed={1.2}
        />
      </Canvas>

      <ModalOverlay planet={selectedPlanet} onClose={handleCloseInfo} />

      <ControlModal
        simulationSpeed={simulationSpeed}
        onSpeedChange={setSimulationSpeed}
      />

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
