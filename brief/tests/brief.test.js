const mongoose = require('mongoose');
const Brief = require('../models/Brief');
const Competence = require('../models/competence');
const briefService = require('../services/briefService');
const request = require('supertest');
const app = require('../index');
const axios = require('axios');

describe('Brief model test', () => {
  beforeEach(async () => {
    await Brief.deleteMany();
    await Competence.deleteMany();
  });

  it('should create and save a brief successfully', async () => {
    const briefData = { titre: 'Brief Test', description: 'Un test de brief' };
    const brief = new Brief(briefData);
    const savedBrief = await brief.save();

    expect(savedBrief._id).toBeDefined();
    expect(savedBrief.titre).toBe(briefData.titre);
    expect(savedBrief.description).toBe(briefData.description);
  });

  it('should fail to create a brief without required fields', async () => {
    const brief = new Brief();
    let err;
    try {
      await brief.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.titre).toBeDefined();
  });
});

describe('BriefService logic', () => {
  beforeEach(async () => {
    await Brief.deleteMany();
    await Competence.deleteMany();
  });

  it('should create and retrieve a brief with correct format', async () => {
    const created = await briefService.createBrief({ titre: 'Brief Test', description: 'Desc' });
    expect(created.titre).toBe('Brief Test');
    const all = await briefService.getAllBriefs();
    expect(all.length).toBe(1);
    expect(all[0]).toMatchObject({
      id: created._id,
      titre: 'Brief Test',
      description: 'Desc',
      competences: []
    });
  });

  it('should associate competences to a brief and format them', async () => {
    const comp = await Competence.create({ code: 'C1', nom: 'Compétence 1' });
    const brief = await briefService.createBrief({ titre: 'Brief 2', description: 'Desc 2' });
    const updated = await briefService.associateCompetences(brief._id, [comp._id]);
    expect(updated.competences.length).toBe(1);
    expect(updated.competences[0]).toMatchObject({
      id: comp._id,
      code: 'C1',
      nom: 'Compétence 1'
    });
  });

  it('should get a brief by id with formatted competences', async () => {
    const comp = await Competence.create({ code: 'C2', nom: 'Compétence 2' });
    const brief = await briefService.createBrief({ titre: 'Brief 3', description: 'Desc 3' });
    await briefService.associateCompetences(brief._id, [comp._id]);
    const found = await briefService.getBriefById(brief._id);
    expect(found).toMatchObject({
      id: brief._id,
      titre: 'Brief 3',
      description: 'Desc 3',
      competences: [
        { id: comp._id, code: 'C2', nom: 'Compétence 2' }
      ]
    });
  });
});

describe('Brief & Competence Integration', () => {
  let server;
  let briefId;

  beforeAll(async () => {
    server = app.listen(4001);
    await Brief.deleteMany({});
    await Competence.deleteMany({});
    try {
      await axios.post('http://localhost:9000/api/competences', {
        code: 'C1',
        nom: 'Compétence 1',
        sousCompetences: []
      });
    } catch (e) {
      if (!(e.response && e.response.status === 400)) {
        console.error('Erreur lors de la création de la compétence dans le microservice:', e.message);
      }
    }
    const res = await request(server)
      .post('/api/briefs')
      .send({ titre: 'Test Brief', description: 'Pour test' });
    briefId = res.body._id || res.body.id;
  });

  afterAll(async () => {
    await server.close();
    await Brief.deleteMany({});
    await Competence.deleteMany({});
    await mongoose.connection.close();
  });

  it('récupère les compétences depuis le microservice competances', async () => {
    const res = await request(server).get('/api/briefs/competences');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('associe des compétences à un brief', async () => {
    const compRes = await request(server).get('/api/briefs/competences');
    const compIds = compRes.body.map(c => c._id || c.id);
    expect(compIds.length).toBeGreaterThan(0);
    const res = await request(server)
      .post(`/api/briefs/${briefId}/competences`)
      .send({ competencesIds: compIds.slice(0, 2) });
    expect(res.statusCode).toBe(200);
    expect(res.body.competences.length).toBeGreaterThan(0);
  });

  it('récupère les compétences associées à un brief', async () => {
    const compRes = await request(server).get('/api/briefs/competences');
    const compIds = compRes.body.map(c => c._id || c.id);
    await request(server)
      .post(`/api/briefs/${briefId}/competences`)
      .send({ competencesIds: compIds.slice(0, 1) });
    const res = await request(server).get(`/api/briefs/${briefId}/competences`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].id || res.body[0]._id).toBe(compIds[0]);
  });

  it('détache une compétence d\'un brief', async () => {
    const compRes = await request(server).get('/api/briefs/competences');
    const compIds = compRes.body.map(c => c._id || c.id);
    await request(server)
      .post(`/api/briefs/${briefId}/competences`)
      .send({ competencesIds: compIds.slice(0, 2) });
    const res = await request(server).delete(`/api/briefs/${briefId}/competences/${compIds[0]}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.competences) || Array.isArray(res.body)).toBe(true);
    const idsRestants = (res.body.competences || res.body).map(c => c.id || c._id);
    expect(idsRestants).not.toContain(compIds[0]);
  });
});