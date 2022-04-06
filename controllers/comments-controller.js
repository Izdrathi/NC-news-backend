const {
    selectCommentsByArticleId,
    insertComment,
    deleteCommentById,
    checkComments,
    updateCommentVotes,
} = require("../models/comments-model.js");
const { checkArticleExists } = require("../models/articles-model.js");

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

exports.updateComment = (req, res, next) => {
    const { comment_id } = req.params;
    updateCommentVotes(comment_id, req.body)
        .then((comment) => {
            res.status(200).send({ comment });
        })
        .catch((err) => {
            next(err);
        });
};
