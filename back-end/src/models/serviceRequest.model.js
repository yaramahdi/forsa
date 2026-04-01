const mongoose = require("mongoose");

// هذا الـ schema يمثل طلب الخدمة الذي يرسله المستخدم للحرفي
const serviceRequestSchema = new mongoose.Schema(
  {
    // اسم المستخدم الذي طلب الخدمة
    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    // رقم جوال المستخدم
    clientPhone: {
      type: String,
      required: true,
      trim: true,
    },

    // الحرفي الذي اختاره المستخدم
    // نربطه مع جدول الحرفيين عن طريق الـ ObjectId
    craftsmanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Craftsman",
      required: true,
    },

    // حالة الطلب
    // حاليًا نبدأها pending
    status: {
      type: String,
      enum: ["pending", "contacted", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    // يضيف createdAt و updatedAt تلقائيًا
    timestamps: true,
  }
);

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);

module.exports = ServiceRequest;