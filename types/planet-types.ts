/**
 * Represents detailed data for a planet in the solar system visualization.
 *
 * Properties:
 * -----------------------------------------------------------------------------
 * @property {string}   name           - The name of the planet (e.g., "Earth").
 * @property {number}   size           - The relative size of the planet for visualization (not actual diameter).
 * @property {number}   distance       - The relative distance from the sun for visualization (not actual distance).
 * @property {number}   realDistance   - The actual distance from the sun in millions of kilometers.
 * @property {number}   realDiameter   - The actual diameter of the planet in kilometers.
 * @property {string}   color          - The color used to represent the planet in the visualization.
 * @property {string}   [texture]      - (Optional) Path or URL to a texture image for the planet's surface.
 * @property {number}   orbitSpeed     - The speed at which the planet orbits the sun in the simulation (visualization only).
 * @property {number}   rotationSpeed  - The speed at which the planet rotates on its axis (visualization only).
 * @property {boolean}  hasRings       - Whether the planet has rings (e.g., Saturn).
 * @property {string}   orbitalPeriod  - The time it takes for the planet to complete one orbit around the sun (e.g., "365 days").
 * @property {string}   dayLength      - The duration of one rotation on its axis (e.g., "24 hours").
 * @property {string}   description    - A brief description of the planet.
 * @property {string}   funFact        - An interesting fact about the planet.
 * @property {string}   temperature    - The average surface temperature (e.g., "-63°C").
 * @property {string}   gravity        - Surface gravity, often in m/s² or as a comparison to Earth.
 * @property {string}   atmosphere     - Description or composition of the planet's atmosphere.
 * @property {string}   moons          - Number or names of moons, or a description (e.g., "1 (Moon)").
 * @property {string}   yearDiscovered - The year the planet was discovered, or "Known since antiquity" for classical planets.
 * @property {string}   [ringColor]    - (Optional) The color of the planet's rings, if any.
 * @property {number}   [ringTilt]     - (Optional) The tilt angle of the planet's rings, if any.
 * -----------------------------------------------------------------------------
 */
export interface PlanetData {
  name: string;
  size: number;
  distance: number;
  realDistance: number;
  realDiameter: number;
  color: string;
  texture?: string;
  orbitSpeed: number;
  rotationSpeed: number;
  hasRings: boolean;
  orbitalPeriod: string;
  dayLength: string;
  description: string;
  funFact: string;
  temperature: string;
  gravity: string;
  atmosphere: string;
  moons: string;
  yearDiscovered: string;
  ringColor?: string;
  ringTilt?: number;
}
