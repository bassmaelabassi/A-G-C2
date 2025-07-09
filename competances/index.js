const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const competenceRoutes = require("./routes/competenceRoutes");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"] }));
app.use(express.json());
app.use("/api", competenceRoutes);

const PORT = process.env.PORT || 9000;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur le port ${PORT}`);
      console.log(`URL: http://localhost:${PORT}/api/competences`);
    });
  } catch (err) {
    console.error("Erreur lors du démarrage du serveur:", err.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;