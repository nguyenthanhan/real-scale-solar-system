"use client"

import { useRef, useState, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, Ring, Html } from "@react-three/drei"
import * as THREE from "three"

export function Planet({ planet, simulationSpeed, onClick }) {
  const planetRef = useRef()
  const orbitRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Create elliptical orbit path once
  const orbitCurve = useMemo(() => {
    return new THREE.EllipseCurve(
      0,
      0, // Center x, y
      planet.distance,
      planet.distance * 0.95, // xRadius, yRadius
      0,
      2 * Math.PI, // Start angle, end angle
      false, // Clockwise
      0, // Rotation
    )
  }, [planet.distance])

  // Calculate the position based on time and simulation speed
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()

    // Calculate the position on the orbit
    if (orbitRef.current) {
      // When simulationSpeed = 0, planet will pause
      if (simulationSpeed === 0) {
        // Keep current position
      } else {
        // Calculate angle based on time and speed
        const angle = (elapsedTime / planet.orbitSpeed) * simulationSpeed

        // Get position on the elliptical curve
        const position = orbitCurve.getPoint((angle / (2 * Math.PI)) % 1)

        // Update planet position directly instead of rotating the group
        orbitRef.current.position.x = position.x
        orbitRef.current.position.z = position.y // y from curve maps to z in 3D
      }
    }

    // Update planet rotation around its axis
    if (planetRef.current) {
      // When simulationSpeed = 0, planet still rotates slowly
      const rotationSpeed = simulationSpeed === 0 ? 0.1 : simulationSpeed
      planetRef.current.rotation.y += (0.01 / planet.rotationSpeed) * rotationSpeed
    }
  })

  // Create orbit path visualization
  const orbitPath = useMemo(() => {
    const points = orbitCurve.getPoints(100)
    const geometry = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(p.x, 0, p.y)))

    return (
      <line geometry={geometry}>
        <lineBasicMaterial attach="material" color="#666666" opacity={0.5} transparent />
      </line>
    )
  }, [orbitCurve])

  return (
    <>
      {/* Orbit path */}
      {orbitPath}

      {/* Planet group */}
      <group ref={orbitRef} position={[planet.distance, 0, 0]}>
        {/* Planet */}
        <Sphere
          ref={planetRef}
          args={[planet.size, 32, 32]}
          onClick={(e) => {
            e.stopPropagation()
            onClick(planet)
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={planet.color}
            metalness={0.1}
            roughness={0.6}
            emissive={planet.color}
            emissiveIntensity={0.05}
          />
        </Sphere>

        {/* Rings for Saturn and Uranus */}
        {planet.hasRings && (
          <>
            <Ring args={[planet.size * 1.4, planet.size * 2.2, 64]} rotation={[Math.PI / 2, planet.ringTilt || 0, 0]}>
              <meshStandardMaterial
                color={planet.ringColor || "#CDCDCD"}
                side={THREE.DoubleSide}
                transparent
                opacity={0.8}
                metalness={0.3}
                roughness={0.7}
              />
            </Ring>
          </>
        )}

        {/* Hover label */}
        {hovered && (
          <Html distanceFactor={10}>
            <div className="bg-black/70 text-white px-2 py-1 rounded text-sm whitespace-nowrap">{planet.name}</div>
          </Html>
        )}
      </group>
    </>
  )
}
