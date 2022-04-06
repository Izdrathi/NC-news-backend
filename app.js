const express = require("express");
const {
    getApi,
    getUsers,
    getUserByName,
} = require("./controllers/app-controller.js");
const {
    getArticleById,
    updateArticleById,
    getArticles,
    postArticle,
    deleteArticle,
} = require("./controllers/articles-controller.js");
const {
    getCommentsByArticleId,
    postComment,
    deleteComment,
    updateComment,
} = require("./controllers/comments-controller.js");
const { getTopics, addTopic } = require("./controllers/topic-controller.js");
const {
    handlePsqlErrors,
    handle500s,
    handleCustomErrors,
} = require("./error.js");

const app = express();
app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.post("/api/topics", addTopic);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", updateArticleById);
app.post("/api/articles", postArticle);
app.delete("/api/articles/:article_id", deleteArticle);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/comments/:comment_id", updateComment);

app.get("/api/users", getUsers);
app.get("/api/users/:username", getUserByName);

app.delete("/api/comments/:comment_id", deleteComment);

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Path not found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
