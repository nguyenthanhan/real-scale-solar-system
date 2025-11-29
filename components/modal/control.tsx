"use client";

import { useState, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Settings, X } from "lucide-react";

interface SpeedControlProps {
  simulationSpeed: number;
  onSpeedChange: (speed: number) => void;
  isVisible?: boolean;
  onToggleVisibility?: (visible: boolean) => void;
  showPlanetLabels?: boolean;
  onTogglePlanetLabels?: (show: boolean) => void;
  showOrbitPath?: boolean;
  onToggleOrbitPath?: (show: boolean) => void;
}

export function ControlModal({
  simulationSpeed,
  onSpeedChange,
  isVisible,
  onToggleVisibility,
  showPlanetLabels = true,
  onTogglePlanetLabels,
  showOrbitPath = true,
  onToggleOrbitPath,
}: SpeedControlProps) {
  const [internalPanelVisible, setInternalPanelVisible] = useState(
    isVisible ?? true
  );
  const isControlled =
    onToggleVisibility !== undefined && isVisible !== undefined;
  const isPanelVisible = isControlled ? isVisible : internalPanelVisible;

  const handleSpeedChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const parsedValue = Number.parseInt(rawValue);
    onSpeedChange(parsedValue);
  };

  // Calculate time conversion
  const getTimeConversion = (speed: number): string => {
    if (speed === 1) return "1s <-> 1s (real-time)";
    if (speed < 60) return `1s <-> ${speed} seconds`;
    if (speed < 3600) return `1s <-> ${(speed / 60).toFixed(1)} minutes`;
    if (speed < 86400) return `1s <-> ${(speed / 3600).toFixed(1)} hours`;
    if (speed < 31_536_000) return `1s <-> ${(speed / 86400).toFixed(1)} days`;
    return `1s <-> ${(speed / 31_536_000).toFixed(1)} years`;
  };

  // Calculate Earth orbit time display
  const getEarthOrbitTime = (speed: number): string => {
    // Guard against division by zero or NaN
    if (speed <= 0 || Number.isNaN(speed)) {
      return "N/A";
    }

    const earthOrbitDays = 365.25 / speed;

    if (earthOrbitDays >= 1) {
      return `${earthOrbitDays.toFixed(1)} days`;
    } else if (earthOrbitDays >= 1 / 24) {
      return `${(earthOrbitDays * 24).toFixed(1)} hours`;
    } else if (earthOrbitDays >= 1 / 1440) {
      return `${(earthOrbitDays * 1440).toFixed(1)} minutes`;
    } else {
      return `${(earthOrbitDays * 86400).toFixed(1)} seconds`;
    }
  };

  // Toggle the entire panel visibility
  const togglePanel = () => {
    const newVisibility = !isPanelVisible;
    if (isControlled) {
      onToggleVisibility(newVisibility);
    } else {
      setInternalPanelVisible(newVisibility);
    }
  };

  return (
    <>
      {isPanelVisible ? (
        <motion.div
          className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg backdrop-blur-sm border border-white/20 shadow-lg shadow-blue-500/10 z-[9999] w-96"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium">
              Speed ×{simulationSpeed.toLocaleString()}
            </h3>
            <button
              onClick={togglePanel}
              className="p-1 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Hide controls"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-2">
            {/* Slider */}
            <input
              type="range"
              min="1"
              max="10000000"
              step="1"
              value={simulationSpeed}
              onChange={handleSpeedChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />

            {/* Time conversion info - compact */}
            <div className="text-[10px] text-gray-400 flex justify-between">
              <span>{getTimeConversion(simulationSpeed)}</span>
              <span>Earth: {getEarthOrbitTime(simulationSpeed)}</span>
            </div>

            {/* Toggles in one row */}
            {(onTogglePlanetLabels || onToggleOrbitPath) && (
              <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                {onTogglePlanetLabels && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">Labels</span>
                    <button
                      onClick={() => onTogglePlanetLabels(!showPlanetLabels)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onTogglePlanetLabels(!showPlanetLabels);
                        }
                      }}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        showPlanetLabels ? "bg-blue-600" : "bg-gray-600"
                      }`}
                      aria-label="Toggle planet labels"
                      aria-pressed={showPlanetLabels}
                      role="switch"
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          showPlanetLabels ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                )}

                {onToggleOrbitPath && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">Orbits</span>
                    <button
                      onClick={() => onToggleOrbitPath(!showOrbitPath)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onToggleOrbitPath(!showOrbitPath);
                        }
                      }}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        showOrbitPath ? "bg-blue-600" : "bg-gray-600"
                      }`}
                      aria-label="Toggle orbit path"
                      aria-pressed={showOrbitPath}
                      role="switch"
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          showOrbitPath ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.button
          className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded-full backdrop-blur-sm border border-white/20 shadow-lg shadow-blue-500/10 hover:bg-gray-800 z-[9999]"
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
