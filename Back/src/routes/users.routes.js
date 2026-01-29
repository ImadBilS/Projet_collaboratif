// Routes CRUD utilisateur (Avatar, Bio, Localisation).
const express = require("express");
const {
  createUserProfile,
  getUserById,
  updateUserProfile,
  deleteUserProfile,
} = require("../controllers/users.controller");


const { authenticateJWT } = require("../middlewares/auth.middleware");
const router = express.Router();

// CREATE
router.post("/",  authenticateJWT, createUserProfile);

// READ
router.get("/:userId", authenticateJWT, getUserById);

// UPDATE
router.put("/:userId", authenticateJWT, updateUserProfile);

// DELETE
router.delete("/:userId", authenticateJWT, deleteUserProfile);

module.exports = router;
