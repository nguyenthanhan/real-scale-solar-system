"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { PlanetData } from "@/data/planet-types";
import { Planet3DModel } from "@/components/modal/planet-3d-model";
import { useSimulationSpeed } from "@/contexts/rotation-speed-context";
import { usePlanetAPIData } from "@/hooks/usePlanetAPIData";

interface PlanetInfoProps {
  planet: PlanetData;
  onClose: () => void;
}

export function PlanetInfo({ planet, onClose }: PlanetInfoProps) {
  const { simulationSpeed } = useSimulationSpeed();
  const [show3DModel, setShow3DModel] = useState(false);

  // Fetch API data using the hook
  const { mergedData, isLoading } = usePlanetAPIData(planet?.name, planet);

  if (!planet) return null;

  useEffect(() => {
    // Delay 3D model render for smooth animation
    setShow3DModel(false);
    const timer = setTimeout(() => {
      setShow3DModel(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [planet?.name]);

  // Helper to display API data with fallback to local data
  const displayValue = (
    apiValue: string | undefined,
    localValue: string | undefined
  ) => {
    if (apiValue) return apiValue;
    return localValue || "N/A";
  };

  return (
    <motion.div
      className="bg-black/90 text-white p-6 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{planet.name}</h2>
          {isLoading && (
            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Close planet information"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 3D Planet Model - Left Side */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="aspect-square bg-black/50 rounded-lg overflow-hidden">
            {show3DModel ? (
              <Planet3DModel
                planet={planet}
                size={60}
                simulationSpeed={simulationSpeed}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white/50 text-sm">Loading model...</div>
              </div>
            )}
          </div>
        </div>

        {/* Text Information - Right Side */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start">
            <div
              className="w-3 h-3 rounded-full mr-2 mt-1 flex-shrink-0"
              style={{ backgroundColor: planet.color }}
            />
            <p className="text-sm opacity-80">{planet.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <p className="text-xs opacity-70">Diameter</p>
              <p className="text-sm">
                {planet.diameterInKm?.toLocaleString() || "N/A"} km
              </p>
            </div>
            <div>
              <p className="text-xs opacity-70">Distance from Sun</p>
              <p className="text-sm">
                {(planet.distanceInKm / 1_000_000).toFixed(1)} million km
              </p>
            </div>
            <div>
              <p className="text-xs opacity-70">Orbital Period</p>
              <p className="text-sm">
                {displayValue(
                  mergedData.apiOrbitalPeriod,
                  planet.orbitalPeriod
                )}
              </p>
            </div>
            <div>
              <p className="text-xs opacity-70">Day Length</p>
              <p className="text-sm">
                {displayValue(mergedData.apiRotationPeriod, planet.dayLength)}
              </p>
            </div>
            <div>
              <p className="text-xs opacity-70">Temperature</p>
              <p className="text-sm">
                {displayValue(mergedData.apiTemperature, planet.temperature)}
              </p>
            </div>
            <div>
              <p className="text-xs opacity-70">Gravity</p>
              <p className="text-sm">
                {displayValue(mergedData.apiGravity, planet.gravity)}
              </p>
            </div>
            <div>
              <p className="text-xs opacity-70">Atmosphere</p>
              <p className="text-sm">{planet.atmosphere || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Moons</p>
              <p className="text-sm">
                {displayValue(mergedData.apiMoonCount, planet.moons)}
              </p>
            </div>
            <div>
              <p className="text-xs opacity-70">Axial Tilt</p>
              <p className="text-sm">
                {planet.axialTilt?.toFixed(1) || "N/A"}°
              </p>
            </div>
            <div>
              <p className="text-xs opacity-70">Rotation</p>
              <p className="text-sm">
                {planet.rotationSpeedByDays < 0 ? "Retrograde" : "Prograde"} •{" "}
                {Math.abs(planet.rotationSpeedByDays).toFixed(2)} days
              </p>
            </div>

            {/* API-only fields */}
            {mergedData.apiMass && (
              <div>
                <p className="text-xs opacity-70">Mass</p>
                <p className="text-sm">{mergedData.apiMass}</p>
              </div>
            )}
            {mergedData.apiDensity && (
              <div>
                <p className="text-xs opacity-70">Density</p>
                <p className="text-sm">{mergedData.apiDensity}</p>
              </div>
            )}
          </div>

          {/* Fun Fact Section */}
          <motion.div
            className="mt-4 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.15 }}
          >
            <p className="text-xs opacity-70">Fun Fact</p>
            <p className="text-sm">{planet.funFact || "N/A"}</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
