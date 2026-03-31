const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const Craftsman = require("../models/craftsman.model");
const jwt = require("jsonwebtoken");

const registerCraftsman = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      profession,
      city,
      neighborhood,
      phone,
      yearsOfExperience,
      bio,
      workImages,
    } = req.body;

    const existingCraftsman = await Craftsman.findOne({ email });

    if (existingCraftsman) {
      return next(createError(400, "This email is already registered"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const savedCraftsman = await Craftsman.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profession,
      city,
      neighborhood,
      phone,
      yearsOfExperience,
      bio,
      workImages,
    });

    const craftsmanResponse = {
      _id: savedCraftsman._id,
      firstName: savedCraftsman.firstName,
      lastName: savedCraftsman.lastName,
      email: savedCraftsman.email,
      profession: savedCraftsman.profession,
      city: savedCraftsman.city,
      neighborhood: savedCraftsman.neighborhood,
      phone: savedCraftsman.phone,
      yearsOfExperience: savedCraftsman.yearsOfExperience,
      bio: savedCraftsman.bio,
      workImages: savedCraftsman.workImages,
      averageRating: savedCraftsman.averageRating,
      ratingsCount: savedCraftsman.ratingsCount,
      isFeatured: savedCraftsman.isFeatured,
      createdAt: savedCraftsman.createdAt,
      updatedAt: savedCraftsman.updatedAt,
    };

    return global.returnJson(
      res,
      201,
      true,
      "Craftsman registered successfully",
      craftsmanResponse
    );
  } catch (error) {
    return next(createError(500, error.message));
  }
};



const loginCraftsman = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const craftsman = await Craftsman.findOne({ email });

    if (!craftsman) {
      return next(createError(400, "Invalid email or password"));
    }

    const isPasswordCorrect = await bcrypt.compare(password, craftsman.password);

    if (!isPasswordCorrect) {
      return next(createError(400, "Invalid email or password"));
    }

    const token = jwt.sign(
      {
        id: craftsman._id,
        email: craftsman.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const craftsmanResponse = {
      _id: craftsman._id,
      firstName: craftsman.firstName,
      lastName: craftsman.lastName,
      email: craftsman.email,
      profession: craftsman.profession,
      city: craftsman.city,
      neighborhood: craftsman.neighborhood,
      phone: craftsman.phone,
      yearsOfExperience: craftsman.yearsOfExperience,
      bio: craftsman.bio,
      workImages: craftsman.workImages,
      averageRating: craftsman.averageRating,
      ratingsCount: craftsman.ratingsCount,
      isFeatured: craftsman.isFeatured,
      createdAt: craftsman.createdAt,
      updatedAt: craftsman.updatedAt,
    };

    return global.returnJson(
      res,
      200,
      true,
      "Login successful",
      {
        token,
        craftsman: craftsmanResponse,
      }
    );
  } catch (error) {
    return next(createError(500, error.message));
  }
};




module.exports = {
  registerCraftsman,
  loginCraftsman
};