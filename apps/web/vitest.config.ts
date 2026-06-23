import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The finance engine is pure — run tests in the fast node environment.
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
