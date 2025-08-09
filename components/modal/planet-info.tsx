"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { PlanetData } from "@/data/planet-types";
import { Planet3DModel } from "@/components/modal/planet-3d-model";
import { useRotationSpeed } from "@/contexts/rotation-speed-context";

export function PlanetInfo({
  planet,
  onClose,
}: {
  planet: PlanetData;
  onClose: () => void;
}) {
  const { rotationSpeedMinutes, setRotationSpeedMinutes } = useRotationSpeed();
  const [show3DModel, setShow3DModel] = useState(false);

  if (!planet) return null;

  useEffect(() => {
    // Delay 3D model loading per planet to prevent lag and show placeholder
    setShow3DModel(false);
    const timer = setTimeout(() => {
      setShow3DModel(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [planet?.name]);

  return (
    <motion.div
      className="bg-black/80 text-white p-4 rounded-lg w-full max-w-[900px] mx-auto backdrop-blur-sm border border-white/20 shadow-lg shadow-blue-500/10"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{planet.name}</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Close planet information"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 min-h-[450px]">
        {/* 3D Planet Model - Left Side */}
        <div className="w-full lg:w-[400px] flex flex-col">
          <div className="flex-1 rounded-lg overflow-hidden bg-black/20 min-h-[300px] lg:min-h-0">
            {show3DModel ? (
              <Planet3DModel
                planet={planet}
                size={60}
                rotationSpeedMinutes={rotationSpeedMinutes}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white/50 text-sm">Loading...</div>
              </div>
            )}
          </div>
        </div>

        {/* Text Information - Right Side */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start">
            <div
              className="w-4 h-4 rounded-full mt-1 mr-2 flex-shrink-0"
              style={{ backgroundColor: planet.color }}
            />
            <p className="text-sm opacity-80">{planet.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
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
              <p className="text-sm">{planet.orbitalPeriod || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Day Length</p>
              <p className="text-sm">{planet.dayLength || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Temperature</p>
              <p className="text-sm">{planet.temperature || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Gravity</p>
              <p className="text-sm">{planet.gravity || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Atmosphere</p>
              <p className="text-sm">{planet.atmosphere || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Moons</p>
              <p className="text-sm">{planet.moons || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Discovered</p>
              <p className="text-sm">{planet.yearDiscovered || "N/A"}</p>
            </div>
          </div>

          <motion.div
            className="mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.15 }}
          >
            <p className="text-xs opacity-70">Fun Fact</p>
            <p className="text-sm">{planet.funFact || "N/A"}</p>
          </motion.div>

          {/* Rotation Information */}
          <div className="mt-4 space-y-2">
            <div>
              <p className="text-xs opacity-70">Rotation</p>
              <p className="text-sm">
                {planet.rotationSpeedByDays < 0 ? "Retrograde" : "Prograde"} •{" "}
                {planet.dayLength}
              </p>
            </div>
            <div>
              <p className="text-xs opacity-70">Axial Tilt</p>
              <p className="text-sm">
                {planet.axialTilt?.toFixed(1) || "N/A"}°
              </p>
            </div>
            <div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-xs opacity-70">Rotation Speed</p>
                  <span className="text-sm">
                    1s &lt;-&gt; {rotationSpeedMinutes}m
                  </span>
                </div>
                <div className="col-span-2 space-y-2">
                  <input
                    type="range"
                    min="0.5"
                    max="720"
                    step="0.5"
                    value={rotationSpeedMinutes}
                    onChange={(e) =>
                      setRotationSpeedMinutes(Number(e.target.value))
                    }
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>30s</span>
                    <span>12 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
