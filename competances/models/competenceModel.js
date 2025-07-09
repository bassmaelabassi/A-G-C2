const mongoose = require("mongoose");

const SousCompetenceSchema = new mongoose.Schema({
    nom: { type: String, required: true},
    validee: { type: Boolean, default: false},
});

const CompetenceSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true},
    nom: { type: String, required: true },
    sousCompetences: { type: [SousCompetenceSchema], default: [] },
});
module.exports = mongoose.model("Competence", CompetenceSchema);