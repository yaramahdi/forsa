const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    clientPhone: {
      type: String,
      required: true,
      trim: true,
    },

    craftsmanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Craftsman",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "contacted", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

serviceRequestSchema.index({ craftsmanId: 1, status: 1, createdAt: -1 });

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);

module.exports = ServiceRequest;