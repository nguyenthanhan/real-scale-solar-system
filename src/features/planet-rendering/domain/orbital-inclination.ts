import { MathUtils } from "three";

/**
 * Represents a 3D position with x, y, z coordinates.
 */
export interface Position3D {
  x: number;
  y: number;
  z: number;
}

/**
 * Applies orbital inclination to a 2D orbit position to get 3D position.
 *
 * The inclination is applied as a rotation around the X-axis, transforming
 * a flat orbit (in the XZ plane) into an inclined orbit with a Y component.
 *
 * Mathematical transformation:
 * - Original position: (x, 0, z)
 * - After rotation by θ around X-axis: (x, z * sin(θ), z * cos(θ))
 *
 * @param x - X position on the orbit (from ellipse curve)
 * @param z - Z position on the orbit (from ellipse curve Y mapped to Z)
 * @param inclinationDegrees - Orbital inclination in degrees (relative to ecliptic plane)
 * @returns Object with x, y, z coordinates representing the inclined position
 *
 * @example
 * // Earth has 0° inclination, so Y remains 0
 * applyInclinationToPosition(100, 50, 0) // { x: 100, y: 0, z: 50 }
 *
 * @example
 * // Mercury has 7.005° inclination
 * applyInclinationToPosition(100, 50, 7.005) // { x: 100, y: ~6.1, z: ~49.6 }
 */
export function applyInclinationToPosition(
  x: number,
  z: number,
  inclinationDegrees: number
): Position3D {
  // Validate inclination - use 0 as fallback for invalid values
  if (!Number.isFinite(inclinationDegrees)) {
    console.warn(`Invalid inclination: ${inclinationDegrees}, using 0`);
    inclinationDegrees = 0;
  }

  // Clamp to reasonable range (-180 to 180 degrees)
  inclinationDegrees = Math.max(-180, Math.min(180, inclinationDegrees));

  const inclinationRadians = MathUtils.degToRad(inclinationDegrees);

  // Rotate around X-axis to apply inclination
  // Original position on flat orbit: (x, 0, z)
  // After rotation by θ around X-axis:
  // x' = x (unchanged)
  // y' = 0 * cos(θ) - z * sin(θ) = -z * sin(θ)
  // z' = 0 * sin(θ) + z * cos(θ) = z * cos(θ)
  //
  // Note: We use negative sin to match Three.js rotation.x behavior
  // which rotates counter-clockwise when looking down the positive X-axis
  return {
    x: x,
    y: -z * Math.sin(inclinationRadians),
    z: z * Math.cos(inclinationRadians),
  };
}

/**
 * Gets the rotation angle (in radians) to apply to an orbit path mesh for inclination.
 *
 * This function converts the orbital inclination from degrees to radians,
 * which can be directly applied to a Three.js object's rotation.x property.
 *
 * @param inclinationDegrees - Orbital inclination in degrees
 * @returns Rotation in radians for X-axis rotation
 *
 * @example
 * // Apply to orbit path mesh
 * lineRef.current.rotation.x = getInclinationRotation(planet.orbitalInclination);
 */
export function getInclinationRotation(inclinationDegrees: number): number {
  // Validate inclination - use 0 as fallback for invalid values
  if (!Number.isFinite(inclinationDegrees)) {
    console.warn(`Invalid inclination: ${inclinationDegrees}, using 0`);
    inclinationDegrees = 0;
  }

  // Clamp to reasonable range (-180 to 180 degrees)
  inclinationDegrees = Math.max(-180, Math.min(180, inclinationDegrees));

  return MathUtils.degToRad(inclinationDegrees);
}
