/**
 * @jest-environment node
 */
import { getOptionalSession } from '../src/lib/optionalSession';
import { auth } from '../auth';

jest.mock('../auth', () => ({
  auth: jest.fn(),
}));

const mockedAuth = auth as jest.Mock;

describe('getOptionalSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns session when auth succeeds', async () => {
    mockedAuth.mockResolvedValueOnce({ user: { email: 'user@test.com' } });
    await expect(getOptionalSession()).resolves.toEqual({
      user: { email: 'user@test.com' },
    });
  });

  test('returns null when auth throws', async () => {
    mockedAuth.mockRejectedValueOnce(new Error('MissingSecret'));
    await expect(getOptionalSession()).resolves.toBeNull();
  });
});
