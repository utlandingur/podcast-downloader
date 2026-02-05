/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { useUserStore } from '../src/hooks/useUserStore';
import { fetchUser } from '../src/lib/fetchUser';
import {
  addDownloadedEpisodeApi,
  toggleFavouritePodcastApi,
} from '../src/lib/api/user';

jest.mock('../src/lib/fetchUser', () => ({
  fetchUser: jest.fn(),
}));

jest.mock('../src/lib/api/user', () => ({
  addDownloadedEpisodeApi: jest.fn(),
  toggleFavouritePodcastApi: jest.fn(),
}));

describe('useUserStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    useUserStore.setState({ user: null, loading: false, error: null });
    jest.clearAllMocks();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useUserStore());

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('should fetch user from API and update state', async () => {
    const dbUser = {
      email: 'test@test.com',
      info: [{ podcast_id: 'pod-1', favourited: true }],
    };
    (fetchUser as jest.Mock).mockResolvedValueOnce({ user: dbUser, error: null });

    const { result } = renderHook(() => useUserStore());

    await act(async () => {
      await result.current.syncUser('test@test.com');
    });

    expect(fetchUser).toHaveBeenCalledWith('test@test.com');
    expect(result.current.user).toEqual(dbUser);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('should set error when API fetch fails', async () => {
    (fetchUser as jest.Mock).mockResolvedValueOnce({
      user: null,
      error: new Error('fail'),
    });

    const { result } = renderHook(() => useUserStore());

    await act(async () => {
      await result.current.syncUser('test@test.com');
    });

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe('Error fetching user.');
  });

  test('should update user after adding downloaded episode', async () => {
    const initialUser = { email: 'test@test.com', info: [] };
    const updatedUser = {
      email: 'test@test.com',
      info: [{ podcast_id: 'pod-1', downloaded_episodes: ['ep-1'] }],
    };
    (addDownloadedEpisodeApi as jest.Mock).mockResolvedValueOnce(updatedUser);

    useUserStore.setState({ user: initialUser });
    const { result } = renderHook(() => useUserStore());

    await act(async () => {
      await result.current.addDownloadedEpisode('pod-1', 'ep-1');
    });

    expect(addDownloadedEpisodeApi).toHaveBeenCalledWith('pod-1', 'ep-1');
    expect(result.current.user).toEqual(updatedUser);
  });

  test('should update user after toggling favourite', async () => {
    const initialUser = { email: 'test@test.com', info: [] };
    const updatedUser = {
      email: 'test@test.com',
      info: [{ podcast_id: 'pod-2', favourited: true }],
    };
    (toggleFavouritePodcastApi as jest.Mock).mockResolvedValueOnce(updatedUser);

    useUserStore.setState({ user: initialUser });
    const { result } = renderHook(() => useUserStore());

    await act(async () => {
      await result.current.toggleFavouritePodcast('pod-2', true);
    });

    expect(toggleFavouritePodcastApi).toHaveBeenCalledWith('pod-2', true);
    expect(result.current.user).toEqual(updatedUser);
  });
});
