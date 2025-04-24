"use client"

import { X } from "lucide-react"
import { motion } from "framer-motion"

export function PlanetInfo({ planet, onClose }) {
  if (!planet) return null

  return (
    <div className="absolute top-4 right-4 bg-black/80 text-white p-4 rounded-lg w-80 backdrop-blur-sm border border-white/20 shadow-lg shadow-blue-500/10 z-10">
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

      <div className="space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: planet.color }} />
          <p className="text-sm opacity-80">{planet.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div>
            <p className="text-xs opacity-70">Diameter</p>
            <p className="text-sm">{planet.realDiameter.toLocaleString()} km</p>
          </div>
          <div>
            <p className="text-xs opacity-70">Distance from Sun</p>
            <p className="text-sm">{planet.realDistance.toLocaleString()} million km</p>
          </div>
          <div>
            <p className="text-xs opacity-70">Orbital Period</p>
            <p className="text-sm">{planet.orbitalPeriod}</p>
          </div>
          <div>
            <p className="text-xs opacity-70">Day Length</p>
            <p className="text-sm">{planet.dayLength}</p>
          </div>
        </div>

        <motion.div className="mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <p className="text-xs opacity-70">Fun Fact</p>
          <p className="text-sm">{planet.funFact}</p>
        </motion.div>
      </div>
    </div>
  )
}
