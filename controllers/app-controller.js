const {
    selectTopics,
    selectArticleById,
    updateVotes,
    selectUsers,
    selectArticles,
    selectCommentsByArticleId,
    checkArticleExists,
    insertComment,
    deleteCommentById,
    checkComments,
} = require("../models/app-model.js");
const fs = require("fs");

exports.getApi = (req, res, next) => {
    let allEndpoints;
    fs.readFile("endpoints.json", "utf8", function (err, data) {
        allEndpoints = JSON.parse(data);
        res.status(200).send(allEndpoints);
    });
};

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
    const { sort_by, order, topic } = req.query;
    selectArticles(sort_by, order, topic)
        .then((allArticles) => {
            res.status(200).send({ articles: allArticles });
        })
        .catch((err) => {
            next(err);
        });
};

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    Promise.all([
        selectCommentsByArticleId(article_id),
        checkArticleExists(article_id),
    ])
        .then(([comments]) => {
            res.status(200).send({ comments });
        })
        .catch((err) => {
            next(err);
        });
};

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    // checks if article exists, otherwise it will try to
    //  post invalid comment resulting in PSQL error
    checkArticleExists(article_id)
        .then(() => {})
        .catch((err) => {
            next(err);
        });

    insertComment(article_id, req.body)
        .then((newComment) => {
            res.status(201).send({ comment: newComment[0] });
        })
        .catch((err) => {
            next(err);
        });
};

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    checkComments(comment_id).catch((err) => {
        next(err);
    });

    deleteCommentById(comment_id)
        .then(() => {
            res.status(204).send();
        })
        .catch((err) => {
            next(err);
        });
};
