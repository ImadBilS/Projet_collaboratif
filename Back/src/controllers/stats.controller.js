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
    // Récupération des filtres de dates
    const { from, to } = req.query;

    const dateFilter =
      from && to ? { gte: new Date(from), lte: new Date(to) } : undefined;

    // Total ressources
    const totalResources = await prisma.resources.count({
      where:  dateFilter ? { created_at: dateFilter } : undefined,
    });

    // Total vues (somme de view_number)
    const totalViews = await prisma.views.aggregate({
      _sum: { view_number: true },
      where:  dateFilter ? { created_at: dateFilter } : undefined,
    });

    // Total commentaires
    const totalComments = await prisma.comments.count({
      where:  dateFilter ? { created_at: dateFilter } : undefined,
    });

    // Total réactions
    const totalReactions = await prisma.react.count({
      where:  dateFilter ? { created_at: dateFilter } : undefined,
    });

    // Catégories les plus populaires
    const popularCategories = await prisma.resources.groupBy({
      by: ["category"],
      _count: { category: true },
      where:  dateFilter ? { created_at: dateFilter } : undefined,
      orderBy: {
        _count: {
          category: "desc",
        },
      },
      take: 5, // top 5
    });

    // Ressources les plus vues
    const mostViewedResources = await prisma.views.groupBy({
      by: ["ressource_id"],
      _sum: { view_number: true },
      where:  dateFilter ? { created_at: dateFilter } : undefined,
      orderBy: {
        _sum: { view_number: "desc" },
      },
      take: 5,
    });

    // Récupérer les infos des ressources (nom, catégorie...)
    const resourceIds = mostViewedResources.map((r) => r.ressource_id);

    const ressources = await prisma.resources.findMany({
      where: { ressource_id: { in: resourceIds } },
      select: {
        ressource_id: true,
        wording: true,
        category: true,
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
      totalResources,
      totalViews: totalViews._sum.view_number || 0,
      totalComments,
      totalReactions,
      popularCategories,
      mostViewed: mostViewedWithNames,
      mostCommentedResources,
      mostLikedResources,
      activeUsers,
      categoryViews,
      resourcesByDepartment,
      resourcesByCity,
      viewsByDepartment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

// Export du controller
module.exports = { getStats };
