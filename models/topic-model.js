const db = require("../db/connection.js");

exports.selectTopics = () => {
    return db.query("SELECT * FROM topics;").then(({ rows }) => {
        return rows;
    });
};

exports.postTopic = (topicToAdd) => {
    const { slug, description } = topicToAdd;
    return db
        .query(
            `
      INSERT INTO topics ( slug, description ) 
      VALUES ($1, $2)  
      RETURNING *;`,
            [slug, description]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};
