const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connecté : ${conn.connection.host}`);
  } catch (err) {
    console.error('Erreur de connexion MongoDB:', err.message);
    throw err;
  }
};

module.exports = connectDB;
