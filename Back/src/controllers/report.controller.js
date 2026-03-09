const { prisma } = require("../db/prisma");

// Signaler un commentaire
async function reportComment(req, res) {
  const userId = req.user.user_id;
  const commentId = Number(req.params.id);
  const { reason } = req.body;

  if (!reason) return res.status(400).json({ message: "Raison requise." });

  const report = await prisma.report.create({
    data: {
      reason,
      user_id: userId,
      comment_id: commentId,
    },
  });

  //   Notification pour modérateurs
  await prisma.notification.create({
    data: {
      type: "REPORT",
      message: `Un commentaire (#${commentId} a été signalé)`,
    },
  });

  res.json({ message: "Commentaire signalé.", report });
}

// Signaler une réponse
async function reportReply(req, res) {
  const userId = req.user.user_id;
  const replyId = Number(req.params.id);
  const { reason } = req.body;

  if (!reason) return res.status(400).json({ message: "Raison requise." });

  const report = await prisma.report.create({
    data: {
      reason,
      user_id: userId,
      replie_id: replyId,
    },
  });

  //   Notification pour modérateurs
  await prisma.notification.create({
    data: {
      type: "REPORT",
      message: `Une réponse (#${replyId} a été signalé)`,
    },
  });

  res.json({ message: "Réponse signalée.", report });
}

// Voir tous les signalements (Admin + Moderator)
async function getAllReports(req, res) {
  const role = req.user.role;

  if (role !== "ADMIN" && role !== "MODERATOR") {
    return res.status(403).json({ message: "Accès refusé." });
  }

  const reports = await prisma.report.findMany({
    include: {
      user: { select: { firstname: true, lastname: true } }, // celui qui signale
      comment: {
        include: {
          user: {
            select: { firstname: true, lastname: true }, // auteur du commentaire
          },
        },
      },
      reply: {
        include: {
          user: {
            select: { firstname: true, lastname: true }, // auteur de la réponse
          },
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  res.json(reports);
}

// Traiter un signalement
async function resolveReport(req, res) {
  try {
    const role = req.user.role;
    const reportId = Number(req.params.id);

    if (role !== "ADMIN" && role !== "MODERATOR") {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const updated = await prisma.report.update({
      where: { report_id: reportId },
      data: { resolved: true },
    });

    res.json({ message: "Signalement marqué comme traité.", report: updated });
  } catch (error) {
    console.error("Erreur lors du traitement du signalement: ", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = {
  reportComment,
  reportReply,
  getAllReports,
  resolveReport,
};
