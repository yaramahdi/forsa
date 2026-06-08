const { validationResult } = require("express-validator");
const { returnJson } = require("../utils/response");

const handleValidation = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((err) => ({
    field: err.path ?? err.param,
    message: err.msg,
  }));

  return returnJson(res, 400, false, "Validation failed", { errors });
};

module.exports = { handleValidation };
