const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Craftsman = require("../models/craftsman.model");

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError(401, "Invalid credentials"));
    }

    const adminEmail = (process.env.ADMIN_EMAIL || "").trim();
    const adminPasswordHash = (process.env.ADMIN_PASSWORD_HASH || "").trim();

    if (!adminEmail || !adminPasswordHash) {
      return next(createError(500, "Admin credentials not configured"));
    }

    const emailMatch = email.toLowerCase().trim() === adminEmail.toLowerCase();
    const passwordMatch = await bcrypt.compare(password, adminPasswordHash);

    if (!emailMatch || !passwordMatch) {
      return next(createError(401, "Invalid credentials"));
    }

    const token = jwt.sign(
      { role: "admin", email: adminEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return global.returnJson(res, 200, true, "Admin login successful", {
      token,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

const getAllCraftsmenForAdmin = async (req, res, next) => {
  try {
    const craftsmen = await Craftsman.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return global.returnJson(
      res,
      200,
      true,
      "Craftsmen fetched successfully for admin",
      craftsmen
    );
  } catch (error) {
    return next(createError(500, error.message));
  }
};

const toggleFeaturedForAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    if (typeof featured !== "boolean") {
      return next(createError(400, "featured must be true or false"));
    }

    const craftsman = await Craftsman.findById(id);

    if (!craftsman) {
      return next(createError(404, "Craftsman not found"));
    }

    craftsman.featured = featured;
    await craftsman.save();

    return global.returnJson(
      res,
      200,
      true,
      featured
        ? "Craftsman added to featured list"
        : "Craftsman removed from featured list",
      {
        _id: craftsman._id,
        featured: craftsman.featured,
      }
    );
  } catch (error) {
    return next(createError(500, error.message));
  }
};

const deleteCraftsmanForAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const craftsman = await Craftsman.findById(id);

    if (!craftsman) {
      return next(createError(404, "Craftsman not found"));
    }

    await Craftsman.findByIdAndDelete(id);

    return global.returnJson(res, 200, true, "Craftsman deleted successfully", {
      _id: id,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

module.exports = {
  loginAdmin,
  getAllCraftsmenForAdmin,
  toggleFeaturedForAdmin,
  deleteCraftsmanForAdmin,
};
