"use client";

import { Canvas } from "@react-three/fiber";
import { SolarSystemProviders } from "@/features/solar-system/application/solar-system-providers";
import { useSolarSystemController } from "@/features/solar-system/application/useSolarSystemController";
import { SceneContent } from "@/features/solar-system/ui/scene-content";
import { SolarSystemOverlays } from "@/features/solar-system/ui/overlays";

function SolarSystemContent() {
  const controller = useSolarSystemController();

  return (
    <div className="w-full h-screen relative bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      <Canvas
        camera={{ position: [0, 2000, 4000], fov: 60, near: 0.1, far: 120000 }}
      >
        <SceneContent
          simulationSpeed={controller.simulationSpeed}
          simulationMode={controller.mode}
          selectedDate={controller.selectedDate}
          onSunClick={controller.handleSunClick}
          onPlanetClick={controller.handlePlanetClick}
          selectedPlanet={controller.selectedPlanet}
          showPlanetLabels={controller.showPlanetLabels}
          showOrbitPath={controller.showOrbitPath}
          showBeltRegions={controller.showBeltRegions}
        />
      </Canvas>

      <SolarSystemOverlays
        selectedPlanet={controller.selectedPlanet}
        mode={controller.mode}
        isDateMode={controller.isDateMode}
        selectedDate={controller.selectedDate}
        onCloseInfo={controller.handleCloseInfo}
        onModeToggle={controller.handleModeToggle}
        onDateChange={controller.setSelectedDate}
        simulationSpeed={controller.simulationSpeed}
        onSpeedChange={controller.setSimulationSpeed}
        controlModalVisible={controller.controlModalVisible}
        onToggleControlModalVisibility={controller.setControlModalVisible}
        showPlanetLabels={controller.showPlanetLabels}
        onTogglePlanetLabels={controller.setShowPlanetLabels}
        showOrbitPath={controller.showOrbitPath}
        onToggleOrbitPath={controller.setShowOrbitPath}
        showBeltRegions={controller.showBeltRegions}
        onToggleBeltRegions={controller.setShowBeltRegions}
        modalAutoRotate={controller.modalAutoRotate}
        onToggleModalAutoRotate={controller.setModalAutoRotate}
      />
    </div>
  );
}

export default function SolarSystem() {
  return (
    <SolarSystemProviders>
      <SolarSystemContent />
    </SolarSystemProviders>
  );
}
