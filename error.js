exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23503" || err.code === "23502")
    res.status(400).send({ msg: "Invalid input" });
  else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error" });
};
