// Charge les variables d'environnement depuis le fichier .env.
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./routes/auth.routes");
const ressource = require("./routes/ressources.route");
const statsRoutes = require("./routes/stats.route.js");
const comments = require("./routes/comments.route.js");
const replies = require("./routes/replies.route.js");
const reacts = require("./routes/react.route.js");
const reports = require("./routes/report.route.js");
const notifications = require("./routes/notifications.route.js");
const usersRoutes = require("./routes/users.routes");
const collections = require("./routes/collections.route.js");
const activities = require("./routes/activities.route.js");
const app = express();
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:5173";

app.use(helmet());

// Parse automatiquement les requêtes JSON.
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());

// Route pour vérifier que l'API fonctionne.
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Monte les routes d'authentification sous /api/auth.
app.use("/api/auth", authRoutes);
// Monte les routes CRUD utilisateur sous /api/users.
app.use("/api/users", usersRoutes);

// Routes d'accèes
app.use("/ressources", ressource);
app.use("/stats", statsRoutes);
app.use("/comments", comments);
app.use("/replies", replies);
app.use("/reacts", reacts);
app.use("/reports", reports);
app.use("/notifications", notifications);
app.use("/collections", collections);
app.use("/activities", activities);

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
