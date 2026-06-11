const express = require("express");

const {
  registerCraftsman,
  loginCraftsman,
  getAllCraftsmen,
  getCraftsmanById,
  getMyProfile,
  updateMyProfile,
  deleteProfileImage,
  getFeaturedCraftsmen,
  getSecurityQuestion,
  resetPassword,
} = require("../controllers/craftsman.controller");

const { verifyToken } = require("../middlewares/auth.middleware");
const uploadCraftsmanImages = require("../middlewares/upload.middleware");
const { handleValidation } = require("../middlewares/validate.middleware");
const { paginationValidator } = require("../validators/shared.validators");
const { loginLimiter } = require("../middlewares/rateLimiters.middleware");

const router = express.Router();

router.post(
  "/register",
  uploadCraftsmanImages.array("workImages", 3),
  registerCraftsman
);

router.post("/login", loginCraftsman);
router.post("/get-security-question", loginLimiter, getSecurityQuestion);
router.patch("/reset-password", loginLimiter, resetPassword);

router.get("/me", verifyToken, getMyProfile);
router.delete("/me/profile-image", verifyToken, deleteProfileImage);

router.patch(
  "/me",
  verifyToken,
  uploadCraftsmanImages.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "workImages", maxCount: 9 },
  ]),
  updateMyProfile
);
router.get("/featured", getFeaturedCraftsmen);

router.get("/", paginationValidator, handleValidation, getAllCraftsmen);
router.get("/:id", getCraftsmanById);

module.exports = router;
