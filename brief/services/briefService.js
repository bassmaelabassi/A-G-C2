const Brief = require('../models/Brief');
const Competence = require('../models/competence');
const { getCompetenceById } = require('./competenceApi');

async function getAllBriefs() {
  const briefs = await Brief.find().populate('competences');
  return briefs.map(brief => ({
    id: brief._id,
    titre: brief.titre,
    description: brief.description,
    competences: (brief.competences || []).map(c => c && c._id ? ({ id: c._id, code: c.code, nom: c.nom }) : c)
  }));
}

async function createBrief({ titre, description }) {
  const newBrief = new Brief({ titre, description });
  return await newBrief.save();
}

async function updateBrief(id, data) {
  return await Brief.findByIdAndUpdate(id, data, { new: true });
}

async function deleteBrief(id) {
  return await Brief.findByIdAndDelete(id);
}

async function associateCompetences(id, competencesIds) {
  const brief = await Brief.findById(id);
  if (!brief) return null;
  for (const compId of competencesIds) {
    let competence = await Competence.findById(compId);
    if (!competence) {
      const remoteComp = await getCompetenceById(compId);
      if (remoteComp && remoteComp._id) {
        competence = new Competence({
          _id: remoteComp._id,
          code: remoteComp.code,
          nom: remoteComp.nom
        });
        await competence.save();
      }
    }
  }

  brief.competences = competencesIds;
  await brief.save();
  const updated = await Brief.findById(id).populate('competences');
  return {
    id: updated._id,
    titre: updated.titre,
    description: updated.description,
    competences: (updated.competences || []).map(c => c && c._id ? ({ id: c._id, code: c.code, nom: c.nom }) : c)
  };
}

async function getBriefById(id) {
  const brief = await Brief.findById(id).populate('competences');
  if (!brief) return null;
  return {
    id: brief._id,
    titre: brief.titre,
    description: brief.description,
    competences: (brief.competences || []).map(c => c && c._id ? ({ id: c._id, code: c.code, nom: c.nom }) : c)
  };
}

async function detachCompetence(briefId, compId) {
  const brief = await Brief.findById(briefId);
  if (!brief) return null;
  const compIndex = brief.competences.indexOf(compId);
  if (compIndex === -1) return null;
  brief.competences.splice(compIndex, 1);
  await brief.save();
  const updated = await Brief.findById(briefId).populate('competences');
  return {
    id: updated._id,
    titre: updated.titre,
    description: updated.description,
    competences: (updated.competences || []).map(c => c && c._id ? ({ id: c._id, code: c.code, nom: c.nom }) : c)
  };
}

module.exports = {
  getAllBriefs,
  createBrief,
  updateBrief,
  deleteBrief,
  associateCompetences,
  getBriefById,
  detachCompetence,
};
