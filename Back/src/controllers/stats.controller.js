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

    // Fusionner les données
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
      where:  dateFilter ? { created_at: dateFilter } : undefined,
      orderBy: {
        _count: { ressource_id: "desc" },
      },
      take: 5,
    });

    // Ressources les plus likées
    const mostLikedResources = await prisma.react.groupBy({
      by: ["ressource_id"],
      _count: { ressource_id: true },
      where:  dateFilter ? { created_at: dateFilter } : undefined,
      orderBy: {
        _count: { ressource_id: "desc" },
      },
      take: 5,
    });

    // Utilisateurs les plus actifs
    // basé sur : ressources créées + commentaires + réactions
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
      orderBy: {
        resources: { _count: "desc" },
      },
      take: 5,
    });

    // Construction du WHERE pour les dates
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
    // on combine views + ressources
    // Prisma ne permet pas de sommer directement une relation dans un groupBy.
    // Donc on fait en deux étapes :
    const categoryViewsRaw = await prisma.$queryRawUnsafe(`
        SELECT r.category, SUM(v.view_number) AS totalViews
        FROM "Resources" r
        LEFT JOIN "Views" v ON r.ressource_id = v.ressource_id
        WHERE 1=1 
        ${whereSQL}
        GROUP BY r.category
        ORDER BY totalViews DESC
        LIMIT 5;  
        `, ...params);
    const categoryViews = fixBigInt(categoryViewsRaw);

    // --- STATS GÉOGRAPHIQUES ---

    const resourcesByDepartmentRaw = await prisma.$queryRawUnsafe(`
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
    `, ...params);
    const resourcesByDepartment = fixBigInt(resourcesByDepartmentRaw);

    const resourcesByCityRaw = await prisma.$queryRawUnsafe(`
            SELECT 
                u.city AS city,
                COUNT(r.ressource_id) AS total
            FROM "Resources" r
            JOIN "User" u ON r.user_id = u.user_id
           WHERE 1=1 
            ${whereSQL}
            GROUP BY city
            ORDER BY total DESC
            LIMIT 5;
            `, ...params);
    const resourcesByCity = fixBigInt(resourcesByCityRaw);

    const viewsByDepartmentRaw = await prisma.$queryRawUnsafe(`
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
        `, ...params);
    const viewsByDepartment = fixBigInt(viewsByDepartmentRaw);

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
