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

   // Création de la ressource en base de données
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

// Export du contrôleur
module.exports = {
  create,
};
