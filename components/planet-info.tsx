"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";

export function PlanetInfo({ planet, onClose }) {
  if (!planet) return null;

  return (
    <motion.div
      className="bg-black/80 text-white p-4 rounded-lg w-96 backdrop-blur-sm border border-white/20 shadow-lg shadow-blue-500/10 max-h-[90vh] overflow-y-auto"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">{planet.name}</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Close planet information"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-start">
          <div
            className="w-4 h-4 rounded-full mt-1 mr-2 flex-shrink-0"
            style={{ backgroundColor: planet.color }}
          />
          <p className="text-sm opacity-80">{planet.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <p className="text-xs opacity-70">Diameter</p>
            <p className="text-sm">
              {planet.realDiameter?.toLocaleString() || "N/A"} km
            </p>
          </div>
          <div>
            <p className="text-xs opacity-70">Distance from Sun</p>
            <p className="text-sm">
              {planet.realDistance?.toLocaleString() || "N/A"} million km
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
          transition={{ delay: 0.2 }}
        >
          <p className="text-xs opacity-70">Fun Fact</p>
          <p className="text-sm">{planet.funFact || "N/A"}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
