const { prisma } = require("../db/prisma");

function normalizeCategories(category) {
  const categories = Array.isArray(category) ? category : [category];

  return categories
    .filter(Boolean)
    .map((item) => String(item).trim().toUpperCase());
}

function normalizeTags(tags) {
  const values = Array.isArray(tags) ? tags : [tags];

  return values
    .filter(Boolean)
    .map((item) => String(item).trim())
    .filter(Boolean);
}

  const allowedVisibilities = new Set(["PUBLIC", "PRIVATE"]);
  const allowedCategories = new Set([
    "FOOD",
    "CLOTHES",
    "TOOLS",
    "TRANSPORT",
    "HOUSING",
    "SERVICES",
    "EDUCATION",
    "HEALTH",
    "SOCIAL_SUPPORT",
    "EVENTS",
    "COMMUNITY",
    "VOLUNTEERING",
    "DONATION",
    "JOB_HELP",
    "CHILDCARE",
    "ELDERLY_HELP",
    "PETS",
    "SPORT",
    "CULTURE",
    "OTHER",
  ]);


//Contrôleur création de ressource
async function create(req, res) {
  const userId = req.user.user_id;
  // Récupération des données envoyées dans le body de la requête
  const {
    wording,
    content,
    visibility,
    category,
    city,
    description,
    summary,
    format,
    relation,
    tags,
    featured,
  } = req.body;
  // Normalisation de la visibilité pour correspondre à l’ENUM Prisma
  // (ex : "public" → "PUBLIC")
  const normalizedVisibility = visibility?.toUpperCase();
  const normalizedCategory = normalizeCategories(category);


  if (!allowedVisibilities.has(normalizedVisibility)) {
    return res.status(400).json({ message: "Visibility invalide." });
  }

  // Vérifier la catégorie
  if (
    normalizedCategory.length === 0 ||
    normalizedCategory.some((item) => !allowedCategories.has(item))
  ) {
    return res.status(400).json({ message: "Catégorie invalide." });
  }

  // Vérifie que le champ wording est bien présent
  if (!wording) {
    return res.status(400).json({ message: "Le champ 'wording' est requis." });
  }

  // Création de la ressource
  const resource = await prisma.resources.create({
    data: {
      wording,
      content: content?.trim() || null,
      summary: summary?.trim() || null,
      visibility: normalizedVisibility,
      category: normalizedCategory,
      city: city?.trim() || null,
      description: description?.trim() || null,
      format: format?.trim() || null,
      relation: relation?.trim() || null,
      tags: normalizeTags(tags),
      featured: Boolean(featured),
      // Association de la ressource à l’utilisateur connecté
      // via la relation Prisma (clé unique user_id)
      user: {
        connect: {
          user_id: userId,
        },
      },
    },
  });

  res.json(resource);
}

