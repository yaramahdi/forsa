const mongoose = require("mongoose");

const craftsmanSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@gmail\.com$/i, "Email must be a valid Gmail address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profession: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      enum: ["غزة", "شمال غزة", "الوسطى", "الجنوب"],
    },
    neighborhood: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^059\d{7}$/, "Phone must start with 059 and contain 10 digits"],
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    workImages: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length >= 3 && arr.length <= 12;
        },
        message: "Craftsman must have between 3 and 12 work images",
      },
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Craftsman = mongoose.model("Craftsman", craftsmanSchema);

module.exports = Craftsman;