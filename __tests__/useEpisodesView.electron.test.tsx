/**
 * @jest-environment jsdom
 */
import { act, renderHook, waitFor } from '@testing-library/react';
import { DownloadState } from '../src/components/downloadPodcastButton';
import { useEpisodesView } from '../src/components/episodesView/useEpisodesView.electron';
import { usePodcastEpisodesV2 } from '../src/hooks/usePodcastEpisodes';
import { useUserStore } from '../src/hooks/useUserStore';
import { getUserPodcastInfo } from '../src/lib/getUserPodcastInfo';

jest.mock('../src/hooks/usePodcastEpisodes', () => ({
  usePodcastEpisodesV2: jest.fn(),
}));

jest.mock('../src/hooks/useUserStore', () => ({
  useUserStore: jest.fn(),
}));

jest.mock('../src/lib/getUserPodcastInfo', () => ({
  getUserPodcastInfo: jest.fn(),
}));

const mockUsePodcastEpisodesV2 = usePodcastEpisodesV2 as jest.Mock;
const mockUseUserStore = useUserStore as jest.Mock;
const mockGetUserPodcastInfo = getUserPodcastInfo as jest.Mock;

const episodes = [
  {
    id: 1,
    title: 'Episode 1',
    description: 'Episode 1 description',
    datePublished: new Date('2024-01-01'),
    episodeNumber: 1,
    episodeUrl: 'https://example.com/ep1.mp3',
  },
  {
    id: 2,
    title: 'Episode 2',
    description: 'Episode 2 description',
    datePublished: new Date('2024-01-02'),
    episodeNumber: 2,
    episodeUrl: 'https://example.com/ep2.mp3',
  },
];

describe('useEpisodesView.electron', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();

    mockUsePodcastEpisodesV2.mockReturnValue({
      data: episodes,
      loading: false,
    });

    mockUseUserStore.mockImplementation((selector: any) =>
      selector({
        user: null,
        addDownloadedEpisode: jest.fn().mockResolvedValue(undefined),
      }),
    );

    mockGetUserPodcastInfo.mockReturnValue(undefined);
  });

  test('stores all downloaded ids during sequential updates (bulk-like flow)', async () => {
    const { result } = renderHook(() => useEpisodesView('podcast-1'));

    await waitFor(() => {
      expect(result.current.episodesToDisplay).toHaveLength(2);
    });

    act(() => {
      result.current.episodesToDisplay[0].updateDownloadState(
        1,
        DownloadState.Downloaded,
      );
      result.current.episodesToDisplay[1].updateDownloadState(
        2,
        DownloadState.Downloaded,
      );
    });

    const stored = localStorage.getItem('podcast-downloads:podcast-1');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored || '[]');
    expect(parsed).toEqual(expect.arrayContaining(['1', '2']));
    expect(parsed).toHaveLength(2);
  });

  test('does not duplicate ids when same episode is marked downloaded multiple times', async () => {
    const { result } = renderHook(() => useEpisodesView('podcast-2'));

    await waitFor(() => {
      expect(result.current.episodesToDisplay).toHaveLength(2);
    });

    act(() => {
      result.current.episodesToDisplay[0].updateDownloadState(
        1,
        DownloadState.Downloaded,
      );
      result.current.episodesToDisplay[0].updateDownloadState(
        1,
        DownloadState.Downloaded,
      );
    });

    const stored = localStorage.getItem('podcast-downloads:podcast-2');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored || '[]');
    expect(parsed).toEqual(['1']);
  });
});
