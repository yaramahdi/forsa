const express = require("express");
const cors = require("cors");

const craftsmanRoutes = require("./routes/craftsman.routes");
const serviceRequestRoutes = require("./routes/serviceRequest.routes");

const { returnJson } = require("./modules/my_modules");

global.returnJson = returnJson;

const app = express();

// السماح للفرونت بإرسال requests للباك
app.use(cors());

// تحويل البيانات القادمة بصيغة JSON إلى req.body
app.use(express.json());

// راوت تجريبي للتأكد أن الـ API شغال
app.get("/", (req, res) => {
  return returnJson(res, 200, true, "Forsa API is running", null);
});

// راوتات الحرفيين
app.use("/api/craftsmen", craftsmanRoutes);

// راوتات طلبات الخدمة
app.use("/api/service-requests", serviceRequestRoutes);

// أي error يمر عبر next(createError(...)) سيصل إلى هنا
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