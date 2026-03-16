const API_TIMEOUT_REVALIDATE = 3600;

export type UpstreamFetch = typeof fetch;

export async function fetchPlanetFromUpstream(
  url: string,
  {
    apiKey,
    signal,
    fetchImpl = fetch,
  }: {
    apiKey?: string;
    signal: AbortSignal;
    fetchImpl?: UpstreamFetch;
  },
): Promise<Response> {
  const headers: HeadersInit = {
    Accept: "application/json",
  };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const requestOptions = {
    signal,
    next: { revalidate: API_TIMEOUT_REVALIDATE },
  };

  const response = await fetchImpl(url, {
    ...requestOptions,
    headers,
  });

  return response;
}
