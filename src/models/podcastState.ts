import { InferSchemaType, Schema, Document, models, model } from "mongoose";

export const podcastStateSchema = new Schema(
  {
    podcast_id: { type: Schema.Types.String, required: true, unique: true },
    favourited: { type: Schema.Types.Boolean },
    downloaded_episodes: { type: [Schema.Types.String] },
  },
  { strict: true }
);

export type PodcastStateType = InferSchemaType<typeof podcastStateSchema>;

export type PodcastStateDocument = PodcastStateType & Document;

export const PodcastState =
  models.PodcastState ||
  model<PodcastStateDocument>("PodcastState", podcastStateSchema);
