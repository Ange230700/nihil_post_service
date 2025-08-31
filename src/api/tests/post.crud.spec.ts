// post\src\api\tests\post.crud.spec.ts

import request from "supertest";
import app from "@nihil_backend/post/api/config.js";
import { startDb, stopDb } from "@nihil_backend/post/api/db.js";
import { z } from "zod";
import { makePost } from "@nihil_backend/post/api/tests/factories/post.factory.js";

/* --------------------------- Zod helpers --------------------------- */

const SuccessEnvelope = <D>(schema: z.ZodType<D>) =>
  z.object({ status: z.literal("success"), data: schema }).strict();

function expectSuccessData<D>(res: { body: unknown }, schema: z.ZodType<D>): D {
  const envelope = SuccessEnvelope(schema);
  const parsed = envelope.safeParse(res.body);
  if (!parsed.success) {
    throw new Error(
      "Response did not match schema: " + JSON.stringify(parsed.error.issues),
    );
  }
  return parsed.data.data;
}

/* --------------------- Minimal schemas used in asserts --------------------- */

const PostIdAndContent = z.object({
  id: z.uuid(),
  content: z.string(),
});

const PostList = z.array(PostIdAndContent);

/* --------------------------------- Constants --------------------------------- */

const API = "/api/posts";

/* --------------------------------- Lifecycle --------------------------------- */

beforeAll(async () => {
  await startDb();
});

afterAll(async () => {
  await stopDb();
});

/* ----------------------------------- Tests ----------------------------------- */

describe("Post CRUD API", () => {
  let postId = "";

  it("should create a new post", async () => {
    const basePost = makePost(); // ✅ fakerized payload
    const res = await request(app).post(API).send(basePost).expect(201);
    const created = expectSuccessData(res, PostIdAndContent);
    expect(created.content).toBe(basePost.content);
    postId = created.id;
    expect(postId).toBeDefined();
  });

  it("should get all posts", async () => {
    // Seed a few more posts to make pagination/listing meaningful
    await Promise.all(
      [makePost(), makePost(), makePost()].map((p) =>
        request(app).post(API).send(p),
      ),
    );

    const res = await request(app).get(API).expect(200);
    const data = expectSuccessData(res, PostList);
    expect(Array.isArray(data)).toBe(true);
    expect(data.some((p) => p.id === postId)).toBe(true);
  });

  it("should get a post by id", async () => {
    const res = await request(app).get(`${API}/${postId}`).expect(200);
    const post = expectSuccessData(res, PostIdAndContent);
    expect(post.id).toBe(postId);
  });

  it("should update a post", async () => {
    const newContent = makePost().content; // ✅ random but valid
    const res = await request(app)
      .put(`${API}/${postId}`)
      .send({ content: newContent })
      .expect(200);
    const updated = expectSuccessData(res, PostIdAndContent);
    expect(updated.content).toBe(newContent);
  });

  it("should delete a post", async () => {
    await request(app).delete(`${API}/${postId}`).expect(200);
    await request(app).get(`${API}/${postId}`).expect(404);
  });
});
