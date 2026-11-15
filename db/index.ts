// db/index.ts
import { connect } from "@tidbcloud/serverless";
import { drizzle } from "drizzle-orm/tidb-serverless";
import * as schema from "./schema";
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables.");
}
const client = connect({ url: process.env.DATABASE_URL! });
export const db = drizzle({ client, schema });
