const express = require("express");

const {
  registerCraftsman,
  loginCraftsman,
  getAllCraftsmen,
  getCraftsmanById,
  getMyProfile,
  updateMyProfile,
  getFeaturedCraftsmen,
  resetPassword,
} = require("../controllers/craftsman.controller");

const { verifyToken } = require("../middlewares/auth.middleware");
const uploadCraftsmanImages = require("../middlewares/upload.middleware");
const { handleValidation } = require("../middlewares/validate.middleware");
const { paginationValidator } = require("../validators/shared.validators");

const router = express.Router();

router.post(
  "/register",
  uploadCraftsmanImages.array("workImages", 3),
  registerCraftsman
);

router.post("/login", loginCraftsman);
router.patch("/reset-password", resetPassword);

router.get("/me", verifyToken, getMyProfile);

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
