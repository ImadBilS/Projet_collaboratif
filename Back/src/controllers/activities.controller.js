const { prisma } = require("../db/prisma");

function parseId(value) {
  const id = Number.parseInt(value, 10);
  return Number.isNaN(id) ? null : id;
}

function buildActivityInclude() {
  return {
    resource: {
      select: {
        ressource_id: true,
        wording: true,
      },
    },
    participants: {
      orderBy: { participant_id: "asc" },
    },
    messages: {
      orderBy: { message_id: "asc" },
    },
  };
}

async function listActivities(req, res) {
  try {
    const activities = await prisma.activity.findMany({
      include: buildActivityInclude(),
      orderBy: { created_at: "desc" },
    });

    return res.status(200).json({ activities });
  } catch (error) {
    console.error("Erreur lors de la récupération des activités :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

async function getActivityById(req, res) {
  try {
    const activityId = parseId(req.params.id);

    if (activityId === null) {
      return res.status(400).json({ message: "id invalide" });
    }

    const activity = await prisma.activity.findUnique({
      where: { activity_id: activityId },
      include: buildActivityInclude(),
    });

    if (!activity) {
      return res.status(404).json({ message: "Activite introuvable" });
    }

    return res.status(200).json({ activity });
  } catch (error) {
    console.error("Erreur lors de la récupération d'une activité :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

async function createActivity(req, res) {
  try {
    const userId = req.user.user_id;
    const resourceId =
      req.body?.resourceId === undefined ? null : parseId(req.body.resourceId);
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { firstname: true, lastname: true },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (req.body?.resourceId !== undefined && resourceId === null) {
      return res.status(400).json({ message: "resourceId invalide" });
    }

    if (resourceId !== null) {
      const resource = await prisma.resources.findUnique({
        where: { ressource_id: resourceId },
        select: { ressource_id: true },
      });

      if (!resource) {
        return res.status(404).json({ message: "Ressource introuvable" });
      }
    }

    const activity = await prisma.activity.create({
      data: {
        title: req.body?.title?.trim() || "Nouvelle activité citoyenne",
        description:
          req.body?.description?.trim() ||
          "Une activité démarrée depuis le mobile pour favoriser un échange relationnel simple.",
        status: req.body?.status?.trim() || "Prête",
        owner_id: userId,
        ressource_id: resourceId,
        participants: {
          create: {
            name: `${user.firstname} ${user.lastname}`.trim(),
          },
        },
      },
      include: buildActivityInclude(),
    });

    return res.status(201).json({ activity });
  } catch (error) {
    console.error("Erreur lors de la création d'une activité :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

async function addParticipant(req, res) {
  try {
    const activityId = parseId(req.params.id);
    const name = String(req.body?.name ?? "").trim();

    if (activityId === null) {
      return res.status(400).json({ message: "id invalide" });
    }

    if (!name) {
      return res.status(400).json({ message: "Nom requis" });
    }

    const activity = await prisma.activity.findUnique({
      where: { activity_id: activityId },
      select: { activity_id: true },
    });

    if (!activity) {
      return res.status(404).json({ message: "Activite introuvable" });
    }

    await prisma.activityParticipant.create({
      data: {
        activity_id: activityId,
        name,
      },
    });

    const updatedActivity = await prisma.activity.findUnique({
      where: { activity_id: activityId },
      include: buildActivityInclude(),
    });

    return res.status(200).json({ activity: updatedActivity });
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un participant :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

async function addMessage(req, res) {
  try {
    const activityId = parseId(req.params.id);
    const message = String(req.body?.message ?? "").trim();
    const userId = req.user.user_id;

    if (activityId === null) {
      return res.status(400).json({ message: "id invalide" });
    }

    if (!message) {
      return res.status(400).json({ message: "Message requis" });
    }

    const [activity, user] = await Promise.all([
      prisma.activity.findUnique({
        where: { activity_id: activityId },
        select: { activity_id: true },
      }),
      prisma.user.findUnique({
        where: { user_id: userId },
        select: { firstname: true, lastname: true },
      }),
    ]);

    if (!activity) {
      return res.status(404).json({ message: "Activite introuvable" });
    }

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    await prisma.$transaction([
      prisma.activityMessage.create({
        data: {
          activity_id: activityId,
          author_name: `${user.firstname} ${user.lastname}`.trim(),
          message,
        },
      }),
      prisma.activity.update({
        where: { activity_id: activityId },
        data: { status: "En cours" },
      }),
    ]);

    const updatedActivity = await prisma.activity.findUnique({
      where: { activity_id: activityId },
      include: buildActivityInclude(),
    });

    return res.status(200).json({ activity: updatedActivity });
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un message :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = {
  listActivities,
  getActivityById,
  createActivity,
  addParticipant,
  addMessage,
};
