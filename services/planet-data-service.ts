/**
 * Planet Data Service
 * Fetches real-time planetary data from Solar System OpenData API
 */

import { APIResponse, isValidAPIResponse } from "./planet-api-types";

const API_BASE_URL = "https://api.le-systeme-solaire.net/rest/bodies";
const API_TIMEOUT = 5000; // 5 seconds

/**
 * Error thrown when API request fails
 */
export class PlanetAPIError extends Error {
  constructor(
    message: string,
    public readonly planetName: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = "PlanetAPIError";
  }
}

/**
 * Planet Data Service class
 * Handles all API requests to Solar System OpenData
 */
export class PlanetDataService {
  private baseUrl: string;
  private timeout: number;
  private static hasWarnedAboutApiKey = false;

  constructor(baseUrl = API_BASE_URL, timeout = API_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Build the API URL for a planet
   */
  buildUrl(planetName: string): string {
    return `${this.baseUrl}/${planetName.toLowerCase()}`;
  }

  /**
   * Fetch planet data from the Solar System OpenData API
   * @param planetName - Name of the planet (e.g., "Earth", "Mars")
   * @returns Promise resolving to API response data
   * @throws PlanetAPIError if request fails or times out
   */
  async fetchPlanetData(planetName: string): Promise<APIResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const url = this.buildUrl(planetName);

    // Get API key from environment variable
    const apiKey = process.env.NEXT_PUBLIC_SOLAR_SYSTEM_API_KEY;

    // Warn if API key is missing (only once)
    if (!apiKey && !PlanetDataService.hasWarnedAboutApiKey) {
      console.warn(
        "⚠️ Solar System API key not found. Get your free key at: https://api.le-systeme-solaire.net/generatekey.html"
      );
      console.warn(
        "Add it to .env.local as: NEXT_PUBLIC_SOLAR_SYSTEM_API_KEY=your-key"
      );
      console.warn("The app will use local fallback data instead.");
      PlanetDataService.hasWarnedAboutApiKey = true;
    }

    try {
      const headers: HeadersInit = {
        Accept: "application/json",
      };

      // Add Authorization header if API key is available
      if (apiKey) {
        headers.Authorization = `Bearer ${apiKey}`;
      }

      const response = await fetch(url, {
        signal: controller.signal,
        headers,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new PlanetAPIError(
          `API returned status ${response.status}`,
          planetName
        );
      }

      const data: unknown = await response.json();

      if (!isValidAPIResponse(data)) {
        throw new PlanetAPIError("Invalid API response structure", planetName);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof PlanetAPIError) {
        console.error(`API error for ${planetName}:`, error.message);
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.error(`API request timeout for ${planetName}`);
          throw new PlanetAPIError("API request timed out", planetName, error);
        }

        console.error(`Failed to fetch data for ${planetName}:`, error);
        throw new PlanetAPIError(
          `Network error: ${error.message}`,
          planetName,
          error
        );
      }

      throw new PlanetAPIError("Unknown error occurred", planetName);
    }
  }
}

// Export singleton instance
export const planetDataService = new PlanetDataService();
