import { describe, expect, it } from "vitest";
import { checkRateLimit, PLANETS_API_RATE_LIMIT_BUCKET } from "@/features/planet-catalog/server/rate-limit";

describe("checkRateLimit", () => {
  it("allows requests when Cache API is unavailable (local tests)", async () => {
    const request = new Request("https://example.com/api/planets/earth");
    const result = await checkRateLimit(request, PLANETS_API_RATE_LIMIT_BUCKET);
    expect(result).toBeNull();
  });
});
