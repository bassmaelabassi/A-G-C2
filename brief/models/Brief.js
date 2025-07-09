const mongoose = require('mongoose');

const BriefSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String },
  competences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Competence' }]
});

module.exports = mongoose.model('Brief', BriefSchema);
