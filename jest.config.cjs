// post\jest.config.cjs

/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",

  rootDir: ".",
  testMatch: ["**/*.spec.ts"],

  // tell Jest to treat .ts as ESM
  extensionsToTreatAsEsm: [".ts"],

  // Important for Node's ESM test env
  testEnvironmentOptions: { url: "http://localhost/" },

  // compile TS -> ESM
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "<rootDir>/tsconfig.jest.json",
        diagnostics: false,
      },
    ],
  },
  transformIgnorePatterns: ["/node_modules/"],

  // fix ESM path endings + your path alias
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@nihil_backend/post/(.*)\\.js$": "<rootDir>/src/$1.ts",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"],
  injectGlobals: true,

  moduleFileExtensions: ["ts", "js", "mjs", "cjs", "json"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],

  collectCoverageFrom: ["src/**/*.{ts,js}"],
  coverageDirectory: "./coverage",
  verbose: true,
};
