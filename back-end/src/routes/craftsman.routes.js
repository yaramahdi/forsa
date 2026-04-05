const express = require("express");

const {
  registerCraftsman,
  loginCraftsman,
  getAllCraftsmen,
  getCraftsmanById,
  getMyProfile,
  updateMyProfile,
  getFeaturedCraftsmen
} = require("../controllers/craftsman.controller");

const { verifyToken } = require("../middlewares/auth.middleware");
const uploadCraftsmanImages = require("../middlewares/upload.middleware");

const router = express.Router();

router.post(
  "/register",
  uploadCraftsmanImages.array("workImages", 3),
  registerCraftsman
);

router.post("/login", loginCraftsman);

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

router.get("/", getAllCraftsmen);
router.get("/:id", getCraftsmanById);

module.exports = router;