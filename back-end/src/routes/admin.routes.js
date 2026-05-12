const express = require("express");
const {
  getAllCraftsmenForAdmin,
  toggleFeaturedForAdmin,
  deleteCraftsmanForAdmin,
} = require("../controllers/admin.controller");

const router = express.Router();

router.get("/craftsmen", getAllCraftsmenForAdmin);
router.patch("/craftsmen/:id/featured", toggleFeaturedForAdmin);
router.delete("/craftsmen/:id", deleteCraftsmanForAdmin);

module.exports = router;