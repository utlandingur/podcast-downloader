/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET as getUserRoute } from '../src/app/api/user/route';
import { POST as postFavouriteRoute } from '../src/app/api/user/favourite/route';
import { POST as postDownloadedRoute } from '../src/app/api/user/downloaded/route';
import { getOptionalSession } from '../src/lib/optionalSession';
import {
  addDownloadedEpisode,
  findOrCreateUser,
  toggleFavouritePodcast,
} from '../src/serverActions/userActions';

jest.mock('../src/lib/optionalSession', () => ({
  getOptionalSession: jest.fn(),
}));

jest.mock('../src/serverActions/userActions', () => ({
  findOrCreateUser: jest.fn(),
  toggleFavouritePodcast: jest.fn(),
  addDownloadedEpisode: jest.fn(),
}));

const mockedGetOptionalSession = getOptionalSession as jest.Mock;
const mockedFindOrCreateUser = findOrCreateUser as jest.Mock;
const mockedToggleFavouritePodcast = toggleFavouritePodcast as jest.Mock;
const mockedAddDownloadedEpisode = addDownloadedEpisode as jest.Mock;

const postReq = (url: string, body: unknown) =>
  new NextRequest(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('api/user routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/user returns user null when unauthenticated', async () => {
    mockedGetOptionalSession.mockResolvedValueOnce(null);

    const response = await getUserRoute();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ user: null });
    expect(mockedFindOrCreateUser).not.toHaveBeenCalled();
  });

  test('GET /api/user returns user for authenticated session', async () => {
    mockedGetOptionalSession.mockResolvedValueOnce({
      user: { email: 'user@test.com' },
    });
    mockedFindOrCreateUser.mockResolvedValueOnce({
      email: 'user@test.com',
      info: [],
    });

    const response = await getUserRoute();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      user: { email: 'user@test.com', info: [] },
    });
    expect(mockedFindOrCreateUser).toHaveBeenCalledWith('user@test.com');
  });

  test('GET /api/user handles auth runtime errors as unauthenticated', async () => {
    mockedGetOptionalSession.mockResolvedValueOnce(null);

    const response = await getUserRoute();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ user: null });
  });

  test('POST /api/user/favourite returns user null without session', async () => {
    mockedGetOptionalSession.mockResolvedValueOnce(null);

    const response = await postFavouriteRoute(
      postReq('http://localhost/api/user/favourite', {
        podcastId: '123',
        favourited: true,
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ user: null });
    expect(mockedFindOrCreateUser).not.toHaveBeenCalled();
    expect(mockedToggleFavouritePodcast).not.toHaveBeenCalled();
  });

  test('POST /api/user/downloaded returns user null without session', async () => {
    mockedGetOptionalSession.mockResolvedValueOnce(null);

    const response = await postDownloadedRoute(
      postReq('http://localhost/api/user/downloaded', {
        podcastId: '123',
        episodeId: '456',
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ user: null });
    expect(mockedFindOrCreateUser).not.toHaveBeenCalled();
    expect(mockedAddDownloadedEpisode).not.toHaveBeenCalled();
  });
});
