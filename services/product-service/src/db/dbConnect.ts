import mongoose from "mongoose";
function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

export async function connectDB(): Promise<void> {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
  }

  const mongoUri = process.env.MONGODB_URI;
  await mongoose.connect(mongoUri);
  console.log("Product DB is connected");
}
