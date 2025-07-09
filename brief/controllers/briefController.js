const Brief = require('../models/Brief');
const Competence = require('../models/competence');
const briefService = require('../services/briefService');
const { getAllCompetences } = require('../services/competenceApi');

exports.getAllBriefs = async (req, res) => {
  try {
    const briefs = await briefService.getAllBriefs();
    res.json(briefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBrief = async (req, res) => {
  try {
    const { titre, description } = req.body;
    const newBrief = await briefService.createBrief({ titre, description });
    res.status(201).json(newBrief);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateBrief = async (req, res) => {
  try {
    const updated = await briefService.updateBrief(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteBrief = async (req, res) => {
  try {
    await briefService.deleteBrief(req.params.id);
    res.json({ message: 'Brief supprimé.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.associateCompetences = async (req, res) => {
  try {
    const { competencesIds } = req.body;
    const updatedBrief = await briefService.associateCompetences(req.params.id, competencesIds);
    if (!updatedBrief) return res.status(404).json({ message: 'Brief non trouvé' });
    res.json(updatedBrief);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBriefById = async (req, res) => {
  try {
    const brief = await briefService.getBriefById(req.params.id);
    if (!brief) return res.status(404).json({ message: 'Brief non trouvé' });
    res.json(brief);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.afficherCompetences = async (req, res) => {
  try {
    const competences = await getAllCompetences();
    res.json(competences);
  } catch (error) {
    console.error('Erreur détaillée:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des compétences', details: error.message });
  }
};

exports.getBriefCompetences = async (req, res) => {
  try {
    const brief = await briefService.getBriefById(req.params.id);
    if (!brief) return res.status(404).json({ message: 'Brief non trouvé' });
    res.json(brief.competences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.detachCompetence = async (req, res) => {
  try {
    const { id, compId } = req.params;
    const updatedBrief = await briefService.detachCompetence(id, compId);
    if (!updatedBrief) return res.status(404).json({ message: 'Brief ou compétence non trouvé' });
    res.json(updatedBrief);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
