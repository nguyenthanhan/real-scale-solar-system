import { describe, expect, it, vi } from "vitest";
import { fetchPlanetFromUpstream } from "@/features/planet-catalog/server/upstream-client";

describe("fetchPlanetFromUpstream", () => {
  it("sends Authorization header when apiKey exists", async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

    const response = await fetchPlanetFromUpstream(
      "https://api.le-systeme-solaire.net/rest/bodies/earth",
      {
        apiKey: "invalid-key",
        signal: new AbortController().signal,
        fetchImpl: mockFetch,
      },
    );

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const firstOptions = mockFetch.mock.calls[0][1] as {
      headers: Record<string, string>;
    };
    expect(firstOptions.headers.Authorization).toBe("Bearer invalid-key");
  });

  it("does not retry when there is no apiKey", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response("", { status: 401 }));

    const response = await fetchPlanetFromUpstream(
      "https://api.le-systeme-solaire.net/rest/bodies/earth",
      {
        signal: new AbortController().signal,
        fetchImpl: mockFetch,
      },
    );

    expect(response.status).toBe(401);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
