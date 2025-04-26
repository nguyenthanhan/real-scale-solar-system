"use client";

import { useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Sun } from "@/components/planet/sun";
import { Planet } from "@/components/planet";
import { ControlModal } from "@/components/modal/control";
import { CameraControls } from "@/lib/camera-controls";
import { planetData, sunData } from "@/constants/planet-data";
import { PlanetData } from "@/types/planet-types";
import { ModalOverlay } from "@/components/modal/modal-overlay";

const MAX_SPEED = 100000;
const MIN_SPEED = 1;

// Solar System component with updated simulation speed scale
export default function SolarSystem() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [showSunInfo, setShowSunInfo] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(500);

  const handlePlanetClick = useCallback((planet: PlanetData) => {
    setSelectedPlanet(planet);
    setShowSunInfo(false);
  }, []);

  const handleSunClick = useCallback(() => {
    setSelectedPlanet(sunData);
  }, []);

  const handleCloseInfo = () => {
    setSelectedPlanet(null);
    setShowSunInfo(false);
  };

  const handleSpeedChange = (speed: number) => {
    let validSpeed = isNaN(speed) ? MIN_SPEED : Number(speed);
    validSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, validSpeed));

    if (validSpeed > MIN_SPEED && validSpeed < MAX_SPEED) {
      if (validSpeed >= 100) {
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
    <div className="w-full h-screen relative bg-black overflow-hidden">
      <Canvas camera={{ position: [0, 25, 25], fov: 70 }}>
        <color attach="background" args={["#000"]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 10, 5]} intensity={0.5} />
        <Sun onClick={handleSunClick} />
        {planetData.map((planet) => (
          <Planet
            key={planet.name}
            planet={planet}
            simulationSpeed={simulationSpeed}
            onClick={handlePlanetClick}
          />
        ))}
        <Stars
          radius={200}
          depth={50}
          count={5000}
          factor={4}
          saturation={1}
          fade
          speed={1.5}
        />
        <OrbitControls
          enableZoom
          enableRotate
          minDistance={1}
          maxDistance={500}
          zoomSpeed={5}
        />
        <CameraControls simulationSpeed={simulationSpeed} />
      </Canvas>

      <ModalOverlay planet={selectedPlanet} onClose={handleCloseInfo} />
      <ModalOverlay
        planet={showSunInfo ? sunData : null}
        onClose={handleCloseInfo}
      />

      <ControlModal
        simulationSpeed={simulationSpeed}
        onSpeedChange={handleSpeedChange}
      />
      <div className="absolute bottom-4 left-4 text-white bg-black/80 p-2 rounded-md text-xs max-w-[180px]">
        <div className="flex flex-col space-y-1">
          <p>• Click objects for info</p>
          <p>• W/S - Orbit forward/back</p>
          <p>• A/D - Orbit left/right</p>
        </div>
      </div>
    </div>
  );
}
