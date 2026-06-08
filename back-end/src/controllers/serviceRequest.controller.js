const createError = require("http-errors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Craftsman = require("../models/craftsman.model");
const ServiceRequest = require("../models/serviceRequest.model");
const { returnJson } = require("../utils/response");

const ALLOWED_TRANSITIONS = {
  pending:   ["confirmed", "contacted", "cancelled"],
  confirmed: ["contacted", "completed", "cancelled"],
  contacted: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

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

function getOptionalAuthenticatedCraftsmanId(req) {
  const directUserId = getCurrentCraftsmanId(req);
  if (directUserId) return String(directUserId);

  const authHeader = req.headers?.authorization || req.headers?.Authorization || "";
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7).trim();
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return String(
      decoded?.id ||
        decoded?._id ||
        decoded?.userId ||
        decoded?.craftsmanId ||
        ""
    ).trim() || null;
  } catch {
    return null;
  }
}

// إنشاء طلب خدمة جديد
const createServiceRequest = async (req, res, next) => {
  try {
    const clientName = String(req.body?.clientName || "").trim();
    const clientPhone = normalizePhone(req.body?.clientPhone);
    const craftsmanId = String(req.body?.craftsmanId || "").trim();
    const jobDetails = String(req.body?.jobDetails || "").trim();

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

    const currentAuthenticatedCraftsmanId = getOptionalAuthenticatedCraftsmanId(req);

    if (
      currentAuthenticatedCraftsmanId &&
      String(currentAuthenticatedCraftsmanId) === String(craftsmanId)
    ) {
      return next(
        createError(400, "You cannot request a service from your own account")
      );
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
      jobDetails,
      status: "pending",
    });

    return returnJson(res, 201, true, "Service request created successfully", {
      serviceRequest: savedRequest,
      craftsmanPhone: craftsman.phone,
    });
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

    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const skip = (page - 1) * limit;

    const filter = { craftsmanId };

    const [serviceRequests, total] = await Promise.all([
      ServiceRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ServiceRequest.countDocuments(filter),
    ]);

    return returnJson(res, 200, true, "My service requests fetched successfully", {
      serviceRequests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
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

    const allowedStatuses = Object.keys(ALLOWED_TRANSITIONS);

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

    const currentStatus = request.status;

    if (currentStatus === nextStatus) {
      return returnJson(res, 200, true, "Service request status updated successfully", {
        serviceRequest: request,
      });
    }

    if (!ALLOWED_TRANSITIONS[currentStatus].includes(nextStatus)) {
      return next(
        createError(400, `Cannot transition from '${currentStatus}' to '${nextStatus}'`)
      );
    }

    request.status = nextStatus;
    await request.save();

    return returnJson(res, 200, true, "Service request status updated successfully", {
      serviceRequest: request,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

module.exports = {
  createServiceRequest,
  getMyServiceRequests,
  updateMyServiceRequestStatus,
};
