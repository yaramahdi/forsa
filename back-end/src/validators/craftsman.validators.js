const { body, param } = require("express-validator");

const CITIES = ["غزة", "شمال غزة", "الوسطى", "الجنوب"];
const GMAIL_REGEX = /^[^\s@]+@gmail\.com$/i;
const PHONE_REGEX = /^059\d{7}$/;

const registerCraftsmanValidator = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .matches(GMAIL_REGEX).withMessage("Must be a valid Gmail address"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("profession").trim().notEmpty().withMessage("Profession is required"),
  body("city")
    .trim()
    .notEmpty().withMessage("City is required")
    .isIn(CITIES).withMessage(`City must be one of: ${CITIES.join(", ")}`),
  body("neighborhood").trim().notEmpty().withMessage("Neighborhood is required"),
  body("phone")
    .trim()
    .notEmpty().withMessage("Phone is required")
    .matches(PHONE_REGEX).withMessage("Phone must start with 059 and contain 10 digits"),
  body("yearsOfExperience")
    .notEmpty().withMessage("Years of experience is required")
    .isFloat({ min: 0 }).withMessage("Years of experience must be 0 or more")
    .toFloat(),
  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ min: 1 }).withMessage("Price must be at least 1")
    .toFloat(),
];

const loginCraftsmanValidator = [
  body("email").trim().notEmpty().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const updateCraftsmanValidator = [
  body("firstName").optional().trim().notEmpty().withMessage("First name cannot be empty"),
  body("lastName").optional().trim().notEmpty().withMessage("Last name cannot be empty"),
  body("profession").optional().trim().notEmpty().withMessage("Profession cannot be empty"),
  body("city")
    .optional()
    .trim()
    .notEmpty().withMessage("City cannot be empty")
    .isIn(CITIES).withMessage(`City must be one of: ${CITIES.join(", ")}`),
  body("neighborhood").optional().trim().notEmpty().withMessage("Neighborhood cannot be empty"),
  body("phone")
    .optional()
    .trim()
    .notEmpty().withMessage("Phone cannot be empty")
    .matches(PHONE_REGEX).withMessage("Phone must start with 059 and contain 10 digits"),
  body("yearsOfExperience")
    .optional()
    .isFloat({ min: 0 }).withMessage("Years of experience must be 0 or more")
    .toFloat(),
  body("price")
    .optional()
    .isFloat({ min: 1 }).withMessage("Price must be at least 1")
    .toFloat(),
];

const craftsmanIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid craftsman ID"),
];

const resetPasswordValidator = [
  body("email").trim().notEmpty().withMessage("Email is required"),
  body("newPassword")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];

module.exports = {
  registerCraftsmanValidator,
  loginCraftsmanValidator,
  updateCraftsmanValidator,
  craftsmanIdParamValidator,
  resetPasswordValidator,
};
