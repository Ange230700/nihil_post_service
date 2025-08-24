// post\jest.config.mjs

/** @type {import('jest').Config} */
export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",

  rootDir: ".",
  testMatch: ["**/*.spec.ts"],

  extensionsToTreatAsEsm: [".ts"],

  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "<rootDir>/tsconfig.jest.json",
      },
    ],
  },

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@nihil_backend/post/(.*)$": "<rootDir>/src/$1",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"],
  injectGlobals: true,

  moduleFileExtensions: ["ts", "js", "mjs", "cjs", "json"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],

  collectCoverageFrom: ["src/**/*.{ts,js}"],
  coverageDirectory: "./coverage",

  verbose: true,
};
