// Minimal fetch wrapper — Phase 0 skeleton. Expanded with auth/retry/tracing in Phase 1+.

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  tenantId?: string;
  locale?: string;
};

const DEFAULT_BASE = '/api';

export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export async function apiFetch<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
  const { body, tenantId, locale, headers, ...rest } = options;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE;
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;

  const finalHeaders: Record<string, string> = {
    accept: 'application/json',
    'accept-language': locale ?? 'tr-TR,tr;q=0.9,en;q=0.8',
    ...(tenantId ? { 'x-landx-tenant': tenantId } : {}),
    ...((headers as Record<string, string>) ?? {}),
  };

  let finalBody: BodyInit | undefined;
  if (body !== undefined) {
    if (body instanceof FormData) {
      finalBody = body;
    } else {
      finalBody = JSON.stringify(body);
      finalHeaders['content-type'] = 'application/json';
    }
  }

  const response = await fetch(url, {
    ...rest,
    headers: finalHeaders,
    body: finalBody,
  });

  if (!response.ok) {
    let payload: unknown = null;
    try {
      payload = await response.json();
    } catch {
      payload = await response.text();
    }
    throw new ApiError(`API ${response.status}: ${response.statusText}`, response.status, payload);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
