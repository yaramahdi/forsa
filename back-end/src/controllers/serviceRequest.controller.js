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

    // نرجع رد منظم + رقم الحرفي حتى يستخدم لاحقًا في صفحة الشكر
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

// هذه الدالة تجلب كل الطلبات الخاصة بالحرفي الحالي من خلال الـ token
const getMyServiceRequests = async (req, res, next) => {
  try {
    // نأخذ id الحرفي الحالي من التوكن
    const craftsmanId = req.user.id;

    // نبحث عن كل الطلبات التي تخص هذا الحرفي
    // sort({ createdAt: -1 }) يعني الأحدث أولًا
    const serviceRequests = await ServiceRequest.find({ craftsmanId })
      .sort({ createdAt: -1 });

    // نرجع الطلبات بشكل منظم
    return global.returnJson(
      res,
      200,
      true,
      "My service requests fetched successfully",
      serviceRequests
    );
  } catch (error) {
    return next(createError(500, error.message));
  }
};

module.exports = {
  createServiceRequest,
  getMyServiceRequests,
};