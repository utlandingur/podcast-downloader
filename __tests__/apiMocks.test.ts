/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET as searchGet } from '../src/app/api/search/route';
import { GET as podcastGet } from '../src/app/api/podcast/route';
import { GET as episodesGet } from '../src/app/api/episodes/route';

const makeReq = (url: string) => new NextRequest(url, { method: 'GET' });

describe('E2E mocks for API routes', () => {
  const originalEnv = process.env.E2E_MOCKS;

  beforeAll(() => {
    process.env.E2E_MOCKS = '1';
  });

  afterAll(() => {
    if (originalEnv === undefined) {
      delete process.env.E2E_MOCKS;
    } else {
      process.env.E2E_MOCKS = originalEnv;
    }
  });

  test('search returns mocked podcasts', async () => {
    const res = await searchGet(
      makeReq('http://localhost/api/search?term=planet&source=v2'),
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].id).toBe(123);
  });

  test('podcast returns mocked podcast by id', async () => {
    const res = await podcastGet(
      makeReq('http://localhost/api/podcast?id=123'),
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.title).toBe('Planet Money');
  });

  test('podcast returns 404 for unknown id', async () => {
    const res = await podcastGet(
      makeReq('http://localhost/api/podcast?id=999'),
    );
    expect(res.status).toBe(404);
  });

  test('episodes returns mocked episode list', async () => {
    const res = await episodesGet(
      makeReq('http://localhost/api/episodes?id=123&source=v2'),
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
  });

  test('episodes returns 400 when missing id', async () => {
    const res = await episodesGet(makeReq('http://localhost/api/episodes'));
    expect(res.status).toBe(400);
  });
});
