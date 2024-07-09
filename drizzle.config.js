import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DARABASE_URL,
  }
});