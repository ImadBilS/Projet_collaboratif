const { prisma } = require("../db/prisma");

//Contrôleur création de ressource
async function create(req, res) {
  // Récupération de l’identifiant utilisateur depuis le JWT
  // (injecté dans req.user par le middleware d’authentification)
  const userId = req.user.user_id;
  // Récupération des données envoyées dans le body de la requête
  const { wording, visibility } = req.body;
  // Normalisation de la visibilité pour correspondre à l’ENUM Prisma
  // (ex : "public" → "PUBLIC")
  const normalizedVisibility = visibility?.toUpperCase();
  const normalizedCategory = category?.toUpperCase();

  // Liste des valeurs autorisées pour l’ENUM Visibility
  const allowedVisibilities = ["PUBLIC", "PRIVATE"];

  // Type de catégorie
  const allowedCategories = [
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
  ];

  // Vérifie que la visibilité est valide
  if (!allowedVisibilities.includes(normalizedVisibility)) {
    return res.status(400).json({ message: "Visibility invalide." });
  }

  // Vérifier la catégorie
  if (!allowedCategories.includes(normalizedCategory)) {
    return res.status(400).json({ message: "Catégorie invalide." });
  }

  // Vérifie que le champ wording est bien présent
  if (!wording) {
    return res.status(400).json({ message: "Le champ 'wording' est requis." });
  }

  // Création de la ressource en base de donnéesgit c
  const resource = await prisma.resources.create({
    data: {
      wording,
      visibility: normalizedVisibility,
      category: normalizedCategory,
      // Association de la ressource à l’utilisateur connecté
      // via la relation Prisma (clé unique user_id)
      user: {
        connect: {
          user_id: userId,
        },
      },
    },
  });

  // Retourne la ressource créée au client
  res.json(resource);
}

//Récupérer toutes les ressources
async function getRessources(req, res) {
  try {
    const ressources = await prisma.resources.findMany();
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
    const userId = req.user.user_id; // récupéré via le middlware JWT
    const ressourceId = parseInt(req.params.id, 10);
    // Répcupérer la ressource
    const ressource = await prisma.resources.findUnique({
      where: {
        ressource_id: ressourceId,
      },
    });

    if (!ressource) {
      return res.status(404).json({ message: "Ressource non trouvée" });
    }

    // Vérifier si une vue existe déjà pour ce user + ressource
    const existingView = await prisma.views.findUnique({
      where: {
        user_id_ressource_id: {
          user_id: userId,
          ressource_id: ressourceId,
        },
      },
    });

    // Si la vue existe on incrémente la table view
    if (existingView) {
      await prisma.views.update({
        where: {
          user_id_ressource_id: {
            user_id: userId,
            ressource_id: ressourceId,
          },
        },
        data: {
          view_number: existingView.view_number + 1,
        },
      });
    }
    // Sinon on crée la ligne
    else {
      await prisma.views.create({
        data: {
          user_id: userId,
          ressource_id: ressourceId,
          view_number: 1,
        },
      });
    }
    // On retourne la ressource
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

    if (!user || !user.postal_code) {
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
            gte: parseInt(department + "000"),
            lte: parseInt(department + "999"),
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
    const ressourceId = parseInt(req.params.id, 10);

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
  //Récupérer l'id de l'utilisateur connecté et l'id de la ressource à modifier
  const userId = req.user.user_id;
  const ressourceId = Number(req.params.id); //Number pour s'assurer que c'est un entier

  //Récupérer les nouvelles données de la ressource depuis le corps de la requête
  const { wording, visibility, category } = req.body;

  const normalizedVisibility = visibility?.toUpperCase();
  const normalizedCategory = category?.toUpperCase();

  const allowedVisibilities = ["PUBLIC", "PRIVATE"];
  const allowedCategories = [
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
  ];

  //Vérifier que la ressource existe et appartient à l'utilisateur
  const ressource = await prisma.resources.findUnique({
    where: {
      ressource_id: ressourceId,
    },
  });

  //Si la ressource n'existe pas ou n'appartient pas à l'utilisateur connecté
  if (!ressource) {
    return res.status(404).json({ message: "Ressource non trouvée." });
  }

  if (ressource.user_id !== userId) {
    return res.status(403).json({ message: "Accès refusé." });
  }

  if (visibility && !allowedVisibilities.includes(normalizedVisibility)) {
    return res.status(400).json({ message: "Visibility invalide." });
  }

  if (category && !allowedCategories.includes(normalizedCategory)) {
    return res.status(400).json({ message: "Catégorie invalide." });
  }

  // Met à jour la ressource
  const updatedRessource = await prisma.resources.update({
    where: {
      ressource_id: ressourceId,
    },
    data: {
      wording,
      visibility: normalizedVisibility,
      category: normalizedCategory,
    },
  });

  res.json(updatedRessource);
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
