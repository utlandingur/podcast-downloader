import { isElectron, remoteRequest } from '@/lib/electronBridge';

type ApiResponse<T> = {
  ok: boolean;
  status: number;
  data: T | null;
};

type ApiRequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  cache?: RequestCache;
  signal?: AbortSignal;
};

const getServerBaseUrl = async () => {
  const isElectronBuild =
    process.env.ELECTRON_BUILD === '1' ||
    process.env.NEXT_PUBLIC_ELECTRON === '1';
  const remoteBase = process.env.NEXT_PUBLIC_REMOTE_API_BASE;
  if (isElectronBuild && remoteBase) return remoteBase;

  try {
    const { headers } = await import('next/headers');
    const incoming = await headers();
    const hostHeader =
      incoming.get('x-forwarded-host') || incoming.get('host') || '';
    const host = hostHeader.split(',')[0]?.trim() || '';
    const proto = incoming.get('x-forwarded-proto') || 'http';
    if (host) {
      const isLoopbackHost =
        /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(host);
      if (remoteBase && isLoopbackHost) {
        return remoteBase;
      }
      return `${proto}://${host}`;
    }
  } catch {
    // ignore if headers not available
  }


  const publicBase =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (publicBase) return publicBase;

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
};

const getServerCookies = async () => {
  try {
    const { headers } = await import('next/headers');
    const incoming = await headers();
    return incoming.get('cookie') || undefined;
  } catch {
    return undefined;
  }
};

const buildBody = (
  body: unknown,
  headers: Record<string, string>,
): { body: BodyInit | undefined; headers: Record<string, string> } => {
  const nextHeaders = { ...headers };
  if (body === undefined || body === null) {
    return { body: undefined, headers: nextHeaders };
  }
  if (typeof body === 'string') {
    return { body, headers: nextHeaders };
  }
  if (body instanceof URLSearchParams) {
    return { body, headers: nextHeaders };
  }
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    return { body, headers: nextHeaders };
  }
  if (typeof Blob !== 'undefined' && body instanceof Blob) {
    return { body, headers: nextHeaders };
  }

  if (!nextHeaders['Content-Type']) {
    nextHeaders['Content-Type'] = 'application/json';
  }
  return { body: JSON.stringify(body), headers: nextHeaders };
};

const parseResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();
  let data: T | null = null;

  if (text) {
    if (contentType.includes('application/json')) {
      try {
        data = JSON.parse(text) as T;
      } catch {
        data = null;
      }
    } else {
      data = text as T;
    }
  }

  return { ok: response.ok, status: response.status, data };
};

export const apiRequest = async <T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> => {
  const method = options.method || 'GET';

  if (typeof window !== 'undefined') {
    if (isElectron()) {
      const response = await remoteRequest({
        path,
        method,
        headers: options.headers,
        body: options.body,
      });
      return (response ?? {
        ok: false,
        status: 0,
        data: null,
      }) as ApiResponse<T>;
    }

    const headers = { ...(options.headers || {}) };
    const { body, headers: requestHeaders } = buildBody(
      options.body,
      headers,
    );

    const response = await fetch(path, {
      method,
      headers: requestHeaders,
      body,
      cache: options.cache,
      signal: options.signal,
    });
    return parseResponse<T>(response);
  }

  const base = await getServerBaseUrl();
  const url = new URL(path, base).toString();
  const headers = { ...(options.headers || {}) };
  const cookies = await getServerCookies();
  if (cookies) headers.cookie = cookies;
  if (!headers.origin) headers.origin = base;
  if (!headers.referer) headers.referer = base;
  const { body, headers: requestHeaders } = buildBody(options.body, headers);

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body,
    cache: options.cache,
    signal: options.signal,
  });

  return parseResponse<T>(response);
};

export const apiGet = async <T>(
  path: string,
  options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
) => apiRequest<T>(path, { ...options, method: 'GET' });

export const apiPost = async <T>(
  path: string,
  body?: unknown,
  options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
) => apiRequest<T>(path, { ...options, method: 'POST', body });

export type { ApiResponse, ApiRequestOptions };
