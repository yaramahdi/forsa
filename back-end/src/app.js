const express = require("express");
const cors = require("cors");
const craftsmanRoutes = require("./routes/craftsman.routes");
const { returnJson } = require("./modules/my_modules");

global.returnJson = returnJson;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return returnJson(res, 200, true, "Forsa API is running", null);
});

app.use("/api/craftsmen", craftsmanRoutes);

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