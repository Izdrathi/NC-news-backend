const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("ANY PATH", () => {
  test("status: 404 - responds with path not found when given incorrect path", () => {
    return request(app)
      .get("/bad/route")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});
describe("GET /api/topics", () => {
  test("status: 200 - responds with an array ob objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics).toHaveLength(3);
        response.body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("status: 200 - responds with an article object", () => {
    return request(app)
      .get("/api/articles/10")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
        expect(article.article_id).toBe(10);
      });
  });
  test('status: 400 - responds with "invalid input" for invalid article_id', () => {
    return request(app)
      .get("/api/articles/blabla")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
  test('status: 404 - responds with " article not  found" when passed article_id that\'s not in the database', () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });
});
