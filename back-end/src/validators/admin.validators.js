const { body, param } = require("express-validator");

const loginAdminValidator = [
  body("email").trim().notEmpty().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const toggleFeaturedValidator = [
  body("featured")
    .exists({ checkNull: true }).withMessage("featured is required")
    .isBoolean().withMessage("featured must be true or false"),
];

const adminCraftsmanIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid craftsman ID"),
];

module.exports = {
  loginAdminValidator,
  toggleFeaturedValidator,
  adminCraftsmanIdParamValidator,
};
