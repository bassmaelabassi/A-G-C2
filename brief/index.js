require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const briefRoutes = require('./routes/briefRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Connexion à la base de données
connectDB();

// Middlewares
app.use(express.json());

// Routes
app.use('/api/briefs', briefRoutes);

// Gestion des erreurs simples
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur' });
});

app.listen(PORT, () => {
  console.log(`Brief-Service démarré sur le port ${PORT}`);
});

module.exports = app;
