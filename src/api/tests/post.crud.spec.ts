// post\src\api\tests\post.crud.spec.ts

import request from "supertest";
import app from "@nihil_backend/post/api/config";
import { APIResponse, PostDTO } from "@nihil_backend/post/api/dto/PostDTO";

jest.setTimeout(15000);
const API = "/api/posts";

describe("Post CRUD API", () => {
  let postId: string;
  const basePost = {
    userId: "user-test-id",
    content: "Hello, Nihil!",
    mediaUrl: "https://cdn.example.com/img.png",
  };

  it("should create a new post", async () => {
    const res = await request(app).post(API).send(basePost).expect(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data.content).toBe(basePost.content);
    postId = res.body.data.id;
    expect(postId).toBeDefined();
  });

  it("should get all posts", async () => {
    const res = await request(app).get(API).expect(200);
    const body = res.body as APIResponse<PostDTO[]>;
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.some((p) => p.id === postId)).toBe(true);
  });

  it("should get a post by id", async () => {
    const res = await request(app).get(`${API}/${postId}`).expect(200);
    expect(res.body.data.id).toBe(postId);
  });

  it("should update a post", async () => {
    const res = await request(app)
      .put(`${API}/${postId}`)
      .send({ content: "Updated content" })
      .expect(200);
    expect(res.body.data.content).toBe("Updated content");
  });

  it("should delete a post", async () => {
    await request(app).delete(`${API}/${postId}`).expect(200);
    // Should now 404
    await request(app).get(`${API}/${postId}`).expect(404);
  });
});
