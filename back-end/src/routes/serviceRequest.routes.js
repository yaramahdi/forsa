const express = require("express");

// نستورد الدالة المسؤولة عن إنشاء طلب خدمة جديد
const {
  createServiceRequest,
} = require("../controllers/serviceRequest.controller");

const router = express.Router();

// هذا الراوت يستقبل طلب POST لإنشاء طلب خدمة
router.post("/", createServiceRequest);

module.exports = router;