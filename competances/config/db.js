const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;

    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/competences-db');
        isConnected = true;
        console.log("Connexion à MongoDB réussie");
    } catch (err) {
        console.error("Erreur de connexion à MongoDB:", err.message);
        throw err;
    }
};

const disconnectDB = async () => {
    if (isConnected) {
        await mongoose.disconnect();
        isConnected = false;
    }
};

module.exports = { connectDB, disconnectDB, mongoose };