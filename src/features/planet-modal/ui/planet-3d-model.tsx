"use client";

import {
  useRef,
  useMemo,
  useEffect,
  useState,
  useCallback,
  type ElementRef,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls } from "@react-three/drei";
import { Mesh } from "three";
import { PlanetData } from "@/data/planet-types";
import { usePlanetMaterial } from "@/features/planet-rendering/application/usePlanetMaterial";
import { PlanetRings } from "@/features/planet-rendering/ui/planet/planet-rings";
import { AtmosphericGlow } from "@/features/planet-modal/ui/atmospheric-glow";
import { calculateAdjustedPlanetSize } from "@/features/planet-rendering/domain/rotation-calculations";

interface Planet3DModelProps {
  planet: PlanetData;
  size?: number;
  simulationSpeed?: number;
  autoRotate?: boolean;
  onAutoRotateChange?: (enabled: boolean) => void;
}

// Component that goes inside the Canvas (can use useFrame)
function PlanetMesh({
  planet,
  size,
  simulationSpeed = 1_000_000,
  autoRotate = true,
}: Planet3DModelProps) {
  const planetRef = useRef<Mesh | null>(null);
  const planetMaterial = usePlanetMaterial(planet);

  // Calculate rotation based on simulation speed
  // Convert simulation speed to rotation multiplier
  const rotationMultiplier = useMemo(() => {
    if (!autoRotate) return 0; // Disable auto-rotation when user wants manual control

    const period = Math.abs(planet.rotationSpeedByDays);
    if (period === 0) return 0;

    // Use simulation speed directly for rotation
    const baseRotation = (2 * Math.PI) / (period * 86400); // radians per second in real time
    const speedMultiplier = simulationSpeed * baseRotation;

    return speedMultiplier * (planet.rotationSpeedByDays < 0 ? -1 : 1);
  }, [planet.rotationSpeedByDays, simulationSpeed, autoRotate]);

  // Optimized rotation animation using useFrame
  useFrame((_, delta) => {
    if (planetRef.current && rotationMultiplier !== 0) {
      // Rotate around Y-axis (vertical axis) with pre-calculated multiplier
      planetRef.current.rotation.y += rotationMultiplier * delta;
    }
  });

  // Reset rotation when planet changes
  useEffect(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y = 0;
      planetRef.current.rotation.x = 0;
      planetRef.current.rotation.z = 0;
    }
  }, [planet.name]);

  // Optimized planet size calculation using utility function
  const planetSize = useMemo(
    () => calculateAdjustedPlanetSize(planet.name, size ?? 0),
    [planet.name, size],
  );

  return (
    <group>
      {/* Atmospheric glow */}
      <AtmosphericGlow planetSize={planetSize} planetName={planet.name} />

      {/* Main planet sphere */}
      <Sphere ref={planetRef} args={[planetSize, 64, 64]} position={[0, 0, 0]}>
        <primitive object={planetMaterial} attach="material" />
      </Sphere>

      {/* Planet rings */}
      {planet.hasRings && (
        <PlanetRings
          scaledSize={planetSize}
          ringColor={planet.ringColor}
          ringTilt={planet.ringTilt}
          axialTilt={planet.axialTilt}
        />
      )}
    </group>
  );
}

// Main component that contains the Canvas
function Planet3DModel({
  planet,
  size = 80,
  simulationSpeed = 1_000_000,
  autoRotate = true,
  onAutoRotateChange,
}: Planet3DModelProps) {
  const controlsRef = useRef<ElementRef<typeof OrbitControls> | null>(null);
  const [isViewModified, setIsViewModified] = useState(false);

  const defaultCameraPosition: [number, number, number] = planet.hasRings
    ? [0, 0, 350]
    : [0, 0, 300];
  const defaultFov = planet.hasRings ? 25 : 30;

  const handleResetView = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      setIsViewModified(false);
    }
  }, []);

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-2">
        <div className="flex items-center gap-2 rounded-md bg-black/65 px-3 py-2 text-xs text-white backdrop-blur">
          <span className="opacity-80">Auto rotate</span>
          <button
            type="button"
            onClick={() => {
              const nextAutoRotate = !autoRotate;
              if (nextAutoRotate) {
                setIsViewModified(false);
              }
              onAutoRotateChange?.(nextAutoRotate);
            }}
            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
              autoRotate ? "bg-blue-600" : "bg-gray-600"
            }`}
            aria-label={`Turn auto rotate ${autoRotate ? "off" : "on"}`}
            aria-pressed={autoRotate}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                autoRotate ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
          <span className="opacity-90">{autoRotate ? "On" : "Off"}</span>
        </div>

        {!autoRotate && isViewModified && (
          <button
            type="button"
            onClick={handleResetView}
            className="rounded-md border border-blue-400/50 bg-blue-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-black/40 transition hover:bg-blue-800"
            style={{ animation: "pulse 1.8s ease-in-out infinite" }}
            aria-label="Reset 3D model view"
          >
            Reset view
          </button>
        )}
      </div>

      {!autoRotate && (
        <div className="absolute bottom-3 left-3 z-20 rounded-md bg-black/65 px-3 py-1.5 text-xs text-white/90 backdrop-blur">
          Drag to rotate • Scroll/pinch to zoom
        </div>
      )}

      <Canvas
        camera={{
          position: defaultCameraPosition,
          fov: defaultFov,
        }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <directionalLight position={[-10, -10, -5]} intensity={0.6} />
        <pointLight position={[0, 0, 100]} intensity={0.3} />

        <PlanetMesh
          planet={planet}
          size={size}
          simulationSpeed={simulationSpeed}
          autoRotate={autoRotate}
        />

        <OrbitControls
          ref={controlsRef}
          enableRotate={!autoRotate}
          enableZoom={!autoRotate}
          enablePan={false}
          minDistance={150}
          maxDistance={500}
          rotateSpeed={0.65}
          zoomSpeed={0.8}
          enableDamping
          dampingFactor={0.08}
          onStart={() => setIsViewModified(true)}
        />
      </Canvas>
    </div>
  );
}

export { Planet3DModel };
