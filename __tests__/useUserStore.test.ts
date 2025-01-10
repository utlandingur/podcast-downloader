/**
 * @jest-environment jsdom
 */
import { renderHook, waitFor } from "@testing-library/react";
import { useUserStore } from "@/hooks/useUser";
import { PlainUserType } from "@/models/user";
import { findOrCreateUser } from "@/serverActions/userActions";
import { Session } from "next-auth";

// Mock the serverActions
jest.mock("../src/serverActions/userActions", () => ({
  findOrCreateUser: jest.fn(),
}));

describe("useUserStore", () => {
  beforeEach(() => {
    // Clear the store before each test
    useUserStore.setState({ user: null, loading: false, error: null });
    jest.clearAllMocks();
  });

  test("should initialize with default values", () => {
    const { result } = renderHook(() => useUserStore());

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("should fetch user from DB", async () => {
    const initialLocalUser = { email: "test@test.com", info: [] };
    const dbUser = {
      email: "test@test.com",
      info: [{ podcastId: 1, episodeId: 1 }],
    };
    const mockSession = { user: dbUser } as unknown as Session;
    (findOrCreateUser as jest.Mock).mockResolvedValueOnce(dbUser);

    const { result } = renderHook(() => useUserStore());

    await waitFor(() => {
      useUserStore.setState({ user: initialLocalUser });
    });

    await waitFor(async () => {
      await result.current.syncUser(mockSession.user?.email || null);
    });

    expect(findOrCreateUser).toHaveBeenCalledWith("test@test.com");
    expect(result.current.user).toEqual(dbUser);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
