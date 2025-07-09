const express = require('express');
const router = express.Router();
const { getAllBriefs, createBrief, updateBrief, deleteBrief, afficherCompetences, getBriefById, associateCompetences, getBriefCompetences, detachCompetence } = require('../controllers/briefController');

router.get('/', getAllBriefs);
router.post('/', createBrief);
router.put('/:id', updateBrief);
router.delete('/:id', deleteBrief);
router.get('/competences', afficherCompetences);
router.get('/:id', getBriefById);

router.post('/:id/competences', associateCompetences);
router.get('/:id/competences', getBriefCompetences);
router.delete('/:id/competences/:compId', detachCompetence);

module.exports = router;
