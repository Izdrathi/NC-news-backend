const { selectTopics, postTopic } = require("../models/topic-model.js");

exports.getTopics = (req, res, next) => {
    selectTopics()
        .then((allTopics) => {
            res.status(200).send({ topics: allTopics });
        })
        .catch((err) => {
            next(err);
        });
};

exports.addTopic = (req, res, next) => {
    postTopic(req.body)
        .then((newTopic) => {
            res.status(201).send(newTopic);
        })
        .catch((err) => {
            next(err);
        });
};
