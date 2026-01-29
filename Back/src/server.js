// Charge les variables d'environnement depuis le fichier .env.
require("dotenv").config();

const express = require("express");
const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");
const app = express();

// Parse automatiquement les requêtes JSON.
app.use(express.json());

// Route pour vérifier que l'API fonctionne.
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Monte les routes d'authentification sous /api/auth.
app.use("/api/auth", authRoutes);
// Monte les routes CRUD utilisateur sous /api/users.
app.use("/api/users", usersRoutes);

// Si aucune route ne correspond, on renvoie un 404.
app.use((req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

// Gestionnaire d'erreurs global.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Erreur serveur" });
});

// Démarre le serveur sur le port configuré.
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`API started on port ${PORT}`);
});
