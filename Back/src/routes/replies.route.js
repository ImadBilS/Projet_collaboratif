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
router.post("/comments/:id/reply", authenticateJWT, addReply);
router.get("/comments/:id/replies", authenticateJWT, getReplies);
router.put("/replies/:id", authenticateJWT, updateReply);
router.delete("/replies/:id", authenticateJWT, deleteReply);

module.exports = router;
