const { prisma } = require("../db/prisma");

// Function our transformer les BigInt
function fixBigInt(obj) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? Number(value) : value,
    ),
  );
}

async function getStats(req, res) {
  try {
    const [totalUsers, totalResources, publicResources, pendingReports] =
      await Promise.all([
        prisma.user.count({
          where: { is_anonymized: false },
        }),
        prisma.resources.count(),
        prisma.resources.count({
          where: { visibility: "PUBLIC" },
        }),
        prisma.report.count({
          where: { resolved: false },
        }),
      ]);

    const recentComments = await prisma.comments.findMany({
      take: 3,
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: { firstname: true, lastname: true },
        },
        resource: {
          select: { wording: true },
        },
      },
    });

    const recentReports = await prisma.report.findMany({
      take: 2,
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: { firstname: true, lastname: true },
        },
      },
    });

    const recentResources = await prisma.resources.findMany({
      take: 3,
      orderBy: { ressource_id: "desc" },
      include: {
        user: {
          select: { firstname: true, lastname: true },
        },
      },
    });

    const recentActivity = [
      ...recentResources.map((resource) => ({
        id: `resource-${resource.ressource_id}`,
        user: buildUserLabel(resource.user),
        action: `Nouvelle ressource: ${resource.wording}`,
        date: `#${resource.ressource_id}`,
      })),
      ...recentComments.map((comment) => ({
        id: `comment-${comment.comment_id}`,
        user: buildUserLabel(comment.user),
        action: `Commentaire sur ${comment.resource?.wording ?? "une ressource"}`,
        date: new Date(comment.created_at).toLocaleDateString("fr-FR"),
      })),
      ...recentReports.map((report) => ({
        id: `report-${report.report_id}`,
        user: buildUserLabel(report.user),
        action: `Signalement: ${report.reason}`,
        date: new Date(report.created_at).toLocaleDateString("fr-FR"),
      })),
    ].slice(0, 6);

    const totalViews = await prisma.views.aggregate({
      _sum: { view_number: true },
    });

    const totalComments = await prisma.comments.count();
    const totalReactions = await prisma.react.count();

    res.json({
      totalUsers,
      totalResources,
      publicResources,
      activeAds: publicResources,
      pendingReports,
      totalViews: totalViews._sum.view_number || 0,
      totalComments,
      totalReactions,
      recentActivity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

// Export du controller
module.exports = { getStats };

function buildUserLabel(user) {
  if (!user) {
    return "Utilisateur";
  }

  return `${user.firstname} ${user.lastname}`.trim();
}
