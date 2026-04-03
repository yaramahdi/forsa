const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const Craftsman = require("../models/craftsman.model");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const deleteFiles = (files = []) => {
  files.forEach((filePath) => {
    const fullPath = path.join(__dirname, "..", filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  });
};

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
    } = req.body;

    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !password?.trim() ||
      !profession?.trim() ||
      !city?.trim() ||
      !neighborhood?.trim() ||
      !phone?.trim() ||
      yearsOfExperience === undefined ||
      yearsOfExperience === null ||
      yearsOfExperience === ""
    ) {
      return next(createError(400, "All required fields must be provided"));
    }

    if (!req.files || req.files.length !== 3) {
      return next(createError(400, "Exactly 3 work images are required"));
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingCraftsman = await Craftsman.findOne({ email: normalizedEmail });

    if (existingCraftsman) {
      return next(createError(400, "This email is already registered"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const workImages = req.files.map((file) => `/uploads/craftsmen/${file.filename}`);

    const savedCraftsman = await Craftsman.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      profession: profession.trim(),
      city: city.trim(),
      neighborhood: neighborhood.trim(),
      phone: phone.trim(),
      yearsOfExperience: Number(yearsOfExperience),
      bio: bio?.trim() || "",
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

    const craftsman = await Craftsman.findOne({
      email: email?.toLowerCase().trim(),
    });

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

const getAllCraftsmen = async (req, res, next) => {
  try {
    const { profession, city, search } = req.query;

    const filter = {};

    if (profession) {
      filter.profession = profession;
    }

    if (city) {
      filter.city = city;
    }

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { profession: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { neighborhood: { $regex: search, $options: "i" } },
      ];
    }

    const craftsmen = await Craftsman.find(filter).select("-password");

    return global.returnJson(
      res,
      200,
      true,
      "Craftsmen fetched successfully",
      craftsmen
    );
  } catch (error) {
    return next(createError(500, error.message));
  }
};

const getCraftsmanById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const craftsman = await Craftsman.findById(id).select("-password");

    if (!craftsman) {
      return next(createError(404, "Craftsman not found"));
    }

    return global.returnJson(
      res,
      200,
      true,
      "Craftsman fetched successfully",
      craftsman
    );
  } catch (error) {
    return next(createError(500, error.message));
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const craftsmanId = req.user.id;

    const craftsman = await Craftsman.findById(craftsmanId).select("-password");

    if (!craftsman) {
      return next(createError(404, "Craftsman not found"));
    }

    return global.returnJson(
      res,
      200,
      true,
      "My profile fetched successfully",
      craftsman
    );
  } catch (error) {
    return next(createError(500, error.message));
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const craftsmanId = req.user.id;

    const {
      firstName,
      lastName,
      profession,
      city,
      neighborhood,
      phone,
      yearsOfExperience,
      bio,
    } = req.body;

    const updateData = {};

    if (firstName !== undefined) updateData.firstName = firstName.trim();
    if (lastName !== undefined) updateData.lastName = lastName.trim();
    if (profession !== undefined) updateData.profession = profession.trim();
    if (city !== undefined) updateData.city = city.trim();
    if (neighborhood !== undefined) updateData.neighborhood = neighborhood.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (yearsOfExperience !== undefined) {
      updateData.yearsOfExperience = Number(yearsOfExperience);
    }
    if (bio !== undefined) updateData.bio = bio.trim();

    if (req.files && req.files.length > 0) {
      if (req.files.length !== 3) {
        return next(createError(400, "Exactly 3 work images are required"));
      }

      const currentCraftsman = await Craftsman.findById(craftsmanId);

      if (!currentCraftsman) {
        return next(createError(404, "Craftsman not found"));
      }

      deleteFiles(currentCraftsman.workImages);

      updateData.workImages = req.files.map(
        (file) => `/uploads/craftsmen/${file.filename}`
      );
    }

    const updatedCraftsman = await Craftsman.findByIdAndUpdate(
      craftsmanId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedCraftsman) {
      return next(createError(404, "Craftsman not found"));
    }

    return global.returnJson(
      res,
      200,
      true,
      "My profile updated successfully",
      updatedCraftsman
    );
  } catch (error) {
    return next(createError(500, error.message));
  }
};

module.exports = {
  registerCraftsman,
  loginCraftsman,
  getAllCraftsmen,
  getCraftsmanById,
  getMyProfile,
  updateMyProfile,
};