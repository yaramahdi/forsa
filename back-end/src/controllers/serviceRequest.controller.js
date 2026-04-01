const createError = require("http-errors");
const Craftsman = require("../models/craftsman.model");
const ServiceRequest = require("../models/serviceRequest.model");

// هذه الدالة مسؤولة عن إنشاء طلب خدمة جديد
const createServiceRequest = async (req, res, next) => {
  try {
    // نأخذ بيانات المستخدم والحرفي المختار من body
    const { clientName, clientPhone, craftsmanId } = req.body;

    // نتأكد أن الحرفي موجود أصلًا
    const craftsman = await Craftsman.findById(craftsmanId);

    if (!craftsman) {
      return next(createError(404, "Craftsman not found"));
    }

    // ننشئ طلب الخدمة ونربطه بالحرفي المختار
    const savedRequest = await ServiceRequest.create({
      clientName,
      clientPhone,
      craftsmanId,
    });

    // نرجع رد منظم + رقم واتساب/جوال الحرفي حتى يُستخدم لاحقًا في صفحة الشكر
    return global.returnJson(
      res,
      201,
      true,
      "Service request created successfully",
      {
        serviceRequest: savedRequest,
        craftsmanPhone: craftsman.phone,
      }
    );
  } catch (error) {
    return next(createError(500, error.message));
  }
};

module.exports = {
  createServiceRequest,
};