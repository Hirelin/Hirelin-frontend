import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SERVER_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  client: {
    NEXT_PUBLIC_SERVER_URL: z.string().url(),
    NEXT_PUBLIC_NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },

  runtimeEnv: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NODE_ENV: process.env.NODE_ENV || "development",
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV || "development",
  },
});
