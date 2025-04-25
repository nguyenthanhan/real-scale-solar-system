"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Pause, Play, FastForward, Rewind, Settings } from "lucide-react"

export function SpeedControl({ speed, onSpeedChange }) {
  const [isPanelVisible, setIsPanelVisible] = useState(true)

  const handleSpeedChange = (e) => {
    onSpeedChange(Number.parseFloat(e.target.value))
  }

  const setPresetSpeed = (value) => {
    onSpeedChange(value)
  }

  // Toggle the entire panel visibility
  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible)
  }

  return (
    <>
      {isPanelVisible ? (
        <motion.div
          className="absolute bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg backdrop-blur-sm border border-white/20 shadow-lg shadow-blue-500/10 z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Simulation Speed</h3>
            <button onClick={togglePanel} className="text-xs text-white/70 hover:text-white">
              Hide
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPresetSpeed(0)}
                  className={`p-1 rounded ${speed === 0 ? "bg-gray-700" : "hover:bg-gray-700"}`}
                  aria-label="Pause simulation"
                  title="Pause"
                >
                  <Pause size={16} />
                </button>
                <button
                  onClick={() => setPresetSpeed(0.5)}
                  className={`p-1 rounded ${speed === 0.5 ? "bg-gray-700" : "hover:bg-gray-700"}`}
                  aria-label="Slow speed"
                  title="0.5x Speed"
                >
                  <Rewind size={16} />
                </button>
                <button
                  onClick={() => setPresetSpeed(1)}
                  className={`p-1 rounded ${speed === 1 ? "bg-gray-700" : "hover:bg-gray-700"}`}
                  aria-label="Normal speed"
                  title="1x Speed"
                >
                  <Play size={16} />
                </button>
                <button
                  onClick={() => setPresetSpeed(2)}
                  className={`p-1 rounded ${speed === 2 ? "bg-gray-700" : "hover:bg-gray-700"}`}
                  aria-label="Fast speed"
                  title="2x Speed"
                >
                  <FastForward size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={speed}
                onChange={handleSpeedChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-sm min-w-[40px] text-right">{speed === 0 ? "Paused" : `${speed}x`}</div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.button
          className="absolute bottom-4 right-4 bg-black/80 text-white p-2 rounded-full backdrop-blur-sm border border-white/20 shadow-lg shadow-blue-500/10 hover:bg-gray-800 z-10"
          onClick={togglePanel}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          title="Show speed controls"
        >
          <Settings size={20} />
        </motion.button>
      )}
    </>
  )
}
