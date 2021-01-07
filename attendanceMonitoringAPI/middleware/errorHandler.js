function errorHandler (err, req, res, next) {
  const { statusCode, errorMessage } = err;

  res.status(statusCode).send({
    errorMessage
  });
}

module.exports = errorHandler;
