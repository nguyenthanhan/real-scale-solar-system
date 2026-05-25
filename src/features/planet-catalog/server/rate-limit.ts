const RATE_LIMIT_MAX_REQUESTS = 30;
const RATE_LIMIT_WINDOW_SECONDS = 60;

/** Shared bucket for all /api/planets/* routes — limits total upstream calls per IP. */
export const PLANETS_API_RATE_LIMIT_BUCKET = "api/planets";

/**
 * Basic per-IP rate limit for edge API routes using the Cache API.
 * Returns a 429 Response when limited, or null when the request may proceed.
 * No-ops outside environments that expose caches.default (e.g. local Node tests).
 *
 * Use a route-level bucket (e.g. "api/planets") rather than per-resource keys
 * when the goal is protecting shared upstream quota.
 *
 * Note: read/modify/write via Cache API is not atomic. Concurrent requests may
 * briefly exceed the limit during bursts — acceptable for casual abuse protection;
 * use Cloudflare WAF or Durable Objects for strict enforcement.
 */
export async function checkRateLimit(
  request: Request,
  bucket: string,
): Promise<Response | null> {
  if (typeof caches === "undefined") {
    return null;
  }

  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  const cacheKey = new Request(
    `https://rate-limit.internal/${bucket}?ip=${encodeURIComponent(ip)}`,
  );
  const cache = caches.default;
  const cached = await cache.match(cacheKey);

  let count = 0;
  if (cached) {
    const parsed = Number.parseInt(await cached.text(), 10);
    count = Number.isFinite(parsed) ? parsed : 0;
  }

  if (count >= RATE_LIMIT_MAX_REQUESTS) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(RATE_LIMIT_WINDOW_SECONDS),
          "Cache-Control": "no-store",
        },
      },
    );
  }

  await cache.put(
    cacheKey,
    new Response(String(count + 1), {
      headers: {
        "Cache-Control": `max-age=${RATE_LIMIT_WINDOW_SECONDS}`,
      },
    }),
  );

  return null;
}
