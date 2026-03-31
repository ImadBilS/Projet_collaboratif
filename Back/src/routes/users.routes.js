// Routes CRUD utilisateur (Avatar, Bio, Localisation).
const express = require("express");
const {
  createUserProfile,
  getUserById,
  updateUserProfile,
  deleteUserProfile,
  updateUserRole,
  getAllUsers,
  updateUserAccount,
} = require("../controllers/users.controller");

const { authenticateJWT } = require("../middlewares/auth.middleware");
const router = express.Router();

// GET ALL USERS (ADMIN ONLY)
router.get("/", authenticateJWT, getAllUsers);

// CREATE
router.post("/", authenticateJWT, createUserProfile);

// READ
router.get("/:user_id", authenticateJWT, getUserById);

// UPDATE
router.put("/:user_id", authenticateJWT, updateUserProfile);

// DELETE
router.delete("/:user_id", authenticateJWT, deleteUserProfile);

// Role
router.put("/:user_id/role", authenticateJWT, updateUserRole);
module.exports = router;

// Modifier les données users
router.put("/:user_id/account", authenticateJWT, updateUserAccount);
