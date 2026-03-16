import { OrbitControls, Stars } from "@react-three/drei";
import { PlanetData } from "@/data/planet-types";
import { planetData } from "@/data/planet-data";
import { BeltRegions } from "@/features/belt-regions/ui/index";
import { Planet } from "@/features/planet-rendering/ui/planet/index";
import { Sun } from "@/features/planet-rendering/ui/planet/sun";
import type { SimulationMode } from "@/features/simulation-control/state/simulation-mode-context";

type SceneContentProps = {
  simulationSpeed: number;
  simulationMode: SimulationMode;
  selectedDate: Date;
  onSunClick: () => void;
  onPlanetClick: (planet: PlanetData) => void;
  selectedPlanet: PlanetData | null;
  showPlanetLabels: boolean;
  showOrbitPath: boolean;
  showBeltRegions: boolean;
};

export function SceneContent({
  simulationSpeed,
  simulationMode,
  selectedDate,
  onSunClick,
  onPlanetClick,
  selectedPlanet,
  showPlanetLabels,
  showOrbitPath,
  showBeltRegions,
}: SceneContentProps) {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[0, 10, 5]} intensity={1.5} />
      <directionalLight position={[0, -10, -5]} intensity={0.8} />
      <Sun
        onClick={onSunClick}
        simulationSpeed={simulationSpeed}
        simulationMode={simulationMode}
      />
      {planetData.map((planet) => (
        <Planet
          key={planet.name}
          planet={planet}
          simulationSpeed={simulationSpeed}
          simulationMode={simulationMode}
          selectedDate={selectedDate}
          onClick={onPlanetClick}
          showLabels={showPlanetLabels && !selectedPlanet}
          showOrbitPath={showOrbitPath}
        />
      ))}
      <BeltRegions visible={showBeltRegions} />
      <Stars
        radius={60000}
        depth={2000}
        count={3000}
        factor={4}
        saturation={1}
        fade
        speed={1}
      />
      <OrbitControls
        makeDefault
        enableZoom
        enableRotate
        minDistance={100}
        maxDistance={60000}
        zoomSpeed={1.2}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}
