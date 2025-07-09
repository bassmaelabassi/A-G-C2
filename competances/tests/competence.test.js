const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');

describe('API des Compétences', () => {
  const testDBUri = 'mongodb://127.0.0.1:27017/competences-test-db';

  beforeAll(async () => {
    await mongoose.connect(testDBUri, {
    });
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/competences', () => {
    it('devrait retourner un tableau vide quand la base de données est vide', async () => {
      const res = await request(app).get('/api/competences');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('devrait retourner une liste de compétences avec leur statut calculé', async () => {
      const Competence = mongoose.model('Competence');
      await Competence.create({
        code: 'C1',
        nom: 'Test Compétence',
        sousCompetences: [
          { nom: 'SC1', validee: true },
          { nom: 'SC2', validee: false },
        ]
      });

      const res = await request(app).get('/api/competences');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].code).toBe('C1');
      expect(res.body[0].statutGlobal).toBe('Validée');
    });
  });

  describe('GET /api/competences/:id', () => {
    it('devrait retourner une compétence par son id', async () => {
      const Competence = mongoose.model('Competence');
      const competence = await Competence.create({
        code: 'C5',
        nom: 'Gestion du temps',
        sousCompetences: [{ nom: 'Planification', validee: true }]
      });

      const res = await request(app).get(`/api/competences/${competence._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('code', 'C5');
      expect(res.body.nom).toBe('Gestion du temps');
      expect(res.body.sousCompetences.length).toBe(1);
    });

    it('devrait retourner 404 si la compétence n\'existe pas', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/competences/${fakeId}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/competences', () => {
    it('devrait créer une nouvelle compétence', async () => {
      const res = await request(app)
        .post('/api/competences')
        .send({
          code: 'C2',
          nom: 'Communication',
          sousCompetences: [
            { nom: 'Exprimer clairement', validee: true },
            { nom: 'Écouter activement', validee: false }
          ]
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('code', 'C2');
      expect(res.body).toHaveProperty('statutGlobal', 'Validée');
      expect(res.body.sousCompetences.length).toBe(2);
    });
  });

  describe('PUT /api/competences/:id', () => {
    it('devrait mettre à jour une compétence existante', async () => {
      const Competence = mongoose.model('Competence');
      const competence = await Competence.create({
        code: 'C3',
        nom: 'Travail en équipe',
        sousCompetences: [{ nom: 'Collaboration', validee: true }]
      });

      const res = await request(app)
        .put(`/api/competences/${competence._id}`)
        .send({ nom: 'Travail collaboratif' });

      expect(res.statusCode).toBe(200);
      expect(res.body.nom).toBe('Travail collaboratif');
    });
  });

  describe('DELETE /api/competences/:id', () => {
    it('devrait supprimer une compétence', async () => {
      const Competence = mongoose.model('Competence');
      const competence = await Competence.create({
        code: 'C4',
        nom: 'Autonomie',
        sousCompetences: []
      });

      const res = await request(app).delete(`/api/competences/${competence._id}`);
      expect(res.statusCode).toBe(200);

      const deleted = await Competence.findById(competence._id);
      expect(deleted).toBeNull();
    });
  });
});
