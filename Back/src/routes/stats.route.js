const express = require("express");
const { getStats } = require("../controllers/stats.controller.js");
const { authenticateJWT } = require("../middlewares/auth.middleware.js")

const router = express.Router();

router.get("/", authenticateJWT, getStats);

module.exports = router;
