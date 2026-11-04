import { Pool } from "pg";

const db = new Pool({
  connectionString: process.env.DATABASE_URL,

  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Connection error handling
db.on("error", (error) => {
  console.error("Unexpected PostgreSQL error:", error);
});

// Test database connection
export const connectDB = async () => {
  try {
    const client = await db.connect();

    const result = await client.query(
      "SELECT current_database(), current_user",
    );

    console.log("PostgreSQL Connected: ✅🎉");

    client.release();
  } catch (error) {
    console.error("PostgreSQL connection failed:", error);
    throw error;
  }
};

export default db;
