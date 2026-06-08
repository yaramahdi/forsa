const { body, param } = require("express-validator");

const ARABIC_DIGIT_MAP = {
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
  "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
};

const normalizeArabicDigits = (value) =>
  String(value || "")
    .replace(/[٠-٩]/g, (d) => ARABIC_DIGIT_MAP[d] || d)
    .replace(/\s+/g, "")
    .trim();

const ALLOWED_STATUSES = ["pending", "confirmed", "contacted", "completed", "cancelled"];

const createServiceRequestValidator = [
  body("clientName").trim().notEmpty().withMessage("Client name is required"),
  body("clientPhone")
    .customSanitizer(normalizeArabicDigits)
    .notEmpty().withMessage("Client phone is required")
    .matches(/^\d{10,13}$/).withMessage("Client phone must be 10–13 digits"),
  body("craftsmanId").isMongoId().withMessage("Invalid craftsman ID"),
];

const updateStatusValidator = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(ALLOWED_STATUSES).withMessage(`Status must be one of: ${ALLOWED_STATUSES.join(", ")}`),
];

const requestIdParamValidator = [
  param("requestId").isMongoId().withMessage("Invalid request ID"),
];

module.exports = {
  createServiceRequestValidator,
  updateStatusValidator,
  requestIdParamValidator,
};
