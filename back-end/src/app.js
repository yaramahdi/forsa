const express = require("express");
const cors = require("cors");
const path = require("path");

const craftsmanRoutes = require("./routes/craftsman.routes");
const serviceRequestRoutes = require("./routes/serviceRequest.routes");

const { returnJson } = require("./modules/my_modules");

global.returnJson = returnJson;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  return returnJson(res, 200, true, "Forsa API is running", null);
});

app.use("/api/craftsmen", craftsmanRoutes);
app.use("/api/service-requests", serviceRequestRoutes);

app.use((error, req, res, next) => {
  return returnJson(
    res,
    error.statusCode || 500,
    false,
    error.message || "Internal Server Error",
    null
  );
});

module.exports = app;