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
// هذه الدالة تجلب حرفي واحد حسب الـ id
const getCraftsmanById = async (req, res, next) => {
  try {
    // نأخذ الـ id من الرابط
    const { id } = req.params;

    // نبحث عن الحرفي حسب الـ id
    // select("-password") معناها لا ترجع كلمة المرور
    const craftsman = await Craftsman.findById(id).select("-password");

    // إذا لم نجد الحرفي
    if (!craftsman) {
      return next(createError(404, "Craftsman not found"));
    }

    // إذا وجدناه نرجعه بشكل منظم
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

// هذه الدالة تجلب بيانات الحرفي الحالي اعتمادًا على الـ token
const getMyProfile = async (req, res, next) => {
  try {
    // الـ verifyToken middleware يضع بيانات التوكن داخل req.user
    // ونحن داخل التوكن خزّنا id و email
    const craftsmanId = req.user.id;

    // نبحث عن الحرفي الحالي في قاعدة البيانات
    // ونستثني password حتى لا ترجع في response
    const craftsman = await Craftsman.findById(craftsmanId).select("-password");

    // إذا لم نجد الحرفي
    if (!craftsman) {
      return next(createError(404, "Craftsman not found"));
    }

    // إذا وجدناه نرجع بياناته بشكل منظم
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
// هذه الدالة تعدّل بيانات الحرفي الحالي اعتمادًا على الـ token
const updateMyProfile = async (req, res, next) => {
  try {
    // نأخذ id الحرفي الحالي من التوكن
    const craftsmanId = req.user.id;

    // نأخذ الحقول المسموح تعديلها من body
    const {
      firstName,
      lastName,
      profession,
      city,
      neighborhood,
      phone,
      yearsOfExperience,
      bio,
      workImages,
    } = req.body;

    // نجهز object يحتوي فقط على الحقول التي وصلتنا فعلًا
    const updateData = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (profession !== undefined) updateData.profession = profession;
    if (city !== undefined) updateData.city = city;
    if (neighborhood !== undefined) updateData.neighborhood = neighborhood;
    if (phone !== undefined) updateData.phone = phone;
    if (yearsOfExperience !== undefined) updateData.yearsOfExperience = yearsOfExperience;
    if (bio !== undefined) updateData.bio = bio;
    if (workImages !== undefined) updateData.workImages = workImages;

    // نبحث عن الحرفي الحالي ونحدّث بياناته
    // new: true => يرجّع النسخة بعد التحديث
    // runValidators: true => يطبّق validation الموجود في الـ model
    const updatedCraftsman = await Craftsman.findByIdAndUpdate(
      craftsmanId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    // إذا لم نجد الحرفي
    if (!updatedCraftsman) {
      return next(createError(404, "Craftsman not found"));
    }

    // نرجّع البيانات بعد التحديث
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
  updateMyProfile
};