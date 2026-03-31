// Routes CRUD utilisateur (Avatar, Bio, Localisation).
const express = require("express");
const {
  listUsers,
  createUserProfile,
  getUserById,
  updateUserProfile,
  deleteUserProfile,
  updateUserRole,
} = require("../controllers/users.controller");


const { authenticateJWT } = require("../middlewares/auth.middleware");
const router = express.Router();

// LIST
router.get("/", authenticateJWT, listUsers);

// CREATE
router.post("/",  authenticateJWT, createUserProfile);

// READ
router.get("/:userId", authenticateJWT, getUserById);

// UPDATE
router.put("/:userId", authenticateJWT, updateUserProfile);

// DELETE
router.delete("/:userId", authenticateJWT, deleteUserProfile);

// Role 
router.put("/:userId/role", authenticateJWT, updateUserRole);
module.exports = router;
