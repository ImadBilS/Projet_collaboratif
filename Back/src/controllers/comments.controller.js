const { prisma } = require("../db/prisma");
const { canModerate } = require("../utils/roles");

// Ajouter un commentaire
async function addComment(req, res) {
  try {
    const userId = req.user.user_id;
    const ressourceId = Number(req.params.id);
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Le commentaire est vide." });
    }

    const comment = await prisma.comments.create({
      data: {
        text,
        status: "ACTIVE",
        user_id: userId,
        ressource_id: ressourceId,
      },
    });

    res.json(comment);
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function getCommentById(req, res) {
  try {
    const commentId = Number(req.params.id);

    if (Number.isNaN(commentId)) {
      return res.status(400).json({ message: "ID invalide." });
    }

    const comment = await prisma.comments.findUnique({
      where: { comment_id: commentId },
      include: {
        user: {
          select: { firstname: true, lastname: true, avatar: true },
        },
        replies: {
          include: {
            user: {
              select: { firstname: true, lastname: true, avatar: true },
            },
          },
          orderBy: { replie_id: "asc" },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({ message: "Commentaire introuvable." });
    }

    return res.json(comment);
  } catch (error) {
    console.error("Erreur lors de la récupération du commentaire :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

// Supprimer un commentaire
async function deleteComment(req, res) {
  try {
    const userId = req.user.user_id;
    const userRole = req.user.role;
    const commentId = Number(req.params.id);

    // Vérifier que le commentaire existe
    const comment = await prisma.comments.findUnique({
      where: { comment_id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé." });
    }

    // Vérifier les permissions :
    // - auteur du commentaire
    // - admin
    // - modérateur
    const isOwner = comment.user_id === userId;
    if (!isOwner && !canModerate(userRole)) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    // Supprimer le commentaire
    await prisma.comments.delete({
      where: { comment_id: commentId },
    });

    res.json({ message: "Commentaire supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

// Afficher les commentaires d'une ressource
async function getCommentsByResource(req, res) {
  try {
    const ressourceId = Number(req.params.id);

    const comments = await prisma.comments.findMany({
      where: { ressource_id: ressourceId },
      include: {
        user: {
          select: { firstname: true, lastname: true, avatar: true },
        },
        replies: {
          include: {
            user: {
              select: { firstname: true, lastname: true, avatar: true },
            },
          },
          orderBy: { replie_id: "asc" },
        },
      },
      orderBy: { comment_id: "desc" },
    });

    res.json(comments);
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function getPublicCommentsByResource(req, res) {
  try {
    const ressourceId = Number(req.params.id);

    const resource = await prisma.resources.findUnique({
      where: { ressource_id: ressourceId },
      select: { visibility: true },
    });

    if (!resource) {
      return res.status(404).json({ message: "Ressource introuvable." });
    }

    if (resource.visibility !== "PUBLIC") {
      return res.status(403).json({ message: "Commentaires non accessibles." });
    }

    const comments = await prisma.comments.findMany({
      where: { ressource_id: ressourceId },
      include: {
        user: {
          select: { firstname: true, lastname: true, avatar: true },
        },
        replies: {
          include: {
            user: {
              select: { firstname: true, lastname: true, avatar: true },
            },
          },
          orderBy: { replie_id: "asc" },
        },
      },
      orderBy: { comment_id: "desc" },
    });

    return res.json(comments);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération publique des commentaires :",
      error
    );
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

// Modifier un commentaire
async function updateComment(req, res) {
  try {
    const userId = req.user.user_id;
    const commentId = Number(req.params.id);
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Le texte est requis." });
    }

    const comment = await prisma.comments.findUnique({
      where: { comment_id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé." });
    }

    const isOwner = comment.user_id === userId;

    if (!isOwner) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const updated = await prisma.comments.update({
      where: { comment_id: commentId },
      data: { text },
    });

    res.json(updated);
  } catch (error) {
    console.error("Erreur lors de la modification du commentaire :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

// Masquer un commentaire
async function hideComment(req, res) {
  try {
    const userRole = req.user.role;
    const commentId = Number(req.params.id);

    if (!canModerate(userRole)) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const updated = await prisma.comments.update({
      where: { comment_id: commentId },
      data: { status: "HIDDEN" },
    });

    res.json({ message: "Commentaire masqué.", updated });
  } catch (error) {
    console.error("Erreur lors du masquage du commentaire :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = {
  addComment,
  getCommentById,
  deleteComment,
  getCommentsByResource,
  getPublicCommentsByResource,
  updateComment,
  hideComment,
};
