const express = require("express");
const {
  addComment,
  getCommentById,
  deleteComment,
  getCommentsByResource,
  getPublicCommentsByResource,
  updateComment,
  hideComment,
} = require("../controllers/comments.controller");
const { authenticateJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

// Commentaires
router.get("/public/:id/ressource", getPublicCommentsByResource);
router.post("/:id", authenticateJWT, addComment);
router.delete("/:id", authenticateJWT, deleteComment);
router.get("/:id/ressource", authenticateJWT, getCommentsByResource);
router.get("/:id", authenticateJWT, getCommentById);
router.put("/:id", authenticateJWT, updateComment);
router.patch("/:id/hide", authenticateJWT, hideComment);

module.exports = router;
