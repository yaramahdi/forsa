const express = require("express");

// نستورد دوال طلبات الخدمة من الكنترولر
const {
  createServiceRequest,
  getMyServiceRequests,
} = require("../controllers/serviceRequest.controller");

// نستورد الميدل وير المسؤول عن التحقق من التوكن
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

// إنشاء طلب خدمة جديد من المستخدم
router.post("/", createServiceRequest);

// جلب الطلبات الخاصة بالحرفي الحالي
// هذا الراوت محمي، ويعتمد على التوكن
router.get("/me", verifyToken, getMyServiceRequests);

module.exports = router;