//Récupérer toutes les ressources
async function getRessources(req, res) {
  try {
    const ressources = await prisma.resources.findMany({
      select: {
        ressource_id: true,
        wording: true,
        content: true,
        summary: true,
        city: true,
        description: true,
        visibility: true,
        user_id: true,
        category: true,
        format: true,
        relation: true,
        tags: true,
        featured: true,
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
      orderBy: { ressource_id: "desc" },
    });
    res.status(200).json(ressources);
  } catch (error) {
    console.error("Erreur lors de la récupération des ressources :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

//Récupérer les ressources de l'utilisateur connecté
async function getRessourcesUser(req, res) {
  try {
    const userId = req.user.user_id;
    const ressources = await prisma.resources.findMany({
      where: {
        user_id: userId,
      },
      select: {
        ressource_id: true,
        wording: true,
        content: true,
        summary: true,
        visibility: true,
        user_id: true,
        category: true,
        format: true,
        relation: true,
        tags: true,
        featured: true,
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
      orderBy: { ressource_id: "desc" },
    });
    res.status(200).json(ressources);
  } catch (error) {
    console.error("Erreur lors de la récupération des ressources :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

//Recupérer une ressource
async function getRessourceById(req, res) {
  try {
    const ressourceId = Number(req.params.id);

    const ressource = await prisma.resources.findUnique({
      where: { ressource_id: ressourceId },
      select: {
        ressource_id: true,
        wording: true,
        content: true,
        summary: true,
        city: true,
        description: true,
        visibility: true,
        category: true,
        format: true,
        relation: true,
        tags: true,
        featured: true,
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
            comments: true,
          },
        },
      },
    });

    if (!ressource) {
      return res.status(404).json({ message: "Ressource non trouvée" });
    }

    res.json(ressource);
  } catch (error) {
    console.error("Erreur lors de la récupération de la ressource :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

//Afficher les ressources publiques
async function getPublicRessources(req, res) {
  try {
    const ressources = await prisma.resources.findMany({
      where: {
        visibility: "PUBLIC",
      },
      select: {
        ressource_id: true,
        wording: true,
        content: true,
        summary: true,
        visibility: true,
        user_id: true,
        category: true,
        format: true,
        relation: true,
        tags: true,
        featured: true,
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
      orderBy: { ressource_id: "desc" },
    });
    res.status(200).json(ressources);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des ressources publiques :",
      error,
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
}

//Afficher les ressources proches de l'utilisateur connecté
async function getNearbyRessourcesForMe(req, res) {
  try {
    //Récupérer le code postal de l'utilisateur connecté
    const user = await prisma.user.findUnique({
      where: {
        user_id: req.user.user_id,
      },
      select: {
        postal_code: true,
      },
    });

    if (!user?.postal_code) {
      return res.status(400).json({
        message: "Code postal utilisateur manquant.",
      });
    }

    const department = user.postal_code.toString().slice(0, 2);

    //Récupérer les ressources publiques dans le même département
    const ressources = await prisma.resources.findMany({
      where: {
        visibility: "PUBLIC",
        user: {
          // Filtrer par code postal dans le même département
          postal_code: {
            gte: Number.parseInt(department + "000"),
            lte: Number.parseInt(department + "999"),
          },
        },
      },
      //Récupérer aussi le nom, le prénom, la ville et le code postal de l'utilisateur propriétaire de la ressource
      include: {
        user: {
          select: {
            city: true,
            postal_code: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });
    res.status(200).json(ressources);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des ressources proches :",
      error,
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
}

//Supprimer une ressource
async function deleteRessource(req, res) {
  try {
    const userId = req.user.user_id;
    const role = req.user.role;
    const ressourceId = Number.parseInt(req.params.id, 10);

    const existingResource = await prisma.resources.findUnique({
      where: {
        ressource_id: ressourceId,
      },
    });

    if (!existingResource) {
      return res.status(404).json({ message: "Ressource non trouvée." });
    }

    const canModerate = role === "Administrateur" || role === "Modérateur";

    if (existingResource.user_id !== userId && !canModerate) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    // Supprime la ressource
    await prisma.resources.delete({
      where: {
        ressource_id: ressourceId,
      },
    });

    res.status(200).json({ message: "Ressource supprimée avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de la ressource :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

//Modifer une ressource (optionnel)
async function updateRessource(req, res) {
  const userId = req.user.user_id;
  const role = req.user.role;
  const ressourceId = Number(req.params.id);

  //Récupérer les nouvelles données de la ressource depuis le corps de la requête
  const {
    wording,
    content,
    visibility,
    category,
    city,
    description,
    summary,
    format,
    relation,
    tags,
    featured,
  } = req.body;

  const normalizedVisibility = visibility?.toUpperCase();
  const normalizedCategory =
    category === undefined ? undefined : normalizeCategories(category);


  const ressource = await prisma.resources.findUnique({
    where: { ressource_id: ressourceId },
  });

  if (!ressource) {
    return res.status(404).json({ message: "Ressource non trouvée." });
  }

  const canModerate = role === "Administrateur" || role === "Modérateur";

  if (ressource.user_id !== userId && !canModerate) {
    return res.status(403).json({ message: "Accès refusé." });
  }

  if (visibility && !allowedVisibilities.has(normalizedVisibility)) {
    return res.status(400).json({ message: "Visibility invalide." });
  }

  if (
    normalizedCategory &&
    (normalizedCategory.length === 0 ||
      normalizedCategory.some((item) => !allowedCategories.has(item)))
  ) {
    return res.status(400).json({ message: "Catégorie invalide." });
  }

  // Met à jour la ressource
  const updated = await prisma.resources.update({
    where: { ressource_id: ressourceId },
    data: {
      ...(wording !== undefined && { wording }),
      ...(content !== undefined && { content: content?.trim() || null }),
      ...(summary !== undefined && { summary: summary?.trim() || null }),
      ...(city !== undefined && { city: city?.trim() || null }),
      ...(description !== undefined && { description: description?.trim() || null }),
      ...(normalizedVisibility && { visibility: normalizedVisibility }),
      ...(format !== undefined && { format: format?.trim() || null }),
      ...(relation !== undefined && { relation: relation?.trim() || null }),
      ...(tags !== undefined && { tags: normalizeTags(tags) }),
      ...(featured !== undefined && { featured: Boolean(featured) }),
      ...(normalizedCategory !== undefined && {
        category: normalizedCategory,
      }),
    },
  });

  res.json(updated);
}

// Filtrer par catégorie
async function getRessourcesByCategory(req, res) {
  const category = req.params.category.toUpperCase();

  const ressources = await prisma.resources.findMany({
    where: { category },
  });

  res.json(ressources);
}

// Export du contrôleur
module.exports = {
  create,
  getRessources,
  getRessourceById,
  getRessourcesUser,
  getPublicRessources,
  getNearbyRessourcesForMe,
  deleteRessource,
  updateRessource,
  getRessourcesByCategory,
};
