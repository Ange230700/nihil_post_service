// post\jest.setup.cjs

import { jest } from "@jest/globals";
import path from "path";
import dotenv from "dotenv";

jest.setTimeout(15_000);

const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

if (process.env.DEBUG_ENV === "1") {
  console.log(`[jest.setup] loaded env from: ${envPath}`);
}

module.exports = {};
