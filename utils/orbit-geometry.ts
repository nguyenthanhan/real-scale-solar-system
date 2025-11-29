import * as THREE from "three";

/**
 * Default configuration values for orbit visualization
 */
export const ORBIT_DEFAULTS = {
  /** Number of segments for smooth circular orbits */
  SEGMENTS: 128,
  /** Thickness of the orbit line (torus tube radius) */
  TUBE_RADIUS: 0.5,
  /** Semi-transparent opacity for orbit materials */
  OPACITY: 0.3,
  /** Color for inner planet orbits (Mercury, Venus, Earth, Mars) */
  INNER_PLANET_COLOR: "#888888",
  /** Color for outer planet orbits (Jupiter, Saturn, Uranus, Neptune) */
  OUTER_PLANET_COLOR: "#666666",
} as const;

/**
 * Creates a torus geometry representing a circular orbit path
 * @param distance - Radius of the orbit from the Sun in scene units
 * @param segments - Number of segments for circle smoothness (default: 128)
 * @returns THREE.TorusGeometry representing the orbit
 */
export function createOrbitGeometry(
  distance: number,
  segments: number = ORBIT_DEFAULTS.SEGMENTS
): THREE.TorusGeometry {
  // Validate distance parameter
  if (distance <= 0 || !Number.isFinite(distance)) {
    console.error(`Invalid orbit distance: ${distance}`);
    distance = 100; // Fallback to reasonable default
  }

  // Validate segments parameter
  if (segments < 3 || !Number.isInteger(segments)) {
    console.warn(`Invalid segment count: ${segments}, using default`);
    segments = ORBIT_DEFAULTS.SEGMENTS;
  }

  const tubeRadius = ORBIT_DEFAULTS.TUBE_RADIUS;

  // Create torus: (radius, tube, radialSegments, tubularSegments)
  return new THREE.TorusGeometry(
    distance, // Orbit radius
    tubeRadius, // Thickness of the line
    16, // Radial segments (tube cross-section)
    segments // Tubular segments (circle smoothness)
  );
}

/**
 * Creates a semi-transparent material for orbit visualization
 * @param color - Hex color string for the orbit
 * @param opacity - Transparency level (0.0 to 1.0, default: 0.3)
 * @returns THREE.MeshBasicMaterial configured for orbit rendering
 */
export function createOrbitMaterial(
  color: string,
  opacity: number = ORBIT_DEFAULTS.OPACITY
): THREE.MeshBasicMaterial {
  // Validate opacity range
  if (opacity < 0 || opacity > 1 || !Number.isFinite(opacity)) {
    console.warn(`Invalid opacity: ${opacity}, using default`);
    opacity = ORBIT_DEFAULTS.OPACITY;
  }

  // Validate color format
  let validColor = color;
  try {
    new THREE.Color(color);
  } catch (error) {
    console.error(`Invalid color: ${color}, using default`);
    validColor = ORBIT_DEFAULTS.INNER_PLANET_COLOR;
  }

  return new THREE.MeshBasicMaterial({
    color: validColor,
    transparent: true,
    opacity: opacity,
    side: THREE.DoubleSide, // Visible from both sides
    depthWrite: false, // Prevent z-fighting with other transparent objects
  });
}

/**
 * Determines the appropriate orbit color based on planet classification
 * @param planetName - Name of the planet
 * @returns Hex color string for the orbit
 */
export function getOrbitColor(planetName: string): string {
  const innerPlanets = ["Mercury", "Venus", "Earth", "Mars"];
  return innerPlanets.includes(planetName)
    ? ORBIT_DEFAULTS.INNER_PLANET_COLOR
    : ORBIT_DEFAULTS.OUTER_PLANET_COLOR;
}

/**
 * Applies orbital inclination to a mesh by rotating it around the X-axis
 * @param mesh - The THREE.Mesh to apply inclination to
 * @param inclinationDegrees - Inclination angle in degrees from the ecliptic plane
 */
export function applyOrbitalInclination(
  mesh: THREE.Mesh,
  inclinationDegrees: number
): void {
  if (!mesh) {
    console.error("Cannot apply inclination to null mesh");
    return;
  }

  if (!Number.isFinite(inclinationDegrees)) {
    console.warn(`Invalid inclination: ${inclinationDegrees}, using 0`);
    inclinationDegrees = 0;
  }

  // Apply inclination as rotation around X-axis (tilts the orbit plane)
  mesh.rotation.x = THREE.MathUtils.degToRad(inclinationDegrees);
}
