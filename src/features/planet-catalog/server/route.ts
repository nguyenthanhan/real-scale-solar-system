/**
 * API Route: Proxy for Solar System OpenData API
 * Avoids CORS issues by making server-side requests
 */

import { fetchPlanetFromUpstream } from "@/features/planet-catalog/server/upstream-client";

export const runtime = "edge";

const API_BASE_URL = "https://api.le-systeme-solaire.net/rest/bodies";
const API_TIMEOUT = 10000; // 10 seconds
const SUPPORTED_PLANETS = new Set([
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
]);

function jsonResponse(
  body: unknown,
  init?: { status?: number; headers?: HeadersInit },
): Response {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const planetName = name.trim().toLowerCase();

  if (!SUPPORTED_PLANETS.has(planetName)) {
    return jsonResponse({ error: "Unsupported planet name" }, { status: 400 });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const apiKey = process.env.SOLAR_SYSTEM_API_KEY;
    const publicKey = process.env.NEXT_PUBLIC_SOLAR_SYSTEM_API_KEY;

    if (!apiKey) {
      if (publicKey) {
        console.error(
          "Missing SOLAR_SYSTEM_API_KEY. Found NEXT_PUBLIC_SOLAR_SYSTEM_API_KEY instead; do not use NEXT_PUBLIC for server secrets.",
        );
      }
      return jsonResponse(
        { error: "Server secret SOLAR_SYSTEM_API_KEY is not configured" },
        { status: 500 },
      );
    }

    const response = await fetchPlanetFromUpstream(
      `${API_BASE_URL}/${planetName}`,
      {
        apiKey,
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return jsonResponse(
          {
            error:
              "Upstream authentication failed. Verify SOLAR_SYSTEM_API_KEY secret on the worker.",
          },
          { status: 502 },
        );
      }
      return jsonResponse(
        { error: `API returned status ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();

    return jsonResponse(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      return jsonResponse({ error: "Request timeout" }, { status: 504 });
    }

    console.error(`Failed to fetch planet data for ${planetName}:`, error);
    return jsonResponse(
      { error: "Failed to fetch planet data" },
      { status: 500 },
    );
  }
}
