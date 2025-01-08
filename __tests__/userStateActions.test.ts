import { User } from "@/models/user";
import { clearDatabase, closeDatabase, connect } from "../__mocks__/handler";
import {
  findOrCreateUser,
  toggleFavouritePodcast,
  addDownloadedEpisode,
} from "@/serverActions/userActions";

describe("User Functions", () => {
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
    let localUser = await findOrCreateUser("user1");

    const podcastId = "podcast1";
    localUser = await toggleFavouritePodcast(localUser, podcastId, true);
    let updatedUser = await User.findOne({ email: "user1" });
    expect(localUser.info[0].favourited).toBe(true);
    expect(updatedUser.info[0].favourited).toBe(true);

    localUser = await toggleFavouritePodcast(localUser, podcastId, false);
    updatedUser = await User.findOne({ email: "user1" });
    expect(localUser.info[0].favourited).toBe(false);
    expect(updatedUser.info[0].favourited).toBe(false);
  });

  test("addDownloadedEpisode should add an episode to the podcast", async () => {
    let localUser = await findOrCreateUser("user2");

    const podcastId = "podcast2";
    const episodeId = "episode1";

    localUser = await addDownloadedEpisode(localUser, podcastId, episodeId);
    let updatedUser = await User.findOne({ email: "user2" });
    let updatedPodcastState = updatedUser.info.find(
      (podcast: any) => podcast.podcast_id === podcastId
    );
    expect(localUser.info[0].downloaded_episodes).toContain(episodeId);
    expect(updatedPodcastState.downloaded_episodes).toContain(episodeId);

    localUser = await addDownloadedEpisode(localUser, podcastId, episodeId);
    updatedUser = await User.findOne({ email: "user2" });
    updatedPodcastState = updatedUser.info.find(
      (podcast: any) => podcast.podcast_id === podcastId
    );
    expect(updatedPodcastState.downloaded_episodes).toContain(episodeId);
    expect(localUser.info[0].downloaded_episodes).toContain(episodeId);

    expect(updatedPodcastState.downloaded_episodes).toHaveLength(1);
    expect(localUser.info[0].downloaded_episodes).toHaveLength(1);
  });

  test("findOrCreateUser should create a new user state if not found", async () => {
    const user = await findOrCreateUser("user3");

    expect(user).toHaveProperty("email", "user3");
    expect(user.info).toHaveLength(0); // Initial state should be empty

    // Try to find the user again
    const user2 = await findOrCreateUser("user3");
    expect(user2).toEqual(user); // Should return the same user state as before
  });
});
