const createError = require("http-errors");
const Craftsman = require("../models/craftsman.model");

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
      featured ? "Craftsman added to featured list" : "Craftsman removed from featured list",
      {
        _id: craftsman._id,
        featured: craftsman.featured,
      }
    );
  } catch (error) {
    return next(createError(500, error.message));
  }
};

module.exports = {
  getAllCraftsmenForAdmin,
  toggleFeaturedForAdmin,
};