const { prisma } = require("../db/prisma");

// Convertir BigInt → Number
function fixBigInt(obj) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? Number(value) : value,
    ),
  );
}

async function getStats(req, res) {
  try {
    const { from, to } = req.query;

    // Filtre date pour Prisma
    const dateFilter =
      from || to
        ? {
            gte: from ? new Date(from) : undefined,
            lte: to ? new Date(to) : undefined,
          }
        : undefined;

    // Stats globales
    const [totalUsers, totalResources, publicResources, pendingReports] =
      await Promise.all([
        prisma.user.count({ where: { is_anonymized: false } }),
        prisma.resources.count(),
        prisma.resources.count({ where: { visibility: "PUBLIC" } }),
        prisma.report.count({ where: { resolved: false } }),
      ]);

    // Commentaires récents
    const recentComments = await prisma.comments.findMany({
      take: 3,
      orderBy: { created_at: "desc" },
      include: {
        user: { select: { firstname: true, lastname: true } },
        resource: { select: { wording: true } },
      },
    });

    // Signalements récents
    const recentReports = await prisma.report.findMany({
      take: 2,
      orderBy: { created_at: "desc" },
      include: {
        user: { select: { firstname: true, lastname: true } },
      },
    });

    // Ressources les plus vues
    const mostViewedResources = await prisma.views.groupBy({
      by: ["ressource_id"],
      _sum: { view_number: true },
      orderBy: { _sum: { view_number: "desc" } },
      take: 5,
    });

    const ressources = await prisma.resources.findMany({
      where: {
        ressource_id: {
          in: mostViewedResources.map((r) => r.ressource_id),
        },
      },
      select: {
        ressource_id: true,
        wording: true,
        category: true,
      },
    });

    const mostViewedWithNames = mostViewedResources.map((item) => {
      const resource = ressources.find(
        (r) => r.ressource_id === item.ressource_id,
      );
      return {
        ressource_id: item.ressource_id,
        views: item._sum.view_number,
        wording: resource?.wording || "Ressource inconnue",
        category: resource?.category || null,
      };
    });

    // Ressources les plus commentées
    const mostCommentedResources = await prisma.comments.groupBy({
      by: ["ressource_id"],
      _count: { ressource_id: true },
      where: dateFilter ? { created_at: dateFilter } : undefined,
      orderBy: { _count: { ressource_id: "desc" } },
      take: 5,
    });

    // Ressources les plus likées
    const mostLikedResources = await prisma.react.groupBy({
      by: ["ressource_id"],
      _count: { ressource_id: true },
      where: dateFilter ? { created_at: dateFilter } : undefined,
      orderBy: { _count: { ressource_id: "desc" } },
      take: 5,
    });

    // Utilisateurs les plus actifs
    const activeUsers = await prisma.user.findMany({
      select: {
        user_id: true,
        firstname: true,
        lastname: true,
        _count: {
          select: {
            resources: { where: dateFilter ? { created_at: dateFilter } : {} },
            comments: { where: dateFilter ? { created_at: dateFilter } : {} },
            reactions: { where: dateFilter ? { created_at: dateFilter } : {} },
          },
        },
      },
      where: { is_anonymized: false },
      orderBy: { resources: { _count: "desc" } },
      take: 5,
    });

    // Construction du WHERE SQL
    let whereSQL = "";
    let params = [];

    if (from) {
      params.push(new Date(from));
      whereSQL += ` AND r.created_at >= $${params.length} `;
    }

    if (to) {
      params.push(new Date(to));
      whereSQL += ` AND r.created_at <= $${params.length} `;
    }

    // Catégories les plus vues
    const categoryViewsRaw = await prisma.$queryRawUnsafe(
      `
      SELECT r.category, SUM(v.view_number) AS totalViews
      FROM "Resources" r
      LEFT JOIN "Views" v ON r.ressource_id = v.ressource_id
      WHERE 1=1 
      ${whereSQL}
      GROUP BY r.category
      ORDER BY totalViews DESC
      LIMIT 5;
    `,
      ...params,
    );
    const categoryViews = fixBigInt(categoryViewsRaw);

    // Stats géographiques
    const resourcesByDepartment = fixBigInt(
      await prisma.$queryRawUnsafe(
        `
      SELECT 
        SUBSTRING(u.postal_code::text, 1, 2) AS department,
        COUNT(r.ressource_id) AS total
      FROM "Resources" r
      JOIN "User" u ON r.user_id = u.user_id
      WHERE 1=1 
      ${whereSQL}
      GROUP BY department
      ORDER BY total DESC
      LIMIT 5;
    `,
        ...params,
      ),
    );

    const resourcesByCity = fixBigInt(
      await prisma.$queryRawUnsafe(
        `
      SELECT 
        u.city AS city,
        COUNT(r.ressource_id) AS total
      FROM "Resources" r
      JOIN "User" u ON r.user_id = u.user_id
      WHERE 1=1 
      ${whereSQL}
      GROUP BY u.city
      ORDER BY total DESC
      LIMIT 5;
    `,
        ...params,
      ),
    );

    const viewsByDepartment = fixBigInt(
      await prisma.$queryRawUnsafe(
        `
      SELECT 
        SUBSTRING(u.postal_code::text, 1, 2) AS department,
        SUM(v.view_number) AS totalViews
      FROM "Views" v
      JOIN "Resources" r ON v.ressource_id = r.ressource_id
      JOIN "User" u ON r.user_id = u.user_id
      WHERE 1=1 
      ${whereSQL}
      GROUP BY department
      ORDER BY totalViews DESC
      LIMIT 5;
    `,
        ...params,
      ),
    );

    // Totaux supplémentaires
    const totalViews = await prisma.views.aggregate({
      _sum: { view_number: true },
    });

    const totalComments = await prisma.comments.count();
    const totalReactions = await prisma.react.count();

    const recentActivity = {
      comments: recentComments,
      reports: recentReports,
    };

    // Réponse finale
    res.json({
      totalUsers,
      totalResources,
      publicResources,
      activeAds: publicResources,
      pendingReports,
      totalViews: totalViews._sum.view_number || 0,
      totalComments,
      totalReactions,
      mostViewed: mostViewedWithNames,
      mostCommented: mostCommentedResources,
      mostLiked: mostLikedResources,
      activeUsers,
      categoryViews,
      resourcesByDepartment,
      resourcesByCity,
      viewsByDepartment,
      recentActivity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

module.exports = { getStats };
