import { afterEach, describe, expect, it, vi } from "vitest";
import {
  checkRateLimit,
  PLANETS_API_RATE_LIMIT_BUCKET,
} from "@/features/planet-catalog/server/rate-limit";

function stubCacheApi() {
  const entries = new Map<string, Response>();
  const cache = {
    match: vi.fn((request: Request) => entries.get(request.url)),
    put: vi.fn((request: Request, response: Response) => {
      entries.set(request.url, response.clone());
      return Promise.resolve();
    }),
  };

  vi.stubGlobal("caches", { default: cache });
  return cache;
}

describe("checkRateLimit", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("limits requests with the in-memory fallback when Cache API is unavailable", async () => {
    const request = new Request("https://example.com/api/planets/earth", {
      headers: { "x-forwarded-for": "198.51.100.50" },
    });

    for (let attempt = 0; attempt < 30; attempt += 1) {
      await expect(
        checkRateLimit(request, PLANETS_API_RATE_LIMIT_BUCKET),
      ).resolves.toBeNull();
    }

    const limited = await checkRateLimit(
      request,
      PLANETS_API_RATE_LIMIT_BUCKET,
    );

    expect(limited?.status).toBe(429);
    await expect(limited?.json()).resolves.toEqual({
      error: "Too many requests. Please try again later.",
    });
    expect(limited?.headers.get("Retry-After")).toBe("60");
  });

  it("bounds the in-memory fallback by evicting the oldest buckets", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2030-01-01T00:00:00.000Z"));

    const bucket = "test/memory-cap";
    const oldestRequest = new Request("https://example.com/api/planets/earth", {
      headers: { "x-forwarded-for": "198.51.100.60" },
    });

    for (let attempt = 0; attempt < 30; attempt += 1) {
      await expect(checkRateLimit(oldestRequest, bucket)).resolves.toBeNull();
    }
    await expect(checkRateLimit(oldestRequest, bucket)).resolves.toHaveProperty(
      "status",
      429,
    );

    for (let index = 0; index < 1024; index += 1) {
      const request = new Request("https://example.com/api/planets/earth", {
        headers: { "x-forwarded-for": `203.0.113.${index}` },
      });

      await expect(checkRateLimit(request, bucket)).resolves.toBeNull();
    }

    await expect(checkRateLimit(oldestRequest, bucket)).resolves.toBeNull();
  });

  it("limits requests after the shared bucket reaches the window cap", async () => {
    const cache = stubCacheApi();
    const request = new Request("https://example.com/api/planets/earth", {
      headers: { "cf-connecting-ip": "203.0.113.10" },
    });

    for (let attempt = 0; attempt < 30; attempt += 1) {
      await expect(
        checkRateLimit(request, PLANETS_API_RATE_LIMIT_BUCKET),
      ).resolves.toBeNull();
    }

    const limited = await checkRateLimit(
      request,
      PLANETS_API_RATE_LIMIT_BUCKET,
    );

    expect(limited?.status).toBe(429);
    await expect(limited?.json()).resolves.toEqual({
      error: "Too many requests. Please try again later.",
    });
    expect(limited?.headers.get("Retry-After")).toBe("60");
    expect(cache.put).toHaveBeenCalledTimes(30);
  });

  it("uses the first forwarded IP so clients do not share one global bucket", async () => {
    const cache = stubCacheApi();
    const firstRequest = new Request("https://example.com/api/planets/earth", {
      headers: { "x-forwarded-for": "203.0.113.10, 198.51.100.1" },
    });
    const secondRequest = new Request("https://example.com/api/planets/earth", {
      headers: { "x-forwarded-for": "203.0.113.11, 198.51.100.1" },
    });

    await expect(
      checkRateLimit(firstRequest, PLANETS_API_RATE_LIMIT_BUCKET),
    ).resolves.toBeNull();
    await expect(
      checkRateLimit(secondRequest, PLANETS_API_RATE_LIMIT_BUCKET),
    ).resolves.toBeNull();

    const cacheKeys = cache.put.mock.calls.map(([request]) => request.url);
    expect(cacheKeys).toContain(
      "https://rate-limit.internal/api/planets?ip=203.0.113.10",
    );
    expect(cacheKeys).toContain(
      "https://rate-limit.internal/api/planets?ip=203.0.113.11",
    );
  });
});
