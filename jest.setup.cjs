// post\jest.setup.cjs

// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("node:path");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const dotenv = require("dotenv");

// eslint-disable-next-line no-undef
jest.setTimeout(15_000);

const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

if (process.env.DEBUG_ENV === "1") {
  console.log(`[jest.setup] loaded env from: ${envPath}`);
}

module.exports = {};
