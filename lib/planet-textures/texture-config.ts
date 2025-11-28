/**
 * Planet Texture Configuration
 *
 * This module defines the mapping between planet names and their corresponding
 * texture image paths and material types for the solar system visualization.
 *
 * Material Types:
 * - "basic": Used for the Sun to create an emissive, self-illuminated effect
 * - "standard": Used for all planets to enable realistic lighting and shading
 */

export interface PlanetTextureConfig {
  /** The name of the celestial body */
  name: string;
  /** Path to the texture image file in the public directory */
  texturePath: string;
  /** Material type: "basic" for emissive Sun, "standard" for planets */
  materialType: "standard" | "basic";
}

/**
 * Texture configuration mapping for all celestial bodies in the solar system.
 * Maps planet names to their texture paths and appropriate material types.
 *
 * Texture Requirements:
 * - Resolution: 2048x1024 pixels (2:1 aspect ratio for sphere mapping)
 * - Format: JPG for planets, PNG for rings (with transparency)
 * - Location: public/textures/ directory
 */
export const PLANET_TEXTURES: Record<string, PlanetTextureConfig> = {
  Sun: {
    name: "Sun",
    texturePath: "/textures/sun.jpg",
    materialType: "basic", // Emissive material for self-illumination
  },
  Mercury: {
    name: "Mercury",
    texturePath: "/textures/mercury.jpg",
    materialType: "standard",
  },
  Venus: {
    name: "Venus",
    texturePath: "/textures/venus.jpg",
    materialType: "standard",
  },
  Earth: {
    name: "Earth",
    texturePath: "/textures/earth.jpg",
    materialType: "standard",
  },
  Mars: {
    name: "Mars",
    texturePath: "/textures/mars.jpg",
    materialType: "standard",
  },
  Jupiter: {
    name: "Jupiter",
    texturePath: "/textures/jupiter.jpg",
    materialType: "standard",
  },
  Saturn: {
    name: "Saturn",
    texturePath: "/textures/saturn.jpg",
    materialType: "standard",
  },
  Uranus: {
    name: "Uranus",
    texturePath: "/textures/uranus.jpg",
    materialType: "standard",
  },
  Neptune: {
    name: "Neptune",
    texturePath: "/textures/neptune.jpg",
    materialType: "standard",
  },
};
