const db = require("../db/connection.js");

exports.selectUsers = () => {
    return db.query("SELECT username FROM users;").then(({ rows }) => {
        return rows;
    });
};

exports.selectUserByName = (username) => {
    return db
        .query("SELECT * FROM users WHERE username = $1;", [username])
        .then(({ rows }) => {
            if (rows.length === 0)
                return Promise.reject({
                    status: 404,
                    msg: "User not found",
                });
            else return rows[0];
        });
};
