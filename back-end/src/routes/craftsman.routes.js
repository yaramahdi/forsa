const express = require("express");
const {
  registerCraftsman,
  loginCraftsman,
} = require("../controllers/craftsman.controller");

const router = express.Router();

router.post("/register", registerCraftsman);
router.post("/login", loginCraftsman);

module.exports = router;