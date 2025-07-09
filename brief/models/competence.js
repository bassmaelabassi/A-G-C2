const mongoose = require('mongoose');

const CompetenceSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  nom: { type: String, required: true }
});

module.exports = mongoose.model('Competence', CompetenceSchema);
