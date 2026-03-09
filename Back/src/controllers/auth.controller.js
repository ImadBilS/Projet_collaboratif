// Contrôleurs d'authentification: inscription, connexion, profil.
const crypto = require("crypto");
const { prisma } = require("../db/prisma");
const { hashPassword, comparePassword } = require("../utils/password");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  REFRESH_TOKEN_EXPIRES_IN,
} = require("../utils/jwt");

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

const REFRESH_COOKIE_NAME = process.env.REFRESH_COOKIE_NAME ?? "refreshToken";

function parseDurationToMs(value) {
  if (typeof value === "number") {
    return value * 1000;
  }

  if (typeof value !== "string") {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const trimmed = value.trim();
  const match = trimmed.match(/^(\d+)\s*([smhd])?$/i);

  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const amount = Number.parseInt(match[1], 10);
  const unit = (match[2] ?? "s").toLowerCase();
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * multipliers[unit];
}

function getRefreshCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: parseDurationToMs(REFRESH_TOKEN_EXPIRES_IN),
  };
}

function getCookieValue(req, name) {
  const header = req.headers.cookie;

  if (!header) {
    return null;
  }

  const cookies = header.split(";").map((part) => part.trim());
  const prefix = `${name}=`;
  const rawCookie = cookies.find((entry) => entry.startsWith(prefix));

  if (!rawCookie) {
    return null;
  }

  return decodeURIComponent(rawCookie.slice(prefix.length));
}

function hashRefreshToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function createSessionForUser(user) {
  const accessToken = signAccessToken({
    userId: user.user_id,
    role: user.role,
  });

  const refreshToken = signRefreshToken({
    userId: user.user_id,
    role: user.role,
  });

  const refreshExpiresAt = new Date(
    Date.now() + parseDurationToMs(REFRESH_TOKEN_EXPIRES_IN)
  );

  await prisma.user.update({
    where: { user_id: user.user_id },
    data: {
      refresh_token_hash: hashRefreshToken(refreshToken),
      refresh_token_expires_at: refreshExpiresAt,
    },
  });

  return { accessToken, refreshToken };
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
    !address_complement ||
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
    return res
      .status(400)
      .json({
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
        address_complement,
        city,
        country,
      },
    });

    const { accessToken, refreshToken } = await createSessionForUser(createdUser);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());

    // Renvoie le token et l'utilisateur sans le mot de passe.
    return res.status(201).json({
      token: accessToken,
      accessToken,
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

    const { accessToken, refreshToken } = await createSessionForUser(user);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());

    // Renvoie le token et les infos utilisateur.
    return res.status(200).json({
      token: accessToken,
      accessToken,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

// Renouvelle la session via le refresh token en cookie.
async function refresh(req, res) {
  const refreshToken = getCookieValue(req, REFRESH_COOKIE_NAME);

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token manquant" });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { user_id: decoded.userId },
    });

    if (!user || !user.refresh_token_hash || !user.refresh_token_expires_at) {
      return res.status(401).json({ message: "Refresh token invalide" });
    }

    if (user.refresh_token_expires_at.getTime() < Date.now()) {
      return res.status(401).json({ message: "Refresh token expiré" });
    }

    if (hashRefreshToken(refreshToken) !== user.refresh_token_hash) {
      return res.status(401).json({ message: "Refresh token invalide" });
    }

    const { accessToken, refreshToken: nextRefreshToken } =
      await createSessionForUser(user);

    res.cookie(
      REFRESH_COOKIE_NAME,
      nextRefreshToken,
      getRefreshCookieOptions()
    );

    return res.status(200).json({
      token: accessToken,
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({ message: "Refresh token invalide" });
  }
}

// Invalide le refresh token courant et supprime le cookie.
async function logout(req, res) {
  const refreshToken = getCookieValue(req, REFRESH_COOKIE_NAME);

  if (refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      await prisma.user.update({
        where: { user_id: decoded.userId },
        data: {
          refresh_token_hash: null,
          refresh_token_expires_at: null,
        },
      });
    } catch (error) {
      // Si le token est invalide, on continue quand même le logout côté client.
    }
  }

  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
  });

  return res.status(200).json({ message: "Déconnexion réussie" });
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
  refresh,
  logout,
  ALLOWED_ROLES,
};
