const express = require("express");
const {
  getTopics,
  getArticleById,
  updateArticleById,
  getUsers,
} = require("./controllers/app-controller.js");
const {
  handlePsqlErrors,
  handle500s,
  handleCustomErrors,
} = require("./error.js");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);
app.patch("/api/articles/:article_id", updateArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
