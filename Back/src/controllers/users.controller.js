// Controleur CRUD utilisateur (Avatar, Bio, city).
const { prisma } = require("../db/prisma");
const { hashPassword } = require("../utils/password");

function sanitizeUser(user) {
  if (!user) return user;
  const { password, ...safeUser } = user;
  return safeUser;
}

function logGdprAnonymizationEvent({
  userId,
  deletedAt,
  canHaveDeleted,
  reactDeleted,
  viewsDeleted,
}) {
  // Trace technique RGPD volontairement non nominative.
  console.info("[RGPD] account_anonymized", {
    userId,
    deletedAt: deletedAt.toISOString(),
    canHaveDeleted,
    reactDeleted,
    viewsDeleted,
  });
}

async function buildAnonymizedUserData(userId, nowMs = Date.now()) {
  const anonymizationToken = `${userId}-${nowMs}`;
  const anonymizedEmail = `deleted+${anonymizationToken}@example.invalid`;
  const anonymizedPassword = await hashPassword(
    `deleted-account-${anonymizationToken}`,
  );
  const textMask = `ANONYMIZED_${userId}`;

  return {
    firstname: `${textMask}_FN`,
    lastname: `${textMask}_LN`,
    birth: new Date("1900-01-01T00:00:00.000Z"),
    mail: anonymizedEmail,
    password: anonymizedPassword,
    sex: `${textMask}_SEX`,
    street_number: userId,
    street_type: `${textMask}_STREET`,
    postal_code: 10000 + (userId % 90000),
    address_complement: `${textMask}_ADDR`,
    city: `${textMask}_CITY`,
    country: `${textMask}_COUNTRY`,
    avatar: null,
    bio: null,
    is_anonymized: true,
    deleted_at: new Date(nowMs),
  };
}

function resolveTargetUserId(req, res) {
  const authUserId = req.user?.user_id;
  const authRole = req.user?.role;
  if (!authUserId) {
    res.status(401).json({ message: "Non authentifie" });
    return null;
  }

  const routeUserId = req.params?.user_id ?? req.params?.userId;

  if (routeUserId) {
    const paramUserId = Number.parseInt(routeUserId, 10);
    if (Number.isNaN(paramUserId)) {
      res.status(400).json({ message: "user_id invalide" });
      return null;
    }
    const canManageOtherUsers =
      authRole === "Administrateur" || authRole === "Modérateur";

    if (paramUserId !== authUserId && !canManageOtherUsers) {
      res.status(403).json({ message: "Acces interdit" });
      return null;
    }
    return paramUserId;
  }

  return authUserId;
}

async function listUsers(req, res) {
  const authRole = req.user?.role;

  if (authRole !== "Administrateur" && authRole !== "Modérateur") {
    return res.status(403).json({ message: "Accès interdit" });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        user_id: true,
        firstname: true,
        lastname: true,
        mail: true,
        role: true,
        city: true,
        country: true,
        bio: true,
        is_anonymized: true,
        deleted_at: true,
      },
      orderBy: { user_id: "desc" },
    });

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

// CREATE: creer un profil utilisateur
async function createUserProfile(req, res) {
  const request = req.body ?? {};
  const { avatar, bio, city } = request;
  if (!avatar && !bio && !city) {
    return res.status(400).json({
      message: "Au moins un champ doit etre renseigne (avatar, bio, city)",
    });
  }

  const userId = resolveTargetUserId(req, res);
  if (!userId) return;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { user_id: true, is_anonymized: true },
    });
    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    if (existingUser.is_anonymized) {
      return res.status(410).json({ message: "Compte supprime" });
    }

    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: {
        avatar,
        bio,
        city,
      },
    });
    return res.status(200).json({ user: sanitizeUser(updatedUser) });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error });
  }
}

// READ: recuperer un utilisateur par id
async function getUserById(req, res) {
  const userId = Number.parseInt(req.params.user_id, 10);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ message: "user_id invalide" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        firstname: true,
        lastname: true,
        birth: true,
        mail: true,
        role: true,
        sex: true,
        avatar: true,
        bio: true,
        street_number: true,
        street_type: true,
        postal_code: true,
        address_complement: true,
        city: true,
        country: true,
        is_anonymized: true,
        deleted_at: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    if (user.is_anonymized) {
      return res.status(410).json({ message: "Compte supprime" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error });
  }
}

