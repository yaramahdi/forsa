const express = require("express");
const {
  getAllCraftsmenForAdmin,
  toggleFeaturedForAdmin,
} = require("../controllers/admin.controller");

const router = express.Router();

router.get("/craftsmen", getAllCraftsmenForAdmin);
router.patch("/craftsmen/:id/featured", toggleFeaturedForAdmin);

module.exports = router;