// Middlewares d'authentification et d'autorisation.
const { verifyToken } = require("../utils/jwt");

// Vérifie le JWT et ajoute req.user.
function authenticateJWT(req, res, next) {
  // Récupère le header Authorization.
  const authHeader = req.headers.authorization;

  // Doit être au format "Bearer <token>".
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant ou invalide" });
  }

  // Extrait le token.
  const token = authHeader.slice("Bearer ".length).trim();

  try {
    // Décode et valide le token.
    const decoded = verifyToken(token);
    
    // Stocke les infos utiles pour les routes suivantes.
    req.user = {
      user_id: decoded.userId,
      role: decoded.role,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
}

// Vérifie que l'utilisateur a un des rôles autorisés.
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    // Si authenticateJWT n'a pas défini req.user.
    if (!req.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    // Refuse si le rôle ne correspond pas.
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    return next();
  };
}

module.exports = {
  authenticateJWT,
  authorizeRoles,
};
