const createError = require("http-errors");
const mongoose = require("mongoose");
const Craftsman = require("../models/craftsman.model");
const ServiceRequest = require("../models/serviceRequest.model");

function normalizePhone(value) {
  const map = {
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  };

  return String(value || "")
    .replace(/[٠-٩]/g, (digit) => map[digit] || digit)
    .replace(/\s+/g, "")
    .trim();
}

function getCurrentCraftsmanId(req) {
  return (
    req.user?.id ||
    req.user?._id ||
    req.user?.userId ||
    req.user?.craftsmanId ||
    null
  );
}

// إنشاء طلب خدمة جديد
const createServiceRequest = async (req, res, next) => {
  try {
    const clientName = String(req.body?.clientName || "").trim();
    const clientPhone = normalizePhone(req.body?.clientPhone);
    const craftsmanId = String(req.body?.craftsmanId || "").trim();

    if (!clientName) {
      return next(createError(400, "Client name is required"));
    }

    if (!clientPhone) {
      return next(createError(400, "Client phone is required"));
    }

    if (!/^\d{10,13}$/.test(clientPhone)) {
      return next(createError(400, "Client phone is invalid"));
    }

    if (!craftsmanId || !mongoose.Types.ObjectId.isValid(craftsmanId)) {
      return next(createError(400, "Craftsman id is invalid"));
    }

    const craftsman = await Craftsman.findById(craftsmanId).select(
      "_id firstName lastName phone"
    );

    if (!craftsman) {
      return next(createError(404, "Craftsman not found"));
    }

    const savedRequest = await ServiceRequest.create({
      clientName,
      clientPhone,
      craftsmanId: craftsman._id,
      status: "pending",
    });

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

// جلب كل طلبات الحرفي الحالي
const getMyServiceRequests = async (req, res, next) => {
  try {
    const craftsmanId = getCurrentCraftsmanId(req);

    if (!craftsmanId) {
      return next(createError(401, "Unauthorized"));
    }

    const serviceRequests = await ServiceRequest.find({ craftsmanId })
      .sort({ createdAt: -1 })
      .lean();

    return global.returnJson(
      res,
      200,
      true,
      "My service requests fetched successfully",
      {
        serviceRequests,
        total: serviceRequests.length,
      }
    );
  } catch (error) {
    return next(createError(500, error.message));
  }
};

// تحديث حالة طلب خدمة خاص بالحرفي الحالي
const updateMyServiceRequestStatus = async (req, res, next) => {
  try {
    const craftsmanId = getCurrentCraftsmanId(req);
    const { requestId } = req.params;
    const nextStatus = String(req.body?.status || "").trim();

    if (!craftsmanId) {
      return next(createError(401, "Unauthorized"));
    }

    if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
      return next(createError(400, "Request id is invalid"));
    }

    const allowedStatuses = [
      "pending",
      "confirmed",
      "contacted",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(nextStatus)) {
      return next(createError(400, "Invalid status"));
    }

    const request = await ServiceRequest.findOne({
      _id: requestId,
      craftsmanId,
    });

    if (!request) {
      return next(createError(404, "Service request not found"));
    }

    request.status = nextStatus;
    await request.save();

    return global.returnJson(
      res,
      200,
      true,
      "Service request status updated successfully",
      {
        serviceRequest: request,
      }
    );
  } catch (error) {
    return next(createError(500, error.message));
  }
};

module.exports = {
  createServiceRequest,
  getMyServiceRequests,
  updateMyServiceRequestStatus,
};