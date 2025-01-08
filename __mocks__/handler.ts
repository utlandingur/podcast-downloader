// This file is used to create dummy data for testing purposes
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

jest.mock("../src/lib/db", () => ({
  connectToDatabase: jest.fn(),
}));

const mongod = new MongoMemoryServer();

export const connect = async () => {
  await mongod.start();
  const uri = await mongod.getUri();

  await mongoose.connect(uri);
};

export const closeDatabase = async (): Promise<void> => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

export const clearDatabase = async (): Promise<void> => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
