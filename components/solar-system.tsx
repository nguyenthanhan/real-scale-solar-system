"use client"

import { useState, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import { motion } from "framer-motion"
import { Sun } from "@/components/sun"
import { Planet } from "@/components/planet"
import { PlanetInfo } from "@/components/planet-info"
import { SpeedControl } from "@/components/speed-control"
import { planetData } from "@/lib/planet-data"

export default function SolarSystem() {
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [simulationSpeed, setSimulationSpeed] = useState(1)
  const orbitControlsRef = useRef()

  const handlePlanetClick = (planet) => {
    setSelectedPlanet(planet)
  }

  const handleCloseInfo = () => {
    setSelectedPlanet(null)
  }

  const handleSpeedChange = (speed) => {
    // Ensure speed is a valid number and within range
    let validSpeed = isNaN(speed) ? 0 : speed
    validSpeed = Math.max(0, Math.min(2, validSpeed)) // Clamp between 0 and 2
    setSimulationSpeed(validSpeed)
  }

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      <Canvas camera={{ position: [0, 25, 25], fov: 60 }}>
        <color attach="background" args={["#000"]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 10, 5]} intensity={0.5} />
        <Sun />
        {planetData.map((planet) => (
          <Planet
            key={planet.name}
            planet={planet}
            simulationSpeed={simulationSpeed}
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
      </Canvas>

      {selectedPlanet && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <PlanetInfo planet={selectedPlanet} onClose={handleCloseInfo} />
        </motion.div>
      )}

      <SpeedControl speed={simulationSpeed} onSpeedChange={handleSpeedChange} />

      <div className="absolute bottom-4 left-4 text-white bg-black/50 p-2 rounded-md text-sm">
        <p>Click on a planet to view details</p>
        <p>Use mouse to rotate, zoom and pan</p>
        <p>Adjust the speed slider to control orbital speeds</p>
      </div>
    </div>
  )
}
