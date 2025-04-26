/**
 * Represents detailed data for a planet in the solar system visualization.
 *
 * Properties:
 * -----------------------------------------------------------------------------
 * @property {string}   name                   - The name of the planet (e.g., "Earth").
 * @property {number}   sizeRelativeEarth      - The size of the planet relative to Earth for visualization purposes.
 * @property {number}   diameterRelativeEarth  - The diameter of the planet relative to Earth's diameter (Earth = 1).
 * @property {number}   diameterInKm           - The actual diameter of the planet in kilometers.
 * @property {number}   distanceInKm           - The distance of the planet from the Sun in kilometers.
 * @property {number}   distanceInAU           - The distance of the planet from the Sun in Astronomical Units (AU).
 * @property {number}   eccentricity           - The orbital eccentricity of the planet (0 = circular, 1 = parabolic, >1 = hyperbolic).
 * @property {number}   axialTilt              - The axial tilt of the planet in degrees (0 = no tilt, 90 = perpendicular to orbit).
 * @property {string}   color                  - The color used to represent the planet in the visualization.
 * @property {string}   [texture]              - (Optional) Path or URL to a texture image for the planet's surface.
 * @property {number}   orbitSpeedByEarth      - The orbital speed of the planet relative to Earth's orbital speed (Earth = 1).
 * @property {number}   orbitSpeedByAU         - The orbital speed of the planet in Astronomical Units (AU) per year.
 * @property {number}   rotationSpeedByDays    - The time it takes for the planet to complete one rotation on its axis, in Earth days.
 * @property {number}   rotationSpeedByKmH     - The equatorial rotation speed of the planet in kilometers per hour (km/h).
 * @property {boolean}  hasRings               - Indicates whether the planet has rings.
 * @property {string}   [ringColor]            - (Optional) The color of the planet's rings.
 * @property {number}   [ringTilt]             - (Optional) The tilt of the planet's rings in degrees.
 * @property {string}   description            - A brief description of the planet.
 * @property {string}   orbitalPeriod          - The time it takes for the planet to complete one orbit around the Sun.
 * @property {string}   dayLength              - The length of a day on the planet.
 * @property {string}   funFact                - A fun fact about the planet.
 * @property {string}   temperature            - The temperature range on the planet.
 * @property {string}   gravity                - The gravity on the planet in meters per second squared (m/s²).
 * @property {string}   atmosphere             - The composition of the planet's atmosphere.
 * @property {string}   moons                  - The number of moons the planet has.
 * @property {string}   yearDiscovered         - The year the planet was discovered.
 *
 * -----------------------------------------------------------------------------
 */
export interface PlanetData {
  name: string;
  sizeRelativeEarth: number;
  diameterRelativeEarth: number;
  diameterInKm: number;
  distanceInKm: number;
  distanceInAU: number;
  eccentricity: number;
  axialTilt: number;
  color: string;
  texture?: string;
  orbitSpeedByEarth: number;
  orbitSpeedByKmH: number;
  orbitalPeriod: string;
  rotationSpeedByDays: number;
  rotationSpeedByKmH: number;
  hasRings: boolean;
  ringColor?: string;
  ringTilt?: number;
  description: string;
  dayLength: string;
  funFact: string;
  temperature: string;
  gravity: string;
  atmosphere: string;
  moons: string;
  yearDiscovered: string;
}
