const express = require("express");
const {
  addComment,
  deleteComment,
  getCommentsByResource,
  updateComment,
  hideComment,
} = require("../controllers/comments.controller");
const { authenticateJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

// Commentaires 
router.post("/:id/comment", authenticateJWT, addComment);
router.delete("/comments/:id", authenticateJWT, deleteComment);
router.get("/:id/comments", authenticateJWT, getCommentsByResource);
router.put("/comments/:id", authenticateJWT, updateComment);
router.patch("comments/:id/hide", authenticateJWT, hideComment);

module.exports = router;
