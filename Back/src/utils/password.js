// Utilitaires de hash/compare des mots de passe.
const bcrypt = require("bcrypt");

// Nombre de tours de hashage (par défaut 10).
const SALT_ROUNDS = Number.parseInt(
  process.env.BCRYPT_SALT_ROUNDS ?? "10",
  10
);

// Hash le mot de passe en clair.
async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

// Compare un mot de passe en clair avec un hash.
async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePassword,
};
