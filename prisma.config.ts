import "dotenv/config";
import { defineConfig } from "prisma/config";

// DIRECT_URL is used by the Prisma CLI (migrations).
// DATABASE_URL is the pooled connection used by the app at runtime.
// Both are provided by Neon — see .env.example for the format.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Falls back to DATABASE_URL so `prisma generate` works before .env is set up.
    // Set DIRECT_URL to the Neon direct connection string before running migrations.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
