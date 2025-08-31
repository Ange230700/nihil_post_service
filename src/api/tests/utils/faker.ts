// post\src\api\tests\utils\faker.ts

import { faker as base } from "@faker-js/faker";

// Stable, deterministic test data across runs
base.seed(13);

export const faker = base;
