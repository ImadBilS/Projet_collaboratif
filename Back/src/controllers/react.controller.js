const { prisma } = require("../db/prisma");

// Ajouter une réaction
async function reactToResource(req, res) {
  try {
    const userId = req.user.user_id;
    const ressourceId = Number(req.params.id);
    const { reaction } = req.body; // ex: "LIKE"

    const allowedReactions = ["LIKE", "DISLIKE", "LOVE", "LAUGH"];

    if (!allowedReactions.includes(reaction)) {
      return res.status(400).json({ message: "Réaction invalide." });
    }

    // Vérifier si une réaction existe déjà
    const existingReaction = await prisma.react.findUnique({
      where: {
        user_id_ressource_id: {
          user_id: userId,
          ressource_id: ressourceId,
        },
      },
    });

    if (existingReaction) {
      // Mettre à jour la réaction
      const updated = await prisma.react.update({
        where: {
          user_id_ressource_id: {
            user_id: userId,
            ressource_id: ressourceId,
          },
        },
        data: {
          reaction_type: reaction,
        },
      });

      return res.json(updated);
    }

    // Sinon créer une nouvelle réaction
    const newReaction = await prisma.react.create({
      data: {
        user_id: userId,
        ressource_id: ressourceId,
        reaction_type: reaction,
      },
    });

    res.json(newReaction);
  } catch (error) {
    console.error("Erreur lors de la réaction :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = { reactToResource };
