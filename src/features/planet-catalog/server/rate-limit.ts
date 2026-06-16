const RATE_LIMIT_MAX_REQUESTS = 30;
const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_WINDOW_MS = RATE_LIMIT_WINDOW_SECONDS * 1000;
const MEMORY_RATE_LIMIT_MAX_BUCKETS = 1_024;
const MEMORY_RATE_LIMIT_CLEANUP_INTERVAL_MS = RATE_LIMIT_WINDOW_MS;

const memoryBuckets = new Map<string, { count: number; expiresAt: number }>();
let lastMemoryCleanupAt = 0;

/** Shared bucket for all /api/planets/* routes — limits total upstream calls per IP. */
export const PLANETS_API_RATE_LIMIT_BUCKET = "api/planets";

/**
 * Basic per-IP rate limit for API routes using the Cache API when available,
 * with an in-memory fallback for Node/Vinext deployments.
 * Returns a 429 Response when limited, or null when the request may proceed.
 *
 * Use a route-level bucket (e.g. "api/planets") rather than per-resource keys
 * when the goal is protecting shared upstream quota.
 *
 * Note: read/modify/write via Cache API is not atomic. Concurrent requests may
 * briefly exceed the limit during bursts. The in-memory fallback is per-process
 * and resets on restart. Use Cloudflare WAF, Durable Objects, Redis, or another
 * shared store for strict multi-instance enforcement.
 */
export async function checkRateLimit(
  request: Request,
  bucket: string,
): Promise<Response | null> {
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (typeof caches === "undefined") {
    return checkMemoryRateLimit(bucket, ip);
  }

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

function rateLimitResponse(): Response {
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

function checkMemoryRateLimit(bucket: string, ip: string): Response | null {
  const now = Date.now();
  const key = `${bucket}:${ip}`;
  cleanupExpiredMemoryBuckets(now);

  const current = memoryBuckets.get(key);

  if (!current || current.expiresAt <= now) {
    if (current) {
      memoryBuckets.delete(key);
    }

    ensureMemoryBucketCapacity(now);
    memoryBuckets.set(key, {
      count: 1,
      expiresAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return null;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return rateLimitResponse();
  }

  current.count += 1;
  return null;
}

function cleanupExpiredMemoryBuckets(now: number, force = false): void {
  if (!force && now - lastMemoryCleanupAt < MEMORY_RATE_LIMIT_CLEANUP_INTERVAL_MS) {
    return;
  }

  lastMemoryCleanupAt = now;
  for (const [key, bucket] of memoryBuckets) {
    if (bucket.expiresAt <= now) {
      memoryBuckets.delete(key);
    }
  }
}

function ensureMemoryBucketCapacity(now: number): void {
  if (memoryBuckets.size < MEMORY_RATE_LIMIT_MAX_BUCKETS) {
    return;
  }

  cleanupExpiredMemoryBuckets(now, true);
  while (memoryBuckets.size >= MEMORY_RATE_LIMIT_MAX_BUCKETS) {
    const oldestKey = memoryBuckets.keys().next().value;
    if (oldestKey === undefined) {
      return;
    }

    memoryBuckets.delete(oldestKey);
  }
}
