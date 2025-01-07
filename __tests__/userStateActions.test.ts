import { UserState } from "@/models/userState";
import { clearDatabase, closeDatabase, connect } from "../__mocks__/handler";
import {
  findOrCreateUserState,
  toggleFavouritePodcast,
  addDownloadedEpisode,
} from "@/serverActions/userStateActions";

describe("UserState Functions", () => {
  beforeAll(async () => {
    await connect(); // Connect to in-memory MongoDB or your test DB
  });

  afterEach(async () => {
    await clearDatabase(); // Clear the DB after each test to start fresh
  });

  afterAll(async () => {
    await closeDatabase(); // Close the DB connection after all tests
  });

  test("toggleFavouritePodcast should toggle the favourited state", async () => {
    const userState = await findOrCreateUserState("user1");

    const podcastId = "podcast1";
    await toggleFavouritePodcast(userState, podcastId, true);
    let updatedUserState = await UserState.findOne({ user_id: "user1" });
    expect(userState.info[0].favourited).toBe(true);
    expect(updatedUserState.info[0].favourited).toBe(true);

    await toggleFavouritePodcast(userState, podcastId, false);
    updatedUserState = await UserState.findOne({ user_id: "user1" });
    expect(userState.info[0].favourited).toBe(false);
    expect(updatedUserState.info[0].favourited).toBe(false);
  });

  test("addDownloadedEpisode should add an episode to the podcast", async () => {
    const userState = await findOrCreateUserState("user2");

    const podcastId = "podcast2";
    const episodeId = "episode1";

    await addDownloadedEpisode(userState, podcastId, episodeId);
    let updatedUserState = await UserState.findOne({ user_id: "user2" });
    let updatedPodcastState = updatedUserState.info.find(
      (podcast: any) => podcast.podcast_id === podcastId
    );

    expect(updatedPodcastState.downloaded_episodes).toContain(episodeId);

    // Add the same episode again, it shouldn't be added twice
    await addDownloadedEpisode(userState, podcastId, episodeId);
    updatedUserState = await UserState.findOne({ user_id: "user2" });
    updatedPodcastState = updatedUserState.info.find(
      (podcast: any) => podcast.podcast_id === podcastId
    );
    expect(updatedPodcastState.downloaded_episodes).toContain(episodeId);
    expect(updatedPodcastState.downloaded_episodes).toHaveLength(1);
  });

  test("findOrCreateUserState should create a new user state if not found", async () => {
    const userState = await findOrCreateUserState("user3");

    expect(userState).toHaveProperty("user_id", "user3");
    expect(userState.info).toHaveLength(0); // Initial state should be empty

    // Try to find the user again
    const userState2 = await findOrCreateUserState("user3");
    expect(userState2).toEqual(userState); // Should return the same user state as before
  });
});
