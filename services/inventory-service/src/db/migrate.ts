import db from "./ConnectDB";
import fs from "fs";
import path from "path";

export const runMigrations = async () => {
  const client = await db.connect();

  try {
    // 1. Migration history table
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Read all migration files
    const migrationDir = path.join(
      process.cwd(),
      "src/db/migrations"
    );

    const files = fs
      .readdirSync(migrationDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    // 3. Execute pending migrations
    for (const file of files) {
      const { rows } = await client.query(
        "SELECT migration_name FROM schema_migrations WHERE migration_name = $1",
        [file]
      );

      if (rows.length > 0) {
        console.log(`Skipping ${file} - already executed`);
        continue;
      }

      const migrationPath = path.join(migrationDir, file);
      const sql = fs.readFileSync(migrationPath, "utf-8");

      await client.query("BEGIN");

      try {
        console.log(`Executing migration: ${file}`);
        await client.query(sql);

        await client.query(
          "INSERT INTO schema_migrations (migration_name) VALUES ($1)",
          [file]
        );

        await client.query("COMMIT");

        console.log(`Migration completed: ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    console.log("All migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    client.release();
  }
};