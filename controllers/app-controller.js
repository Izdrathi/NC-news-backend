const {
  selectTopics,
  selectArticleById,
  updateVotes,
  selectUsers,
  selectArticles,
} = require("../models/app-model.js");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((allTopics) => {
      res.status(200).send({ topics: allTopics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticleById = (req, res, next) => {
  const { article_id } = req.params;
  updateVotes(article_id, req.body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((allUsers) => {
      res.status(200).send({ username: allUsers });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((allArticles) => {
      res.status(200).send({ articles: allArticles });
    })
    .catch((err) => {
      next(err);
    });
};
