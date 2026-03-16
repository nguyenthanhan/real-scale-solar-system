import { PlanetData } from "@/data/planet-types";
import { validateAllPlanets } from "@/utils/validate-planet-data";

// NASA JPL Horizons System data source
// https://ssd.jpl.nasa.gov/planets/phys_par.html

export const sunData: PlanetData = {
  name: "Sun",
  description: "The star at the center of our Solar System",
  funFact: "The Sun contains 99.86% of the mass in the Solar System",
  color: "#FDB813",
  diameterRelativeEarth: 109.2, // More accurate: 1,392,700 / 12,742
  diameterInKm: 1_392_700,
  distanceInKm: 0,
  distanceInAU: 0,
  temperature: "5,500°C (surface), 15 million°C (core)",
  gravity: "274 m/s²",
  atmosphere: "Hot plasma of hydrogen (73%) and helium (25%)",
  orbitSpeedByEarth: 0,
  orbitSpeedByKmH: 0,
  orbitalPeriodDays: 0, // Sun doesn't orbit (in heliocentric model)
  rotationSpeedByDays: 25.38,
  rotationSpeedByKmH: 1.997,
  hasRings: false,
  ringColor: "",
  ringTilt: 0,
  texture: "",
  orbitalPeriod: "225-250 million years around the Milky Way",
  dayLength: "25.38 Earth days at equator",
  moons: "None",
  yearDiscovered: "Prehistoric",
  eccentricity: 0,
  axialTilt: 7.25,
  orbitalInclination: 0,
  notableFeatures: [
    "Contains 99.86% of the Solar System's mass",
    "Core temperature reaches 15 million°C",
    "Light takes 8 minutes to reach Earth",
    "About 4.6 billion years old (middle-aged star)",
    "Will become a red giant in about 5 billion years",
  ],
};

