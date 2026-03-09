// Contrôleurs d'authentification: inscription, connexion, profil.
const { prisma } = require("../db/prisma");
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");

// Rôles autorisés pour l'inscription.
const ALLOWED_ROLES = ["Citoyen", "Modérateur", "Administrateur"];

// Vérifie qu'une date est valide.
function isValidDate(value) {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

// Convertit une valeur en entier, sinon retourne null.
function toInteger(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

// Supprime le mot de passe avant de renvoyer un utilisateur.
function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

// Inscription d'un utilisateur.
async function register(req, res) {
  // Récupération des champs envoyés par le client.
  const {
    firstname,
    lastname,
    birth,
    mail,
    password,
    role,
    sex,
    street_number,
    street_type,
    postal_code,
    address_complement,
    city,
    country,
  } = req.body;

  // Vérifie la présence des champs obligatoires.
  if (
    !firstname ||
    !lastname ||
    !birth ||
    !mail ||
    !password ||
    !role ||
    !sex ||
    street_number === undefined ||
    !street_type ||
    postal_code === undefined ||
    !city ||
    !country
  ) {
    return res.status(400).json({ message: "Champs obligatoires manquants" });
  }

  // Contrôle du rôle.
  if (!ALLOWED_ROLES.includes(role)) {
    return res
      .status(400)
      .json({ message: "Rôle invalide (Citoyen, Modérateur, Administrateur)" });
  }

  // Contrôle de la date.
  if (!isValidDate(birth)) {
    return res.status(400).json({ message: "Date de naissance invalide" });
  }

  // Conversion des champs numériques.
  const streetNumber = toInteger(street_number);
  const postalCode = toInteger(postal_code);

  if (streetNumber === null || postalCode === null) {
    return res.status(400).json({
      message: "numéro de rue et code postal doivent être des nombres",
    });
  }

  try {
    // Vérifie si l'email existe déjà.
    const existingUser = await prisma.user.findUnique({
      where: { mail },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }

    // Hash du mot de passe avant stockage.
    const hashedPassword = await hashPassword(password);

    // Création de l'utilisateur en base.
    const createdUser = await prisma.user.create({
      data: {
        firstname,
        lastname,
        birth: new Date(birth),
        mail,
        password: hashedPassword,
        role,
        sex,
        street_number: streetNumber,
        street_type,
        postal_code: postalCode,
        address_complement: address_complement || null,
        city,
        country,
      },
    });

    // Génération du JWT.
    const token = signToken({
      userId: createdUser.user_id,
      role: createdUser.role,
    });

    // Renvoie le token et l'utilisateur sans le mot de passe.
    return res.status(201).json({
      token,
      user: sanitizeUser(createdUser),
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

// Connexion utilisateur.
async function login(req, res) {
  const { mail, password } = req.body;

  // Vérifie que l'email et le mot de passe sont fournis.
  if (!mail || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  try {
    // Recherche l'utilisateur par email.
    const user = await prisma.user.findUnique({
      where: { mail },
    });

    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Compare le mot de passe fourni avec le hash en base.
    const passwordMatches = await comparePassword(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Génère un JWT pour la session.
    const token = signToken({
      userId: user.user_id,
      role: user.role,
    });

    // Renvoie le token et les infos utilisateur.
    return res.status(200).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

// Retourne le profil de l'utilisateur connecté.
async function me(req, res) {
  try {
    // Charge l'utilisateur à partir de l'id stocké dans le token.
    const user = await prisma.user.findUnique({
      where: { user_id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Renvoie l'utilisateur sans le mot de passe.
    return res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = {
  register,
  login,
  me,
  ALLOWED_ROLES,
};
