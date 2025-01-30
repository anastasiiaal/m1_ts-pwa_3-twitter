require("dotenv").config();
require("./src/utils/sequelize"); // Charge la connexion à la BDD
require("express-async-errors"); // Gère les erreurs dans les middlewares async
const cors = require("cors");

const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

app.use(express.json()); // Remplace body-parser

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Charger les routes
const postRoutes = require("./src/routes/postRoutes");
const commentRoutes = require("./src/routes/commentRoutes");

app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Middleware de gestion des erreurs
app.use((error, req, res, next) => {
  console.error(error); // Affiche l'erreur dans la console pour le debug

  if (error?.status) {
    return res.status(error.status).json({
      code: error.code || "ERROR",
      message: error.message,
    });
  }

  return res.status(500).json({
    code: "SERVER_ERROR",
    message: "Internal Server Error",
  });
});

// Démarrer le serveur
const PORT = process.env.APP_PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 API en ligne sur http://localhost:${PORT}`);
});
