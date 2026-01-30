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

  // Liste des valeurs autorisées pour l’ENUM Visibility
  const allowedVisibilities = ["PUBLIC", "PRIVATE"];

  // Vérifie que la visibilité est valide
  if (!allowedVisibilities.includes(normalizedVisibility)) {
    return res.status(400).json({ message: "Visibility invalide." });
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

async function getRessources(req, res) {
  try {
    const ressources = await prisma.resources.findMany();
    res.status(200).json(ressources);
  } catch (error) {
    console.error("Erreur lors de la récupération des ressources :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function getRessourcesUser(req, res) {
  try {
    const userId = req.user.user_id;
    const ressources = await prisma.resources.findMany({
      where: {
        user_id: userId,
        },
    });
    res.status(200).json(ressources);
  }
    catch (error) { 
    console.error("Erreur lors de la récupération des ressources :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function deleteRessource(req, res) {
  try {
    const userId = req.user.user_id;
    const ressourceId = parseInt(req.params.id, 10);
    
    // Vérifie que l'utilisateur est bien le propriétaire de la ressource
    const existingResource = await prisma.resources.findUnique({
      where: {
        resource_id: ressourceId,
        user_id: userId,
      },
    });

    if (!existingResource) {
      return res.status(404).json({ message: "Ressource non trouvée ou accès refusé." });
    }

    // Supprime la ressource
    await prisma.resources.delete({
      where: {
        resource_id: ressourceId,
      },
    });

    res.status(200).json({ message: "Ressource supprimée avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de la ressource :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

// Export du contrôleur
module.exports = {
  create,
  getRessources,
  getRessourcesUser,
  deleteRessource,
};
