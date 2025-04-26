"use client";

import { useState } from "react";

interface SpeedControlProps {
  simulationSpeed: number;
  onSpeedChange: (speed: number) => void;
}

export function ControlModal({
  simulationSpeed,
  onSpeedChange,
}: SpeedControlProps) {
  const [inputValue, setInputValue] = useState<string>(
    simulationSpeed.toString()
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleInputBlur = () => {
    const speed = parseFloat(inputValue);
    if (!isNaN(speed)) {
      onSpeedChange(speed);
    }
    setInputValue(simulationSpeed.toString());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const input = e.target as HTMLInputElement;
      input.blur();
    }
  };

  return (
    <div className="absolute top-4 right-4 bg-black/70 p-3 rounded-lg text-white space-y-3 backdrop-blur-sm border border-white/10">
      <div>
        <label className="block mb-1 text-xs opacity-90">
          Simulation Speed (×)
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="range"
            min="1"
            max="10000"
            step="100"
            value={simulationSpeed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-36 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="w-16 px-1 py-0.5 bg-gray-800 border border-gray-600 rounded text-xs"
            aria-label="Simulation speed multiplier"
          />
        </div>
      </div>

      <div>
        <p className="text-xs opacity-80">
          Using realistic planetary size and distance ratios
        </p>
      </div>
    </div>
  );
}
