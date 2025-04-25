"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere } from "@react-three/drei"

export function Sun({ onClick }) {
  const sunRef = useRef()
  const glowRef = useRef()

  useFrame(({ clock }) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001
    }

    if (glowRef.current) {
      // Subtle pulsing effect for the glow
      const pulse = Math.sin(clock.getElapsedTime() * 0.5) * 0.05 + 1
      glowRef.current.scale.set(pulse, pulse, pulse)
    }
  })

  const handleSunClick = (e) => {
    e.stopPropagation()
    if (onClick) onClick()
  }

  return (
    <group onClick={handleSunClick}>
      {/* Outer glow */}
      <Sphere ref={glowRef} args={[3.2, 30, 30]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ffff80" transparent opacity={0.1} />
      </Sphere>

      {/* Middle glow */}
      <Sphere args={[2.7, 30, 30]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ffff80" transparent opacity={0.2} />
      </Sphere>

      {/* Inner glow */}
      <Sphere args={[2.3, 30, 30]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#FFF5E0" transparent opacity={0.3} />
      </Sphere>

      {/* Sun core */}
      <Sphere ref={sunRef} args={[2, 30, 30]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#FDB813" emissive="#FDB813" emissiveIntensity={2} toneMapped={false} />
      </Sphere>

      {/* Light sources */}
      <pointLight position={[0, 0, 0]} intensity={2.5} distance={100} decay={2} />
      <pointLight position={[0, 0, 0]} intensity={1} distance={50} decay={1.5} />
    </group>
  )
}
