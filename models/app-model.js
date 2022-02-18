const db = require("../db/connection.js");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

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
        return Promise.reject({ status: 404, msg: "Article not found" });
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
  if (votes >= 0) {
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
          return Promise.reject({ status: 404, msg: "Article not found" });
        else return rows[0];
      });
  } else {
    return db
      .query(
        `
          UPDATE articles
          SET
            votes = $1 - votes
          WHERE article_id = $2
          RETURNING *;`,
        [votes, article_id]
      )
      .then(({ rows }) => {
        if (rows.length === 0)
          return Promise.reject({ status: 404, msg: "Article not found" });
        else return rows[0];
      });
  }
};

exports.selectUsers = () => {
  return db.query("SELECT username FROM users;").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticles = () => {
  return db
    .query(
      `SELECT articles.*, 
        CAST(COUNT(comments.article_id) AS INT) AS comment_count
        FROM articles 
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      return rows;
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "Article not found" });
      else return rows;
    });
};

exports.insertComment = (article_id, commentToAdd) => {
  const { username, body } = commentToAdd;
  if (!commentToAdd) {
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
