// post\src\api\tests\factories\post.factory.ts

import { faker } from "@nihil_backend/post/api/tests/utils/faker.js";

export function makePost(
  overrides: Partial<{
    userId: string;
    content: string;
    mediaUrl: string | null;
    originalPostId: string | null;
  }> = {},
) {
  return {
    userId: overrides.userId ?? faker.string.uuid(),
    content:
      overrides.content ??
      faker.lorem.sentences({ min: 1, max: 3 }).slice(0, 4000),
    mediaUrl:
      overrides.mediaUrl ??
      (faker.datatype.boolean() ? faker.image.url() : null),
    originalPostId:
      overrides.originalPostId ??
      (faker.datatype.boolean() ? faker.string.uuid() : null),
  };
}
