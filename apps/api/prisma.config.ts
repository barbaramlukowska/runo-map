import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// CLI-only config; migrations need a direct connection (the app uses the pooled URL).
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DIRECT_URL"),
  },
});
