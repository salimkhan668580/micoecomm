import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
  }

  const mongoUri =
    process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/user-service";
  await mongoose.connect(mongoUri);
  console.log("User DB is connected salim khan");
}
