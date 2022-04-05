const express = require("express");
const {
    getApi,
    getTopics,
    getArticleById,
    updateArticleById,
    getUsers,
    getArticles,
    getCommentsByArticleId,
    postComment,
    deleteComment,
    getUserByName,
} = require("./controllers/app-controller.js");
const {
    handlePsqlErrors,
    handle500s,
    handleCustomErrors,
} = require("./error.js");

const app = express();
app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", updateArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);

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
