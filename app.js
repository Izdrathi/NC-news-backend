const express = require("express");
const { getTopics } = require("./controllers/app-controller.js");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
