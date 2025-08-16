// post/jest.global-setup.ts
import { createEphemeralDb } from "../test-utils/ephemeral-db.mjs";
import { createRequire } from "node:module";
import "dotenv/config";

const require = createRequire(import.meta.url);

export default async () => {
  const schemaPath = require.resolve("nihildbpost/prisma/schema.prisma");

  await createEphemeralDb({
    baseUrlEnvKey: "POST_DATABASE_URL",
    prismaSchemaPath: schemaPath,
    runtimeUrlEnvKey: "POST_DATABASE_URL",
    metaFile: ".tmp-post-test-db.json",
  });
};
