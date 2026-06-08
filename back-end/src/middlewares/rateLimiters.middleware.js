const rateLimit = require("express-rate-limit");
const { returnJson } = require("../utils/response");

const GENERAL_MAX        = parseInt(process.env.RATE_LIMIT_GENERAL_MAX, 10)         || 100;
const LOGIN_MAX          = parseInt(process.env.RATE_LIMIT_LOGIN_MAX, 10)           || 5;
const REGISTER_MAX       = parseInt(process.env.RATE_LIMIT_REGISTER_MAX, 10)        || 3;
const SERVICE_REQ_MAX    = parseInt(process.env.RATE_LIMIT_SERVICE_REQUEST_MAX, 10) || 5;

// Builds a handler that returns our standard response envelope.
// req.rateLimit.resetTime is a Date set by express-rate-limit before handler fires.
const makeHandler = (message) => (req, res) => {
  const retryAfter = req.rateLimit?.resetTime
    ? Math.ceil((req.rateLimit.resetTime.getTime() - Date.now()) / 1000)
    : 0;
  return returnJson(res, 429, false, message, { retryAfter });
};

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: GENERAL_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: makeHandler("Too many requests, please try again later."),
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: LOGIN_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: makeHandler("Too many login attempts. Please try again in 15 minutes."),
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: REGISTER_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: makeHandler("Too many registration attempts. Please try again in 1 hour."),
});

const serviceRequestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: SERVICE_REQ_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: makeHandler("Too many service requests submitted. Please wait before submitting more."),
});

module.exports = { generalLimiter, loginLimiter, registerLimiter, serviceRequestLimiter };
