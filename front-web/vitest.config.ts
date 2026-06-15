import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    reporters: ["default"],
    setupFiles: ["./src/test/setup.ts"],
  },
});
