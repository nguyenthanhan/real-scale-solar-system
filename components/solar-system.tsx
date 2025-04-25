"use client";

import { useState, useRef, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Sun } from "@/components/sun";
import { Planet } from "@/components/planet";
import { PlanetInfo } from "@/components/planet-info";
import { SpeedControl } from "@/components/speed-control";
import { planetData, sunData } from "@/lib/planet-data";
import * as THREE from "three";

// Function to control camera view with WASD keys
function KeyboardControls({ simulationSpeed, onSpeedChange }) {
  const { camera, gl } = useThree();
  const keysPressed = useRef({});
  const orbitControlsRef = useRef();

  // Set up key press tracking
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Skip if user is typing in an input field
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        return;
      }

      keysPressed.current[event.key.toLowerCase()] = true;

      // Handle speed controls immediately
      if (event.key.toLowerCase() === "q") {
        // Decrease speed by 100, minimum 1
        onSpeedChange(Math.max(1, simulationSpeed - 100));
      } else if (event.key.toLowerCase() === "e") {
        // Increase speed by 100, maximum 100000
        onSpeedChange(Math.min(100000, simulationSpeed + 100));
      }
    };

    const handleKeyUp = (event) => {
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
    // Base camera movement speed
    const baseSpeed = 0.1;

    // Calculate camera movement based on current camera orientation
    const moveForward = new THREE.Vector3();
    const moveRight = new THREE.Vector3();

    // Get the camera's forward and right vectors
    camera.getWorldDirection(moveForward);
    moveRight.crossVectors(camera.up, moveForward).normalize();

    // Zero out the Y component to prevent vertical movement when going forward/backward
    moveForward.y = 0;
    moveForward.normalize();

    // W/S keys move camera forward/backward
    if (keysPressed.current["w"]) {
      camera.position.addScaledVector(moveForward, baseSpeed);
    }
    if (keysPressed.current["s"]) {
      camera.position.addScaledVector(moveForward, -baseSpeed);
    }

    // A/D keys move camera left/right
    if (keysPressed.current["a"]) {
      camera.position.addScaledVector(moveRight, -baseSpeed);
    }
    if (keysPressed.current["d"]) {
      camera.position.addScaledVector(moveRight, baseSpeed);
    }
  });

  return null;
}

// Solar System component with updated simulation speed scale
export default function SolarSystem() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [showSunInfo, setShowSunInfo] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // Default is 1 (real-time speed)
  const orbitControlsRef = useRef();
  const [keyboardControlsEnabled, setKeyboardControlsEnabled] = useState(true);

  const handlePlanetClick = (planet) => {
    setSelectedPlanet(planet);
    setShowSunInfo(false);
  };

  const handleSunClick = () => {
    setSelectedPlanet(null);
    setShowSunInfo(true);
  };

  const handleCloseInfo = () => {
    setSelectedPlanet(null);
    setShowSunInfo(false);
  };

  const handleSpeedChange = (speed) => {
    let validSpeed = isNaN(speed) ? 1 : Number(speed);
    validSpeed = Math.max(1, Math.min(100000, validSpeed));

    if (validSpeed >= 100) {
      validSpeed = Math.round(validSpeed / 100) * 100;
    }
    // For very small values, don't round
    else {
      validSpeed = Math.round(validSpeed);
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
            simulationSpeed={simulationSpeed} // Pass the direct value without division
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
          ref={orbitControlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={100}
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

      <SpeedControl speed={simulationSpeed} onSpeedChange={handleSpeedChange} />

      <div className="absolute bottom-4 left-4 text-white bg-black/80 p-2 rounded-md text-xs max-w-[180px]">
        <div className="flex flex-col space-y-1">
          <p>• Click objects for info</p>
          <p>• W/S - Move forward/back</p>
          <p>• A/D - Move left/right</p>
          <p>• Q/E - Speed ±100</p>
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
