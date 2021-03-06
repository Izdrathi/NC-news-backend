const db = require("../db/connection.js");

exports.selectArticleById = (article_id) => {
    return db
        .query(
            `
    SELECT articles.*, 
    CAST(COUNT(comments.article_id) AS INT) AS comment_count
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
            [article_id]
        )
        .then(({ rows }) => {
            if (rows.length === 0)
                return Promise.reject({
                    status: 404,
                    msg: "Article not found",
                });
            else return rows[0];
        });
};

exports.updateVotes = (article_id, voteObject) => {
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
        UPDATE articles
        SET
          votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`,
            [votes, article_id]
        )
        .then(({ rows }) => {
            if (rows.length === 0)
                return Promise.reject({
                    status: 404,
                    msg: "Article not found",
                });
            else return rows[0];
        });
};

exports.selectArticles = (sort_by = "created_at", order = "DESC", topic) => {
    const validForSortBy = [
        "article_id",
        "title",
        "topic",
        "author",
        "created_at",
        "votes",
        "comment_count",
    ];
    const validOrder = ["ASC", "DESC"];

    if (!validForSortBy.includes(sort_by) || !validOrder.includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid query" });
    }

    let queryString = `SELECT articles.*, 
  CAST(COUNT(comments.article_id) AS INT) AS comment_count
  FROM articles 
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id `;

    const queryValues = [];
    if (topic) {
        queryString += `WHERE articles.topic = $1`;
        queryValues.push(topic);
    }
    queryString += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

    return db.query(queryString, queryValues).then(({ rows: articles }) => {
        return articles;
    });
};

exports.checkArticleExists = (article_id) => {
    return db
        .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
        .then(({ rows }) => {
            if (rows.length === 0)
                return Promise.reject({
                    status: 404,
                    msg: "Article not found",
                });
            else return rows;
        });
};

exports.insertArticle = (articleToAdd) => {
    const { author, title, body, topic } = articleToAdd;
    return db
        .query(
            `
      INSERT INTO articles (author, title, body, topic) 
      VALUES ($1, $2, $3, $4)  
      RETURNING *;`,
            [author, title, body, topic]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.deleteArticleById = (article_id) => {
    return db
        .query("DELETE FROM articles WHERE article_id = $1 RETURNING*;", [
            article_id,
        ])
        .then(({ rows }) => {
            return rows;
        });
};
