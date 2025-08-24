// post\jest.config.mjs

export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  extensionsToTreatAsEsm: [".ts"],
  // Only transform TS (avoid double-processing JS)
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      { useESM: true, tsconfig: "<rootDir>/tsconfig.jest.json" },
    ],
  },
  // 🔒 Single alias — no .js variant
  moduleNameMapper: {
    "^@nihil_backend/post/(.*)$": "<rootDir>/src/$1", // in post
    // Map bare ESM-style relative imports produced by TS without adding .js
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  moduleFileExtensions: ["ts", "js", "json"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  injectGlobals: true,
  collectCoverageFrom: ["**/*.{ts,js}"],
  coverageDirectory: "./coverage",
  // Prevent Jest from picking compiled output if present
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  // Helps ESM resolution with ts-jest
  resolver: "ts-jest-resolver",
};
