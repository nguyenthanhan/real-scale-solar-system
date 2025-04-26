import { PlanetData } from "@/types/planet-types";

export const DISTANCE_SCALE = 0.05;

export const sunData: PlanetData = {
  name: "Sun",
  color: "#FDB813",
  size: 2.0, // Relative size compared to planets
  distance: 0,
  realDiameter: 1_392_700,
  realDistance: 0,
  orbitSpeed: 0, // Sun doesn't orbit
  rotationSpeed: 25, // Average rotation period in Earth days
  hasRings: false,
  description:
    "The star at the center of our Solar System, a nearly perfect sphere of hot plasma.",
  orbitalPeriod: "225-250 million years around the Milky Way",
  dayLength: "25-35 Earth days (varies by latitude)",
  funFact: "The Sun contains 99.86% of the mass in the Solar System.",
  temperature: "5,500°C (surface), 15 million°C (core)",
  gravity: "274 m/s² (28× Earth)",
  atmosphere: "Hot plasma of hydrogen and helium",
  moons: "8 planets, dwarf planets, and billions of smaller objects",
  yearDiscovered: "Known to all human civilizations",
};

export const planetData: PlanetData[] = [
  {
    name: "Mercury",
    size: 0.4,
    distance: 4,
    color: "#9c9c9c", // Gray with slight brown tint
    orbitSpeed: 0.24, // Relative to Earth
    rotationSpeed: 58.6,
    hasRings: false,
    realDiameter: 4_879,
    realDistance: 57.9,
    orbitalPeriod: "88 Earth days",
    dayLength: "59 Earth days",
    description: "The smallest and innermost planet in the Solar System.",
    funFact:
      "Despite being close to the Sun, Mercury has ice in its polar craters.",
    temperature: "-173°C to 427°C",
    gravity: "3.7 m/s² (38% of Earth)",
    atmosphere: "Virtually none, extremely thin exosphere",
    moons: "0",
    yearDiscovered: "Known to ancient civilizations",
  },
  {
    name: "Venus",
    size: 0.6,
    distance: 6,
    color: "#e6c8a0", // Pale yellow-orange
    orbitSpeed: 0.62, // Relative to Earth
    rotationSpeed: 243,
    hasRings: false,
    realDiameter: 12_104,
    realDistance: 108.2,
    orbitalPeriod: "225 Earth days",
    dayLength: "243 Earth days (retrograde rotation)",
    description:
      "The second planet from the Sun and Earth's closest planetary neighbor.",
    funFact: "Venus rotates in the opposite direction to most planets.",
    temperature: "462°C (hottest planet)",
    gravity: "8.87 m/s² (91% of Earth)",
    atmosphere: "Thick CO₂, sulfuric acid clouds",
    moons: "0",
    yearDiscovered: "Known to ancient civilizations",
  },
  {
    name: "Earth",
    size: 0.6,
    distance: 8,
    color: "#2f6a69", // Blue-green
    orbitSpeed: 1.0, // Baseline (Earth=1)
    rotationSpeed: 1,
    hasRings: false,
    realDiameter: 12_756,
    realDistance: 149.6,
    orbitalPeriod: "365.25 days",
    dayLength: "24 hours",
    description:
      "Our home planet and the only known place with life in the universe.",
    funFact: "Earth is the only planet not named after a god or goddess.",
    temperature: "-88°C to 58°C",
    gravity: "9.8 m/s²",
    atmosphere: "78% nitrogen, 21% oxygen, 1% other gases",
    moons: "1 (Moon)",
    yearDiscovered: "N/A",
  },
  {
    name: "Mars",
    size: 0.5,
    distance: 10,
    color: "#c1440e", // Rust red
    orbitSpeed: 1.88, // Relative to Earth
    rotationSpeed: 1.03,
    hasRings: false,
    realDiameter: 6_792,
    realDistance: 227.9,
    orbitalPeriod: "687 Earth days",
    dayLength: "24.6 hours",
    description: "The fourth planet from the Sun, often called the Red Planet.",
    funFact:
      "Mars has the largest dust storms in the solar system, lasting for months.",
    temperature: "-153°C to 20°C",
    gravity: "3.72 m/s² (38% of Earth)",
    atmosphere: "Thin, mostly CO₂",
    moons: "2 (Phobos, Deimos)",
    yearDiscovered: "Known to ancient civilizations",
  },
  {
    name: "Jupiter",
    size: 1.2,
    distance: 14,
    color: "#d8ca9d", // Light brown with orange bands
    orbitSpeed: 11.86, // Relative to Earth
    rotationSpeed: 0.41,
    hasRings: false,
    realDiameter: 142_984,
    realDistance: 778.6,
    orbitalPeriod: "11.9 Earth years",
    dayLength: "9.9 hours",
    description:
      "The largest planet in our Solar System, a gas giant with a Great Red Spot.",
    funFact:
      "Jupiter's Great Red Spot is a storm that has been raging for at least 400 years.",
    temperature: "-145°C (cloud top)",
    gravity: "24.79 m/s² (2.5× Earth)",
    atmosphere: "Hydrogen, helium, methane, ammonia",
    moons: "79 confirmed moons",
    yearDiscovered: "Known to ancient civilizations",
  },
  {
    name: "Saturn",
    size: 1.0,
    distance: 18,
    color: "#e3be7e", // Pale gold
    orbitSpeed: 29.46, // Relative to Earth
    rotationSpeed: 0.45,
    hasRings: true,
    ringColor: "#e8d9b5", // Light beige
    ringTilt: 0.4, // Slight tilt to the rings
    realDiameter: 120_536,
    realDistance: 1_433.5,
    orbitalPeriod: "29.5 Earth years",
    dayLength: "10.7 hours",
    description:
      "The sixth planet from the Sun, famous for its spectacular ring system.",
    funFact:
      "Saturn's rings are made mostly of ice chunks, with some rocky debris and dust.",
    temperature: "-178°C (cloud top)",
    gravity: "10.44 m/s² (1.07× Earth)",
    atmosphere: "Hydrogen, helium, methane",
    moons: "82 confirmed moons",
    yearDiscovered: "Known to ancient civilizations",
  },
  {
    name: "Uranus",
    size: 0.8,
    distance: 22,
    color: "#c1e7e3", // Pale cyan
    orbitSpeed: 84.01, // Relative to Earth
    rotationSpeed: 0.72,
    hasRings: true,
    ringColor: "#a5a5a5", // Gray
    ringTilt: 0.1, // Slight tilt to the rings
    realDiameter: 51_118,
    realDistance: 2_872.5,
    orbitalPeriod: "84 Earth years",
    dayLength: "17.2 hours (retrograde rotation)",
    description:
      "The seventh planet from the Sun, an ice giant that rotates on its side.",
    funFact:
      "Uranus rotates on its side, with its axis pointing nearly toward the Sun.",
    temperature: "-224°C",
    gravity: "8.69 m/s² (89% of Earth)",
    atmosphere: "Hydrogen, helium, methane (gives blue color)",
    moons: "27 known moons",
    yearDiscovered: "1781 by William Herschel",
  },
  {
    name: "Neptune",
    size: 0.8,
    distance: 26,
    color: "#3457d5", // Deep blue
    orbitSpeed: 164.8, // Relative to Earth
    rotationSpeed: 0.67,
    hasRings: true,
    ringColor: "#a5a5a5", // Light grey
    ringTilt: 0.03, // Slight tilt to the rings
    realDiameter: 49_528,
    realDistance: 4_495.1,
    orbitalPeriod: "165 Earth years",
    dayLength: "16.1 hours",
    description:
      "The eighth and most distant planet from the Sun, a stormy ice giant.",
    funFact:
      "Neptune has five faint rings and the strongest winds in the Solar System, reaching 2,100 km/h.",
    temperature: "-218°C",
    gravity: "11.15 m/s² (1.14× Earth)",
    atmosphere: "Hydrogen, helium, methane (gives blue color)",
    moons: "14 known moons",
    yearDiscovered: "1846 by Urbain Le Verrier, Johann Galle",
  },
];
