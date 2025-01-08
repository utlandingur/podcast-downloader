import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cachedConnection: typeof mongoose | null = null;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_CONNECTION environment variable"
    );
  }

  if (cachedConnection) {
    console.log("=> using cached database instance");
    return cachedConnection;
  }

  const connection = await mongoose.connect(MONGODB_URI);

  cachedConnection = connection;

  return connection;
}

export const getMongoClient = async () => {
  await connectToDatabase(); // Ensure Mongoose is connected
  return mongoose.connection.getClient(); // Get the underlying MongoClient
};
