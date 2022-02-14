const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");

const runTest = () => {
  return seed(testData).then(() => db.end());
};
runTest();

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
          console.log(response.body.topics);
        });
      });
  });
});
