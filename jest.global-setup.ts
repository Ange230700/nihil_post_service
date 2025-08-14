// post/jest.global-setup.ts
import { createEphemeralDb } from "../test-utils/ephemeral-db.mjs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export default async () => {
  await createEphemeralDb({
    baseUrlEnvKey: "POST_DATABASE_URL",
    prismaSchemaPath: require.resolve("nihildbpost/prisma/schema.prisma"),
    runtimeUrlEnvKey: "POST_DATABASE_URL",
    metaFile: ".tmp-post-test-db.json",
  });
};