// fonction Update du profile de l'utilisateur
async function updateUserProfile(req, res) {
  const userId = resolveTargetUserId(req, res);
  if (!userId) return;

  const { avatar, bio, city } = req.body ?? {};

  if (!avatar && !bio && !city) {
    return res.status(400).json({
      message: "Aucun champ a mettre a jour (avatar, bio, city)",
    });
  }

  if (bio && bio.length > 500) {
    return res.status(400).json({ message: "Bio trop longue (max 500)" });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { user_id: true, is_anonymized: true },
    });
    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    if (existingUser.is_anonymized) {
      return res.status(410).json({ message: "Compte supprime" });
    }

    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: { avatar, bio, city },
    });

    return res.status(200).json({ user: sanitizeUser(updatedUser) });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}

// fonction pour DELETE le profile de l'utilisateur
async function deleteUserProfile(req, res) {
  const userId = resolveTargetUserId(req, res);
  if (!userId) return;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { user_id: true, is_anonymized: true },
    });
    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    if (existingUser.is_anonymized) {
      return res.status(410).json({ message: "Compte deja supprime" });
    }

    const nowMs = Date.now();
    const anonymizedUserData = await buildAnonymizedUserData(userId, nowMs);

    if (
      !anonymizedUserData.firstname ||
      !anonymizedUserData.lastname ||
      !anonymizedUserData.mail ||
      !anonymizedUserData.password
    ) {
      throw new Error(
        "Payload d'anonymisation incomplet pour les champs obligatoires",
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const [canHaveResult, reactResult, viewsResult] = await Promise.all([
        tx.canHave.deleteMany({ where: { user_id: userId } }),
        tx.react.deleteMany({ where: { user_id: userId } }),
        tx.views.deleteMany({ where: { user_id: userId } }),
      ]);

      const updatedUser = await tx.user.update({
        where: { user_id: userId },
        data: anonymizedUserData,
      });

      return {
        updatedUser,
        canHaveDeleted: canHaveResult.count,
        reactDeleted: reactResult.count,
        viewsDeleted: viewsResult.count,
      };
    });

    logGdprAnonymizationEvent({
      userId,
      deletedAt: anonymizedUserData.deleted_at,
      canHaveDeleted: result.canHaveDeleted,
      reactDeleted: result.reactDeleted,
      viewsDeleted: result.viewsDeleted,
    });

    return res.status(200).json({ user: sanitizeUser(result.updatedUser) });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}

async function updateUserRole(req, res) {
  const authUser = req.user;

  // Seul un admin peut changer un rôle
  if (authUser.role !== "Administrateur") {
    return res.status(403).json({ message: "Accès interdit" });
  }

  const userId = Number.parseInt(req.params.user_id ?? req.params.userId, 10);
  if (Number.isNaN(userId)) {
    return res.status(400).json({ message: "user_id invalide" });
  }

  const { role } = req.body;

  const ALLOWED_ROLES = ["Citoyen", "Modérateur", "Administrateur"];
  if (!ALLOWED_ROLES.includes(role)) {
    return res.status(400).json({ message: "Rôle invalide" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: { role },
    });

    return res.status(200).json({ user: sanitizeUser(updatedUser) });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}

async function getAllUsers(req, res) {
  if (req.user.role !== "Administrateur") {
    return res.status(403).json({ message: "Accès interdit" });
  }

  try {
    const users = await prisma.user.findMany({
      where: { is_anonymized: false },
      select: {
        user_id: true,
        firstname: true,
        lastname: true,
        mail: true,
        role: true,
        avatar: true,
        city: true,
        bio: true,
      },
    });

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}

async function updateUserAccount(req, res) {
  const userId = Number(req.params.userId);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ message: "userId invalide" });
  }

  // L'utilisateur ne peut modifier que son propre compte
  if (req.user.user_id !== userId) {
    return res.status(403).json({ message: "Accès interdit" });
  }

  const {
    firstname,
    lastname,
    mail,
    oldPassword,
    newPassword,
    sex,
    birth,
    street_number,
    street_type,
    postal_code,
    address_complement,
    city,
    country,
  } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Si changement de mot de passe → vérifier l'ancien
    let hashedPassword = user.password;
    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ message: "Ancien mot de passe requis" });
      }

      const match = await comparePassword(oldPassword, user.password);
      if (!match) {
        return res.status(401).json({ message: "Ancien mot de passe incorrect" });
      }

      hashedPassword = await hashPassword(newPassword);
    }

    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: {
        firstname,
        lastname,
        mail,
        password: hashedPassword,
        sex,
        birth: birth ? new Date(birth) : undefined,
        street_number,
        street_type,
        postal_code,
        address_complement,
        city,
        country,
      },
    });

    return res.status(200).json({
      message: "Compte mis à jour",
      user: {
        ...updatedUser,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}

module.exports = { updateUserAccount };

module.exports = {
  getAllUsers,
  buildAnonymizedUserData,
  listUsers,
  createUserProfile,
  getUserById,
  updateUserProfile,
  deleteUserProfile,
  updateUserRole,
  updateUserAccount,
};
