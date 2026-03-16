/**
 * Belt region data structure for Asteroid Belt and Kuiper Belt visualization
 */

export interface BeltData {
  id: string;
  name: string;
  innerRadiusAU: number;
  outerRadiusAU: number;
  color: string;
  opacity: number;
  description: string;
  particleCount: number; // Number of particles to render in the belt
  particleSize: number; // Size of each particle
}

export const BELT_DATA: BeltData[] = [
  {
    id: "asteroid-belt",
    name: "Asteroid Belt",
    innerRadiusAU: 2.2,
    outerRadiusAU: 3.2,
    color: "#8B7355",
    opacity: 0.15,
    description: "Region between Mars and Jupiter containing rocky asteroids",
    particleCount: 2000,
    particleSize: 3,
  },
  {
    id: "kuiper-belt",
    name: "Kuiper Belt",
    innerRadiusAU: 30,
    outerRadiusAU: 50,
    color: "#4A6B8A",
    opacity: 0.1,
    description: "Region beyond Neptune containing icy bodies",
    particleCount: 3000,
    particleSize: 5,
  },
];
