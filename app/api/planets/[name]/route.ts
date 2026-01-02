/**
 * API Route: Proxy for Solar System OpenData API
 * Avoids CORS issues by making server-side requests
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

const API_BASE_URL = "https://api.le-systeme-solaire.net/rest/bodies";
const API_TIMEOUT = 10000; // 10 seconds

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const planetName = name.toLowerCase();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const apiKey = process.env.NEXT_PUBLIC_SOLAR_SYSTEM_API_KEY;

    const headers: HeadersInit = {
      Accept: "application/json",
    };

    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${API_BASE_URL}/${planetName}`, {
      signal: controller.signal,
      headers,
      // Cache for 1 hour on server
      next: { revalidate: 3600 },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `API returned status ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "Request timeout" }, { status: 504 });
    }

    console.error(`Failed to fetch planet data for ${planetName}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch planet data" },
      { status: 500 },
    );
  }
}
