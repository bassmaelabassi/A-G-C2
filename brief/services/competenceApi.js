const axios = require('axios');

const COMPETENCE_SERVICE_URL = 'http://localhost:9000/api';

async function getAllCompetences() {
  const response = await axios.get(`${COMPETENCE_SERVICE_URL}/competences`);
  return response.data;
}

async function getCompetenceById(id) {
  const response = await axios.get(`${COMPETENCE_SERVICE_URL}/competences/${id}`);
  return response.data;
}

module.exports = { getAllCompetences, getCompetenceById }; 