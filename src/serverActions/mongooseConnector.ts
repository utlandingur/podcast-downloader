"use server";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

let cachedConnection: typeof mongoose | null = null;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGO_URI) {
    throw new Error(
      "Please define the MONGODB_CONNECTION environment variable"
    );
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  const connection = await mongoose.connect(MONGO_URI);

  cachedConnection = connection;

  return connection;
}
