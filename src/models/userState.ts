"use server";
import { InferSchemaType, Schema, Document, models, model } from "mongoose";

import { podcastStateSchema } from "@/models/podcastState";

const userStateSchema = new Schema(
  {
    user_id: { type: Schema.Types.String, required: true, unique: true },
    info: { type: [podcastStateSchema], required: true },
  },
  { strict: true }
);

export type UserStateType = InferSchemaType<typeof userStateSchema>;

export type UserStateDocument = UserStateType & Document;

export const UserState =
  models.UserState || model<UserStateDocument>("UserState", userStateSchema);
