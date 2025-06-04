import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "singlestore",
  tablesFilter: ["drive-tutorial_*"],
  dbCredentials: {
    host: process.env.SINGLESTORE_HOST!,
    port: Number(process.env.SINGLESTORE_PORT!),
    user: process.env.SINGLESTORE_USER!,
    password: process.env.SINGLESTORE_PASS!,
    database: process.env.SINGLESTORE_DB_NAME!,
    ssl: {},
  },
} satisfies Config;
