// Utilitaires JWT: création et vérification de tokens.
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "15m";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET ?? ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d";

// Signe un access token JWT.
function signAccessToken(payload) {
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error("JWT_SECRET n'est pas définie");
  }

  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

// Signe un refresh token JWT.
function signRefreshToken(payload) {
  if (!REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET n'est pas définie");
  }

  return jwt.sign({ ...payload, tokenType: "refresh" }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

// Vérifie et décode un access token JWT.
function verifyAccessToken(token) {
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error("JWT_SECRET n'est pas définie");
  }

  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

// Vérifie et décode un refresh token JWT.
function verifyRefreshToken(token) {
  if (!REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET n'est pas définie");
  }

  const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);

  if (decoded.tokenType !== "refresh") {
    throw new Error("Token type invalide");
  }

  return decoded;
}

// Compatibilité avec le code existant.
function signToken(payload) {
  return signAccessToken(payload);
}

// Compatibilité avec le code existant.
function verifyToken(token) {
  return verifyAccessToken(token);
}

module.exports = {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  signToken,
  verifyToken,
};
