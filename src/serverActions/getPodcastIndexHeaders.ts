"use server";
import { createHash } from "crypto";

const apiKey = process.env.PODCAST_INDEX_API_KEY;
const apiSecret = process.env.PODCAST_INDEX_API_SECRET;
if (!apiKey || !apiSecret) {
  throw new Error("Missing API credentials for Podcast Index");
}
// ======== Hash credentials to get the Authorization token ========
export const getPodcastIndexHeaders = async () => {
  const apiHeaderTime = Math.floor(Date.now() / 1000);
  const sha1Algorithm = "sha1";

  const sha1Hash = createHash(sha1Algorithm);
  const data4Hash = apiKey + apiSecret + apiHeaderTime;
  sha1Hash.update(data4Hash);
  const hash4Header = sha1Hash.digest("hex");

  return {
    "X-Auth-Date": "" + apiHeaderTime,
    "X-Auth-Key": apiKey,
    Authorization: hash4Header,
    "User-Agent": "PodcastIdeaGenerator/0.1",
  };
};
