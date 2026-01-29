// Utilitaires JWT: création et vérification de tokens.
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1d";

// Signe un token JWT avec un payload (ex: userId, role).
function signToken(payload) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET n'est pas définie");
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Vérifie et décode un token JWT.
function verifyToken(token) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET n'est pas définie");
  }

  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  signToken,
  verifyToken,
};
