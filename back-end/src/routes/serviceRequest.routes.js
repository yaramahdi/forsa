const express = require("express");

const {
  createServiceRequest,
  getMyServiceRequests,
  updateMyServiceRequestStatus,
} = require("../controllers/serviceRequest.controller");

const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

// إنشاء طلب خدمة جديد من المستخدم
router.post("/", createServiceRequest);

// جلب الطلبات الخاصة بالحرفي الحالي
router.get("/me", verifyToken, getMyServiceRequests);

// تحديث حالة طلب خدمة خاص بالحرفي الحالي
router.patch("/:requestId/status", verifyToken, updateMyServiceRequestStatus);

module.exports = router;