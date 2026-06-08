const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const craftsmanRoutes = require("./routes/craftsman.routes");
const serviceRequestRoutes = require("./routes/serviceRequest.routes");
const adminRoutes = require("./routes/admin.routes");

const { returnJson } = require("./utils/response");
const errorHandler = require("./middlewares/error.middleware");
const { generalLimiter } = require("./middlewares/rateLimiters.middleware");

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
// express-mongo-sanitize is incompatible with Express 5 (req.query is getter-only).
// Manually sanitize body and params — query is protected via escapeRegex in controllers.
app.use((req, res, next) => {
  if (req.body)   req.body   = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  next();
});

app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  return returnJson(res, 200, true, "Forsa API is running", null);
});

app.use("/api", generalLimiter);
app.use("/api/craftsmen", craftsmanRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

module.exports = app;
