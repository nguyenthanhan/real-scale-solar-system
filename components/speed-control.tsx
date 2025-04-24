"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Pause, Play, FastForward, Rewind } from "lucide-react"

export function SpeedControl({ speed, onSpeedChange }) {
  const [isOpen, setIsOpen] = useState(true)

  const handleSpeedChange = (e) => {
    onSpeedChange(Number.parseFloat(e.target.value))
  }

  const setPresetSpeed = (value) => {
    onSpeedChange(value)
  }

  return (
    <motion.div
      className="absolute bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg backdrop-blur-sm border border-white/20 shadow-lg shadow-blue-500/10"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Simulation Speed</h3>
        <button onClick={() => setIsOpen(!isOpen)} className="text-xs text-white/70 hover:text-white">
          {isOpen ? "Hide" : "Show"}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPresetSpeed(0)}
              className={`p-1 rounded ${speed === 0 ? "bg-gray-700" : "hover:bg-gray-700"}`}
              aria-label="Pause simulation"
            >
              <Pause size={16} />
            </button>
            <button
              onClick={() => setPresetSpeed(0.5)}
              className={`p-1 rounded ${speed === 0.5 ? "bg-gray-700" : "hover:bg-gray-700"}`}
              aria-label="Slow speed"
            >
              <Rewind size={16} />
            </button>
            <button
              onClick={() => setPresetSpeed(1)}
              className={`p-1 rounded ${speed === 1 ? "bg-gray-700" : "hover:bg-gray-700"}`}
              aria-label="Normal speed"
            >
              <Play size={16} />
            </button>
            <button
              onClick={() => setPresetSpeed(2)}
              className={`p-1 rounded ${speed === 2 ? "bg-gray-700" : "hover:bg-gray-700"}`}
              aria-label="Fast speed"
            >
              <FastForward size={16} />
            </button>
            <div className="text-sm ml-2">{speed === 0 ? "Paused" : `${speed}x`}</div>
          </div>

          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={speed}
            onChange={handleSpeedChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}
    </motion.div>
  )
}
