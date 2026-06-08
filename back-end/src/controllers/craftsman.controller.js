const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const Craftsman = require("../models/craftsman.model");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const escapeRegex = require("../utils/escapeRegex");
const { returnJson } = require("../utils/response");
const { deleteFiles } = require("../utils/fileCleanup");

const deleteSingleFile = (filePath) => {
  if (!filePath) return;

  const fullPath = path.join(__dirname, "..", filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

const parsePriceValue = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const numericPrice = Number(value);

  if (!Number.isFinite(numericPrice) || numericPrice < 1) {
    return null;
  }

  return numericPrice;
};

const buildCraftsmanResponse = (craftsman) => ({
  _id: craftsman._id,
  firstName: craftsman.firstName,
  lastName: craftsman.lastName,
  email: craftsman.email,
  profession: craftsman.profession,
  city: craftsman.city,
  neighborhood: craftsman.neighborhood,
  phone: craftsman.phone,
  yearsOfExperience: craftsman.yearsOfExperience,
  price: craftsman.price,
  bio: craftsman.bio,
  profileImage: craftsman.profileImage,
  workImages: craftsman.workImages,
  averageRating: craftsman.averageRating,
  ratingsCount: craftsman.ratingsCount,
  featured: craftsman.featured,
  createdAt: craftsman.createdAt,
  updatedAt: craftsman.updatedAt,
});

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
      price,
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
      yearsOfExperience === "" ||
      price === undefined ||
      price === null ||
      price === ""
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

    const parsedPrice = parsePriceValue(price);
    if (parsedPrice === null) {
      return next(createError(400, "Price must be a number greater than or equal to 1"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const workImages = req.files.map(
      (file) => `/uploads/craftsmen/${file.filename}`
    );

    let savedCraftsman;
    try {
      savedCraftsman = await Craftsman.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        profession: profession.trim(),
        city: city.trim(),
        neighborhood: neighborhood.trim(),
        phone: phone.trim(),
        yearsOfExperience: Number(yearsOfExperience),
        price: parsedPrice,
        bio: bio?.trim() || "",
        workImages,
      });
    } catch (err) {
      await deleteFiles(workImages);
      throw err;
    }

    const token = jwt.sign(
      { id: savedCraftsman._id, email: savedCraftsman.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return returnJson(res, 201, true, "Craftsman registered successfully", {
      token,
      craftsman: buildCraftsmanResponse(savedCraftsman),
    });
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
      return next(createError(400, "خطأ في كلمة المرور او الايميل"));
    }

    const isPasswordCorrect = await bcrypt.compare(password, craftsman.password);

    if (!isPasswordCorrect) {
      return next(createError(400, "خطأ في كلمة المرور او الايميل"));
    }

    const token = jwt.sign(
      {
        id: craftsman._id,
        email: craftsman.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return returnJson(res, 200, true, "Login successful", {
      token,
      craftsman: buildCraftsmanResponse(craftsman),
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

const getAllCraftsmen = async (req, res, next) => {
  try {
    const { profession, city, search } = req.query;
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (profession) filter.profession = String(profession);
    if (city) filter.city = String(city);

    if (search) {
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { firstName: { $regex: safeSearch, $options: "i" } },
        { lastName: { $regex: safeSearch, $options: "i" } },
        { profession: { $regex: safeSearch, $options: "i" } },
        { city: { $regex: safeSearch, $options: "i" } },
        { neighborhood: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const [craftsmen, total] = await Promise.all([
      Craftsman.find(filter).select("-password").skip(skip).limit(limit),
      Craftsman.countDocuments(filter),
    ]);

    return returnJson(res, 200, true, "Craftsmen fetched successfully", {
      craftsmen,
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

const getCraftsmanById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const craftsman = await Craftsman.findById(id).select("-password");

    if (!craftsman) {
      return next(createError(404, "Craftsman not found"));
    }

    return returnJson(res, 200, true, "Craftsman fetched successfully", craftsman);
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

    return returnJson(res, 200, true, "My profile fetched successfully", craftsman);
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
      price,
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
    if (price !== undefined) {
      const parsedPrice = parsePriceValue(price);

      if (parsedPrice === null) {
        return next(createError(400, "Price must be a number greater than or equal to 1"));
      }

      updateData.price = parsedPrice;
    }
    if (bio !== undefined) updateData.bio = bio.trim();

    const currentCraftsman = await Craftsman.findById(craftsmanId);

    if (!currentCraftsman) {
      return next(createError(404, "Craftsman not found"));
    }

    const profileImageFile = req.files?.profileImage?.[0];
    const workImageFiles = req.files?.workImages || [];

    if (profileImageFile) {
      updateData.profileImage = `/uploads/craftsmen/${profileImageFile.filename}`;
    }

    if (workImageFiles.length > 0) {
      const newWorkImages = workImageFiles.map(
        (file) => `/uploads/craftsmen/${file.filename}`
      );

      const mergedImages = [...(currentCraftsman.workImages || []), ...newWorkImages];

      if (mergedImages.length > 12) {
        await deleteFiles(newWorkImages);
        return next(createError(400, "You can upload up to 12 work images only"));
      }

      updateData.workImages = mergedImages;
    }

    // Collect new uploaded files for cleanup if DB update fails
    const newFilePaths = [
      ...(profileImageFile ? [`/uploads/craftsmen/${profileImageFile.filename}`] : []),
      ...workImageFiles.map((f) => `/uploads/craftsmen/${f.filename}`),
    ];

    const oldProfileImage = profileImageFile ? currentCraftsman.profileImage : null;

    let updatedProfile;
    try {
      updatedProfile = await Craftsman.findByIdAndUpdate(
        craftsmanId,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");
    } catch (err) {
      await deleteFiles(newFilePaths);
      throw err;
    }

    // DB succeeded — safe to delete the replaced profile image
    if (oldProfileImage) {
      deleteSingleFile(oldProfileImage);
    }

    return returnJson(res, 200, true, "My profile updated successfully", updatedProfile);
  } catch (error) {
    return next(createError(500, error.message));
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    if (!email?.trim() || !newPassword?.trim()) {
      return next(createError(400, "البريد الإلكتروني وكلمة المرور مطلوبان"));
    }

    if (newPassword.length < 8) {
      return next(createError(400, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"));
    }

    const normalizedEmail = email.toLowerCase().trim();
    const craftsman = await Craftsman.findOne({ email: normalizedEmail });

    if (!craftsman) {
      return next(createError(404, "لا يوجد حساب مرتبط بهذا البريد الإلكتروني"));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Craftsman.updateOne({ email: normalizedEmail }, { $set: { password: hashedPassword } });

    return returnJson(res, 200, true, "تمت إعادة تعيين كلمة المرور بنجاح", null);
  } catch (error) {
    return next(createError(500, error.message));
  }
};

const getFeaturedCraftsmen = async (req, res, next) => {
  try {
    const featuredCraftsmen = await Craftsman.find({ featured: true })
      .select("-password")
      .sort({ createdAt: -1 });

    return returnJson(
      res,
      200,
      true,
      "Featured craftsmen fetched successfully",
      featuredCraftsmen
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
  getFeaturedCraftsmen,
  resetPassword,
};
