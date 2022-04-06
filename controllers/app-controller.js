const { selectUsers, selectUserByName } = require("../models/app-model.js");
const fs = require("fs");

exports.getApi = (req, res, next) => {
    let allEndpoints;
    fs.readFile("endpoints.json", "utf8", function (err, data) {
        allEndpoints = JSON.parse(data);
        res.status(200).send(allEndpoints);
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

exports.getUserByName = (req, res, next) => {
    const { username } = req.params;
    selectUserByName(username)
        .then((user) => {
            res.status(200).send({ user });
        })
        .catch((err) => {
            next(err);
        });
};
