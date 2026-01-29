const express = require("express");
const { create } = require("../controllers/ressources.controller");
const {
  authenticateJWT,
  } = require("../middlewares/auth.middleware");

const router = express.Router();
router.post("/", authenticateJWT, create);

module.exports = router;
