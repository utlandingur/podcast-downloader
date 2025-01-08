import { InferSchemaType, Schema, Document, models, model } from "mongoose";

import { podcastStateSchema } from "@/models/podcastState";

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
