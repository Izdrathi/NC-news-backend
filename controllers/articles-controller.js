const {
    selectArticleById,
    updateVotes,
    selectArticles,
    insertArticle,
    deleteArticleById,
    checkArticleExists,
} = require("../models/articles-model.js");

exports.getArticles = (req, res, next) => {
    const { sort_by, order, topic } = req.query;
    selectArticles(sort_by, order, topic)
        .then((allArticles) => {
            res.status(200).send({ articles: allArticles });
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

exports.postArticle = (req, res, next) => {
    insertArticle(req.body)
        .then((newArticle) => {
            res.status(201).send(newArticle);
        })
        .catch((err) => {
            next(err);
        });
};

exports.deleteArticle = (req, res, next) => {
    const { article_id } = req.params;
    Promise.all([checkArticleExists(article_id), deleteArticleById(article_id)])
        .then(() => {
            res.status(204).send();
        })
        .catch((err) => {
            next(err);
        });
};
