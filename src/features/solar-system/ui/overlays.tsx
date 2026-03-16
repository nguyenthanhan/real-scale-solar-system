import { PlanetData } from "@/data/planet-types";
import { DatePicker } from "@/features/date-mode/ui/date-picker";
import { ControlModal } from "@/features/planet-modal/ui/control";
import { ModalOverlay } from "@/features/planet-modal/ui/modal-overlay";
import { ModeToggleButton } from "@/features/simulation-control/ui/mode-toggle-button";
import { GitHubButton } from "@/components/button/github-button";
import { MemoryMonitor } from "@/components/debug/memory-monitor";
import type { SimulationMode } from "@/features/simulation-control/state/simulation-mode-context";

type SolarSystemOverlaysProps = {
  selectedPlanet: PlanetData | null;
  mode: SimulationMode;
  isDateMode: boolean;
  selectedDate: Date;
  onCloseInfo: () => void;
  onModeToggle: () => void;
  onDateChange: (date: Date) => void;
  simulationSpeed: number;
  onSpeedChange: (speed: number) => void;
  controlModalVisible: boolean;
  onToggleControlModalVisibility: (visible: boolean) => void;
  showPlanetLabels: boolean;
  onTogglePlanetLabels: (show: boolean) => void;
  showOrbitPath: boolean;
  onToggleOrbitPath: (show: boolean) => void;
  showBeltRegions: boolean;
  onToggleBeltRegions: (show: boolean) => void;
  modalAutoRotate: boolean;
  onToggleModalAutoRotate: (autoRotate: boolean) => void;
};

export function SolarSystemOverlays({
  selectedPlanet,
  mode,
  isDateMode,
  selectedDate,
  onCloseInfo,
  onModeToggle,
  onDateChange,
  simulationSpeed,
  onSpeedChange,
  controlModalVisible,
  onToggleControlModalVisibility,
  showPlanetLabels,
  onTogglePlanetLabels,
  showOrbitPath,
  onToggleOrbitPath,
  showBeltRegions,
  onToggleBeltRegions,
  modalAutoRotate,
  onToggleModalAutoRotate,
}: SolarSystemOverlaysProps) {
  return (
    <>
      <ModalOverlay planet={selectedPlanet} onClose={onCloseInfo} />

      {!selectedPlanet && (
        <div className="absolute top-4 left-4 z-buttons">
          <ModeToggleButton mode={mode} onToggle={onModeToggle} />
        </div>
      )}

      {isDateMode && !selectedPlanet && (
        <div
          className="absolute top-16 left-4 z-controls animate-in fade-in duration-500"
          style={{ animation: "fadeIn 500ms ease-in-out" }}
        >
          <DatePicker selectedDate={selectedDate} onDateChange={onDateChange} />
        </div>
      )}

      <ControlModal
        simulationSpeed={simulationSpeed}
        onSpeedChange={onSpeedChange}
        isVisible={controlModalVisible}
        onToggleVisibility={onToggleControlModalVisibility}
        showPlanetLabels={showPlanetLabels}
        onTogglePlanetLabels={onTogglePlanetLabels}
        showOrbitPath={showOrbitPath}
        onToggleOrbitPath={onToggleOrbitPath}
        showBeltRegions={showBeltRegions}
        onToggleBeltRegions={onToggleBeltRegions}
        disabled={isDateMode}
        modalAutoRotate={modalAutoRotate}
        onToggleModalAutoRotate={onToggleModalAutoRotate}
        isPlanetModalOpen={selectedPlanet !== null}
      />

      {!selectedPlanet && (
        <div className="absolute bottom-4 left-4 text-white bg-black/80 p-2 rounded-md text-xs max-w-[180px]">
          <div className="flex flex-col space-y-1">
            <p>• Click objects for info</p>
          </div>
        </div>
      )}

      {!selectedPlanet && <GitHubButton />}
      {process.env.NODE_ENV === "development" && <MemoryMonitor />}
    </>
  );
}
