const competenceService = require("../services/competenceService");
const { calculerStatutGlobal } = require("../utils/statusCalculator");

const getAll = async (req, res) => {
  try {
    let competences = await competenceService.getAllCompetences();

    competences = competences.map(c => {
      const cObj = c.toObject ? c.toObject() : c;
      cObj.statutGlobal = calculerStatutGlobal(c.sousCompetences);
      return cObj;
    });

    res.json(competences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const competence = await competenceService.getCompetenceById(req.params.id);
    if (!competence) {
      return res.status(404).json({ message: "Compétence non trouvée" });
    }
    const competenceObj = competence.toObject ? competence.toObject() : competence;
    competenceObj.statutGlobal = calculerStatutGlobal(competence.sousCompetences);
    res.status(200).json(competenceObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const data = {
      ...req.body,
      sousCompetences: Array.isArray(req.body.sousCompetences) ? req.body.sousCompetences : []
    };
    const competence = await competenceService.createCompetence(data);

    const competenceObj = competence.toObject ? competence.toObject() : competence;
    competenceObj.statutGlobal = calculerStatutGlobal(competence.sousCompetences);

    res.status(201).json(competenceObj);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateEval = async (req, res) => {
  try {
    const result = await competenceService.updateEvaluation(
      req.params.id,
      req.body.sousCompetences
    );

    const resultObj = result.toObject ? result.toObject() : result;
    resultObj.statutGlobal = calculerStatutGlobal(result.sousCompetences);

    res.json(resultObj);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const updated = await competenceService.updateCompetence(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Not found" });

    const updatedObj = updated.toObject ? updated.toObject() : updated;
    updatedObj.statutGlobal = calculerStatutGlobal(updated.sousCompetences);

    res.json(updatedObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await competenceService.deleteCompetence(req.params.id);
    res.status(200).end();
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const resolveTie = async (req, res) => {
  try {
    const { competenceId, subCompetenceId } = req.body;
    const result = await competenceService.resolveTie(competenceId, subCompetenceId);

    const resultObj = result.toObject ? result.toObject() : result;
    resultObj.statutGlobal = calculerStatutGlobal(result.sousCompetences);

    res.json(resultObj);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getAll, getById, create, updateEval, remove, update, resolveTie };
