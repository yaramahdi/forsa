const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// هذا الميدل وير يتأكد أن المستخدم أرسل token صحيح
const verifyToken = async (req, res, next) => {
  try {
    // نقرأ قيمة Authorization من الـ headers
    const authHeader = req.headers.authorization;

    // إذا لم يوجد token أصلًا
    if (!authHeader) {
      return next(createError(401, "Access denied. No token provided"));
    }

    // نتأكد أن صيغة الهيدر صحيحة:
    // Bearer TOKEN
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return next(createError(401, "Invalid token format"));
    }

    // نستخرج التوكن نفسه
    const token = parts[1];

    // نتحقق من صحة التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // نخزن البيانات المفكوكة داخل req
    // حتى نستفيد منها في أي controller لاحقًا
    req.user = decoded;

    // نكمل إلى الراوت/الكنترولر التالي
    next();
  } catch (error) {
    return next(createError(401, "Invalid or expired token"));
  }
};

module.exports = {
  verifyToken,
};