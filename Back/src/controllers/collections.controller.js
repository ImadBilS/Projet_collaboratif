const { prisma } = require("../db/prisma");

function parseResourceId(value) {
  const resourceId = Number.parseInt(value, 10);
  return Number.isNaN(resourceId) ? null : resourceId;
}

async function getMyCollections(req, res) {
  try {
    const userId = req.user.user_id;
    const entries = await prisma.userResourceProgress.findMany({
      where: {
        user_id: userId,
        OR: [
          { is_favorite: true },
          { is_saved_for_later: true },
          { is_completed: true },
        ],
      },
      include: {
        resource: {
          include: {
            user: {
              select: {
                firstname: true,
                lastname: true,
                city: true,
              },
            },
            _count: {
              select: {
                reactions: true,
              },
            },
          },
        },
      },
      orderBy: { updated_at: "desc" },
    });

    return res.status(200).json({ collections: entries });
  } catch (error) {
    console.error("Erreur lors de la récupération des collections :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

async function upsertCollectionState(req, res) {
  try {
    const userId = req.user.user_id;
    const resourceId = parseResourceId(req.params.resourceId);
    const {
      isFavorite,
      isSavedForLater,
      isCompleted,
    } = req.body ?? {};

    if (resourceId === null) {
      return res.status(400).json({ message: "resourceId invalide" });
    }

    if (
      isFavorite === undefined &&
      isSavedForLater === undefined &&
      isCompleted === undefined
    ) {
      return res.status(400).json({ message: "Aucune collection a mettre a jour" });
    }

    const resource = await prisma.resources.findUnique({
      where: { ressource_id: resourceId },
      select: { ressource_id: true },
    });

    if (!resource) {
      return res.status(404).json({ message: "Ressource introuvable" });
    }

    const entry = await prisma.userResourceProgress.upsert({
      where: {
        user_id_ressource_id: {
          user_id: userId,
          ressource_id: resourceId,
        },
      },
      update: {
        is_favorite: isFavorite,
        is_saved_for_later: isSavedForLater,
        is_completed: isCompleted,
      },
      create: {
        user_id: userId,
        ressource_id: resourceId,
        is_favorite: Boolean(isFavorite),
        is_saved_for_later: Boolean(isSavedForLater),
        is_completed: Boolean(isCompleted),
      },
      include: {
        resource: {
          include: {
            user: {
              select: {
                firstname: true,
                lastname: true,
                city: true,
              },
            },
            _count: {
              select: {
                reactions: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({ collection: entry });
  } catch (error) {
    console.error("Erreur lors de la mise a jour des collections :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = {
  getMyCollections,
  upsertCollectionState,
};
