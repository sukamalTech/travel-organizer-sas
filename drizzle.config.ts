// drizzle.config.ts
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    host: "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
    port: 4000,
    user: "2dgCj5f1H1mH2qR.root",
    password: "Iqz8olJExPi5VT7V",
    database: "test",
    ssl: {
      rejectUnauthorized: true,
    },
  },
});
