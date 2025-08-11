// post\jest.global-setup.ts
import { createEphemeralDb } from "../test-utils/ephemeral-db.js";
export default async () => {
  await createEphemeralDb({
    baseUrlEnvKey: "POST_DATABASE_URL",
    prismaSchemaPath: require.resolve("nihildbpost/prisma/schema.prisma"),
    runtimeUrlEnvKey: "POST_DATABASE_URL",
    metaFile: ".tmp-post-test-db.json",
  });
};
