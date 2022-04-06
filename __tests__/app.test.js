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
                expect(articles).toBeSortedBy("created_at", {
                    descending: true,
                });
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
describe("GET /api/articles (comment count)", () => {
    test("status: 200 - responds with an array of objects including comment_count", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                response.body.articles.forEach((article) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            comment_count: expect.any(Number),
                        })
                    );
                });
            });
    });
});
describe("POST /api/articles/:article_id/comments", () => {
    test("status: 201 - responds with the newly added comment", () => {
        const newComment = {
            username: "butter_bridge",
            body: "case of blablabla",
        };
        return request(app)
            .post("/api/articles/8/comments")
            .send(newComment)
            .expect(201)
            .then(({ body: { comment } }) => {
                expect(comment).toEqual(
                    expect.objectContaining({
                        author: "butter_bridge",
                        body: "case of blablabla",
                        comment_id: 19,
                        votes: 0,
                        article_id: 8,
                    })
                );
            });
    });
    test('status: 400 - responds with "invalid input" for invalid article_id', () => {
        const newComment = {
            username: "butter_bridge",
            body: "case of blablabla",
        };
        return request(app)
            .post("/api/articles/blabla/comments")
            .send(newComment)
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid input");
            });
    });
    test('status: 404 - responds with "article not found" when passed article_id that\'s not in the database', () => {
        const newComment = {
            username: "butter_bridge",
            body: "case of blablabla",
        };
        return request(app)
            .post("/api/articles/999/comments")
            .send(newComment)
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Article not found");
            });
    });
    test('status: 400 - responds with "Invalid input" when passed comment doesn\'t match criteria - invalid username ', () => {
        const newComment = {
            username: "rivi",
            body: "case of blablabla",
        };
        return request(app)
            .post("/api/articles/2/comments")
            .send(newComment)
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid input");
            });
    });
    test('status: 400 - responds with "Invalid input" when passed comment doesn\'t match criteria - invalid body type ', () => {
        const newComment = {
            username: "rivi",
            body: 7,
        };
        return request(app)
            .post("/api/articles/2/comments")
            .send(newComment)
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid input");
            });
    });
    test('status: 400 - responds with "Invalid input" when passed comment doesn\'t match criteria - empty comment ', () => {
        const newComment = {};
        return request(app)
            .post("/api/articles/2/comments")
            .send(newComment)
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid input");
            });
    });
    test('status: 400 - responds with "Invalid input" when passed comment doesn\'t match criteria - missing body ', () => {
        const newComment = { username: "butter_bridge" };
        return request(app)
            .post("/api/articles/2/comments")
            .send(newComment)
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid input");
            });
    });
});
describe("GET /api/articles (queries)", () => {
    test("status: 200 - accepts sort_by query", () => {
        return request(app)
            .get("/api/articles?sort_by=author")
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy("author", { descending: true });
            });
    });
    test('status: 400 - responds with "Invalid sort query" for invalid query', () => {
        return request(app)
            .get("/api/articles?sort_by=bleble")
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid query");
            });
    });
    test("status: 200 - accepts order query", () => {
        return request(app)
            .get("/api/articles?sort_by=author&order=ASC")
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy("author", { ascending: true });
            });
    });
    test('status: 400 - responds with "Invalid order query" for invalid order', () => {
        return request(app)
            .get("/api/articles?order=blabla")
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid query");
            });
    });
    test("status: 200 - accepts topic filter query and returns relevant articles only", () => {
        return request(app)
            .get("/api/articles?topic=cats")
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toHaveLength(1);
                expect(articles[0].topic).toEqual("cats");
            });
    });
    test("status: 200 - accepts topic filter query and returns empty array when passed input doesn't match any articles", () => {
        return request(app)
            .get("/api/articles?topic=banana")
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toHaveLength(0);
            });
    });
});
describe("DELETE /api/comments/:comment_id", () => {
    test("status: 204 - deletes specified comment ", () => {
        return request(app)
            .delete("/api/comments/16")
            .expect(204)
            .then(() => {
                return db
                    .query(`SELECT * FROM comments WHERE article_id = 6;`)
                    .then(({ rows }) => {
                        expect(rows.length).toBe(0);
                    });
            });
    });
    test('status: 404 - responds with "Comment not found" when passed comment_id that\'s not in DB', () => {
        return request(app)
            .delete("/api/comments/999")
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Comment not found");
            });
    });
    test('status: 400 - responds with "Invalid input" when passed comment_id that\'s invalid', () => {
        return request(app)
            .delete("/api/comments/bananas")
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid input");
            });
    });
});
describe("GET /api/users/:username", () => {
    test("status: 200 - responds with a user object", () => {
        return request(app)
            .get("/api/users/lurker")
            .expect(200)
            .then(({ body: { user } }) => {
                expect(user).toEqual(
                    expect.objectContaining({
                        username: expect.any(String),
                        avatar_url: expect.any(String),
                        name: expect.any(String),
                    })
                );
                expect(user.username).toBe("lurker");
            });
    });
    test('status: 404 - responds with " user not found" when passed username that\'s not in the database', () => {
        return request(app)
            .get("/api/users/blabla")
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("User not found");
            });
    });
});
describe("POST /api/articles", () => {
    test("status: 201 - responds with the newly added article", () => {
        const newArticle = {
            author: "butter_bridge",
            title: "bla",
            body: "case of blablabla",
            topic: "cats",
        };
        return request(app)
            .post("/api/articles")
            .send(newArticle)
            .expect(201)
            .then(({ body }) => {
                expect(body).toEqual(
                    expect.objectContaining({
                        author: "butter_bridge",
                        title: "bla",
                        body: "case of blablabla",
                        topic: "cats",
                        votes: 0,
                        created_at: expect.any(String),
                        article_id: expect.any(Number),
                    })
                );
            });
    });
    test('status: 400 - responds with "invalid input" for invalid input - missing parts', () => {
        const newArticle = {
            author: "butter_bridge",
            title: "bla",
            body: "case of blablabla",
        };
        return request(app)
            .post("/api/articles")
            .send(newArticle)
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid input");
            });
    });
    test('status: 400 - responds with "Invalid input" when passed comment doesn\'t match criteria - invalid username ', () => {
        const newArticle = {
            author: "rivi",
            title: "bla",
            body: "case of blablabla",
            topic: "cats",
        };
        return request(app)
            .post("/api/articles")
            .send(newArticle)
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid input");
            });
    });
    test('status: 400 - responds with "Invalid input" when passed comment doesn\'t match criteria - empty comment ', () => {
        const newArticle = {};
        return request(app)
            .post("/api/articles")
            .send(newArticle)
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid input");
            });
    });
});
describe("PATCH /api/comments/:comment_id", () => {
    test("status: 200 - responds with updated object when votes are a positive number", () => {
        const voteUpdate = { inc_votes: 1 };
        return request(app)
            .patch("/api/comments/18")
            .send(voteUpdate)
            .expect(200)
            .then(({ body: { comment } }) => {
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: 18,
                        body: expect.any(String),
                        author: expect.any(String),
                        article_id: expect.any(Number),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                    })
                );
                expect(comment.votes).toBe(17);
            });
    });
    test("status: 200 - responds with updated object when votes are a negative number", () => {
        const voteUpdate = { inc_votes: -2 };
        return request(app)
            .patch("/api/comments/17")
            .send(voteUpdate)
            .expect(200)
            .then(({ body: { comment } }) => {
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: 17,
                        body: expect.any(String),
                        author: expect.any(String),
                        article_id: expect.any(Number),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                    })
                );
                expect(comment.comment_id).toBe(17);
                expect(comment.votes).toBe(18);
            });
    });
    test('status: 400 - responds with "Bad request" for empty input', () => {
        const voteUpdate = {};
        return request(app)
            .patch("/api/comments/17")
            .send(voteUpdate)
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request");
            });
    });
    test('status: 400 - responds with "Invalid input" for invalid input', () => {
        const voteUpdate = { inc_votes: "bananas" };
        return request(app)
            .patch("/api/comments/17")
            .send(voteUpdate)
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid input");
            });
    });
    test('status: 404 - responds with "comment not found" when passed comment_id that\'s not in the database', () => {
        const voteUpdate = { inc_votes: 10 };
        return request(app)
            .patch("/api/comments/999")
            .send(voteUpdate)
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Comment not found");
            });
    });
});
describe("POST /api/topic", () => {
    test("status: 201 - responds with the newly added topic", () => {
        const newTopic = { slug: "coding", description: "fun time" };
        return request(app)
            .post("/api/topics")
            .send(newTopic)
            .expect(201)
            .then(({ body }) => {
                expect(body).toEqual(
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String),
                    })
                );
                expect(body.slug).toBe("coding");
            });
    });
    test('status: 400 - responds with "invalid input" for invalid input - missing parts', () => {
        const newTopic = { slug: "coding" };
        return request(app)
            .post("/api/topics")
            .send(newTopic)
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid input");
            });
    });
    test('status: 400 - responds with "Invalid input" when passed topic doesn\'t match criteria - empty input ', () => {
        const newTopic = {};
        return request(app)
            .post("/api/topics")
            .send(newTopic)
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid input");
            });
    });
    test('status: 400 - responds with "Topic already exists" when passed topic includes already existing slug ', () => {
        const newTopic = { slug: "mitch", description: "fun time" };
        return request(app)
            .post("/api/topics")
            .send(newTopic)
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Topic already exists");
            });
    });
});
describe("DELETE /api/articles/:article_id", () => {
    test("status: 204 - deletes specified article ", () => {
        return request(app)
            .delete("/api/articles/12")
            .expect(204)
            .then(() => {
                return db
                    .query(`SELECT * FROM articles WHERE article_id = 12;`)
                    .then(({ rows }) => {
                        expect(rows.length).toBe(0);
                    });
            });
    });
    test('status: 404 - responds with "Article not found" when passed article_id that\'s not in DB', () => {
        return request(app)
            .delete("/api/articles/999")
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Article not found");
            });
    });
    test('status: 400 - responds with "Invalid input" when passed article_id that\'s invalid', () => {
        return request(app)
            .delete("/api/articles/bananas")
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid input");
            });
    });
});
