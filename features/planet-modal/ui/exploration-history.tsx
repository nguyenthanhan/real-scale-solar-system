"use client";

import { Rocket } from "lucide-react";
import { ExplorationHistory as ExplorationHistoryType } from "@/data/planet-types";

interface ExplorationHistoryProps {
  explorationHistory: ExplorationHistoryType | undefined;
}

export function ExplorationHistory({
  explorationHistory,
}: ExplorationHistoryProps) {
  // Don't render if no exploration history data
  if (!explorationHistory) {
    return null;
  }

  const { firstFlyby, firstOrbiter, firstLander, notableMissions } =
    explorationHistory;

  // Don't render if all fields are empty
  const hasData =
    firstFlyby ||
    firstOrbiter ||
    firstLander ||
    (notableMissions && notableMissions.length > 0);
  if (!hasData) {
    return null;
  }

  return (
    <div className="space-y-2">
      {/* Milestones */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {firstFlyby && (
          <div className="bg-white/5 rounded-lg p-2">
            <p className="text-xs text-white/50">First Flyby</p>
            <p className="text-sm text-white/90">{firstFlyby}</p>
          </div>
        )}
        {firstOrbiter && (
          <div className="bg-white/5 rounded-lg p-2">
            <p className="text-xs text-white/50">First Orbiter</p>
            <p className="text-sm text-white/90">{firstOrbiter}</p>
          </div>
        )}
        {firstLander && (
          <div className="bg-white/5 rounded-lg p-2">
            <p className="text-xs text-white/50">First Lander</p>
            <p className="text-sm text-white/90">{firstLander}</p>
          </div>
        )}
      </div>

      {/* Notable Missions */}
      {notableMissions && notableMissions.length > 0 && (
        <div>
          <p className="text-xs text-white/50 mb-1">Notable Missions</p>
          <div className="flex flex-wrap gap-1.5">
            {notableMissions.map((mission, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full"
              >
                <Rocket size={10} />
                {mission}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
