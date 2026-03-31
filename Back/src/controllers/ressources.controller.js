const { prisma } = require("../db/prisma");

//Contrôleur création de ressource
async function create(req, res) {
  const userId = req.user.user_id;
  const { wording, visibility, category = [] } = req.body;

  const normalizedVisibility = visibility?.toUpperCase();

  const allowedVisibilities = ["PUBLIC", "PRIVATE"];

  if (!allowedVisibilities.includes(normalizedVisibility)) {
    return res.status(400).json({ message: "Visibility invalide." });
  }

  if (!wording) {
    return res.status(400).json({ message: "Le champ 'wording' est requis." });
  }

  // Création de la ressource
  const resource = await prisma.resources.create({
    data: {
      wording,
      visibility: normalizedVisibility,
      user: { connect: { user_id: userId } },
      category: {
        create: category.map((c) => ({
          category: c.toUpperCase(),
        })),
      },
    },
    include: {
      category: true,
    },
  });

  res.json(resource);
}

//Récupérer toutes les ressources
async function getRessources(req, res) {
  try {
    const ressources = await prisma.resources.findMany({
      include: {
        user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
        category: true,
      },
    });

    // Transformer les catégories pivot → tableau simple
    const formatted = ressources.map((r) => ({
      ...r,
      category: r.category.map((c) => c.category),
    }));
    res.status(200).json(formatted);
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
      where: { user_id: userId },
      include: {
        user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
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
      include: {
        user: { select: { firstname: true, lastname: true } },
        category: true,
      },
    });

    if (!ressource) {
      return res.status(404).json({ message: "Ressource non trouvée" });
    }

    // Transformer les catégories
    const formatted = {
      ...ressource,
      category: ressource.category.map((c) => c.category),
    };

    res.json(formatted);
  } catch (error) {
    console.error("Erreur lors de la récupération de la ressource :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

//Afficher les ressources publiques
async function getPublicRessources(req, res) {
  try {
    const ressources = await prisma.resources.findMany({
      where: { visibility: "PUBLIC" },
      include: {
        user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
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
    const ressourceId = Number.parseInt(req.params.id, 10);

    // Vérifie que l'utilisateur est bien le propriétaire de la ressource
    const existingResource = await prisma.resources.findUnique({
      where: {
        ressource_id: ressourceId,
        user_id: userId,
      },
    });

    if (!existingResource) {
      return res
        .status(404)
        .json({ message: "Ressource non trouvée ou accès refusé." });
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
  const ressourceId = Number(req.params.id);

  const { wording, visibility, category = [] } = req.body;

  const normalizedVisibility = visibility?.toUpperCase();

  const allowedVisibilities = ["PUBLIC", "PRIVATE"];

  const ressource = await prisma.resources.findUnique({
    where: { ressource_id: ressourceId },
  });

  if (!ressource) {
    return res.status(404).json({ message: "Ressource non trouvée." });
  }

  if (ressource.user_id !== userId) {
    return res.status(403).json({ message: "Accès refusé." });
  }

  if (visibility && !allowedVisibilities.includes(normalizedVisibility)) {
    return res.status(400).json({ message: "Visibility invalide." });
  }

  // Mise à jour
  const updated = await prisma.resources.update({
    where: { ressource_id: ressourceId },
    data: {
      wording,
      visibility: normalizedVisibility,
      category: {
        deleteMany: {}, // supprime toutes les anciennes catégories
        create: category.map((c) => ({
          category: c.toUpperCase(),
        })),
      },
    },
    include: {
      category: true,
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
