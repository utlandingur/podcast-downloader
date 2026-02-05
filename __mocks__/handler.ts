// This file is used to create dummy data for testing purposes
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

jest.mock("../src/lib/db", () => ({
  connectToDatabase: jest.fn(),
}));

let mongod: MongoMemoryServer | null = null;

export const connect = async () => {
  if (!mongod) {
    mongod = await MongoMemoryServer.create({
      instance: {
        ip: "127.0.0.1",
        port: 0,
      },
    });
  }
  const uri = mongod.getUri();

  await mongoose.connect(uri);
};

export const closeDatabase = async (): Promise<void> => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongod) {
    await mongod.stop();
    mongod = null;
  }
};

export const clearDatabase = async (): Promise<void> => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
