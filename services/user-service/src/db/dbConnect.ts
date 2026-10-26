import mongoose from "mongoose";
import AdminModel from "../models/Admin.models.js";

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

async function initializeDefaultAdmin(): Promise<void> {
  if ((await AdminModel.countDocuments()) > 0) {
    return;
  }

  try {
    await AdminModel.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: "123456",
      role: "Admin",
    });
    console.log("Default admin account initialized");
  } catch (error: unknown) {
    if (!isDuplicateKeyError(error)) {
      throw error;
    }

    // Another service instance may have initialized the same account concurrently.
    if ((await AdminModel.countDocuments()) === 0) {
      throw error;
    }
  }
}

export async function connectDB(): Promise<void> {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
  }

  const mongoUri =
    process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/user-service";
  await mongoose.connect(mongoUri);
  await initializeDefaultAdmin();
  console.log("User DB is connected salim khan");
}
