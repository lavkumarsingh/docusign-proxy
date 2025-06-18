const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    errorCode: err.code || "INTERNAL_ERROR",
    message: err.message || "Something went wrong"
  });
};
