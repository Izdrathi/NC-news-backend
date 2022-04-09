const db = require("../db/connection.js");

exports.selectCommentsByArticleId = (article_id) => {
    return db
        .query("SELECT * FROM comments WHERE article_id = $1;", [article_id])
        .then(({ rows }) => {
            return rows;
        });
};

exports.insertComment = (article_id, commentToAdd) => {
    const { username, body } = commentToAdd;
    if (!commentToAdd || body === undefined) {
        return Promise.reject({ status: 400, msg: "Invalid input" });
    }
    return db
        .query(
            `
      INSERT INTO comments (author, body, article_id) 
      VALUES ($1, $2, $3)  
      RETURNING *;`,
            [username, body, article_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.checkComments = (comment_id) => {
    return db
        .query("SELECT * FROM comments WHERE comment_id = $1;", [comment_id])
        .then(({ rows }) => {
            if (rows.length === 0)
                return Promise.reject({
                    status: 404,
                    msg: "Comment not found",
                });
            else return rows;
        });
};

exports.deleteCommentById = (comment_id) => {
    return db
        .query("DELETE FROM comments WHERE comment_id = $1 RETURNING*;", [
            comment_id,
        ])
        .then(({ rows }) => {
            return rows;
        });
};

exports.updateCommentVotes = (comment_id, voteObject) => {
    if (
        Object.keys(voteObject).length === 0 ||
        typeof voteObject.inc_votes === !Number
    ) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }
    const votes = voteObject.inc_votes;
    return db
        .query(
            `
    UPDATE comments
    SET
      votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;`,
            [votes, comment_id]
        )
        .then(({ rows }) => {
            if (rows.length === 0)
                return Promise.reject({
                    status: 404,
                    msg: "Comment not found",
                });
            else return rows[0];
        });
};
