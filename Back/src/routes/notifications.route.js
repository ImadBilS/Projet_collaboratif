const express = require("express");
const {
  getNotifications,
  markNotificationRead,
} = require("../controllers/notifications.controller");
const { authenticateJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authenticateJWT, getNotifications);
router.patch("/:id/read", authenticateJWT, markNotificationRead)

module.exports = router