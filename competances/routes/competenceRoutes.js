const express = require("express");
const router = express.Router();
const controller = require("../controllers/competenceController");

router.get("/competences/:id", controller.getById);
router.get("/competences", controller.getAll);
router.post("/competences", controller.create);
router.put("/competences/:id/evaluation", controller.updateEval);
router.delete("/competences/:id", controller.remove);
router.put("/competences/:id", controller.update);
router.get('/competences/debug/all', async (req, res) => {
  const Competence = require('../models/competenceModel');
  const all = await Competence.find();
  res.json(all);
});
router.post("/competences/resolve-tie", controller.resolveTie);

module.exports = router;