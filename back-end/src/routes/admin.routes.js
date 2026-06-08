const express = require("express");
const {
  loginAdmin,
  getAllCraftsmenForAdmin,
  toggleFeaturedForAdmin,
  deleteCraftsmanForAdmin,
} = require("../controllers/admin.controller");
const { verifyAdmin } = require("../middlewares/admin.middleware");
const { handleValidation } = require("../middlewares/validate.middleware");
const { paginationValidator } = require("../validators/shared.validators");

const router = express.Router();

// Public — no auth required
router.post("/login", loginAdmin);

// Protected — valid admin JWT required for all routes below
router.get("/craftsmen", verifyAdmin, paginationValidator, handleValidation, getAllCraftsmenForAdmin);
router.patch("/craftsmen/:id/featured", verifyAdmin, toggleFeaturedForAdmin);
router.delete("/craftsmen/:id", verifyAdmin, deleteCraftsmanForAdmin);

module.exports = router;
