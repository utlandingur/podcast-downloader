import { getFavouriteIds } from '@/lib/getFavouriteIds';
import type { PlainUserType } from '@/models/user';

describe('getFavouriteIds', () => {
  test('returns favourited podcast ids', () => {
    const user: PlainUserType = {
      email: 'test@test.com',
      info: [
        { podcast_id: 'pod-1', favourited: true, downloaded_episodes: [] },
        { podcast_id: 'pod-2', favourited: false, downloaded_episodes: [] },
        { podcast_id: 'pod-3', favourited: true, downloaded_episodes: [] },
      ],
    };

    expect(getFavouriteIds(user)).toEqual(['pod-1', 'pod-3']);
  });

  test('returns empty array when no favourites', () => {
    const user: PlainUserType = {
      email: 'test@test.com',
      info: [{ podcast_id: 'pod-1', favourited: false, downloaded_episodes: [] }],
    };

    expect(getFavouriteIds(user)).toEqual([]);
  });
});
