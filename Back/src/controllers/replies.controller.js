const { prisma } = require("../db/prisma");
const { canModerate } = require("../utils/roles");

// Répondre à un commentaire
async function addReply(req, res) {
  try {
    const userId = req.user.user_id;
    const commentId = Number(req.params.id);
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Le texte est requis." });
    }

    // Vérifier que le commentaire existe
    const comment = await prisma.comments.findUnique({
      where: { comment_id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé." });
    }

    const reply = await prisma.repliesComment.create({
      data: {
        text,
        user_id: userId,
        comment_id: commentId,
      },
    });

    res.json(reply);
  } catch (error) {
    console.error("Erreur lors de l'ajout d'une réponse :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

// Récupérer les réponses d'un commentaire
async function getReplies(req, res) {
  try {
    const commentId = Number(req.params.id);

    const replies = await prisma.repliesComment.findMany({
      where: { comment_id: commentId },
      include: {
        user: {
          select: { firstname: true, lastname: true, avatar: true },
        },
      },
      orderBy: { replie_id: "asc" },
    });

    res.json(replies);
  } catch (error) {
    console.error("Erreur lors de la récupération des réponses :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

// Modifier une réponse
async function updateReply(req, res) {
  try {
    const userId = req.user.user_id;
    const replyId = Number(req.params.id);
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Le texte est requis." });
    }

    const reply = await prisma.repliesComment.findUnique({
      where: { replie_id: replyId },
    });

    if (!reply) {
      return res.status(404).json({ message: "Réponse non trouvée." });
    }

    const isOwner = reply.user_id === userId;

    if (!isOwner) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const updated = await prisma.repliesComment.update({
      where: { replie_id: replyId },
      data: { text },
    });

    res.json(updated);
  } catch (error) {
    console.error("Erreur lors de la modification de la réponse :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

// Supprimer une réponse
async function deleteReply(req, res) {
  try {
    const userId = req.user.user_id;
    const userRole = req.user.role;
    const replyId = Number(req.params.id);

    const reply = await prisma.repliesComment.findUnique({
      where: { replie_id: replyId },
    });

    if (!reply) {
      return res.status(404).json({ message: "Réponse non trouvée." });
    }

    const isOwner = reply.user_id === userId;
    if (!isOwner && !canModerate(userRole)) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    await prisma.repliesComment.delete({
      where: { replie_id: replyId },
    });

    res.json({ message: "Réponse supprimée avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de la réponse :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = {
  addReply,
  getReplies,
  updateReply,
  deleteReply,
};
