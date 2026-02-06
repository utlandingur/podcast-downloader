/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { ensureAuthorizedRequest, isAllowedWebOrigin } from '@/lib/deviceAuth';

const makeReq = (url: string, headers: Record<string, string>) =>
  new NextRequest(url, { headers });

describe('deviceAuth', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  test('allows same-origin request in production', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.ALLOWED_ORIGINS;

    const req = makeReq('https://podcasttomp3.com/api/search?term=test', {
      host: 'podcasttomp3.com',
      origin: 'https://podcasttomp3.com',
    });

    const result = await ensureAuthorizedRequest(req, '');
    expect(result.ok).toBe(true);
  });

  test('allows localhost origin in development', async () => {
    process.env.NODE_ENV = 'development';
    delete process.env.ALLOWED_ORIGINS;

    const req = makeReq('http://localhost:3000/api/search?term=test', {
      host: 'localhost:3000',
      origin: 'http://localhost:3000',
    });

    const result = await ensureAuthorizedRequest(req, '');
    expect(result.ok).toBe(true);
  });

  test('allows origin listed in ALLOWED_ORIGINS', async () => {
    process.env.NODE_ENV = 'production';
    process.env.ALLOWED_ORIGINS =
      'https://foo.example,https://bar.example';

    const req = makeReq('https://podcasttomp3.com/api/search?term=test', {
      host: 'podcasttomp3.com',
      origin: 'https://bar.example',
    });

    const result = await ensureAuthorizedRequest(req, '');
    expect(result.ok).toBe(true);
    expect(isAllowedWebOrigin(req)).toBe(true);
  });

  test('rejects unknown origin when no device headers provided', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.ALLOWED_ORIGINS;

    const req = makeReq('https://podcasttomp3.com/api/search?term=test', {
      host: 'podcasttomp3.com',
      origin: 'https://evil.example',
    });

    const result = await ensureAuthorizedRequest(req, '');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(401);
    }
  });
});
