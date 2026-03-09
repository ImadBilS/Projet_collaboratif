const { prisma } = require("../db/prisma");

// Récupérer les notifications
async function getNotifications(req, res) {
  const role = req.user.role;

  if (role !== "ADMIN" && role !== "MODERATOR") {
    return res.status(403).json({ message: "Accès refusé" });
  }

  const notifications = await prisma.notification.findMany({
    orderBy: { created_at: "desc" },
  });

  res.json(notifications);
}

// Marquer une notif comme lue
async function markNotificationRead(req, res) {
  const role = req.user.role;
  const notifId = Number(req.params.id);

  if (role !== "ADMIN" && role !== "MODERATOR") {
    return res.status(403).json({ message: "Accès refusé." });
  }

  await prisma.notification.update({
    where: { notification_id: notifId },
    data: { is_read: true },
  });

  res.json({ message: "Notification marquée comme lue." });
}

module.exports = {
  getNotifications,
  markNotificationRead,
};
