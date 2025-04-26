"use client";

import { useState, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";

interface SpeedControlProps {
  simulationSpeed: number;
  onSpeedChange: (speed: number) => void;
}

export function ControlModal({
  simulationSpeed,
  onSpeedChange,
}: SpeedControlProps) {
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  const handleSpeedChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSpeedChange(Number.parseInt(e.target.value));
  };

  // Toggle the entire panel visibility
  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  return (
    <>
      {isPanelVisible ? (
        <motion.div
          className="absolute bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg backdrop-blur-sm border border-white/20 shadow-lg shadow-blue-500/10 z-10 w-96"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onDoubleClick={togglePanel}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">
              Simulation Speed (×{simulationSpeed.toLocaleString()})
            </h3>
            <button
              onClick={togglePanel}
              className="text-xs text-white/70 hover:text-white"
            >
              Hide
            </button>
          </div>

          <div className="space-y-4">
            {/* Slider with wider width */}
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="1"
                max="100000"
                step="100"
                value={simulationSpeed}
                onChange={handleSpeedChange}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-sm min-w-[90px] text-right">
                ×{simulationSpeed.toLocaleString()}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Real-time (×1)</span>
              <span>Fast (×100,000)</span>
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
  );
}
