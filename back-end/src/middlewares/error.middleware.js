const { returnJson } = require("../utils/response");

const isDev = process.env.NODE_ENV !== "production";

const errorHandler = (err, req, res, next) => {
  const ts = new Date().toISOString();
  const isOperational = err.isOperational || err.expose;
  console.error(`[${ts}] ${req.method} ${req.originalUrl} — ${err.message}`);
  if (isDev && !isOperational) console.error(err.stack);

  let statusCode = 500;
  let message = "Internal server error";
  let data = null;

  if (err.isOperational || err.expose) {
    statusCode = err.statusCode || err.status || 500;
    message = err.message;
    if (err.details) {
      data = { details: err.details };
    }

  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    data = {
      errors: Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      })),
    };

  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;

  } else if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field} is already in use`;

  } else if (err.name === "MulterError") {
    statusCode = 400;
    message = err.message;

  } else if (isDev) {
    statusCode = err.statusCode || 500;
    message = err.message || "Internal server error";
    data = { stack: err.stack };
  }

  return returnJson(res, statusCode, false, message, data);
};

module.exports = errorHandler;
