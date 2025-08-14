// post\jest.global-teardown.ts
import { dropEphemeralDb } from "../test-utils/ephemeral-db.mjs";
export default async () => {
  await dropEphemeralDb(".tmp-post-test-db.json");
};
