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
import { RotationSpeedProvider } from "@/contexts/rotation-speed-context";

const MAX_SPEED = 10000000;
const MIN_SPEED = 1;

// Solar System component with updated simulation speed scale
export default function SolarSystem() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [simulationSpeed, setSimulationSpeed] = useState(2000000);

  const handlePlanetClick = useCallback((planet: PlanetData) => {
    setSelectedPlanet(planet);
  }, []);

  const handleSunClick = useCallback(() => {
    setSelectedPlanet(sunData);
  }, []);

  const handleCloseInfo = () => {
    setSelectedPlanet(null);
  };

  const handleSpeedChange = (speed: number) => {
    let validSpeed = isNaN(speed) ? MIN_SPEED : Number(speed);
    validSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, validSpeed));

    if (validSpeed > MIN_SPEED && validSpeed < MAX_SPEED) {
      if (validSpeed >= 100 && validSpeed < MAX_SPEED) {
        validSpeed = Math.round(validSpeed / 100) * 100;
      }
      // For very small values, don't round
      else {
        validSpeed = Math.round(validSpeed);
      }
    }

    setSimulationSpeed(validSpeed);
  };

  return (
    <RotationSpeedProvider>
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
          onSpeedChange={handleSpeedChange}
        />

        <div className="absolute bottom-4 left-4 text-white bg-black/80 p-2 rounded-md text-xs max-w-[180px]">
          <div className="flex flex-col space-y-1">
            <p>• Click objects for info</p>
          </div>
        </div>

        <GitHubButton />
      </div>
    </RotationSpeedProvider>
  );
}
