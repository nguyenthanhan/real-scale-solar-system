"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Sun } from "@/components/sun";
import { Planet } from "@/components/planet";
import { PlanetInfo } from "@/components/planet-info";
import { SpeedControl } from "@/components/speed-control";
import { planetData, sunData } from "@/lib/planet-data";
import { PlanetData } from "@/types/planet-types";
import * as THREE from "three";

// Function to control camera view with WASD keys
interface KeyboardControlsProps {
  simulationSpeed: number;
  onSpeedChange: (speed: number) => void;
}

function KeyboardControls({
  simulationSpeed,
  onSpeedChange,
}: KeyboardControlsProps) {
  const { camera, gl } = useThree();
  const keysPressed = useRef<Record<string, boolean>>({});

  // Set up key press tracking
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if user is typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      keysPressed.current[event.key.toLowerCase()] = true;

      // Handle speed controls immediately
      if (event.key.toLowerCase() === "q") {
        // Decrease speed by 5000, minimum 1
        onSpeedChange(Math.max(1, simulationSpeed - 5000));
      } else if (event.key.toLowerCase() === "e") {
        // Increase speed by 5000, maximum 100000
        onSpeedChange(Math.min(100000, simulationSpeed + 5000));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current[event.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [simulationSpeed, onSpeedChange]);

  // Handle camera movement in the animation frame
  useFrame(({ camera }) => {
    // Base camera movement speed - increased for faster movement
    const baseSpeed = 0.5;

    // Calculate camera movement based on current camera orientation
    const moveForward = new THREE.Vector3();
    const moveRight = new THREE.Vector3();

    // Get the camera's forward and right vectors
    camera.getWorldDirection(moveForward);
    moveRight.crossVectors(camera.up, moveForward).normalize();

    // Zero out the Y component to prevent vertical movement when going forward/backward
    moveForward.y = 0;
    moveForward.normalize();

    // Calculate current distance from origin (sun)
    const distanceFromOrigin = camera.position.length();

    // Create a vector pointing from camera to origin (sun)
    const toOrigin = new THREE.Vector3(0, 0, 0)
      .sub(camera.position)
      .normalize();

    // Create a rotation axis (perpendicular to both the up vector and toOrigin)
    const rotationAxisVertical = new THREE.Vector3()
      .crossVectors(toOrigin, camera.up)
      .normalize();
    const rotationAxisHorizontal = camera.up.clone().normalize();

    // Apply rotations instead of translations
    if (keysPressed.current["w"]) {
      // Rotate around horizontal axis (move up)
      camera.position.applyAxisAngle(
        rotationAxisVertical,
        baseSpeed / distanceFromOrigin
      );
    }
    if (keysPressed.current["s"]) {
      // Rotate around horizontal axis (move down)
      camera.position.applyAxisAngle(
        rotationAxisVertical,
        -baseSpeed / distanceFromOrigin
      );
    }
    if (keysPressed.current["a"]) {
      // Rotate around vertical axis (move left)
      camera.position.applyAxisAngle(
        rotationAxisHorizontal,
        baseSpeed / distanceFromOrigin
      );
    }
    if (keysPressed.current["d"]) {
      // Rotate around vertical axis (move right)
      camera.position.applyAxisAngle(
        rotationAxisHorizontal,
        -baseSpeed / distanceFromOrigin
      );
    }

    // Make sure camera is looking at the origin (sun)
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Solar System component with updated simulation speed scale
export default function SolarSystem() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [showSunInfo, setShowSunInfo] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // Default is 1 (real-time speed)
  const [distanceScale, setDistanceScale] = useState(0.05); // Default spacing scale for planets
  const [keyboardControlsEnabled, setKeyboardControlsEnabled] = useState(true);

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
    let validSpeed = isNaN(speed) ? 1 : Number(speed);
    validSpeed = Math.max(1, Math.min(100000, validSpeed));

    if (validSpeed > 1 && validSpeed < 100000) {
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

  // Toggle keyboard controls
  const toggleKeyboardControls = () => {
    setKeyboardControlsEnabled(!keyboardControlsEnabled);
  };

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      <Canvas camera={{ position: [0, 25, 25], fov: 60 }}>
        <color attach="background" args={["#000"]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 10, 5]} intensity={0.5} />
        <Sun onClick={handleSunClick} />
        {planetData.map((planet) => (
          <Planet
            key={planet.name}
            planet={planet}
            simulationSpeed={simulationSpeed}
            distanceScale={distanceScale}
            onClick={() => handlePlanetClick(planet)}
          />
        ))}
        <Stars
          radius={300}
          depth={50}
          count={5000}
          factor={4}
          saturation={1}
          fade
          speed={1.5}
        />
        <OrbitControls
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={500}
        />
        {keyboardControlsEnabled && (
          <KeyboardControls
            simulationSpeed={simulationSpeed}
            onSpeedChange={handleSpeedChange}
          />
        )}
      </Canvas>

      {/* Planet Info Modal with Overlay */}
      {selectedPlanet && (
        <>
          {/* Overlay to close modal when clicking outside */}
          <div
            className="fixed inset-0 bg-transparent z-40"
            onClick={handleCloseInfo}
          />
          <div
            className="fixed top-4 right-4 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <PlanetInfo planet={selectedPlanet} onClose={handleCloseInfo} />
          </div>
        </>
      )}

      {/* Sun Info Modal with Overlay */}
      {showSunInfo && (
        <>
          {/* Overlay to close modal when clicking outside */}
          <div
            className="fixed inset-0 bg-transparent z-40"
            onClick={handleCloseInfo}
          />
          <div
            className="fixed top-4 right-4 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <PlanetInfo planet={sunData} onClose={handleCloseInfo} />
          </div>
        </>
      )}

      <SpeedControl
        simulationSpeed={simulationSpeed}
        onSpeedChange={handleSpeedChange}
        distanceScale={distanceScale}
        onDistanceScaleChange={setDistanceScale}
      />

      <div className="absolute bottom-4 left-4 text-white bg-black/80 p-2 rounded-md text-xs max-w-[180px]">
        <div className="flex flex-col space-y-1">
          <p>• Click objects for info</p>
          <p>• W/S - Orbit forward/back</p>
          <p>• A/D - Orbit left/right</p>
          <p>• Q/E - Speed ±5000</p>
          <button
            onClick={toggleKeyboardControls}
            className="mt-1 px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 text-xs"
          >
            {keyboardControlsEnabled ? "Disable" : "Enable"} Keys
          </button>
        </div>
      </div>
    </div>
  );
}
