// post\jest.setup.cjs

const path = require("path");
const dotenv = require("dotenv");

// eslint-disable-next-line no-undef
jest.setTimeout(15_000);

const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

if (process.env.DEBUG_ENV === "1") {
  console.log(`[jest.setup] loaded env from: ${envPath}`);
}

// Provide throwaway RSA keys automatically in tests
const { generateKeyPairSync } = require("crypto");
if (!process.env.JWT_PRIVATE_KEY || !process.env.JWT_PUBLIC_KEY) {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });
  process.env.JWT_PRIVATE_KEY = privateKey
    .export({ type: "pkcs8", format: "pem" })
    .toString();
  process.env.JWT_PUBLIC_KEY = publicKey
    .export({ type: "spki", format: "pem" })
    .toString();
}

// Handy defaults (optional)
process.env.ACCESS_TOKEN_TTL ||= "15m";
process.env.REFRESH_TOKEN_TTL ||= "30d";
