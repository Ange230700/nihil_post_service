// post\jest.setup.ts

import path from "path";
import dotenv from "dotenv"; // Load the .env that lives in the package being tested
import { cleanupTestResources } from "@nihil_backend/post/src/api/tests/test-utils";
// (Jest sets process.cwd() to the project's rootDir)
jest.setTimeout(15_000);
const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

if (process.env.DEBUG_ENV === "1") {
  console.log(`[jest.setup] loaded env from: ${envPath}`);
}

afterAll(async () => {
  await cleanupTestResources();
});
