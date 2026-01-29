// Contrôleur CRUD utilisateur (Avatar, Bio, city).
const { prisma } = require("../db/prisma");

function resolveTargetUserId(req, res) {
  const authUserId = req.user?.userId;
  if (!authUserId) {
    res.status(401).json({ message: "Non authentifié" });
    return null;
  }

  if (req.params?.userId) {
    const paramUserId = Number.parseInt(req.params.userId, 10);
    if (Number.isNaN(paramUserId)) {
      res.status(400).json({ message: "userId invalide" });
      return null;
    }
    if (paramUserId !== authUserId) {
      res.status(403).json({ message: "Accès interdit" });
      return null;
    }
    return paramUserId;
  }

  return authUserId;
}

// CREATE: créer un profil utilisateur 
async function createUserProfile(req, res) {
  const request = req.body ?? {};
  const { avatar, bio, city } = request;
  if (!avatar && !bio && !city) {
    return res.status(400).json({
      message: "Au moins un champ doit être renseigné (avatar, bio, city)",
    });
  }

  const userId = resolveTargetUserId(req, res);
  if (!userId) return;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { user_id: true },
    });
    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: {
        avatar,
        bio,
        city,
      },
    });
    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

// READ: récupérer un utilisateur par id
async function getUserById(req, res) {
  const userId = Number.parseInt(req.params.userId, 10);
  if (Number.isNaN(userId)){
    return res.status(400).json({ message: "userId invalide" });
}
  try {
    const user = await prisma.user.findUnique ({
      where: {user_id: userId},
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
    },
    });
    if (!user){
      return res.status(404).json({ message: "Utilisateur introuvable"});
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}



// fonction Update du profile de l'utilisateur
async function updateUserProfile(req, res) {
  const userId = resolveTargetUserId(req, res);
  if (!userId) return;

  const { avatar, bio, city } = req.body ?? {};

  if (!avatar && !bio && !city) {
    return res.status(400).json({
      message: "Aucun champ à mettre à jour (avatar, bio, city)",
    });
  }

  if (bio && bio.length > 500) {
    return res.status(400).json({ message: "Bio trop longue (max 500)" });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { user_id: true },
    });
    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: { avatar, bio, city },
    });

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}


// fonction pour DELETE le profile de l'utilisateur
async function deleteUserProfile(req, res) {
  const userId = resolveTargetUserId(req, res);
  if (!userId) return;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { user_id: true },
    });
    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: {
        avatar: null,
        bio: null,
      },
    });

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}


module.exports = {
  createUserProfile,
  getUserById,
  updateUserProfile,
  deleteUserProfile,
};
