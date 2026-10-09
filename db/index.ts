// db/index.ts
import { drizzle } from "drizzle-orm/tidb-serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables.");
}

export const db = drizzle(process.env.DATABASE_URL);