export const planetData: PlanetData[] = [
  {
    name: "Mercury",
    diameterRelativeEarth: 0.383, // Accurate: 4,880 / 12,742
    color: "#9c9c9c",
    diameterInKm: 4_880,
    distanceInKm: 57_910_000,
    distanceInAU: 0.39,
    orbitSpeedByEarth: 47.87,
    orbitSpeedByKmH: 172_332,
    orbitalPeriodDays: 87.969, // NASA JPL
    rotationSpeedByDays: 58.646,
    rotationSpeedByKmH: 10.892,
    hasRings: false,
    ringColor: "",
    ringTilt: 0,
    texture: "",
    description: "The smallest and innermost planet in the Solar System",
    orbitalPeriod: "88 Earth days",
    dayLength: "176 Earth days",
    funFact: "Despite being closest to the Sun, Mercury has ice in its craters",
    temperature: "-173°C to 427°C",
    gravity: "3.7 m/s²",
    atmosphere: "Very thin, mostly oxygen, sodium, hydrogen",
    moons: "0",
    yearDiscovered: "Prehistoric",
    eccentricity: 0.2056, // NASA JPL (4 decimal places)
    axialTilt: 0.034,
    orbitalInclination: 7.005,
    notableFeatures: [
      "Smallest planet in the Solar System",
      "Has ice in permanently shadowed craters despite extreme heat",
      "Most cratered planet due to lack of atmosphere",
      "Has a massive iron core (about 85% of its radius)",
    ],
    explorationHistory: {
      firstFlyby: "Mariner 10 (1974)",
      firstOrbiter: "MESSENGER (2011)",
      notableMissions: ["Mariner 10", "MESSENGER", "BepiColombo (ongoing)"],
    },
  },
  {
    name: "Venus",
    diameterRelativeEarth: 0.949, // Accurate: 12,104 / 12,742
    color: "#E6E6FA",
    diameterInKm: 12_104,
    distanceInKm: 108_200_000,
    distanceInAU: 0.72,
    orbitSpeedByEarth: 35.02,
    orbitSpeedByKmH: 126_074,
    orbitalPeriodDays: 224.701, // NASA JPL
    rotationSpeedByDays: -243.025, // Negative = retrograde
    rotationSpeedByKmH: 6.52,
    hasRings: false,
    ringColor: "",
    ringTilt: 0,
    texture: "",
    description: "Second planet from the Sun, often called Earth's sister",
    orbitalPeriod: "225 Earth days",
    dayLength: "116.75 Earth days (retrograde)",
    funFact: "Venus rotates in the opposite direction to most planets",
    temperature: "462°C (constant)",
    gravity: "8.87 m/s²",
    atmosphere: "96.5% CO2, 3.5% N2",
    moons: "0",
    yearDiscovered: "Prehistoric",
    eccentricity: 0.0068, // NASA JPL (4 decimal places)
    axialTilt: 177.4,
    orbitalInclination: 3.395,
    notableFeatures: [
      "Rotates backwards (retrograde rotation)",
      "Hottest planet despite not being closest to Sun",
      "Surface pressure is 92 times Earth's",
      "A day on Venus is longer than its year",
      "Covered by thick sulfuric acid clouds",
    ],
    explorationHistory: {
      firstFlyby: "Mariner 2 (1962)",
      firstOrbiter: "Venera 9 (1975)",
      firstLander: "Venera 7 (1970)",
      notableMissions: [
        "Venera program",
        "Magellan",
        "Venus Express",
        "Akatsuki",
      ],
    },
  },
  {
    name: "Earth",
    diameterRelativeEarth: 1.0, // Reference planet
    color: "#4B6CB7",
    diameterInKm: 12_742,
    distanceInKm: 149_597_870,
    distanceInAU: 1.0,
    orbitSpeedByEarth: 29.78,
    orbitSpeedByKmH: 107_226,
    orbitalPeriodDays: 365.256, // NASA JPL (sidereal year)
    rotationSpeedByDays: 1,
    rotationSpeedByKmH: 1_674,
    hasRings: false,
    ringColor: "",
    ringTilt: 0,
    texture: "",
    description:
      "Our home planet, the only known world with liquid water oceans",
    orbitalPeriod: "365.25 days",
    dayLength: "23.93 hours",
    funFact: "Earth's magnetic field protects it from solar wind",
    temperature: "-89.2°C to 56.7°C",
    gravity: "9.8 m/s²",
    atmosphere: "78% N2, 21% O2, 1% Ar",
    moons: "1",
    yearDiscovered: "Prehistoric",
    eccentricity: 0.0167, // NASA JPL (4 decimal places)
    axialTilt: 23.5,
    orbitalInclination: 0.0,
    notableFeatures: [
      "Only known planet with liquid water on its surface",
      "Has a protective magnetic field",
      "Only planet known to harbor life",
      "70% of surface covered by oceans",
      "Has plate tectonics actively reshaping its surface",
    ],
    explorationHistory: {
      notableMissions: ["Apollo program", "ISS", "Countless satellites"],
    },
  },
  {
    name: "Mars",
    diameterRelativeEarth: 0.532, // Accurate: 6,779 / 12,742
    color: "#d14b28",
    diameterInKm: 6_779,
    distanceInKm: 227_943_824,
    distanceInAU: 1.52,
    orbitSpeedByEarth: 24.077,
    orbitSpeedByKmH: 86_868,
    orbitalPeriodDays: 686.98, // NASA JPL
    rotationSpeedByDays: 1.03,
    rotationSpeedByKmH: 868,
    hasRings: false,
    ringColor: "",
    ringTilt: 0,
    texture: "",
    description:
      "The Red Planet with the largest dust storms in the solar system",
    orbitalPeriod: "687 Earth days",
    dayLength: "24.62 hours",
    funFact: "Mars has seasons similar to Earth due to its axial tilt",
    temperature: "-125°C to 20°C",
    gravity: "3.71 m/s²",
    atmosphere: "95.3% CO2, 2.7% N2, 1.6% Ar",
    moons: "2",
    yearDiscovered: "Prehistoric",
    eccentricity: 0.0934, // NASA JPL (4 decimal places)
    axialTilt: 25.2,
    orbitalInclination: 1.85,
    notableFeatures: [
      "Home to Olympus Mons - largest volcano in Solar System",
      "Has the largest canyon system (Valles Marineris)",
      "Evidence of ancient water flows on surface",
      "Has two small moons: Phobos and Deimos",
      "Most explored planet after Earth",
    ],
    explorationHistory: {
      firstFlyby: "Mariner 4 (1965)",
      firstOrbiter: "Mariner 9 (1971)",
      firstLander: "Viking 1 (1976)",
      notableMissions: [
        "Viking",
        "Spirit & Opportunity",
        "Curiosity",
        "Perseverance",
        "Ingenuity helicopter",
      ],
    },
  },
  {
    name: "Jupiter",
    diameterRelativeEarth: 10.97, // Accurate: 139,820 / 12,742
    color: "#D8CA9D",
    diameterInKm: 139_820,
    distanceInKm: 778_500_000,
    distanceInAU: 5.2,
    orbitSpeedByEarth: 13.07,
    orbitSpeedByKmH: 47_052,
    orbitalPeriodDays: 4332.59, // NASA JPL (11.86 years)
    rotationSpeedByDays: 0.41,
    rotationSpeedByKmH: 45_000,
    hasRings: true,
    ringColor: "#a67c52",
    ringTilt: 0,
    texture: "",
    description:
      "The largest planet in the Solar System with the Great Red Spot",
    orbitalPeriod: "12 Earth years",
    dayLength: "9.93 hours",
    funFact: "Jupiter's Great Red Spot is a storm larger than Earth",
    temperature: "-108°C",
    gravity: "24.79 m/s²",
    atmosphere: "89.8% H2, 10.2% He",
    moons: "79",
    yearDiscovered: "Prehistoric",
    eccentricity: 0.0484, // NASA JPL (4 decimal places)
    axialTilt: 3.13,
    orbitalInclination: 1.303,
    notableFeatures: [
      "Largest planet in the Solar System",
      "Great Red Spot - storm larger than Earth lasting 400+ years",
      "Has at least 95 moons including the four Galilean moons",
      "Strong magnetic field - 20,000 times stronger than Earth's",
      "Acts as a cosmic vacuum cleaner protecting inner planets",
    ],
    explorationHistory: {
      firstFlyby: "Pioneer 10 (1973)",
      firstOrbiter: "Galileo (1995)",
      notableMissions: [
        "Pioneer 10 & 11",
        "Voyager 1 & 2",
        "Galileo",
        "Juno (ongoing)",
      ],
    },
  },
  {
    name: "Saturn",
    diameterRelativeEarth: 9.14, // Accurate: 116,460 / 12,742
    color: "#f5deb3",
    diameterInKm: 116_460,
    distanceInKm: 1_429_400_000,
    distanceInAU: 9.55,
    orbitSpeedByEarth: 9.69,
    orbitSpeedByKmH: 34_884,
    orbitalPeriodDays: 10759.22, // NASA JPL (29.46 years)
    rotationSpeedByDays: 0.44,
    rotationSpeedByKmH: 36_000,
    hasRings: true,
    ringColor: "#F5DEB3",
    ringTilt: 0,
    texture: "",
    description: "Known for its spectacular ring system",
    orbitalPeriod: "29 Earth years",
    dayLength: "10.57 hours",
    funFact: "Saturn's rings are made mostly of ice particles",
    temperature: "-139°C",
    gravity: "10.44 m/s²",
    atmosphere: "96.3% H2, 3.25% He",
    moons: "83",
    yearDiscovered: "Prehistoric",
    eccentricity: 0.0539, // NASA JPL (4 decimal places)
    axialTilt: 26.7,
    orbitalInclination: 2.485,
    notableFeatures: [
      "Most spectacular ring system in the Solar System",
      "Least dense planet - would float on water",
      "Has 146 known moons including Titan with thick atmosphere",
      "Hexagonal storm pattern at its north pole",
      "Rings are mostly water ice with some rocky debris",
    ],
    explorationHistory: {
      firstFlyby: "Pioneer 11 (1979)",
      firstOrbiter: "Cassini (2004)",
      notableMissions: ["Pioneer 11", "Voyager 1 & 2", "Cassini-Huygens"],
    },
  },
  {
    name: "Uranus",
    diameterRelativeEarth: 3.98, // Accurate: 50,724 / 12,742
    color: "#afeeee",
    diameterInKm: 50_724,
    distanceInKm: 2_870_990_000,
    distanceInAU: 19.19,
    orbitSpeedByEarth: 6.81,
    orbitSpeedByKmH: 24_516,
    orbitalPeriodDays: 30688.5, // NASA JPL (84.01 years)
    rotationSpeedByDays: -0.72, // Negative = retrograde
    rotationSpeedByKmH: 9_000,
    hasRings: true,
    ringColor: "#2F2F2F",
    ringTilt: 0,
    texture: "",
    description: "An ice giant with a unique sideways rotation",
    orbitalPeriod: "84 Earth years",
    dayLength: "17.24 hours",
    funFact: "Uranus rotates on its side, making its axial tilt 98 degrees",
    temperature: "-224°C",
    gravity: "8.69 m/s²",
    atmosphere: "82.5% H2, 15.2% He, 2.3% CH4",
    moons: "27",
    yearDiscovered: "1781",
    eccentricity: 0.0463, // NASA JPL (4 decimal places)
    axialTilt: 97.8,
    orbitalInclination: 0.773,
    notableFeatures: [
      "Rotates on its side with 98° axial tilt",
      "Coldest planetary atmosphere in Solar System (-224°C)",
      "Has faint ring system discovered in 1977",
      "27 known moons named after Shakespeare characters",
      "Rotates backwards (retrograde) like Venus",
    ],
    explorationHistory: {
      firstFlyby: "Voyager 2 (1986)",
      notableMissions: ["Voyager 2 (only spacecraft to visit)"],
    },
  },
  {
    name: "Neptune",
    diameterRelativeEarth: 3.86, // Accurate: 49,244 / 12,742
    color: "#4169e1",
    diameterInKm: 49_244,
    distanceInKm: 4_498_250_000,
    distanceInAU: 30.07,
    orbitSpeedByEarth: 5.43,
    orbitSpeedByKmH: 19_548,
    orbitalPeriodDays: 60182, // NASA JPL (164.79 years)
    rotationSpeedByDays: 0.67,
    rotationSpeedByKmH: 9_000,
    hasRings: true,
    ringColor: "#1A1A1A",
    ringTilt: 0,
    texture: "",
    description: "The windiest planet with speeds reaching 2,100 km/h",
    orbitalPeriod: "165 Earth years",
    dayLength: "16.11 hours",
    funFact: "Neptune has the strongest winds in the Solar System",
    temperature: "-214°C",
    gravity: "11.15 m/s²",
    atmosphere: "80% H2, 19% He, 1% CH4",
    moons: "14",
    yearDiscovered: "1846",
    eccentricity: 0.0086, // NASA JPL (4 decimal places)
    axialTilt: 28.3,
    orbitalInclination: 1.77,
    notableFeatures: [
      "Strongest winds in Solar System (2,100 km/h)",
      "Has a Great Dark Spot similar to Jupiter's storm",
      "Farthest planet from the Sun",
      "Has 16 known moons including Triton (captured dwarf planet)",
      "Emits more heat than it receives from the Sun",
    ],
    explorationHistory: {
      firstFlyby: "Voyager 2 (1989)",
      notableMissions: ["Voyager 2 (only spacecraft to visit)"],
    },
  },
];

// Validate planet data on module load (client-side only)
if (typeof window !== "undefined") {
  try {
    validateAllPlanets(planetData);
  } catch (error) {
    console.error("Failed to load planet data:", error);
    // Only throw in development mode
    if (process.env.NODE_ENV === "development") {
      throw error;
    }
  }
}
