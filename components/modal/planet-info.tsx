"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Info, Star, Rocket, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { PlanetData } from "@/data/planet-types";
import { Planet3DModel } from "@/components/modal/planet-3d-model";
import { InfoSection } from "@/components/modal/info-section";
import { NotableFeatures } from "@/components/modal/notable-features";
import { ExplorationHistory } from "@/components/modal/exploration-history";
import { useSimulationSpeed } from "@/contexts/rotation-speed-context";
import { usePlanetAPIData } from "@/hooks/usePlanetAPIData";

interface PlanetInfoProps {
  planet: PlanetData;
  onClose: () => void;
}

export function PlanetInfo({ planet, onClose }: PlanetInfoProps) {
  const { simulationSpeed, modalAutoRotate } = useSimulationSpeed();
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
    localValue: string | undefined,
  ) => {
    if (apiValue) return apiValue;
    return localValue || "N/A";
  };

  return (
    <motion.div
      className="bg-black text-white w-full h-full flex flex-col lg:flex-row"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* 3D Planet Model - Left Side (full bleed on top, left, bottom) */}
      <div className="w-full lg:w-1/2 flex-shrink-0 min-h-[300px] sm:min-h-[350px] lg:h-full">
        <div className="w-full h-full">
          {show3DModel ? (
            <Planet3DModel
              planet={planet}
              size={60}
              simulationSpeed={simulationSpeed}
              autoRotate={modalAutoRotate}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-white/50 text-sm">Loading model...</div>
            </div>
          )}
        </div>
      </div>

      {/* Text Information - Right Side (with padding) */}
      <div className="w-full lg:w-1/2 flex flex-col p-4 sm:p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
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

        <div className="flex-1 space-y-3 overflow-y-auto min-h-0 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <div className="flex items-start">
            <div
              className="w-3 h-3 rounded-full mr-2 mt-1 flex-shrink-0"
              style={{ backgroundColor: planet.color }}
            />
            <p className="text-sm opacity-80">{planet.description}</p>
          </div>

          {/* Basic Info Section */}
          <InfoSection title="Basic Information" icon={<Info size={14} />}>
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
                    planet.orbitalPeriod,
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
          </InfoSection>

          {/* Notable Features Section - Conditional */}
          {planet.notableFeatures && planet.notableFeatures.length > 0 && (
            <InfoSection title="Notable Features" icon={<Star size={14} />}>
              <NotableFeatures features={planet.notableFeatures} />
            </InfoSection>
          )}

          {/* Exploration History Section - Conditional */}
          {planet.explorationHistory && (
            <InfoSection
              title="Exploration History"
              icon={<Rocket size={14} />}
            >
              <ExplorationHistory
                explorationHistory={planet.explorationHistory}
              />
            </InfoSection>
          )}

          {/* Fun Fact Section */}
          {planet.funFact && (
            <InfoSection title="Fun Fact" icon={<Lightbulb size={14} />}>
              <motion.p
                className="text-sm text-white/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.15 }}
              >
                {planet.funFact}
              </motion.p>
            </InfoSection>
          )}
        </div>
      </div>
    </motion.div>
  );
}
