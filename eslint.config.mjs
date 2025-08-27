// post\eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Merge rules from typescript-eslint's recommendedTypeChecked array
const tsTypeCheckedRules = Object.assign(
  {},
  ...tseslint.configs.recommendedTypeChecked
    .map((c) => c?.rules)
    .filter(Boolean),
);

export default defineConfig([
  // Ignore caches, build, coverage, etc.
  globalIgnores(["node_modules", "dist", ".eslintcache", ".tmp", "coverage"]),

  // JS-only files (configs, scripts) — NOT type-aware
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.node,
      sourceType: "module",
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },

  // TypeScript (type-aware) — only under src/**
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: path.join(__dirname, "tsconfig.json"),
        tsconfigRootDir: __dirname,
        sourceType: "module",
      },
      globals: globals.node,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      ...tsTypeCheckedRules,
    },
  },

  // Turn off rule conflicts with Prettier + run Prettier as an ESLint rule
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
]);
