const express = require("express");
const { create, getRessources, getRessourcesUser, deleteRessource } = require("../controllers/ressources.controller");
const {
  authenticateJWT,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// Route protégée: nécessite un JWT valide
router.post("/", authenticateJWT, create);  
router.get("/", authenticateJWT, getRessources);
router.get("/me", authenticateJWT, getRessourcesUser);
router.delete("/:id", authenticateJWT, deleteRessource);
module.exports = router;
