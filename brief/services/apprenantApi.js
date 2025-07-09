const axios = require('axios');

const APPRENANT_SERVICE_URL = process.env.APPRENANT_SERVICE_URL || 'http://localhost:9200/api/apprenants';

const axiosInstance = axios.create({
  baseURL: APPRENANT_SERVICE_URL,
  timeout: 5000,
});

async function getRendusByApprenant(apprenantId) {
  try {
    const response = await axiosInstance.get(`/${apprenantId}/rendus`);
    return response.data;
  } catch (err) {
    console.error('Erreur lors de la récupération des rendus:', err.message);
    throw err;
  }
}

async function notifyAffectationBrief(apprenantId, briefId) {
  try {
    const response = await axiosInstance.post(`/${apprenantId}/affectation`, { briefId });
    return response.data;
  } catch (err) {
    console.error('Erreur lors de la notification d\'affectation:', err.message);
    throw err;
  }
}

module.exports = {
  getRendusByApprenant,
  notifyAffectationBrief,
}; 