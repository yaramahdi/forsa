const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(createError(401, "Access denied. No token provided"));
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return next(createError(401, "Invalid token format"));
    }

    const token = parts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return next(createError(401, "Access denied. Admin privileges required"));
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return next(createError(401, "Invalid or expired token"));
  }
};

module.exports = { verifyAdmin };
