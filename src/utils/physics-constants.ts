/**
 * Physics and astronomy constants used throughout the application
 */

/**
 * Number of seconds in one day (24 hours * 60 minutes * 60 seconds)
 */
export const SECONDS_PER_DAY = 86400;

/**
 * Full circle in radians (2π)
 */
export const FULL_CIRCLE_RADIANS = 2 * Math.PI;

/**
 * Earth's orbital period in days (sidereal year)
 * Used as fallback when planet data is missing
 */
export const EARTH_ORBITAL_PERIOD_DAYS = 365.256;

/**
 * NASA JPL Horizons System reference values for orbital periods (in days)
 * Source: https://ssd.jpl.nasa.gov/planets/phys_par.html
 */
export const NASA_JPL_ORBITAL_PERIODS = {
  Mercury: 87.969,
  Venus: 224.701,
  Earth: 365.256,
  Mars: 686.98,
  Jupiter: 4332.59,
  Saturn: 10759.22,
  Uranus: 30688.5,
  Neptune: 60182,
} as const;

/**
 * NASA JPL Horizons System reference values for eccentricities
 * Source: https://ssd.jpl.nasa.gov/planets/phys_par.html
 */
export const NASA_JPL_ECCENTRICITIES = {
  Mercury: 0.2056,
  Venus: 0.0068,
  Earth: 0.0167,
  Mars: 0.0934,
  Jupiter: 0.0484,
  Saturn: 0.0539,
  Uranus: 0.0463,
  Neptune: 0.0086,
} as const;
