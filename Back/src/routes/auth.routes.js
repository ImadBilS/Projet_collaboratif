// Routes d'authentification (inscription, connexion, profil).
const express = require("express");
const {
  register,
  login,
  me,
  refresh,
  logout,
} = require("../controllers/auth.controller");
const {
  authenticateJWT,
  authorizeRoles,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// Routes publiques (pas besoin de token)
router.post("/register", register); // pour user
router.post(
  "/admin-register",
  authenticateJWT,
  authorizeRoles("Administrateur"),
  register,
); // pour admin
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
// Route protégée: nécessite un JWT valide
router.get("/me", authenticateJWT, me);

// route protégée par rôle
router.get(
  "/admin",
  authenticateJWT,
  authorizeRoles("Administrateur"),
  (req, res) => {
    res.status(200).json({ message: "Accès admin OK" });
  },
);

module.exports = router;
