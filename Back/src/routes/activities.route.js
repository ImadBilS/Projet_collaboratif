const express = require("express");
const { authenticateJWT } = require("../middlewares/auth.middleware");
const {
  listActivities,
  getActivityById,
  createActivity,
  addParticipant,
  addMessage,
} = require("../controllers/activities.controller");

const router = express.Router();

router.get("/", authenticateJWT, listActivities);
router.get("/:id", authenticateJWT, getActivityById);
router.post("/", authenticateJWT, createActivity);
router.post("/:id/participants", authenticateJWT, addParticipant);
router.post("/:id/messages", authenticateJWT, addMessage);

module.exports = router;
