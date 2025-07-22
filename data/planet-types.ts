export interface PlanetData {
  /** The name of the planet (e.g., "Earth"). */
  name: string;

  /** The diameter of the planet relative to Earth's diameter (Earth = 1). */
  diameterRelativeEarth: number;

  /** The actual diameter of the planet in kilometers. */
  diameterInKm: number;

  /** The distance of the planet from the Sun in kilometers. */
  distanceInKm: number;

  /** The distance of the planet from the Sun in Astronomical Units (AU). */
  distanceInAU: number;

  /** The orbital eccentricity of the planet (0 = circular, 1 = parabolic, >1 = hyperbolic). */
  eccentricity: number;

  /** The axial tilt of the planet in degrees (0 = no tilt, 90 = perpendicular to orbit). */
  axialTilt: number;

  /** The color used to represent the planet in the visualization. */
  color: string;

  /** (Optional) Path or URL to a texture image for the planet's surface. */
  texture?: string;

  /** The orbital speed of the planet relative to Earth's orbital speed (Earth = 1). */
  orbitSpeedByEarth: number;

  /** The orbital speed of the planet in kilometers per hour (km/h). */
  orbitSpeedByKmH: number;

  /** The time it takes for the planet to complete one orbit around the Sun. */
  orbitalPeriod: string;

  /** The time it takes for the planet to complete one rotation on its axis, in Earth days. */
  rotationSpeedByDays: number;

  /** The equatorial rotation speed of the planet in kilometers per hour (km/h). */
  rotationSpeedByKmH: number;

  /** Indicates whether the planet has rings. */
  hasRings: boolean;

  /** (Optional) The color of the planet's rings. */
  ringColor?: string;

  /** (Optional) The tilt of the planet's rings in degrees. */
  ringTilt?: number;

  /** A brief description of the planet. */
  description: string;

  /** The length of a day on the planet. */
  dayLength: string;

  /** A fun fact about the planet. */
  funFact: string;

  /** The temperature range on the planet. */
  temperature: string;

  /** The gravity on the planet in meters per second squared (m/s²). */
  gravity: string;

  /** The composition of the planet's atmosphere. */
  atmosphere: string;

  /** The number of moons the planet has. */
  moons: string;

  /** The year the planet was discovered. */
  yearDiscovered: string;
}
