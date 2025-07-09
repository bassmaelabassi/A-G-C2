const Competence = require("../models/competenceModel");
const { calculerStatutGlobal } = require("../utils/statusCalculator");

const getAllCompetences = async () => {
  const competences = await Competence.find();
  return competences.map(c => ({
    ...c.toObject(),
    statutGlobal: calculerStatutGlobal(c.sousCompetences || []),
  }));
};

const getCompetenceById = async (id) => {
  const competence = await Competence.findById(id);
  if (!competence) return null;
  return {
    ...competence.toObject(),
    statutGlobal: calculerStatutGlobal((competence.sousCompetences || [])),
  };
};

const createCompetence = async (data) => {
  const competence = new Competence({
    ...data,
    sousCompetences: Array.isArray(data.sousCompetences) ? data.sousCompetences : []
  });
  const saved = await competence.save();
  return {
    ...saved.toObject(),
    statutGlobal: calculerStatutGlobal(saved.sousCompetences || []),
  };
};

const updateEvaluation = async (id, sousCompetences) => {
  const competence = await Competence.findById(id);
  if (!competence) throw new Error("Compétence non trouvée");

  competence.sousCompetences = Array.isArray(sousCompetences) ? sousCompetences : [];
  const updated = await competence.save();
  return {
    ...updated.toObject(),
    statutGlobal: calculerStatutGlobal(updated.sousCompetences || []),
  };
};

const updateCompetence = async (id, data) => {
  const updated = await Competence.findByIdAndUpdate(id, {
    ...data,
    sousCompetences: Array.isArray(data.sousCompetences) ? data.sousCompetences : []
  }, { new: true });
  if (!updated) return null;
  return {
    ...updated.toObject(),
    statutGlobal: calculerStatutGlobal(updated.sousCompetences || []),
  };
};

const deleteCompetence = async (id) => {
  return await Competence.findByIdAndDelete(id);
};

const resolveTie = async (competenceId, subCompetenceId) => {
  const competence = await Competence.findById(competenceId);
  if (!competence) throw new Error("Compétence non trouvée");

  const validated = competence.sousCompetences.filter(sc => sc.validee).length;
  const notValidated = competence.sousCompetences.filter(sc => !sc.validee).length;

  if (validated !== notValidated) {
    throw new Error("Il n'y a pas d'égalité à résoudre.");
  }

  const chosen = competence.sousCompetences.id(subCompetenceId);
  if (!chosen) throw new Error("Sous-compétence non trouvée");

  if (chosen.validee) {
    const toValidate = competence.sousCompetences.find(sc => !sc.validee && sc._id.toString() !== subCompetenceId);
    if (toValidate) toValidate.validee = true;
    else throw new Error("Aucune sous-compétence à valider trouvée.");
  } else {
    const toInvalidate = competence.sousCompetences.find(sc => sc.validee && sc._id.toString() !== subCompetenceId);
    if (toInvalidate) toInvalidate.validee = false;
    else throw new Error("Aucune sous-compétence à invalider trouvée.");
  }

  const updated = await competence.save();
  return {
    ...updated.toObject(),
    statutGlobal: calculerStatutGlobal(updated.sousCompetences),
  };
};

const compareStatutGlobal = (sousCompetences, decisiveName) => {
  const valides = sousCompetences.filter(sc => sc.statut === 'validée').length;
  const nonValides = sousCompetences.filter(sc => sc.statut === 'non validée').length;
  if (valides > nonValides) return 'validée';
  if (nonValides > valides) return 'non validée';

  if (decisiveName) {
    const decisive = sousCompetences.find(sc => sc.nom === decisiveName);
    return decisive ? decisive.statut : 'non validée';
  }

  return 'non validée';
};

module.exports = {
  getAllCompetences,
  getCompetenceById,
  createCompetence,
  updateEvaluation,
  deleteCompetence,
  updateCompetence,
  resolveTie,
  compareStatutGlobal,
};
