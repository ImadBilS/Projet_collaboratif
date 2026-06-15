const express = require("express");
const {
  addReply,
  getReplies,
  updateReply,
  deleteReply,
} = require("../controllers/replies.controller");
const { authenticateJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

// Réponses aux commentaires
router.post("/:id/reply", authenticateJWT, addReply);
router.get("/:id/replies", authenticateJWT, getReplies);
router.put("/:id", authenticateJWT, updateReply);
router.delete("/:id", authenticateJWT, deleteReply);

module.exports = router;
