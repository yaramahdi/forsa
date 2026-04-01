const express = require("express");
// نستورد الميدل وير المسؤول عن التحقق من التوكن
const { verifyToken } = require("../middlewares/auth.middleware");


// نستورد الدوال التي نحتاجها من الكنترولر
const {
  registerCraftsman,
  loginCraftsman,
  getAllCraftsmen,
  getCraftsmanById,
  getMyProfile
} = require("../controllers/craftsman.controller");

const router = express.Router();





// تسجيل حرفي جديد
router.post("/register", registerCraftsman);

// تسجيل دخول الحرفي
router.post("/login", loginCraftsman);

// جلب الحرفيين
// هذا الراوت يدعم أيضًا query params مثل:
// ?search=نجار
// ?profession=نجار
// ?city=غزة
router.get("/", getAllCraftsmen);

// جلب الملف الشخصي للحرفي الحالي
// هذا الراوت محمي، ولا يعمل إلا إذا أرسل المستخدم token صحيح
router.get("/me", verifyToken, getMyProfile);

router.get("/:id",getCraftsmanById)
module.exports = router;