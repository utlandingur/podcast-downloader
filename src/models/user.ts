import { InferSchemaType, Schema, Document, models, model } from "mongoose";

import { podcastStateSchema, PodcastStateType } from "@/models/podcastState";

const userSchema = new Schema(
  {
    email: { type: Schema.Types.String, required: true, unique: true },
    info: { type: [podcastStateSchema], required: true },
  },
  { strict: true }
);

export type UserType = InferSchemaType<typeof userSchema>;

export type UserDocument = UserType & Document;

export const User = models?.User || model<UserDocument>("User", userSchema);

// Ordinary objects that can be passed from the client to the server
export type PlainPodcastStateType = Omit<PodcastStateType, keyof Document>;

export type PlainUserType = {
  email: string;
  info: PlainPodcastStateType[]; // Replace subdocuments with plain objects
};
