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
describe("PATCH /api/articles/:article_id", () => {
  test("status: 200 - responds with updated object when votes are a positive number", () => {
    const voteUpdate = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/10")
      .send(voteUpdate)
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
        expect(article.votes).toBe(1);
      });
  });
  test("status: 200 - responds with updated object when votes are a negative number", () => {
    const voteUpdate = {
      inc_votes: -10,
    };
    return request(app)
      .patch("/api/articles/5")
      .send(voteUpdate)
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
        expect(article.votes).toBe(-10);
        expect(article.article_id).toBe(5);
      });
  });
  test('status: 400 - responds with "Bad request" for empty input', () => {
    const voteUpdate = {};
    return request(app)
      .patch("/api/articles/5")
      .send(voteUpdate)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test('status: 400 - responds with "Invalid input" for invalid input', () => {
    const voteUpdate = { inc_votes: "bananas" };
    return request(app)
      .patch("/api/articles/5")
      .send(voteUpdate)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
  test('status: 404 - responds with "article not found" when passed article_id that\'s not in the database', () => {
    const voteUpdate = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/999")
      .send(voteUpdate)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });
});
describe("GET /api/users", () => {
  test("status: 200 - responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.username).toHaveLength(4);
        response.body.username.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
});
describe("GET /api/articles", () => {
  test("status: 200 - responds with an array of article objects ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toHaveLength(12);
        response.body.articles.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  test("status: 200 - responds with an array of article objects sorted by created_at in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe("GET /api/articles/:article_id (comment count)", () => {
  test("status: 200 - responds with the relevant object including comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            comment_count: expect.any(Number),
          })
        );
        expect(article.comment_count).toBe(11);
      });
  });
  test("status: 200 - responds with the relevant object including comment_count = 0 when there are no comments for the article", () => {
    return request(app)
      .get("/api/articles/7")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            comment_count: expect.any(Number),
          })
        );
        expect(article.comment_count).toBe(0);
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("status: 200 - responds with an array of comment objects", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
          expect(comments).toHaveLength(11);
        });
      });
  });
  test("status: 200 - responds with an empty array when article has no comments", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(0);
      });
  });
  test('status: 400 - responds with "invalid input" for invalid article_id', () => {
    return request(app)
      .get("/api/articles/blabla/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
  test('status: 404 - responds with " article not  found" when passed article_id that\'s not in the database', () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });
});
