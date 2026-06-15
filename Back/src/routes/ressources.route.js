const express = require("express");
const {
  create,
  getRessourceById,
  getRessources,
  getRessourcesUser,
  getNearbyRessourcesForMe,
  getPublicRessources,
  deleteRessource,
  updateRessource,
  getRessourcesByCategory,
} = require("../controllers/ressources.controller");
const { authenticateJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

// Route protégée: nécessite un JWT valide
router.post("/", authenticateJWT, create);
router.get("/", authenticateJWT, getRessources);
router.get("/public", getPublicRessources);
router.get("/me", authenticateJWT, getRessourcesUser);
router.get("/:id", authenticateJWT, getRessourceById);
router.get("/nearby/me", authenticateJWT, getNearbyRessourcesForMe);
router.delete("/:id", authenticateJWT, deleteRessource);
router.put("/:id", authenticateJWT, updateRessource);
router.get("/category/:category", getRessourcesByCategory);

module.exports = router;
