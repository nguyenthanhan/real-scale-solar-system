"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import { Sun } from "@/components/sun"
import { Planet } from "@/components/planet"
import { PlanetInfo } from "@/components/planet-info"
import { SpeedControl } from "@/components/speed-control"
import { planetData } from "@/lib/planet-data"

// Sửa lại hàm KeyboardControls để thay đổi góc nhìn với WS
function KeyboardControls({ simulationSpeed, onSpeedChange }) {
  const { camera, gl } = useThree()
  const keysPressed = useRef({})
  const orbitControlsRef = useRef()

  // Set up key press tracking
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Skip if user is typing in an input field
      if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
        return
      }

      keysPressed.current[event.key.toLowerCase()] = true

      // Handle speed controls immediately
      if (event.key.toLowerCase() === "q") {
        onSpeedChange(Math.max(1, Math.round(simulationSpeed - 5)))
      } else if (event.key.toLowerCase() === "e") {
        onSpeedChange(Math.min(100, Math.round(simulationSpeed + 5)))
      }
    }

    const handleKeyUp = (event) => {
      keysPressed.current[event.key.toLowerCase()] = false
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [simulationSpeed, onSpeedChange])

  // Handle camera movement in the animation frame
  useFrame(({ camera }) => {
    // Camera rotation speed
    const rotationSpeed = 0.03

    // W/S keys change the camera angle (pitch)
    if (keysPressed.current["w"]) {
      // Rotate camera up (decrease phi angle)
      camera.position.y += rotationSpeed * 5
      camera.lookAt(0, 0, 0)
    }
    if (keysPressed.current["s"]) {
      // Rotate camera down (increase phi angle)
      camera.position.y -= rotationSpeed * 5
      camera.lookAt(0, 0, 0)
    }

    // A/D keys move the camera horizontally
    if (keysPressed.current["a"]) {
      camera.position.x -= rotationSpeed * 5
      camera.lookAt(0, 0, 0)
    }
    if (keysPressed.current["d"]) {
      camera.position.x += rotationSpeed * 5
      camera.lookAt(0, 0, 0)
    }
  })

  return null
}

// Sửa lại phần SolarSystem để cập nhật thang đo tốc độ mô phỏng
export default function SolarSystem() {
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [showSunInfo, setShowSunInfo] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(25) // Mặc định là 25 (25x tốc độ thực)
  const orbitControlsRef = useRef()
  const [keyboardControlsEnabled, setKeyboardControlsEnabled] = useState(true)

  const handlePlanetClick = (planet) => {
    setSelectedPlanet(planet)
    setShowSunInfo(false)
  }

  const handleSunClick = () => {
    setSelectedPlanet(null)
    setShowSunInfo(true)
  }

  const handleCloseInfo = () => {
    setSelectedPlanet(null)
    setShowSunInfo(false)
  }

  const handleSpeedChange = (speed) => {
    // Ensure speed is a valid number and within range 1-100
    let validSpeed = isNaN(speed) ? 1 : speed
    validSpeed = Math.max(1, Math.min(100, validSpeed)) // Clamp between 1 and 100
    // Round to integer for simplicity
    validSpeed = Math.round(validSpeed)
    setSimulationSpeed(validSpeed)
  }

  // Toggle keyboard controls
  const toggleKeyboardControls = () => {
    setKeyboardControlsEnabled(!keyboardControlsEnabled)
  }

  // Sun information data
  const sunInfo = {
    name: "Sun",
    color: "#FDB813",
    description: "The star at the center of our Solar System, a nearly perfect sphere of hot plasma.",
    realDiameter: 1_392_700,
    realDistance: 0,
    orbitalPeriod: "225-250 million years around the Milky Way",
    dayLength: "25-35 Earth days (varies by latitude)",
    funFact: "The Sun contains 99.86% of the mass in the Solar System.",
    temperature: "5,500°C (surface), 15 million°C (core)",
    gravity: "274 m/s² (28× Earth)",
    atmosphere: "Hot plasma of hydrogen and helium",
    moons: "8 planets, dwarf planets, and billions of smaller objects",
    yearDiscovered: "Known to all human civilizations",
  }

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
            simulationSpeed={simulationSpeed / 25} // Chuyển đổi từ thang đo 1-100 sang thang đo cũ
            onClick={() => handlePlanetClick(planet)}
          />
        ))}
        <Stars radius={300} depth={50} count={5000} factor={4} saturation={1} fade speed={1.5} />
        <OrbitControls
          ref={orbitControlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={100}
        />
        {keyboardControlsEnabled && (
          <KeyboardControls simulationSpeed={simulationSpeed} onSpeedChange={handleSpeedChange} />
        )}
      </Canvas>

      {/* Planet Info Modal with Overlay */}
      {selectedPlanet && (
        <>
          {/* Overlay to close modal when clicking outside */}
          <div className="fixed inset-0 bg-transparent z-40" onClick={handleCloseInfo} />
          <div className="fixed top-4 right-4 z-50" onClick={(e) => e.stopPropagation()}>
            <PlanetInfo planet={selectedPlanet} onClose={handleCloseInfo} />
          </div>
        </>
      )}

      {/* Sun Info Modal with Overlay */}
      {showSunInfo && (
        <>
          {/* Overlay to close modal when clicking outside */}
          <div className="fixed inset-0 bg-transparent z-40" onClick={handleCloseInfo} />
          <div className="fixed top-4 right-4 z-50" onClick={(e) => e.stopPropagation()}>
            <PlanetInfo planet={sunInfo} onClose={handleCloseInfo} />
          </div>
        </>
      )}

      <SpeedControl speed={simulationSpeed} onSpeedChange={handleSpeedChange} />

      <div className="absolute bottom-4 left-4 text-white bg-black/80 p-2 rounded-md text-xs max-w-[180px]">
        <div className="flex flex-col space-y-1">
          <p>• Click objects for info</p>
          <p>• W/S - Rotate view up/down</p>
          <p>• A/D - Move left/right</p>
          <p>• Q/E - Speed control</p>
          <button
            onClick={toggleKeyboardControls}
            className="mt-1 px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 text-xs"
          >
            {keyboardControlsEnabled ? "Disable" : "Enable"} Keys
          </button>
        </div>
      </div>
    </div>
  )
}
